import { QueryIntent, SearchMode } from '@private-browser/shared';

/**
 * Heuristic & Semantic Intent Classification Engine
 * Analyzes query patterns, extracts concrete constraints, suggests query refinements,
 * and identifies the optimal workflow mode with full user transparency.
 */
export function analyzeQueryIntent(query: string, explicitMode?: SearchMode): QueryIntent {
  const clean = query.trim().toLowerCase();

  // If user explicitly chose a mode, respect it while refining the query
  if (explicitMode && explicitMode !== 'search') {
    return {
      originalQuery: query,
      refinedQuery: refineQueryForMode(query, explicitMode),
      detectedMode: explicitMode,
      confidence: 1.0,
      reasoning: `User explicitly activated ${explicitMode.toUpperCase()} mode.`,
      preservedConstraints: extractConstraints(query),
    };
  }

  // 1. Remote Companion detection
  if (
    clean.includes('antigravity') ||
    clean.includes('remote companion') ||
    clean.includes('pair laptop') ||
    clean.includes('desktop bridge') ||
    clean.includes('phone to pc') ||
    clean.includes('device bridge')
  ) {
    return {
      originalQuery: query,
      refinedQuery: 'Google Antigravity active session status & remote device pairing credentials',
      detectedMode: 'companion',
      confidence: 0.95,
      reasoning: 'Detected request to inspect or pair remote device / Antigravity workspace.',
      preservedConstraints: extractConstraints(query),
    };
  }

  // 2. Images Only detection
  if (
    clean.startsWith('photo of') ||
    clean.startsWith('photos of') ||
    clean.startsWith('image of') ||
    clean.startsWith('images of') ||
    clean.startsWith('picture of') ||
    clean.startsWith('pictures of') ||
    clean.includes('high res wallpaper') ||
    clean.includes('images only') ||
    clean.endsWith('pictures') ||
    clean.endsWith('photos')
  ) {
    const stripped = query
      .replace(/^(photos?|images?|pictures?)\s+(of\s+)?/i, '')
      .replace(/\s+(high\s+res|wallpaper|images?\s+only)$/i, '');

    return {
      originalQuery: query,
      refinedQuery: stripped.trim() || query,
      detectedMode: 'images',
      confidence: 0.92,
      reasoning: 'Visual search intent detected; strictly activating permitted web-sourced image gallery.',
      preservedConstraints: extractConstraints(query),
    };
  }

  // 3. Shopping intent detection
  const hasShoppingKeywords =
    clean.includes('buy') ||
    clean.includes('price') ||
    clean.includes('cost') ||
    clean.includes('discount') ||
    clean.includes('under ₹') ||
    clean.includes('under rs') ||
    clean.includes('inr') ||
    clean.includes('budget') ||
    clean.includes('deals') ||
    clean.includes('vs') ||
    clean.includes('which headphone') ||
    clean.includes('which laptop') ||
    clean.includes('which phone') ||
    clean.includes('best wireless') ||
    clean.includes('review and price');

  if (hasShoppingKeywords) {
    return {
      originalQuery: query,
      refinedQuery: refineShoppingQuery(query),
      detectedMode: 'shopping',
      confidence: 0.88,
      reasoning: 'Identified purchasing or product comparison intent. Activating Shopping Intelligence matrix.',
      preservedConstraints: extractConstraints(query),
    };
  }

  // 4. Entertainment & Movies detection
  const hasEntertainmentKeywords =
    clean.includes('movie') ||
    clean.includes('film') ||
    clean.includes('trailer') ||
    clean.includes('season') ||
    clean.includes('episode') ||
    clean.includes('streaming on') ||
    clean.includes('netflix') ||
    clean.includes('rotten tomatoes') ||
    clean.includes('box office') ||
    clean.includes('imdb') ||
    clean.includes('dune') ||
    clean.includes('oppenheimer') ||
    clean.includes('cinematography') ||
    clean.includes('soundtrack') ||
    clean.includes('who directed');

  if (hasEntertainmentKeywords) {
    return {
      originalQuery: query,
      refinedQuery: `${query} (ratings, streaming availability, audience reaction & spoiler-free synopsis)`,
      detectedMode: 'entertainment',
      confidence: 0.89,
      reasoning: 'Entertainment and media entity detected. Gathering verified critics, audience sentiment & streaming sources.',
      preservedConstraints: extractConstraints(query),
    };
  }

  // 5. Deep Research detection
  if (
    clean.startsWith('deep research') ||
    clean.includes('comprehensive analysis') ||
    clean.includes('in-depth comparison') ||
    clean.includes('systematic review') ||
    clean.includes('architecture breakdown')
  ) {
    return {
      originalQuery: query,
      refinedQuery: query.replace(/^deep research:?\s*/i, ''),
      detectedMode: 'deep_research',
      confidence: 0.85,
      reasoning: 'Multi-step synthesis requested. Formulating multi-angle citation roadmap.',
      preservedConstraints: extractConstraints(query),
    };
  }

  // 6. Conversational / Chat detection
  if (
    clean.startsWith('hello') ||
    clean.startsWith('hi') ||
    clean.startsWith('can you explain') ||
    clean.startsWith('let us discuss') ||
    clean.startsWith('help me think through')
  ) {
    return {
      originalQuery: query,
      refinedQuery: query,
      detectedMode: 'chat',
      confidence: 0.82,
      reasoning: 'Conversational prompt detected. Entering interactive dialogue workspace.',
      preservedConstraints: extractConstraints(query),
    };
  }

  // 7. General search default
  return {
    originalQuery: query,
    refinedQuery: refineGeneralQuery(query),
    detectedMode: 'search',
    confidence: 0.75,
    reasoning: 'Broad research inquiry. Synthesizing authoritative sources with grounded evidence.',
    preservedConstraints: extractConstraints(query),
  };
}

function refineShoppingQuery(q: string): string {
  // Preserve numbers, currencies, brands
  return `${q.trim()} (detailed specs, authorized retailers, durability benchmarks & verified buyer praise/complaints)`;
}

function refineGeneralQuery(q: string): string {
  return `${q.trim()}: architectural foundations, evidence-backed findings & verified sources`;
}

function refineQueryForMode(q: string, mode: SearchMode): string {
  switch (mode) {
    case 'shopping':
      return refineShoppingQuery(q);
    case 'entertainment':
      return `${q} (ratings, cast, streaming platforms & spoiler-free analysis)`;
    case 'images':
      return q.replace(/^(photos?|images?|pictures?)\s+(of\s+)?/i, '').trim();
    case 'deep_research':
      return `multi-perspective deep dive: ${q}`;
    default:
      return q;
  }
}

function extractConstraints(q: string): QueryIntent['preservedConstraints'] {
  const constraints: QueryIntent['preservedConstraints'] = {
    brands: [],
    models: [],
    datesOrYear: [],
    technicalTerms: [],
  };

  // Extract currency / budget
  const inrMatch = q.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i) || q.match(/under\s*([\d,]+)\s*(?:inr|rs|rupees)/i);
  if (inrMatch) {
    const amount = parseInt(inrMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(amount)) {
      constraints.budget = { amount, currency: 'INR' };
    }
  }

  const usdMatch = q.match(/\$\s*([\d,]+)/) || q.match(/under\s*([\d,]+)\s*(?:dollars|usd)/i);
  if (usdMatch) {
    const amount = parseInt(usdMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(amount)) {
      constraints.budget = { amount, currency: 'USD' };
    }
  }

  // Extract years
  const yearMatches = q.match(/\b(20\d\d|19\d\d)\b/g);
  if (yearMatches) {
    constraints.datesOrYear = yearMatches;
  }

  // Common brands detection
  const commonBrands = ['sony', 'bose', 'sennheiser', 'apple', 'samsung', 'google', 'lg', 'dell', 'lenovo', 'asus'];
  commonBrands.forEach((b) => {
    if (new RegExp(`\\b${b}\\b`, 'i').test(q)) {
      constraints.brands?.push(b.toUpperCase());
    }
  });

  return constraints;
}
