import {
  SearchMode,
  SourceCitation,
  SearchResultPayload,
  ExtractedConstraints,
  SourceProvenanceType,
} from '@private-browser/shared';

export interface SearchApiRequest {
  query: string;
  mode?: SearchMode;
  constraints?: ExtractedConstraints;
  provider?: string;
  forceLive?: boolean;
  maxResults?: number;
}

export interface SearchApiResponse {
  success: boolean;
  payload?: SearchResultPayload;
  error?: string;
  provenance: SourceProvenanceType;
  providerId: string;
  durationMs: number;
}

export interface AnswerGenerationRequest {
  query: string;
  sources: SourceCitation[];
  mode?: SearchMode;
  constraints?: ExtractedConstraints;
}

export interface AnswerGenerationResponse {
  success: boolean;
  groundedAnswer: string;
  validCitationIndices: number[];
  invalidCitationIndices: number[];
  modelUsed: string;
  isAiGenerated: boolean;
  disclaimer?: string;
  error?: string;
}

export interface CompanionStatusResponse {
  status: 'connected' | 'disconnected' | 'error';
  targetPort: number;
  isDaemonRunning: boolean;
  diagnosticMessage: string;
  testedAt: string;
}
