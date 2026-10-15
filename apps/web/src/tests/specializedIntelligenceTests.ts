import { WikimediaImageProvider } from '../../../api/src/providers/WikimediaImageProvider.js';
import { ShoppingResearchOrchestrator } from '../../../api/src/services/ShoppingResearchOrchestrator.js';
import { EntertainmentResearchOrchestrator } from '../../../api/src/services/EntertainmentResearchOrchestrator.js';
import { DeepResearchOrchestrator } from '../../../api/src/services/DeepResearchOrchestrator.js';
import { AnswerGenerator } from '../../../api/src/services/AnswerGenerator.js';
import { DuckDuckGoProvider } from '../../../api/src/providers/DuckDuckGoProvider.js';
import { SourceCitation } from '@private-browser/shared';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`✅ PASS [M4] ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL [M4] ${testName} - ${detail || 'Assertion failed'}`);
    failed++;
  }
}

async function runMilestone4Tests() {
  console.log('\n================ AURA MILESTONE 4: SPECIALIZED INTELLIGENCE TEST SUITE ================');

  // --- Phase 1: AI Foundation & Answer Generation Verification ---
  console.log('\n--- Phase 1: AI Foundation & Grounded Synthesis ---');
  const answerGen = new AnswerGenerator();

  // Test 1: Missing credentials honest fallback
  const mockSources: SourceCitation[] = [
    {
      id: 'src-1',
      index: 1,
      title: 'Web Authentication Standard',
      url: 'https://w3.org/TR/webauthn',
      domain: 'w3.org',
      snippet: 'WebAuthn defines an API permitting the creation of public key-based credentials.',
      provenance: 'live',
    },
    {
      id: 'src-2',
      index: 2,
      title: 'FIDO Alliance Specifications',
      url: 'https://fidoalliance.org/specs',
      domain: 'fidoalliance.org',
      snippet: 'FIDO2 encompasses the W3C Web Authentication specification and FIDO CTAP.',
      provenance: 'live',
    },
  ];

  const answerFallback = await answerGen.generateAnswer({
    query: 'What is WebAuthn?',
    sources: mockSources,
  });

  assert(
    answerFallback.isAiGenerated === false &&
      answerFallback.modelUsed === 'direct_source_extractor' &&
      answerFallback.validCitationIndices.includes(1) &&
      answerFallback.groundedAnswer.includes('w3.org'),
    'Test 1: Missing AI credentials uses honest direct source extraction without claiming neural generation'
  );

  // Test 2: Refusal to fabricate when zero sources exist
  const emptyAnswer = await answerGen.generateAnswer({
    query: 'Nonexistent query with 0 sources',
    sources: [],
  });

  assert(
    emptyAnswer.success === false &&
      emptyAnswer.isAiGenerated === false &&
      emptyAnswer.modelUsed === 'none' &&
      emptyAnswer.groundedAnswer.includes('No verified sources were available'),
    'Test 2: Answer generator explicitly refuses to fabricate answers when 0 sources are available'
  );

  // --- Phase 2: Genuine Images Only Mode ---
  console.log('\n--- Phase 2: Genuine Images Only Retrieval ---');
  const imgProvider = new WikimediaImageProvider();

  // Test 3: Live image search returns authentic records
  try {
    const liveImages = await imgProvider.searchImages('Swiss Alps', { maxResults: 2 });
    const firstImg = liveImages[0];

    assert(
      liveImages.length >= 1 &&
        Boolean(firstImg.imageUrl) &&
        Boolean(firstImg.sourcePageUrl) &&
        firstImg.sourceDomain === 'commons.wikimedia.org' &&
        Boolean(firstImg.attribution) &&
        firstImg.isAIGenerated === false &&
        firstImg.provenance === 'live',
      'Test 3: Live image provider retrieves authentic images with attribution, license, and zero AI generation',
      `Got ${liveImages.length} images; first=${JSON.stringify(firstImg)}`
    );
  } catch (err: any) {
    assert(false, 'Test 3: Live image provider retrieves authentic images', err.message);
  }

  // Test 4: Empty search results return empty array without AI fallback
  try {
    const emptyImages = await imgProvider.searchImages('asdfqwerzxcv123456789nonexistent', { maxResults: 2 });
    assert(
      Array.isArray(emptyImages) && emptyImages.length === 0,
      'Test 4: Nonexistent image query returns empty list for honest empty state without AI fallback'
    );
  } catch (err: any) {
    assert(false, 'Test 4: Nonexistent image query', err.message);
  }

  // --- Phase 3: Live Shopping Research ---
  console.log('\n--- Phase 3: Live Shopping Research Orchestration ---');
  const ddg = new DuckDuckGoProvider();
  const shoppingOrchestrator = new ShoppingResearchOrchestrator(ddg);

  // Test 5: Shopping constraint extraction & model comparison
  try {
    const shopResult = await shoppingOrchestrator.conductResearch(
      'Compare Sony XM5 and Bose QC Ultra, focusing on comfort and durability'
    );
    const products = shopResult.payload.products;
    const sony = products.find((p) => p.id === 'prod-sony-xm5');
    const bose = products.find((p) => p.id === 'prod-bose-qc-ultra');

    assert(
      products.length === 2 &&
        Boolean(sony) &&
        Boolean(bose) &&
        sony?.durability.evidenceBasis === 'independent_testing' &&
        bose?.durability.evidenceBasis === 'independent_testing' &&
        sony?.retailers.length! > 0 &&
        bose?.retailers.length! > 0 &&
        Boolean(shopResult.citations.length > 0),
      'Test 5: Shopping research identifies exact models, independent durability evidence, and supporting citations'
    );
  } catch (err: any) {
    assert(false, 'Test 5: Shopping research orchestration', err.message);
  }

  // Test 6: Budget constraint preservation in shopping
  try {
    const budgetResult = await shoppingOrchestrator.conductResearch(
      'Best noise-cancelling headphones under ₹15,000 in India'
    );
    const constraints = budgetResult.payload.extractedConstraints;
    const products = budgetResult.payload.products;

    assert(
      constraints?.budget?.amount === 15000 &&
        constraints?.budget?.currency === 'INR' &&
        constraints?.location === 'India' &&
        products.every((p) => p.price.amount <= 15000),
      'Test 6: Budget amount, currency (INR), and regional constraints are strictly preserved and respected'
    );
  } catch (err: any) {
    assert(false, 'Test 6: Budget constraint preservation', err.message);
  }

  // --- Phase 4: Live Entertainment Research ---
  console.log('\n--- Phase 4: Live Entertainment Research ---');
  const entertainmentOrchestrator = new EntertainmentResearchOrchestrator(ddg);

  // Test 7: Movie research, ratings distinction, and default spoiler hiding
  try {
    const entResult = await entertainmentOrchestrator.conductResearch(
      'Is Dune: Part Two worth watching, and where can I stream it?'
    );
    const item = entResult.payload;

    assert(
      item.title === 'Dune: Part Two' &&
        item.ratings.criticsScore !== undefined &&
        item.ratings.audienceScore !== undefined &&
        Boolean(item.streamingAvailability.length > 0) &&
        Boolean(item.spoilerFreeSynopsis) &&
        Boolean(item.spoilerContent) &&
        item.trailers[0].verifiedOfficial === true,
      'Test 7: Entertainment research separates critic/audience scores, tracks streaming platforms, and protects spoilers'
    );
  } catch (err: any) {
    assert(false, 'Test 7: Entertainment research', err.message);
  }

  // --- Phase 5: Deep Research Integration ---
  console.log('\n--- Phase 5: Deep Research Multi-Phase Orchestration ---');

  // Test 8: Deterministic multi-phase step completion & failure isolation
  let stepCallCount = 0;
  const controlledProvider = {
    id: 'controlled_provider',
    name: 'Controlled Test Provider',
    isConfigured: true,
    async search(q: string) {
      stepCallCount++;
      if (stepCallCount <= 2) {
        return [
          {
            id: `src-step-${stepCallCount}`,
            index: stepCallCount,
            title: `Verified Architecture Finding ${stepCallCount}`,
            url: `https://cisa.gov/framework-${stepCallCount}`,
            domain: 'cisa.gov',
            snippet: `Empirical architectural data on privacy trade-offs ${stepCallCount}`,
            provenance: 'live' as const,
          },
        ];
      }
      // Step 3 simulates network failure to verify honest failure tracking
      throw new Error('Remote index timeout (simulated)');
    },
  };

  const deterministicDeepOrchestrator = new DeepResearchOrchestrator(controlledProvider);
  const deepResult = await deterministicDeepOrchestrator.conductDeepResearch(
    'Research the privacy trade-offs of local versus cloud AI.'
  );
  const plan = deepResult.report.plan || [];
  const completed = plan.filter((s) => s.status === 'completed');
  const failedSteps = plan.filter((s) => s.status === 'failed');

  assert(
    plan.length === 3 &&
      completed.length === 2 &&
      failedSteps.length === 1 &&
      Boolean(failedSteps[0].keyFinding?.includes('Remote index timeout')) &&
      Boolean(deepResult.report.executiveSummary) &&
      Boolean(deepResult.report.evidenceMatrix?.corroboratedClaims.length),
    'Test 8: Deep research marks steps completed ONLY after success and transparently tracks failed steps with evidence matrix'
  );

  // Test 9: Live Deep Research initialization
  try {
    const liveDeep = await new DeepResearchOrchestrator(ddg).conductDeepResearch('What is WebAuthn?');
    assert(
      Boolean(liveDeep.report.plan && liveDeep.report.plan.length === 3) &&
        Boolean(liveDeep.report.limitationsDisclaimer?.includes('Bounded search scope')),
      'Test 9: Live Deep Research executes bounded 3-phase investigation for real web queries'
    );
  } catch (err: any) {
    assert(false, 'Test 9: Live Deep Research', err.message);
  }

  // --- Summary ---
  console.log('\n================ MILESTONE 4 TEST SUMMARY ================');
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  if (failed === 0) {
    console.log('🎉 ALL MILESTONE 4 SPECIALIZED INTELLIGENCE TESTS PASSED!');
  }
  console.log('=========================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runMilestone4Tests().catch((err) => {
  console.error('Test runner encountered unexpected error:', err);
  process.exit(1);
});
