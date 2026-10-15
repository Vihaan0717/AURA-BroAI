import {
  SearchResultPayload,
  ShoppingResultPayload,
  EntertainmentItem,
  ImageSearchResult,
  RemoteCompanionState,
  PrivacySettings,
  UserSavedMemory,
  ChatSession,
} from '@private-browser/shared';

/**
 * Milestone 1 Mock Data Service
 * Provides realistic, structured mock payloads that strictly conform to domain schemas.
 * Clearly labeled as mock data pending Milestone 2 live provider integration.
 */

export const MOCK_SEARCH_RESULTS: Record<string, SearchResultPayload> = {
  default: {
    id: 'res-general-01',
    query: 'privacy implications of on-device AI versus cloud LLMs',
    refinedQuery: 'on-device AI vs cloud LLM privacy architectures: data retention, inference telemetry, and encryption boundaries',
    mode: 'search',
    retrievalTimestamp: '2026-10-15T14:30:00Z',
    processingDurationMs: 420,
    groundedAnswer: `On-device AI executes neural model weights directly on local NPU/GPU silicon, guaranteeing that raw prompts, sensitive document contents, and embedding vectors never leave the host memory bus [1]. In contrast, standard cloud LLM architectures transmit input payloads over TLS to remote data centers, where privacy relies entirely on zero-retention contractual agreements and confidential compute enclaves [2].

However, the privacy trade-off involves model parameter capacity and updates: while local models eliminate network interception risks, they cannot dynamically incorporate external real-time verification without specialized search proxies [3]. Furthermore, confidential computing in modern cloud instances (AMD SEV-SNP, Intel TDX) provides cryptographic memory encryption, though it still exposes metadata such as request timing and payload sizing to host infrastructure operators [4].`,
    citations: [
      {
        id: 'cit-1',
        index: 1,
        title: 'Hardware-Isolated Local Inference: NPU Execution & Memory Safety',
        url: 'https://security.ieee.org/papers/local-npu-privacy-2025',
        domain: 'ieee.org',
        snippet: 'Local neural execution guarantees zero network transit for raw weights and activation states, providing cryptographic isolation from external networks.',
        freshness: 'Published 3 months ago',
        isVerifiedDomain: true,
      },
      {
        id: 'cit-2',
        index: 2,
        title: 'Enterprise Cloud AI Telemetry & Retention Audit Report',
        url: 'https://cyberdefense.org/reports/cloud-llm-data-handling',
        domain: 'cyberdefense.org',
        snippet: 'Most commercial cloud APIs offer zero-day data retention tiers, but rely heavily on tenant trust rather than client-verifiable attestation.',
        freshness: 'Updated 2 weeks ago',
        isVerifiedDomain: true,
      },
      {
        id: 'cit-3',
        index: 3,
        title: 'Architectures for Privacy-Preserving Agentic Browsing',
        url: 'https://acm-privacy.org/proceedings/agent-browsing-2025',
        domain: 'acm.org',
        snippet: 'Hybrid search agents utilize client-side token stripping before dispatching anonymized keywords to external search indices.',
        freshness: 'Published 1 month ago',
        isVerifiedDomain: true,
      },
      {
        id: 'cit-4',
        index: 4,
        title: 'Confidential VM Benchmarks: Hardware Attestation vs Side-Channel Leakage',
        url: 'https://research.cispa.de/confidential-vm-benchmarks',
        domain: 'cispa.de',
        snippet: 'Memory encryption protects runtime states from hypervisors, but traffic flow analysis remains capable of inferring token lengths.',
        freshness: 'Updated 5 days ago',
        isVerifiedDomain: true,
      },
    ],
    evidenceList: [
      {
        id: 'ev-1',
        claim: 'Local NPU inference keeps raw prompts strictly in local memory without outbound network packets.',
        citationIndices: [1],
        type: 'fact',
      },
      {
        id: 'ev-2',
        claim: 'Commercial cloud zero-data-retention tiers depend on contractual compliance rather than client-verifiable zero-knowledge proofs.',
        citationIndices: [2],
        type: 'fact',
      },
      {
        id: 'ev-3',
        claim: 'Hybrid token stripping proxies reduce identity leakage by an estimated 70-85% for search queries.',
        citationIndices: [3],
        type: 'estimate',
        confidenceNotes: 'Derived from simulated corpus in ACM 2025 study; real-world efficacy varies with query uniqueness.',
      },
      {
        id: 'ev-4',
        claim: 'Confidential cloud compute prevents unauthorized memory inspection but cannot eliminate traffic timing side-channels.',
        citationIndices: [4],
        type: 'inference',
      },
    ],
    conflictingFindings: [
      'Source [2] notes enterprise cloud agreements legally preclude training on customer data, while Source [4] argues legal guarantees fail to protect against side-channel memory timing extraction.',
    ],
    unverifiedAspects: [
      'Specific hardware power dissipation overhead when running 14B parameter models continuously on consumer 8GB laptops.',
    ],
    followUpSuggestions: [
      'How does hybrid local-embedding search compare in latency to pure cloud search?',
      'What are the minimum hardware requirements for running quantized 8B models locally?',
      'How do confidential enclaves handle GPU acceleration without compromising enclaves?',
    ],
  },
};

export const MOCK_SHOPPING_RESULTS: Record<string, ShoppingResultPayload> = {
  headphones: {
    id: 'shop-01',
    query: 'best wireless noise cancelling headphones under 30000 inr with durable hinge',
    refinedQuery: 'wireless ANC headphones under ₹30,000 INR: Sony WH-1000XM5 vs Sennheiser Momentum 4 vs Bose QC (hinge durability, warranty & Indian pricing)',
    comparisonSummary: 'Evaluated 3 leading premium ANC models filtered for long-term headband/hinge build quality, active noise cancellation performance, battery endurance, and Indian authorized service network support.',
    budgetFit: 'Target budget: ₹30,000. All compared models are currently available between ₹24,990 and ₹29,990 across authorized Indian retailers.',
    citations: [
      {
        id: 'scit-1',
        index: 1,
        title: 'Rtings Lab Mechanical Stress & Hinge Teardown Report',
        url: 'https://rtings.com/headphones/reviews/durability-benchmarks-2025',
        domain: 'rtings.com',
        snippet: 'Stress testing reveals Bose QC cast-aluminum pivots resist twisting force up to 45Nm, whereas XM5 friction slider shows wear after 3,000 cycles.',
        freshness: 'Updated 1 month ago',
        isVerifiedDomain: true,
      },
      {
        id: 'scit-2',
        index: 2,
        title: 'Consumer Complaints Board India: Audio Brand Service Turnarounds',
        url: 'https://consumercomplaints.in/reports/audio-electronics-service-2025',
        domain: 'consumercomplaints.in',
        snippet: 'Sony authorized service centers in Tier 1 & 2 Indian cities average 4-day repair/replacement turnaround, compared to 12 days for Sennheiser.',
        freshness: 'Updated 3 weeks ago',
        isVerifiedDomain: true,
      },
    ],
    products: [
      {
        id: 'prod-sony-xm5',
        name: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
        brand: 'Sony',
        priceProvenance: 'static_sample',
        modelVariant: 'WH-1000XM5 (Black / Silver)',
        specs: {
          'ANC Performance': 'Dual processor V1 + QN1 with 8 microphones',
          'Battery Life': '30 hours (ANC on), 40 hours (ANC off)',
          'Hinge / Folding': 'Stepless friction slider (Non-folding flat fold)',
          'Weight': '250 grams',
          'Codecs': 'LDAC, AAC, SBC (No aptX)',
          'Multi-point': 'Yes (Bluetooth 5.2)',
        },
        price: {
          amount: 26990,
          currency: 'INR',
          formatted: '₹26,990',
        },
        deliveryNotes: 'Free 1-day delivery in metro cities via Amazon Prime / Croma Express',
        stockStatus: 'in_stock',
        retailers: [
          {
            name: 'Amazon India (Appario / Authorized)',
            url: 'https://amazon.in/dp/B09XS7JWHH',
            listedPrice: '₹26,990',
            isRecommended: true,
            reason: 'Lowest price with instant ₹2,000 bank discount card offer & hassle-free 7-day replacement.',
            reliabilityRating: 4.8,
          },
          {
            name: 'Sony Center Official Store',
            url: 'https://shopatsc.com/products/wh-1000xm5',
            listedPrice: '₹29,990',
            isRecommended: false,
            reason: 'Official direct warranty, but ₹3,000 higher than online authorized partners.',
            reliabilityRating: 4.9,
          },
          {
            name: 'Croma Retail',
            url: 'https://croma.com/sony-wh-1000xm5',
            listedPrice: '₹27,490',
            isRecommended: false,
            reason: 'Good option for in-person store inspection before purchase.',
            reliabilityRating: 4.6,
          },
        ],
        warranty: '1 Year Comprehensive Manufacturer Warranty across all Sony India authorized service centers.',
        returnPolicy: '7-day replacement for manufacturing defects; no return for remorse on unsealed electronics.',
        recurringPraise: [
          'Industry-benchmark high-frequency voice & office noise cancellation.',
          'Sublime microphone call clarity with beamforming AI noise suppression.',
          'Ultra-lightweight 250g chassis with soft-fit leatherette.',
        ],
        commonComplaints: [
          'Headband cannot fold into a compact ball (takes up significant backpack volume).',
          'Synthetic leather pads can cause ear perspiration in non-air-conditioned Indian summer environments.',
          'Earcups do not swivel fully flat on chests when resting around neck.',
        ],
        durability: {
          verdict: 'Good structural integrity; slider friction mechanism requires gentle handling compared to older XM4 metal brackets.',
          evidenceBasis: 'recurring_owner_reports',
          explanation: 'Independent teardown labs and 18-month user forums report the stepless friction slider remains silent and functional, but lack of metal hinges means drop resistance onto concrete is lower than Bose QC.',
        },
        reviewRiskSignals: [
          'Moderate review volume spike noticed during festive sale period with brief burst of unverified 5-star reviews; filtered to verified purchases.',
        ],
        recommendationBreakdown: {
          whyItMatches: 'Best-in-class ANC and call microphones within the ₹25k-₹28k bracket with the strongest local repair service presence across India.',
          credibleAdvantages: [
            'Superior ANC isolation for flights, metro, and crowded cafes.',
            'LDAC high-resolution audio support on Android devices.',
            'Prompt warranty resolution in all major Indian cities.',
          ],
          keyTradeOffs: [
            'Bulky non-folding carry case.',
            'Higher vulnerability to joint stress if sat on or crushed in a stuffed bag.',
          ],
          preferredRetailerChoice: 'Amazon India (Appario Retail) for ₹26,990 due to verified distributor authenticity and rapid replacement guarantee.',
          unverifiedAttributes: [
            'Long-term durability of the headband cushion gluing in humid coastal climates beyond 2 years.',
          ],
        },
      },
      {
        id: 'prod-sennheiser-m4',
        name: 'Sennheiser Momentum 4 Wireless',
        brand: 'Sennheiser',
        priceProvenance: 'static_sample',
        modelVariant: 'Momentum 4 (Graphite Edition)',
        specs: {
          'ANC Performance': 'Adaptive Hybrid ANC with Transparency',
          'Battery Life': '60 hours (ANC on) — Class leader',
          'Hinge / Folding': 'Reinforced composite pivot with flat fold',
          'Weight': '293 grams',
          'Codecs': 'aptX Adaptive, aptX, AAC, SBC',
          'Multi-point': 'Yes (Bluetooth 5.2)',
        },
        price: {
          amount: 24990,
          currency: 'INR',
          formatted: '₹24,990',
        },
        deliveryNotes: 'Standard 2-3 business days across India',
        stockStatus: 'in_stock',
        retailers: [
          {
            name: 'Headphone Zone India',
            url: 'https://headphonezone.in/products/sennheiser-momentum-4',
            listedPrice: '₹24,990',
            isRecommended: true,
            reason: 'Authorized audiophile specialist with dedicated club support and genuine brand warranty.',
            reliabilityRating: 4.9,
          },
          {
            name: 'Amazon India',
            url: 'https://amazon.in/dp/B0B6GHW1XQ',
            listedPrice: '₹25,990',
            isRecommended: false,
            reason: '₹1,000 more expensive than Headphone Zone.',
            reliabilityRating: 4.7,
          },
        ],
        warranty: '2 Years International & India Manufacturer Warranty (Double the industry standard).',
        returnPolicy: '7-day replacement for DOA units via authorized dealer.',
        recurringPraise: [
          'Massive 60-hour real-world battery endurance (charge once every 2-3 weeks).',
          'Audiophile-grade dynamic soundstage with customizable parametric EQ.',
          '2-year warranty provides unmatched long-term peace of mind.',
        ],
        commonComplaints: [
          'ANC is slightly less aggressive than Sony XM5 on sudden transient noises.',
          'Touch sensor controls can trigger accidentally when adjusting headband.',
          'Service network turnaround in smaller Indian cities requires postal dispatch.',
        ],
        durability: {
          verdict: 'Excellent physical build; headband fabric wrapping and composite pivots exhibit superior fatigue resistance.',
          evidenceBasis: 'independent_testing',
          explanation: 'Standardized flexural testing demonstrates high elasticity in the reinforced headband core without plastic creaking after 5,000 extension cycles.',
        },
        reviewRiskSignals: [],
        recommendationBreakdown: {
          whyItMatches: 'Offers the best battery life (60 hrs) and audio fidelity under ₹25,000, backed by a generous 2-year warranty.',
          credibleAdvantages: [
            'Double the battery life of Sony and Bose competitors.',
            'Natural, musical sound profile that does not fatigue during all-day listening.',
            'Full 24 months manufacturer warranty coverage.',
          ],
          keyTradeOffs: [
            'ANC is 10-15% weaker than XM5 in subways or engine hums.',
            'Longer service turnaround times in non-metro locations.',
          ],
          preferredRetailerChoice: 'Headphone Zone India (₹24,990) for expert pre-sale guidance and dedicated audiophile customer care.',
          unverifiedAttributes: [
            'Wear resistance of fabric headband top against sweat and hair oil staining over 3 years.',
          ],
        },
      },
    ],
  },
};

export const MOCK_ENTERTAINMENT_RESULTS: Record<string, EntertainmentItem> = {
  scifi: {
    id: 'ent-dune-2',
    title: 'Dune: Part Two',
    year: 2024,
    type: 'movie',
    releaseStatus: 'released',
    releaseDateText: 'March 1, 2024 (Theatrical) / Available on Streaming',
    runtime: '2h 46m',
    genre: ['Sci-Fi', 'Epic', 'Adventure', 'Drama'],
    tone: ['Monumental', 'Ominous', 'Philosophical', 'Visceral'],
    pacing: 'Methodical buildup transitioning into relentless third-act spectacle',
    ratings: {
      criticsScore: {
        value: 92,
        max: 100,
        source: 'Rotten Tomatoes Tomatometer',
        details: 'Based on 442 verified critics reviews (Certified Fresh)',
      },
      audienceScore: {
        value: 95,
        max: 100,
        source: 'Rotten Tomatoes Verified Audience',
        details: 'Based on 25,000+ verified ticket purchaser ratings',
      },
      tomatometerPercent: 92,
      popcornmeterPercent: 95,
      imdbRating: '8.5 / 10 (520k votes)',
    },
    streamingAvailability: [
      {
        platform: 'JioCinema / Max (India)',
        region: 'India',
        type: 'subscription',
      },
      {
        platform: 'Apple TV / Prime Video',
        region: 'Global',
        type: 'rent',
      },
      {
        platform: 'HBO Max',
        region: 'US / Europe',
        type: 'subscription',
      },
    ],
    audienceMatchProfile: {
      whoWillEnjoy: [
        'Fans of serious, sweeping cinematic worldbuilding (Blade Runner 2049, Lawrence of Arabia).',
        'Viewers who value Hans Zimmer\'s thunderous percussive sound design and Greig Fraser\'s tactile cinematography.',
        'Audiences interested in subversive deconstructions of chosen-one messianic mythologies.',
      ],
      whoMightDislike: [
        'Viewers seeking lighthearted quips or fast-paced popcorn action akin to Marvel adventures.',
        'Those who have not seen Dune Part One (the narrative begins in media res with zero recap).',
        'People sensitive to prolonged heavy sub-bass audio or stark desert color palettes.',
      ],
    },
    spoilerFreeSynopsis: `Paul Atreides unites with Chani and the Fremen while seeking vengeance against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the known universe, he endeavors to prevent a catastrophic holy war only he can foresee.`,
    spoilerContent: `Key Plot Development: Paul drinks the Water of Life in the southern sietch, surviving to achieve prescience and realizing his mother Lady Jessica is the daughter of Baron Harkonnen. In the climatic battle of Arrakeen, Paul defeats Feyd-Rautha in single combat, deposes Emperor Shaddam IV, and announces his strategic betrothal to Princess Irulan—catalyzing the inevitable intergalactic holy war despite his warnings.`,
    trailers: [
      {
        title: 'Official Trailer 3 (Warner Bros. Pictures)',
        url: 'https://youtube.com/watch?v=Way9Dexny3w',
        verifiedOfficial: true,
      },
    ],
  },
};

export const MOCK_IMAGE_RESULTS: Record<string, ImageSearchResult[]> = {
  nature: [
    {
      id: 'img-01',
      title: 'Matterhorn Peak at Sunrise with Alpine Lake Reflection',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
      sourcePageUrl: 'https://unsplash.com/photos/mountain-reflection-during-dawn-46273834b3fb',
      sourceDomain: 'unsplash.com',
      attribution: 'Photo by Bailey Zindel on Unsplash (Free to use under Unsplash License)',
      dimensions: { width: 3840, height: 2160 },
      aspectRatio: '16:9',
      mimeType: 'image/jpeg',
      verifiedSource: true,
      isAIGenerated: false,
    },
    {
      id: 'img-02',
      title: 'Piz Bernina Mountain Ridge in Swiss Grisons Alps',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
      sourcePageUrl: 'https://unsplash.com/photos/rocky-mountain-under-blue-sky-fed622ff2c3b',
      sourceDomain: 'unsplash.com',
      attribution: 'Photo by Kalen Emsley on Unsplash (Permitted photographic source)',
      dimensions: { width: 4000, height: 2667 },
      aspectRatio: '3:2',
      mimeType: 'image/jpeg',
      verifiedSource: true,
      isAIGenerated: false,
    },
    {
      id: 'img-03',
      title: 'Emerald Pine Glade and Mountain Creek in Dolomites',
      imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80',
      thumbnailUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=400&q=80',
      sourcePageUrl: 'https://unsplash.com/photos/mountain-and-trees-d7adac402bff',
      sourceDomain: 'unsplash.com',
      attribution: 'Photo by Luca Bravo on Unsplash (Permitted photographic source)',
      dimensions: { width: 3200, height: 2133 },
      aspectRatio: '3:2',
      mimeType: 'image/jpeg',
      verifiedSource: true,
      isAIGenerated: false,
    },
  ],
};

export const MOCK_REMOTE_STATE: RemoteCompanionState = {
  status: 'disconnected',
  targetDevice: {
    name: 'Workstation-Win11-Pro',
    platform: 'Windows 11',
    hostMasked: '192.168.1.*** (Local Subnet)',
    antigravityVersion: 'Antigravity 2.0 / CLI v1.8.4',
    lastSeen: 'Active 2 minutes ago',
  },
  safety: {
    emergencyUnlockAvailable: true,
    physicalKeyboardPreserved: true,
    timeoutMinutes: 15,
    auditLogCount: 4,
  },
  auditLogs: [
    {
      timestamp: 'Today, 20:15:32',
      action: 'Handshake token generated via authenticated local pairing',
      status: 'completed',
    },
    {
      timestamp: 'Today, 20:15:45',
      action: 'Verified Antigravity IDE daemon socket availability on port 5892',
      status: 'completed',
    },
    {
      timestamp: 'Today, 20:16:10',
      action: 'Read-only workspace status query dispatched',
      status: 'authorized',
    },
  ],
};

export const MOCK_SAVED_MEMORIES: UserSavedMemory[] = [
  {
    id: 'mem-1',
    category: 'product_preference',
    content: 'Prefers audio equipment with replaceable ear-cushions, physical buttons over touch pads, and low clamping force.',
    dateAdded: '2026-10-10',
  },
  {
    id: 'mem-2',
    category: 'entertainment_taste',
    content: 'Enjoys cerebral sci-fi, slow-burn mystery thrillers, and practical effect cinematography; dislikes exposition-heavy superhero franchises.',
    dateAdded: '2026-10-12',
  },
  {
    id: 'mem-3',
    category: 'workflow',
    content: 'Default shopping currency: INR (₹). Standard regional location: India (metro delivery priority).',
    dateAdded: '2026-10-14',
  },
];

export const MOCK_PRIVACY_SETTINGS: PrivacySettings = {
  adFreeStrict: true,
  telemetryDisabled: true,
  allowResearchMemory: true,
  thirdPartyTrackerShield: true,
  cookieHandling: 'strict_isolate',
  aiProcessingMode: 'hybrid',
  autoPurgeHistoryDays: 30,
};

export const MOCK_INITIAL_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'sess-1',
    title: 'Local AI Architectures & NPU Benchmarks',
    createdAt: '2026-10-15T18:30:00Z',
    updatedAt: '2026-10-15T19:10:00Z',
    messages: [
      {
        id: 'msg-1',
        role: 'user',
        content: 'What are the security boundaries of running quantized models locally on an 8GB laptop?',
        timestamp: '19:05',
        mode: 'chat',
      },
      {
        id: 'msg-2',
        role: 'assistant',
        content: `Running quantized models (e.g. 4-bit GGUF or AWQ 7B/8B models) on an 8GB laptop creates a strict local security perimeter:\n\n1. **Zero External Transit**: Your prompt text, system instructions, and token outputs reside exclusively in RAM/VRAM paging pools without traversing WAN gateways.\n2. **Hardware Constraints**: An 8GB system will allocate approximately 4.2GB - 5.5GB for a 7B 4-bit model, leaving 2.5GB for the OS and browser. Context windows must be budgeted to 4k or 8k tokens to avoid disk swapping.\n3. **Isolation**: When hosted through a sandboxed localhost daemon, scripts on external websites cannot inspect model weights or inference history unless explicitly routed through an authenticated CORS bridge.`,
        timestamp: '19:06',
        mode: 'chat',
        followUpChips: [
          'What happens if memory swaps to SSD during inference?',
          'Can browser web workers access WebGPU neural models directly?',
        ],
      },
    ],
  },
];
