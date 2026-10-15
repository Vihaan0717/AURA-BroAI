import { SourceCitation } from '@private-browser/shared';

export interface CacheEntry<T = any> {
  query: string;
  mode: string;
  sources?: SourceCitation[];
  data?: T;
  cachedAt: string;
  ttlSeconds: number;
}

export class CacheService {
  private cache = new Map<string, CacheEntry>();
  private defaultTtlSeconds = 900; // 15 minutes

  constructor(ttlSeconds = 900) {
    this.defaultTtlSeconds = ttlSeconds;
  }

  private generateKey(query: string, mode = 'search'): string {
    return `${mode.toLowerCase()}:${query.trim().toLowerCase()}`;
  }

  get(query: string, mode = 'search'): { sources: SourceCitation[]; cachedAt: string; ttlSeconds: number } | null {
    const key = this.generateKey(query, mode);
    const entry = this.cache.get(key);
    if (!entry || !entry.sources) return null;

    const ageSeconds = (Date.now() - new Date(entry.cachedAt).getTime()) / 1000;
    if (ageSeconds > entry.ttlSeconds) {
      this.cache.delete(key);
      return null;
    }

    // Return sources tagged with 'cached' provenance
    const cachedSources: SourceCitation[] = entry.sources.map((s) => ({
      ...s,
      provenance: 'cached',
      retrievalStatus: 'cached',
    }));

    return {
      sources: cachedSources,
      cachedAt: entry.cachedAt,
      ttlSeconds: entry.ttlSeconds,
    };
  }

  set(query: string, sources: SourceCitation[], mode = 'search', ttlSeconds?: number): void {
    if (!sources || sources.length === 0) return; // Never cache empty results
    const key = this.generateKey(query, mode);
    this.cache.set(key, {
      query: query.trim(),
      mode,
      sources,
      cachedAt: new Date().toISOString(),
      ttlSeconds: ttlSeconds || this.defaultTtlSeconds,
    });
  }

  getGeneric<T>(query: string, mode: string): { data: T; cachedAt: string; ttlSeconds: number } | null {
    const key = this.generateKey(query, mode);
    const entry = this.cache.get(key);
    if (!entry || !entry.data) return null;

    const ageSeconds = (Date.now() - new Date(entry.cachedAt).getTime()) / 1000;
    if (ageSeconds > entry.ttlSeconds) {
      this.cache.delete(key);
      return null;
    }

    return {
      data: entry.data as T,
      cachedAt: entry.cachedAt,
      ttlSeconds: entry.ttlSeconds,
    };
  }

  setGeneric<T>(query: string, mode: string, data: T, ttlSeconds?: number): void {
    if (!data) return;
    const key = this.generateKey(query, mode);
    this.cache.set(key, {
      query: query.trim(),
      mode,
      data,
      cachedAt: new Date().toISOString(),
      ttlSeconds: ttlSeconds || this.defaultTtlSeconds,
    });
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}
