import * as http from 'node:http';
import { URL } from 'node:url';
import { SearchResultPayload, SourceCitation } from '@private-browser/shared';
import { DuckDuckGoProvider } from './providers/DuckDuckGoProvider.js';
import { TavilyProvider } from './providers/TavilyProvider.js';
import { MockProvider } from './providers/MockProvider.js';
import { SearchProvider } from './providers/SearchProvider.js';
import { CacheService } from './services/CacheService.js';
import { AnswerGenerator } from './services/AnswerGenerator.js';
import { CompanionProbe } from './services/CompanionProbe.js';
import { SearchApiRequest, SearchApiResponse } from './types.js';

export class ApiServer {
  private server: http.Server;
  private cacheService: CacheService;
  private answerGenerator: AnswerGenerator;
  private companionProbe: CompanionProbe;
  private providers: Map<string, SearchProvider> = new Map();

  // Rate limiter map: IP -> timestamps
  private requestLog = new Map<string, number[]>();
  private rateLimitWindowMs = 60000; // 1 minute
  private maxRequestsPerWindow = 60;

  constructor() {
    this.cacheService = new CacheService(900); // 15 minutes TTL
    this.answerGenerator = new AnswerGenerator();
    this.companionProbe = new CompanionProbe();

    // Register search providers
    const ddg = new DuckDuckGoProvider();
    const tavily = new TavilyProvider();
    const mock = new MockProvider();

    this.providers.set(ddg.id, ddg);
    this.providers.set(tavily.id, tavily);
    this.providers.set(mock.id, mock);

    this.server = http.createServer((req, res) => this.handleRequest(req, res));
  }

  private isRateLimited(ip: string): boolean {
    const now = Date.now();
    const timestamps = (this.requestLog.get(ip) || []).filter((t) => now - t < this.rateLimitWindowMs);
    if (timestamps.length >= this.maxRequestsPerWindow) {
      return true;
    }
    timestamps.push(now);
    this.requestLog.set(ip, timestamps);
    return false;
  }

  private setCorsHeaders(res: http.ServerResponse): void {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  }

  private async parseJsonBody<T>(req: http.IncomingMessage): Promise<T> {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 512 * 1024) {
          // 512KB payload limit to prevent memory exhaustion
          req.destroy();
          reject(new Error('Payload too large'));
        }
      });
      req.on('end', () => {
        try {
          resolve(body ? JSON.parse(body) : ({} as T));
        } catch (err) {
          reject(new Error('Invalid JSON payload'));
        }
      });
      req.on('error', reject);
    });
  }

  private async handleRequest(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    this.setCorsHeaders(res);

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const ip = req.socket.remoteAddress || 'unknown';
    if (this.isRateLimited(ip)) {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Rate limit exceeded. Try again in 60 seconds.' }));
      return;
    }

    const parsedUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = parsedUrl.pathname;

    try {
      // 1. Health check & configuration audit
      if (req.method === 'GET' && pathname === '/api/health') {
        const configuredProviders = Array.from(this.providers.values()).map((p) => ({
          id: p.id,
          name: p.name,
          isConfigured: p.isConfigured,
        }));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            providers: configuredProviders,
            aiSynthesisConfigured: Boolean(process.env.GEMINI_API_KEY),
            cacheSize: this.cacheService.size(),
          })
        );
        return;
      }

      // 2. Real General Web Search endpoint
      if (req.method === 'POST' && pathname === '/api/search') {
        const body = await this.parseJsonBody<SearchApiRequest>(req);
        const query = body.query?.trim();

        if (!query) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Missing query parameter' }));
          return;
        }

        const startTime = Date.now();
        const mode = body.mode || 'search';
        let sources: SourceCitation[] = [];
        let isFromCache = false;
        let cacheMeta: { cachedAt: string; ttlSeconds: number; isStale: boolean } | undefined;
        let usedProviderId = 'duckduckgo';

        // Check cache unless forceLive is explicitly requested
        if (!body.forceLive) {
          const cached = this.cacheService.get(query, mode);
          if (cached) {
            sources = cached.sources;
            isFromCache = true;
            cacheMeta = {
              cachedAt: cached.cachedAt,
              ttlSeconds: cached.ttlSeconds,
              isStale: false,
            };
          }
        }

        // If not cached, execute live retrieval
        if (!isFromCache) {
          // Select provider
          let provider: SearchProvider | undefined;
          if (body.provider === 'fixture') {
            provider = this.providers.get('fixture_provider');
            usedProviderId = 'fixture_provider';
          } else if (body.provider === 'tavily' && this.providers.get('tavily')?.isConfigured) {
            provider = this.providers.get('tavily');
            usedProviderId = 'tavily';
          } else {
            provider = this.providers.get('duckduckgo');
            usedProviderId = 'duckduckgo';
          }

          if (!provider) {
            provider = this.providers.get('duckduckgo')!;
          }

          try {
            sources = await provider.search(query, { maxResults: body.maxResults || 6 });
            if (sources.length > 0 && provider.id !== 'fixture_provider') {
              this.cacheService.set(query, sources, mode);
            }
          } catch (err: any) {
            console.error(`Provider [${provider.id}] search error:`, err.message);
            // If live provider failed and no sources, try fallback fixture with clear mock provenance
            const fallbackProvider = this.providers.get('fixture_provider')!;
            sources = await fallbackProvider.search(query, { maxResults: 3 });
            usedProviderId = 'fixture_provider';
          }
        }

        const durationMs = Date.now() - startTime;
        const resultProvenance = isFromCache
          ? 'cached'
          : usedProviderId === 'fixture_provider'
          ? 'mock'
          : sources.length > 0
          ? 'live'
          : 'unavailable';

        // Generate source-grounded answer
        const answerResponse = await this.answerGenerator.generateAnswer({
          query,
          sources,
          mode,
          constraints: body.constraints,
        });

        const evidenceList = this.answerGenerator.extractEvidenceList(sources);

        const payload: SearchResultPayload = {
          id: `res-${Date.now()}`,
          query,
          refinedQuery: query,
          mode,
          groundedAnswer: answerResponse.groundedAnswer,
          citations: sources,
          evidenceList,
          conflictingFindings: [],
          unverifiedAspects:
            resultProvenance === 'mock'
              ? ['Notice: Displaying offline sample test fixtures. No live internet query was executed.']
              : [],
          followUpSuggestions: [
            `What are the most recent updates on ${query.slice(0, 30)}?`,
            `How does this compare with industry standards?`,
            `Are there alternative implementations?`,
          ],
          retrievalTimestamp: new Date().toISOString(),
          processingDurationMs: durationMs,
          provenance: resultProvenance,
          providerId: usedProviderId,
          isLiveResult: resultProvenance === 'live',
          providerStatusMessage:
            resultProvenance === 'live'
              ? `Live retrieval via ${usedProviderId === 'duckduckgo' ? 'DuckDuckGo Open Web' : usedProviderId}`
              : isFromCache
              ? `Cached research snapshot (${cacheMeta?.cachedAt.slice(11, 19)} UTC)`
              : resultProvenance === 'mock'
              ? 'Sample Test Fixture (Offline)'
              : 'Provider Unavailable',
          cacheMetadata: cacheMeta,
        };

        const response: SearchApiResponse = {
          success: true,
          payload,
          provenance: resultProvenance,
          providerId: usedProviderId,
          durationMs,
        };

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
        return;
      }

      // 3. Companion Status Probe (Honest socket detection on localhost:5892)
      if (req.method === 'GET' && pathname === '/api/companion/status') {
        const probeResult = await this.companionProbe.probePort(5892);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(probeResult));
        return;
      }

      // 4. Cache management endpoints
      if (req.method === 'POST' && pathname === '/api/cache/clear') {
        this.cacheService.clear();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Cache cleared' }));
        return;
      }

      // 404 for unknown endpoints
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: `Not found: ${req.method} ${pathname}` }));
    } catch (err: any) {
      console.error('API server internal error:', err);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal server error', details: err.message }));
    }
  }

  public listen(port: number, callback?: () => void): http.Server {
    return this.server.listen(port, callback);
  }

  public close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server.close((err) => (err ? reject(err) : resolve()));
    });
  }

  public getCacheService(): CacheService {
    return this.cacheService;
  }

  public getProviders(): Map<string, SearchProvider> {
    return this.providers;
  }
}
