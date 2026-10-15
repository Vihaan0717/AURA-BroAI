declare const process: any;
import { routeUserIntent } from '../services/intentRouter';
import { orchestrateModeExecution } from '../services/orchestratorService';
import { SearchMode } from '@private-browser/shared';

interface TestCase {
  id: number;
  query: string;
  context?: {
    currentMode?: SearchMode;
    lastQuery?: string;
    lastMode?: SearchMode;
    activeTopic?: string;
  };
  expectedMode: SearchMode;
  expectedRoutingState?: 'auto' | 'explicit' | 'contextual';
  verifyDetails?: (intent: any, result: any) => string | null; // return error message or null if pass
}

export const ACCEPTANCE_TESTS: TestCase[] = [
  {
    id: 1,
    query: 'What is a passkey?',
    expectedMode: 'search',
    verifyDetails: (intent, result) => {
      if (!result.searchResult) return 'Missing searchResult payload';
      if (!result.searchResult.groundedAnswer.includes('FIDO')) return 'Missing WebAuthn/FIDO explanation in grounded answer';
      if (result.searchResult.citations.length === 0) return 'No citations returned';
      return null;
    },
  },
  {
    id: 2,
    query: 'Research the privacy trade-offs of local versus cloud AI.',
    expectedMode: 'deep_research',
    verifyDetails: (intent, result) => {
      if (!result.deepResearchResult) return 'Missing deepResearchResult payload';
      if (result.deepResearchResult.plan.length < 3) return 'Deep research plan has fewer than 3 steps';
      if (!result.deepResearchResult.evidenceMatrix.conflictingEvidence) return 'Missing conflicting evidence matrix';
      return null;
    },
  },
  {
    id: 3,
    query: 'Best noise-cancelling headphones under ₹15,000 in India.',
    expectedMode: 'shopping',
    verifyDetails: (intent, result) => {
      if (!result.shoppingResult) return 'Missing shoppingResult payload';
      if (intent.preservedConstraints.budget?.amount !== 15000) return `Budget not extracted correctly: got ${intent.preservedConstraints.budget?.amount}`;
      if (intent.preservedConstraints.budget?.currency !== 'INR') return `Currency not INR: got ${intent.preservedConstraints.budget?.currency}`;
      if (intent.preservedConstraints.location !== 'India') return `Location not India: got ${intent.preservedConstraints.location}`;
      if (result.shoppingResult.products.length < 2) return 'Fewer than 2 products returned in shopping shortlist';
      return null;
    },
  },
  {
    id: 4,
    query: 'Compare Sony XM5 and Bose QC Ultra, focusing on comfort and durability.',
    expectedMode: 'shopping',
    verifyDetails: (intent, result) => {
      if (!result.shoppingResult) return 'Missing shoppingResult payload';
      if (!intent.preservedConstraints.models?.includes('XM5')) return 'Missing XM5 in extracted models';
      if (!intent.preservedConstraints.models?.includes('QC Ultra')) return 'Missing QC Ultra in extracted models';
      if (!intent.preservedConstraints.features?.includes('comfort')) return 'Missing comfort in extracted features';
      if (!intent.preservedConstraints.features?.includes('durability')) return 'Missing durability in extracted features';
      return null;
    },
  },
  {
    id: 5,
    query: 'Is Dune: Part Two worth watching, and where can I stream it?',
    expectedMode: 'entertainment',
    verifyDetails: (intent, result) => {
      if (!result.entertainmentResult) return 'Missing entertainmentResult payload';
      if (result.entertainmentResult.title !== 'Dune: Part Two') return 'Item is not Dune: Part Two';
      if (!result.entertainmentResult.ratings.tomatometerPercent) return 'Missing verified Rotten Tomatoes score';
      if (result.entertainmentResult.streamingAvailability.length === 0) return 'Missing streaming platforms';
      return null;
    },
  },
  {
    id: 6,
    query: 'Show me two real images of the Swiss Alps.',
    expectedMode: 'images',
    verifyDetails: (intent, result) => {
      if (!result.imageResults) return 'Missing imageResults payload';
      if (result.imageResults.length !== 2) return `Expected 2 images, got ${result.imageResults.length}`;
      if (result.imageResults.some((img: any) => img.isAIGenerated)) return 'AI generated images found in image search!';
      return null;
    },
  },
  {
    id: 7,
    query: 'Help me make a Python learning schedule.',
    expectedMode: 'chat',
    verifyDetails: (intent, result) => {
      return null; // Routed to AI chat workflow
    },
  },
  {
    id: 8,
    query: 'Open my Antigravity agent session.',
    expectedMode: 'companion',
    verifyDetails: (intent, result) => {
      if (!result.remoteState) return 'Missing remoteState payload';
      return null;
    },
  },
  {
    id: 9,
    query: 'What about battery life?',
    context: {
      currentMode: 'auto',
      lastQuery: 'Compare Sony XM5 and Bose QC Ultra, focusing on comfort and durability.',
      lastMode: 'shopping',
      activeTopic: 'shopping comparison',
    },
    expectedMode: 'shopping',
    expectedRoutingState: 'contextual',
    verifyDetails: (intent, result) => {
      if (result.mode !== 'shopping') return 'Did not continue in shopping mode';
      if (!result.continuationNotice) return 'Missing continuation notice';
      return null;
    },
  },
  {
    id: 10,
    query: 'Search for laptops under ₹50,000, but use Images Only.',
    expectedMode: 'images',
    expectedRoutingState: 'explicit',
    verifyDetails: (intent, result) => {
      if (result.mode !== 'images') return 'Failed to respect explicit Images Only directive';
      if (intent.preservedConstraints.budget?.amount !== 50000) return `Budget constraint dropped: ${intent.preservedConstraints.budget?.amount}`;
      if (result.imageResults?.some((img: any) => img.isAIGenerated)) return 'AI generated images found';
      return null;
    },
  },
];

export function runAllAcceptanceTests(): {
  total: number;
  passed: number;
  failed: number;
  results: { id: number; query: string; passed: boolean; error?: string }[];
} {
  let passed = 0;
  let failed = 0;
  const results: { id: number; query: string; passed: boolean; error?: string }[] = [];

  for (const tc of ACCEPTANCE_TESTS) {
    try {
      const intent = routeUserIntent(tc.query, tc.context || {});
      if (intent.detectedMode !== tc.expectedMode) {
        throw new Error(`Mode mismatch: expected "${tc.expectedMode}", got "${intent.detectedMode}"`);
      }
      if (tc.expectedRoutingState && intent.routingState !== tc.expectedRoutingState) {
        throw new Error(`Routing state mismatch: expected "${tc.expectedRoutingState}", got "${intent.routingState}"`);
      }

      const outcome = orchestrateModeExecution(tc.query, intent, intent.detectedMode, {
        lastMode: tc.context?.lastMode,
        lastQuery: tc.context?.lastQuery,
      });

      if (tc.verifyDetails) {
        const error = tc.verifyDetails(intent, outcome);
        if (error) throw new Error(error);
      }

      passed++;
      results.push({ id: tc.id, query: tc.query, passed: true });
    } catch (err: any) {
      failed++;
      results.push({ id: tc.id, query: tc.query, passed: false, error: err.message });
    }
  }

  return { total: ACCEPTANCE_TESTS.length, passed, failed, results };
}

// If executed via node / tsx directly
if (typeof process !== 'undefined' && process.argv && process.argv[1]?.includes('acceptanceTests')) {
  const report = runAllAcceptanceTests();
  console.log(`\n================ ACCEPTANCE TEST RESULTS ================`);
  console.log(`Total: ${report.total} | Passed: ${report.passed} | Failed: ${report.failed}\n`);
  report.results.forEach((r) => {
    const symbol = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${symbol} [Test ${r.id}] "${r.query}"`);
    if (r.error) console.log(`   Error: ${r.error}`);
  });
  console.log(`=========================================================\n`);
}
