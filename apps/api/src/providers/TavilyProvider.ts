import { SourceCitation, normalizeAndDeduplicateSources } from '@private-browser/shared';
import { SearchProvider } from './SearchProvider.js';

export class TavilyProvider implements SearchProvider {
  public readonly id = 'tavily';
  public readonly name = 'Tavily Search API';

  public get isConfigured(): boolean {
    return Boolean(process.env.TAVILY_API_KEY && process.env.TAVILY_API_KEY.trim().length > 0);
  }

  async search(
    query: string,
    options?: { maxResults?: number; signal?: AbortSignal }
  ): Promise<SourceCitation[]> {
    if (!this.isConfigured) {
      throw new Error('Tavily API key not configured (set TAVILY_API_KEY).');
    }

    const apiKey = process.env.TAVILY_API_KEY!;
    const maxResults = options?.maxResults || 6;
    const timeoutSignal = AbortSignal.timeout(8000);
    const combinedSignal = options?.signal
      ? AbortSignal.any([options.signal, timeoutSignal])
      : timeoutSignal;

    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        search_depth: 'basic',
        include_answer: false,
        max_results: maxResults,
      }),
      signal: combinedSignal,
    });

    if (!res.ok) {
      throw new Error(`Tavily API returned status ${res.status}: ${res.statusText}`);
    }

    const data = (await res.json()) as any;
    const rawSources: Partial<SourceCitation>[] = (data.results || []).map((r: any) => ({
      title: r.title,
      url: r.url,
      snippet: r.content || r.snippet || '',
      providerId: this.id,
      provenance: 'live',
      retrievalStatus: 'success',
      retrievalTimestamp: new Date().toISOString(),
    }));

    return normalizeAndDeduplicateSources(rawSources, 'live', this.id).slice(0, maxResults);
  }
}
