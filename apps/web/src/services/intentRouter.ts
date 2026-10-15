import {
  QueryIntent,
  SearchMode,
  ExtractedConstraints,
  MODE_REGISTRY,
} from '@private-browser/shared';

export interface RoutingContext {
  currentMode?: SearchMode; // Current/selected mode
  selectedMode?: SearchMode; // 'auto' or explicit mode
  lastQuery?: string;
  lastMode?: SearchMode;
  lastIntent?: QueryIntent;
  activeTopic?: string;
  recentMessages?: { role: 'user' | 'assistant'; content: string }[];
  preferredLocation?: string;
  preferredCurrency?: 'INR' | 'USD' | 'EUR';
}

/**
 * Intelligent Intent Router for Aura Private Browser
 * Implements deterministic semantic classification, contextual continuation,
 * deep constraint extraction, and transparent confidence policies.
 */
export function routeUserIntent(
  rawQuery: string,
  context: RoutingContext = {}
): QueryIntent {
  const query = rawQuery.trim();
  const clean = query.toLowerCase();

  // 1. Check for Explicit Mode Override inside query text (e.g. "..., but use Images Only")
  const explicitTextOverride = detectExplicitTextOverride(clean);
  const explicitChoice = context.selectedMode || context.currentMode;
  const activeExplicitMode =
    explicitChoice && explicitChoice !== 'auto'
      ? explicitChoice
      : explicitTextOverride;

  const constraints = extractDetailedConstraints(query, context);

  // If user selected or explicitly typed an explicit mode override:
  if (activeExplicitMode && activeExplicitMode !== 'auto') {
    return {
      originalQuery: query,
      refinedQuery: refineQueryForMode(query, activeExplicitMode, constraints),
      detectedMode: activeExplicitMode,
      confidenceScore: 1.0,
      confidenceLevel: 'high',
      reasoning: `User explicitly activated ${MODE_REGISTRY[activeExplicitMode]?.displayName || activeExplicitMode}. Constraints preserved.`,
      routingState: 'explicit',
      preservedConstraints: constraints,
      requiredTools: MODE_REGISTRY[activeExplicitMode]?.availableTools || [],
    };
  }

  // 2. Contextual Continuation (Follow-up inquiries within an active workflow)
  if (context.lastMode && context.lastMode !== 'auto') {
    const isFollowUp = isContextualFollowUp(clean, context);
    if (isFollowUp) {
      const continuationMode = context.lastMode;
      const mergedQuery = context.lastQuery
        ? `${context.lastQuery} — Follow-up: ${query}`
        : query;

      return {
        originalQuery: query,
        refinedQuery: refineQueryForMode(mergedQuery, continuationMode, constraints),
        detectedMode: continuationMode,
        confidenceScore: 0.96,
        confidenceLevel: 'high',
        reasoning: `Recognized contextual follow-up to previous ${MODE_REGISTRY[continuationMode]?.displayName} workflow. Preserving conversation scope.`,
        routingState: 'contextual',
        preservedConstraints: constraints,
        requiredTools: MODE_REGISTRY[continuationMode]?.availableTools || [],
      };
    }
  }

  // 3. Remote Companion / Antigravity Detection
  if (
    clean.includes('antigravity') ||
    clean.includes('agent session') ||
    clean.includes('remote companion') ||
    clean.includes('pair laptop') ||
    clean.includes('laptop status') ||
    clean.includes('desktop bridge') ||
    clean.includes('paired device') ||
    clean.includes('phone to pc')
  ) {
    return {
      originalQuery: query,
      refinedQuery: 'Google Antigravity active session status & remote device bridge verification',
      detectedMode: 'companion',
      confidenceScore: 0.98,
      confidenceLevel: 'high',
      reasoning: 'Detected request to inspect or interact with local Antigravity daemon or paired laptop session.',
      routingState: 'auto',
      preservedConstraints: constraints,
      requiredTools: MODE_REGISTRY.companion.availableTools,
    };
  }

  // 4. Images Only Detection
  if (
    clean.startsWith('photo of') ||
    clean.startsWith('photos of') ||
    clean.startsWith('image of') ||
    clean.startsWith('images of') ||
    clean.startsWith('picture of') ||
    clean.startsWith('pictures of') ||
    clean.startsWith('show me images') ||
    clean.startsWith('show me photos') ||
    clean.startsWith('show me pictures') ||
    clean.includes('real images of') ||
    clean.includes('real photos of') ||
    clean.includes('wallpaper of') ||
    clean.includes('high res photo') ||
    clean.endsWith('images only') ||
    clean.endsWith('pictures') ||
    clean.endsWith('photos')
  ) {
    const stripped = cleanImageQuery(query);
    return {
      originalQuery: query,
      refinedQuery: stripped,
      detectedMode: 'images',
      confidenceScore: 0.95,
      confidenceLevel: 'high',
      reasoning: 'Explicit visual retrieval intent. Activating authorized web photo sources with zero AI hallucinations.',
      routingState: 'auto',
      preservedConstraints: constraints,
      requiredTools: MODE_REGISTRY.images.availableTools,
    };
  }

  // 5. Shopping Intelligence Detection
  const isShopping =
    clean.includes('under ₹') ||
    clean.includes('under rs') ||
    clean.includes('inr') ||
    clean.includes('under $') ||
    clean.includes('under €') ||
    clean.includes('best price') ||
    clean.includes('price of') ||
    clean.includes('compare ') ||
    /\b(sony|bose|sennheiser|apple|samsung|lenovo|dell|asus|hp)\s+(xm5|xm4|qc|ultra|airpods|momentum|macbook|thinkpad|xps)/i.test(query) ||
    /best\s+[\w-]+\s+(under|between|for)/i.test(clean) ||
    clean.includes('which headphone') ||
    clean.includes('which laptop') ||
    clean.includes('which phone') ||
    clean.includes('buy ') ||
    clean.includes('worth buying');

  if (isShopping) {
    return {
      originalQuery: query,
      refinedQuery: refineShoppingQuery(query, constraints),
      detectedMode: 'shopping',
      confidenceScore: 0.94,
      confidenceLevel: 'high',
      reasoning: 'Product comparison and purchasing constraints identified. Activating Shopping Intelligence matrix.',
      routingState: 'auto',
      preservedConstraints: constraints,
      requiredTools: MODE_REGISTRY.shopping.availableTools,
    };
  }

  // 6. Entertainment & Media Detection
  const isEntertainment =
    clean.includes('worth watching') ||
    clean.includes('where can i stream') ||
    clean.includes('streaming on') ||
    clean.includes('rotten tomatoes') ||
    clean.includes('tomatometer') ||
    clean.includes('imdb rating') ||
    clean.includes('movie review') ||
    clean.includes('tv series') ||
    clean.includes('dune: part two') ||
    clean.includes('dune part 2') ||
    clean.includes('dune 2') ||
    clean.includes('oppenheimer') ||
    clean.includes('box office') ||
    clean.includes('trailer for') ||
    clean.includes('season finale') ||
    clean.includes('who directed') ||
    clean.includes('cast of');

  if (isEntertainment) {
    return {
      originalQuery: query,
      refinedQuery: `${query} (ratings, critic consensus, audience sentiment, verified streaming availability & spoiler-free synopsis)`,
      detectedMode: 'entertainment',
      confidenceScore: 0.93,
      confidenceLevel: 'high',
      reasoning: 'Film, television, or media entity detected. Querying Rotten Tomatoes, IMDb, and streaming registries.',
      routingState: 'auto',
      preservedConstraints: constraints,
      requiredTools: MODE_REGISTRY.entertainment.availableTools,
    };
  }

  // 7. Deep Research Detection
  const isDeepResearch =
    clean.startsWith('deep research') ||
    clean.startsWith('research the') ||
    clean.includes('privacy trade-offs') ||
    clean.includes('trade-offs of') ||
    clean.includes('comprehensive analysis') ||
    clean.includes('multi-source investigation') ||
    clean.includes('systematic review') ||
    clean.includes('comparative study') ||
    clean.includes('architectural breakdown');

  if (isDeepResearch) {
    const stripped = query.replace(/^deep research:?\s*/i, '');
    return {
      originalQuery: query,
      refinedQuery: `multi-perspective investigation: ${stripped}`,
      detectedMode: 'deep_research',
      confidenceScore: 0.91,
      confidenceLevel: 'high',
      reasoning: 'Multi-perspective investigation requested. Formulating multi-angle research plan with corroborated vs conflicting evidence.',
      routingState: 'auto',
      preservedConstraints: constraints,
      requiredTools: MODE_REGISTRY.deep_research.availableTools,
    };
  }

  // 8. Conversational / AI Chat Detection
  const isChat =
    clean.startsWith('help me make') ||
    clean.startsWith('help me learn') ||
    clean.startsWith('create a schedule') ||
    clean.startsWith('learning schedule') ||
    clean.startsWith('study plan') ||
    clean.startsWith('can you explain') ||
    clean.startsWith('write a ') ||
    clean.startsWith('draft an ') ||
    clean.startsWith('brainstorm') ||
    clean.startsWith('hello') ||
    clean.startsWith('hi aura') ||
    clean.startsWith('let us discuss');

  if (isChat) {
    return {
      originalQuery: query,
      refinedQuery: query,
      detectedMode: 'chat',
      confidenceScore: 0.9,
      confidenceLevel: 'high',
      reasoning: 'Conversational assistant intent detected. Opening multi-turn dialogue with memory integration.',
      routingState: 'auto',
      preservedConstraints: constraints,
      requiredTools: MODE_REGISTRY.chat.availableTools,
    };
  }

  // 9. Medium Confidence Heuristics
  if (clean.includes('tradeoff') || clean.includes('versus') || clean.includes('pros and cons')) {
    return {
      originalQuery: query,
      refinedQuery: refineGeneralQuery(query),
      detectedMode: 'search',
      confidenceScore: 0.78,
      confidenceLevel: 'medium',
      reasoning: 'Comparative query. Executing General Search with suggested Deep Research upgrade.',
      routingState: 'auto',
      preservedConstraints: constraints,
      suggestedAlternativeMode: 'deep_research',
      statedAssumption: 'Providing grounded overview across authoritative web sources.',
      requiredTools: MODE_REGISTRY.search.availableTools,
    };
  }

  // 10. General Search Default (e.g. "What is a passkey?")
  return {
    originalQuery: query,
    refinedQuery: refineGeneralQuery(query),
    detectedMode: 'search',
    confidenceScore: 0.85,
    confidenceLevel: 'high',
    reasoning: 'Broad informational query. Synthesizing authoritative sources with grounded claim citations.',
    routingState: 'auto',
    preservedConstraints: constraints,
    requiredTools: MODE_REGISTRY.search.availableTools,
  };
}

/**
 * Detect explicit textual overrides like:
 * "Search for laptops under ₹50,000, but use Images Only."
 */
function detectExplicitTextOverride(clean: string): SearchMode | undefined {
  if (
    clean.includes('use images only') ||
    clean.includes('in images only') ||
    clean.includes('images only mode') ||
    clean.includes('show images only')
  ) {
    return 'images';
  }
  if (
    clean.includes('use deep research') ||
    clean.includes('in deep research') ||
    clean.includes('deep research mode')
  ) {
    return 'deep_research';
  }
  if (
    clean.includes('use shopping mode') ||
    clean.includes('in shopping mode')
  ) {
    return 'shopping';
  }
  if (
    clean.includes('use entertainment mode') ||
    clean.includes('in entertainment mode')
  ) {
    return 'entertainment';
  }
  if (
    clean.includes('use ai chat') ||
    clean.includes('in chat mode')
  ) {
    return 'chat';
  }
  return undefined;
}

/**
 * Check if the current query is an attribute continuation of the previous workflow
 * e.g., "What about battery life?", "Does it have active noise cancelling?", "How is the microphone?"
 */
function isContextualFollowUp(clean: string, context: RoutingContext): boolean {
  const followUpStarters = [
    'what about',
    'how about',
    'and the',
    'does it have',
    'is there a',
    'what is the battery',
    'how is the',
    'can it',
    'show me more',
    'what else',
    'tell me about its',
  ];

  const startsWithFollowUp = followUpStarters.some((starter) =>
    clean.startsWith(starter)
  );

  const shortAttributeCheck =
    clean.split(' ').length <= 5 &&
    (clean.includes('battery') ||
      clean.includes('comfort') ||
      clean.includes('mic') ||
      clean.includes('microphone') ||
      clean.includes('warranty') ||
      clean.includes('sound quality') ||
      clean.includes('anc') ||
      clean.includes('weight') ||
      clean.includes('color') ||
      clean.includes('streaming'));

  return startsWithFollowUp || shortAttributeCheck;
}

/**
 * Clean image query by stripping directive prefixes and suffixes
 */
function cleanImageQuery(q: string): string {
  return q
    .replace(/^(show\s+me\s+)?(two|2|three|3|four|4)?\s*(real\s+)?(photos?|images?|pictures?)\s+(of\s+)?/i, '')
    .replace(/,\s*but\s+use\s+images\s+only\.?/i, '')
    .replace(/\s+(high\s+res|wallpaper|images?\s+only)$/i, '')
    .trim();
}

/**
 * Refine shopping query preserving models, INR budget, locations, and durability
 */
function refineShoppingQuery(q: string, c: ExtractedConstraints): string {
  const parts: string[] = [q.trim()];
  const extras: string[] = [];

  if (c.budget) {
    extras.push(`Budget: ${c.budget.currency} ${c.budget.amount.toLocaleString()}`);
  }
  if (c.location) {
    extras.push(`Region: ${c.location}`);
  }
  extras.push('specs, authorized retailers, durability benchmarks, verified complaints/praise');

  return `${parts.join(' ')} (${extras.join(', ')})`;
}

/**
 * Refine general search query preserving all user constraints
 */
function refineGeneralQuery(q: string): string {
  return `${q.trim()}: authoritative overview, architectural mechanisms & verified sources`;
}

/**
 * Mode query refiner
 */
function refineQueryForMode(q: string, mode: SearchMode, c: ExtractedConstraints): string {
  switch (mode) {
    case 'shopping':
      return refineShoppingQuery(q, c);
    case 'entertainment':
      return `${q} (critic scores, audience reaction, verified streaming availability & spoiler-free synopsis)`;
    case 'images':
      return cleanImageQuery(q);
    case 'deep_research':
      return `multi-perspective investigation: ${q.replace(/^deep research:?\s*/i, '')}`;
    case 'companion':
      return 'Google Antigravity session status & local device companion check';
    default:
      return q;
  }
}

/**
 * Detailed constraint extractor for budgets, currencies, brands, models,
 * locations, counts, and feature requests.
 */
function extractDetailedConstraints(
  q: string,
  context: RoutingContext
): ExtractedConstraints {
  const clean = q.toLowerCase();
  const constraints: ExtractedConstraints = {
    brands: [],
    models: [],
    features: [],
    datesOrYear: [],
    technicalTerms: [],
    exclusions: [],
  };

  // 1. Budget and Currency
  // INR
  const inrMatch =
    q.match(/(?:₹|rs\.?|inr)\s*([\d,]+)/i) ||
    q.match(/under\s*([\d,]+)\s*(?:inr|rs|rupees)/i) ||
    q.match(/under\s*₹?\s*([\d,]+)/i);

  if (inrMatch && inrMatch[1]) {
    const amount = parseInt(inrMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(amount) && amount > 0) {
      constraints.budget = { amount, currency: 'INR' };
    }
  }

  // USD
  const usdMatch =
    q.match(/\$\s*([\d,]+)/) ||
    q.match(/under\s*([\d,]+)\s*(?:dollars|usd)/i);
  if (usdMatch && usdMatch[1] && !constraints.budget) {
    const amount = parseInt(usdMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(amount)) {
      constraints.budget = { amount, currency: 'USD' };
    }
  }

  // EUR
  const eurMatch =
    q.match(/€\s*([\d,]+)/) ||
    q.match(/under\s*([\d,]+)\s*(?:euros?|eur)/i);
  if (eurMatch && eurMatch[1] && !constraints.budget) {
    const amount = parseInt(eurMatch[1].replace(/,/g, ''), 10);
    if (!isNaN(amount)) {
      constraints.budget = { amount, currency: 'EUR' };
    }
  }

  // 2. Location
  if (/\b(india|delhi|mumbai|bangalore|hyderabad)\b/i.test(q)) {
    constraints.location = 'India';
  } else if (/\b(us|usa|united states|uk|europe)\b/i.test(q)) {
    constraints.location = 'US/Global';
  } else if (context.preferredLocation) {
    constraints.location = context.preferredLocation;
  }

  // 3. Brands
  const brandList = [
    'sony',
    'bose',
    'sennheiser',
    'apple',
    'samsung',
    'google',
    'dell',
    'lenovo',
    'asus',
    'hp',
    'acer',
    'nothing',
    'oneplus',
    'xiaomi',
    'boat',
    'noise',
    'jbl',
  ];
  brandList.forEach((b) => {
    if (new RegExp(`\\b${b}\\b`, 'i').test(q)) {
      constraints.brands?.push(b.toUpperCase());
    }
  });

  // 4. Models
  const modelPatterns = [
    /\b(wh-1000xm5|xm5|wh-1000xm4|xm4)\b/i,
    /\b(qc\s*ultra|quietcomfort\s*ultra|qc\s*45)\b/i,
    /\b(momentum\s*4|momentum\s*3)\b/i,
    /\b(airpods\s*max|airpods\s*pro)\b/i,
    /\b(macbook\s*(air|pro)?)\b/i,
    /\b(thinkpad\s*[\w\d]+|thinkpad)\b/i,
    /\b(xps\s*13|xps\s*15|xps)\b/i,
    /\b(ear\s*2|ear\s*1)\b/i,
  ];
  modelPatterns.forEach((pat) => {
    const match = q.match(pat);
    if (match) {
      constraints.models?.push(match[0].trim());
    }
  });

  // 5. Requested Result Count (e.g. "two real images" -> 2)
  const countMatch = q.match(/\b(one|1|two|2|three|3|four|4|five|5|six|6)\b\s+(?:real\s+)?(?:photos?|images?|results?|products?)/i);
  if (countMatch) {
    const wordToNum: Record<string, number> = {
      one: 1, '1': 1,
      two: 2, '2': 2,
      three: 3, '3': 3,
      four: 4, '4': 4,
      five: 5, '5': 5,
      six: 6, '6': 6,
    };
    constraints.requestedResultCount = wordToNum[countMatch[1].toLowerCase()] || 2;
  }

  // 6. Features & Topics
  const featureList = [
    'comfort',
    'durability',
    'battery life',
    'active noise cancellation',
    'anc',
    'build quality',
    'warranty',
    'microphone',
    'streaming',
  ];
  featureList.forEach((f) => {
    if (new RegExp(`\\b${f}\\b`, 'i').test(q)) {
      constraints.features?.push(f);
    }
  });

  // 7. Exclusions
  if (clean.includes('zero bloat') || clean.includes('no bloat')) {
    constraints.exclusions?.push('bloatware');
  }
  if (clean.includes('without tracking') || clean.includes('no telemetry')) {
    constraints.exclusions?.push('telemetry');
  }

  // 8. Years
  const yearMatches = q.match(/\b(20\d\d|19\d\d)\b/g);
  if (yearMatches) {
    constraints.datesOrYear = yearMatches;
  }

  return constraints;
}
