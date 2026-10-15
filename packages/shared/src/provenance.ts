import { SourceCitation, SourceProvenanceType } from './types.js';

const DISALLOWED_SCHEMES = ['javascript:', 'data:', 'file:', 'vbscript:', 'blob:'];
const PRIVATE_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  '169.254.169.254', // Cloud metadata service
];

/**
 * Validates whether a URL has a safe http/https protocol and does not target internal network addresses (SSRF defense).
 */
export function validateAndSanitizeUrl(rawUrl: string): {
  isValid: boolean;
  sanitizedUrl: string;
  domain: string;
  reason?: string;
} {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, sanitizedUrl: '', domain: '', reason: 'Empty URL' };
  }

  const trimmed = rawUrl.trim();
  const lower = trimmed.toLowerCase();

  for (const scheme of DISALLOWED_SCHEMES) {
    if (lower.startsWith(scheme)) {
      return { isValid: false, sanitizedUrl: '', domain: '', reason: `Disallowed scheme: ${scheme}` };
    }
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, sanitizedUrl: '', domain: '', reason: `Unsupported protocol: ${parsed.protocol}` };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check for private hostnames / loopbacks
    if (
      PRIVATE_HOSTNAMES.includes(hostname) ||
      hostname.endsWith('.localhost') ||
      hostname.endsWith('.local') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('192.168.') ||
      /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname)
    ) {
      return { isValid: false, sanitizedUrl: '', domain: hostname, reason: 'Private/internal IP or loopback address prohibited' };
    }

    // Strip common tracking parameters from canonical URL
    const cleanParams = new URLSearchParams();
    parsed.searchParams.forEach((val, key) => {
      const kLower = key.toLowerCase();
      if (!kLower.startsWith('utm_') && kLower !== 'fbclid' && kLower !== 'gclid' && kLower !== 'ref_src' && kLower !== 'ref') {
        cleanParams.append(key, val);
      }
    });

    // Normalize trailing slash on pathname (e.g., /spec/ -> /spec)
    if (parsed.pathname.length > 1 && parsed.pathname.endsWith('/')) {
      parsed.pathname = parsed.pathname.replace(/\/+$/, '');
    }

    parsed.search = cleanParams.toString() ? `?${cleanParams.toString()}` : '';
    parsed.hash = ''; // Drop fragment for canonical URL

    return {
      isValid: true,
      sanitizedUrl: parsed.toString(),
      domain: hostname.replace(/^www\./, ''),
    };
  } catch {
    return { isValid: false, sanitizedUrl: '', domain: '', reason: 'Malformed URL' };
  }
}

/**
 * Normalizes, validates, and deduplicates source citations by canonical URL.
 * Enforces strictly sequential 1-based indexing [1], [2], [3]...
 */
export function normalizeAndDeduplicateSources(
  rawSources: Partial<SourceCitation>[],
  defaultProvenance: SourceProvenanceType = 'live',
  providerId = 'unknown'
): SourceCitation[] {
  const seenUrls = new Set<string>();
  const normalized: SourceCitation[] = [];

  for (const src of rawSources) {
    if (!src || !src.url) continue;

    const validation = validateAndSanitizeUrl(src.url);
    if (!validation.isValid) continue;

    const canonicalUrl = validation.sanitizedUrl;
    if (seenUrls.has(canonicalUrl)) continue;
    seenUrls.add(canonicalUrl);

    const index = normalized.length + 1;
    normalized.push({
      id: src.id || `src-${Date.now()}-${index}`,
      index,
      title: src.title?.trim() || validation.domain,
      url: canonicalUrl,
      domain: validation.domain,
      snippet: src.snippet?.trim() || '',
      provenance: src.provenance || defaultProvenance,
      retrievalTimestamp: src.retrievalTimestamp || new Date().toISOString(),
      publishedDate: src.publishedDate,
      providerId: src.providerId || providerId,
      retrievalStatus: src.retrievalStatus || 'success',
      contentType: src.contentType || 'text/html',
      attribution: src.attribution,
      license: src.license,
      isVerifiedDomain: src.isVerifiedDomain ?? isRecognizedAuthoritativeDomain(validation.domain),
      freshness: src.freshness,
    });
  }

  return normalized;
}

/**
 * Checks if a domain is an established authoritative knowledge / standards base
 */
export function isRecognizedAuthoritativeDomain(domain: string): boolean {
  const authoritativeList = [
    'w3.org',
    'fidoalliance.org',
    'developer.mozilla.org',
    'github.com',
    'ieee.org',
    'acm.org',
    'ietf.org',
    'nist.gov',
    'cisa.gov',
    'kernel.org',
    'python.org',
    'nodejs.org',
    'react.dev',
    'typescriptlang.org',
    'developer.apple.com',
    'developer.android.com',
  ];
  const d = domain.toLowerCase();
  return authoritativeList.some((auth) => d === auth || d.endsWith(`.${auth}`));
}

/**
 * Validates that all inline citation markers [N] in a synthesis text refer to an actual source index.
 * Strips or flags dangling/hallucinated citation numbers.
 */
export function validateCitationsInAnswer(
  answerText: string,
  availableCitations: SourceCitation[]
): {
  validatedAnswer: string;
  validIndices: number[];
  invalidIndices: number[];
} {
  const validIndexSet = new Set(availableCitations.map((c) => c.index));
  const validIndices: number[] = [];
  const invalidIndices: number[] = [];

  const validatedAnswer = answerText.replace(/\[(\d+)\]/g, (match, digits) => {
    const idx = parseInt(digits, 10);
    if (validIndexSet.has(idx)) {
      if (!validIndices.includes(idx)) validIndices.push(idx);
      return `[${idx}]`;
    } else {
      if (!invalidIndices.includes(idx)) invalidIndices.push(idx);
      // Remove or flag invalid citation referencing nonexistent source ID
      return '';
    }
  });

  return {
    validatedAnswer: validatedAnswer.replace(/\s{2,}/g, ' '), // Clean up any double spaces from removed citations
    validIndices,
    invalidIndices,
  };
}
