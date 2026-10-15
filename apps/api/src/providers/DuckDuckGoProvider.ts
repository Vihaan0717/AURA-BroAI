import { SourceCitation, normalizeAndDeduplicateSources } from '@private-browser/shared';
import { SearchProvider } from './SearchProvider.js';

export class DuckDuckGoProvider implements SearchProvider {
  public readonly id = 'duckduckgo';
  public readonly name = 'DuckDuckGo Open Web';
  public readonly isConfigured = true; // Free, open access, zero API key required

  /**
   * Performs real web search retrieval using DuckDuckGo HTML & Instant Answer APIs
   */
  async search(
    query: string,
    options?: { maxResults?: number; signal?: AbortSignal }
  ): Promise<SourceCitation[]> {
    const maxResults = options?.maxResults || 6;
    const sources: Partial<SourceCitation>[] = [];

    // Combine timeout signal with caller signal
    const timeoutSignal = AbortSignal.timeout(7000);
    const combinedSignal = options?.signal
      ? AbortSignal.any([options.signal, timeoutSignal])
      : timeoutSignal;

    // 1. Primary: DuckDuckGo HTML search for comprehensive web results
    try {
      const htmlUrl = `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const res = await fetch(htmlUrl, {
        method: 'POST',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 AuraBrowser/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `q=${encodeURIComponent(query)}&b=`,
        signal: combinedSignal,
      });

      if (res.ok) {
        const html = await res.text();
        const parsed = this.parseDuckDuckGoHtml(html);
        sources.push(...parsed);
      }
    } catch {
      // Fallback or network glitch, try Instant Answer API below
    }

    // 2. Secondary: If HTML yielded few results, supplement with Instant Answer API
    if (sources.length < 2) {
      try {
        const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
        const res = await fetch(apiUrl, {
          headers: {
            'User-Agent': 'Aura-Private-Browser/1.0 (Privacy-Preserving-Research)',
            Accept: 'application/json',
          },
          signal: combinedSignal,
        });

        if (res.ok) {
          const data = (await res.json()) as any;
          if (data.AbstractText && data.AbstractURL) {
            sources.push({
              title: data.Heading || query,
              url: data.AbstractURL,
              snippet: data.AbstractText,
              providerId: this.id,
              provenance: 'live',
              retrievalStatus: 'success',
            });
          }

          if (Array.isArray(data.RelatedTopics)) {
            for (const topic of data.RelatedTopics) {
              if (topic.Text && topic.FirstURL) {
                sources.push({
                  title: topic.Text.split(' - ')[0] || topic.Text.slice(0, 50),
                  url: topic.FirstURL,
                  snippet: topic.Text,
                  providerId: this.id,
                  provenance: 'live',
                  retrievalStatus: 'success',
                });
              }
            }
          }
        }
      } catch {
        // Handled below if all fail
      }
    }

    // Normalize, validate against safe schemes and deduplicate
    const normalized = normalizeAndDeduplicateSources(sources, 'live', this.id);
    return normalized.slice(0, maxResults);
  }

  /**
   * Helper to parse DuckDuckGo HTML results with regex (zero heavy HTML parser dependency)
   */
  private parseDuckDuckGoHtml(html: string): Partial<SourceCitation>[] {
    const results: Partial<SourceCitation>[] = [];

    // Match each result block: h2 with result__title and link, followed by result__snippet
    const blockRegex =
      /<h2\s+class="result__title">[\s\S]*?<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>[\s\S]*?<\/h2>[\s\S]*?<a\s+class="result__snippet[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;

    let match: RegExpExecArray | null;
    while ((match = blockRegex.exec(html)) !== null) {
      let rawUrl = match[1];
      const title = this.stripHtmlTags(match[2]);
      const snippet = this.stripHtmlTags(match[3]);

      // Unpack DuckDuckGo redirect uddg parameter if present
      const uddgMatch = rawUrl.match(/[?&]uddg=([^&]+)/);
      if (uddgMatch) {
        try {
          rawUrl = decodeURIComponent(uddgMatch[1]);
        } catch {
          // keep original
        }
      } else if (rawUrl.startsWith('//')) {
        rawUrl = `https:${rawUrl}`;
      }

      if (
        rawUrl &&
        !rawUrl.includes('duckduckgo.com') &&
        (rawUrl.startsWith('http://') || rawUrl.startsWith('https://'))
      ) {
        results.push({
          title: title || 'Web Search Result',
          url: rawUrl,
          snippet: snippet || title,
          providerId: this.id,
          provenance: 'live',
          retrievalStatus: 'success',
          retrievalTimestamp: new Date().toISOString(),
        });
      }
    }

    return results;
  }

  private stripHtmlTags(str: string): string {
    return str
      .replace(/<[^>]+>/g, '')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#x27;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}
