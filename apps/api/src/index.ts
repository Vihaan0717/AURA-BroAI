/**
 * API Server / Search Orchestration Layer Skeleton (Target for Milestone 2)
 */
import { SearchMode } from '@private-browser/shared';

export interface ProviderAdapter {
  name: string;
  isConfigured: boolean;
  search(query: string, mode: SearchMode): Promise<unknown>;
}

console.log('Search orchestration layer initialized (Mock providers ready for M1).');
