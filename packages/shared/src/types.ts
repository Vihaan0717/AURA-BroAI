/**
 * Domain Types for Private AI Browser & Personal Device Bridge
 */

export type SearchMode =
  | 'search'
  | 'deep_research'
  | 'shopping'
  | 'entertainment'
  | 'images'
  | 'chat'
  | 'companion'
  | 'privacy';

export type EvidenceType = 'fact' | 'opinion' | 'estimate' | 'inference';

export interface SourceCitation {
  id: string;
  index: number;
  title: string;
  url: string;
  domain: string;
  snippet: string;
  freshness?: string;
  isVerifiedDomain?: boolean;
}

export interface EvidenceSummary {
  id: string;
  claim: string;
  citationIndices: number[];
  type: EvidenceType;
  confidenceNotes?: string;
}

export interface QueryIntent {
  originalQuery: string;
  refinedQuery: string;
  detectedMode: SearchMode;
  confidence: number;
  reasoning: string;
  preservedConstraints: {
    brands?: string[];
    models?: string[];
    budget?: { amount: number; currency: string };
    datesOrYear?: string[];
    technicalTerms?: string[];
    exclusions?: string[];
  };
}

export interface SearchResultPayload {
  id: string;
  query: string;
  refinedQuery: string;
  mode: SearchMode;
  groundedAnswer: string;
  citations: SourceCitation[];
  evidenceList: EvidenceSummary[];
  conflictingFindings?: string[];
  unverifiedAspects?: string[];
  followUpSuggestions: string[];
  retrievalTimestamp: string;
  processingDurationMs: number;
}

// Shopping Domain Types
export type DurabilityEvidenceBasis =
  | 'independent_testing'
  | 'recurring_owner_reports'
  | 'manufacturer_claims'
  | 'limited_inference';

export interface ProductAttributeComparison {
  id: string;
  name: string;
  brand: string;
  modelVariant: string;
  specs: Record<string, string>;
  price: {
    amount: number;
    currency: 'INR' | 'USD' | 'EUR';
    formatted: string;
  };
  deliveryNotes?: string;
  stockStatus: 'in_stock' | 'limited_stock' | 'out_of_stock' | 'unverified';
  retailers: {
    name: string;
    url: string;
    listedPrice: string;
    isRecommended: boolean;
    reason?: string;
    reliabilityRating: number;
  }[];
  warranty: string;
  returnPolicy: string;
  recurringPraise: string[];
  commonComplaints: string[];
  durability: {
    verdict: string;
    evidenceBasis: DurabilityEvidenceBasis;
    explanation: string;
  };
  reviewRiskSignals?: string[];
  recommendationBreakdown: {
    whyItMatches: string;
    credibleAdvantages: string[];
    keyTradeOffs: string[];
    preferredRetailerChoice: string;
    unverifiedAttributes: string[];
  };
}

export interface ShoppingResultPayload {
  id: string;
  query: string;
  refinedQuery: string;
  products: ProductAttributeComparison[];
  comparisonSummary: string;
  budgetFit: string;
  citations: SourceCitation[];
}

// Entertainment Domain Types
export interface EntertainmentItem {
  id: string;
  title: string;
  year: number;
  type: 'movie' | 'tv_series' | 'documentary';
  releaseStatus: 'released' | 'in_theaters' | 'upcoming';
  releaseDateText: string;
  runtime?: string;
  genre: string[];
  tone: string[];
  pacing: string;
  ratings: {
    criticsScore?: { value: number; max: number; source: string; details?: string };
    audienceScore?: { value: number; max: number; source: string; details?: string };
    tomatometerPercent?: number;
    popcornmeterPercent?: number;
    imdbRating?: string;
  };
  streamingAvailability: {
    platform: string;
    region: string;
    type: 'subscription' | 'rent' | 'free';
  }[];
  audienceMatchProfile: {
    whoWillEnjoy: string[];
    whoMightDislike: string[];
  };
  spoilerFreeSynopsis: string;
  spoilerContent?: string;
  trailers: {
    title: string;
    url: string;
    verifiedOfficial: boolean;
  }[];
}

// Image Search Types (Strictly Real Web Sources, No AI Generation)
export interface ImageSearchResult {
  id: string;
  title: string;
  imageUrl: string;
  thumbnailUrl: string;
  sourcePageUrl: string;
  sourceDomain: string;
  attribution: string;
  dimensions?: {
    width: number;
    height: number;
  };
  aspectRatio?: string;
  mimeType?: string;
  verifiedSource: boolean;
  isAIGenerated: false; // Explicitly enforce never AI-generated
}

// AI Chat & Memory Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: SourceCitation[];
  followUpChips?: string[];
  mode?: SearchMode;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: ChatMessage[];
  pinnedMemory?: string[];
}

export interface UserSavedMemory {
  id: string;
  category: 'product_preference' | 'entertainment_taste' | 'research_topic' | 'workflow';
  content: string;
  dateAdded: string;
}

// Remote Companion Types
export type ConnectionStatus = 'disconnected' | 'pairing' | 'connected' | 'error';

export interface RemoteCompanionState {
  status: ConnectionStatus;
  targetDevice: {
    name: string;
    platform: 'Windows 11' | 'Windows 10' | 'macOS' | 'Linux';
    hostMasked: string;
    antigravityVersion?: string;
    lastSeen: string;
  };
  activeSessionId?: string;
  sessionStartedAt?: string;
  safety: {
    emergencyUnlockAvailable: boolean;
    physicalKeyboardPreserved: boolean;
    timeoutMinutes: number;
    auditLogCount: number;
  };
  auditLogs: {
    timestamp: string;
    action: string;
    status: 'authorized' | 'rejected' | 'completed';
  }[];
}

// Privacy Settings
export interface PrivacySettings {
  adFreeStrict: boolean;
  telemetryDisabled: boolean;
  allowResearchMemory: boolean;
  thirdPartyTrackerShield: boolean;
  cookieHandling: 'strict_isolate' | 'block_third_party' | 'essential_only';
  aiProcessingMode: 'cloud_confidential' | 'hybrid' | 'local_model';
  autoPurgeHistoryDays: number;
}
