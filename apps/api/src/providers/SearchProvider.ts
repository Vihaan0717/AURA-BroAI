import { SourceCitation } from '@private-browser/shared';

export interface SearchProvider {
  id: string;
  name: string;
  isConfigured: boolean;
  search(query: string, options?: { maxResults?: number; signal?: AbortSignal }): Promise<SourceCitation[]>;
}
