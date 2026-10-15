import { QueryIntent, SearchMode } from '@private-browser/shared';
import { routeUserIntent } from './intentRouter';

/**
 * Legacy intent detector facade.
 * Delegates to centralized, typed intentRouter for single source of truth.
 */
export function analyzeQueryIntent(query: string, explicitMode?: SearchMode): QueryIntent {
  return routeUserIntent(query, { selectedMode: explicitMode });
}
