import { ApiServer } from './server.js';
export * from './types.js';
export * from './providers/SearchProvider.js';
export * from './providers/DuckDuckGoProvider.js';
export * from './providers/TavilyProvider.js';
export * from './providers/MockProvider.js';
export * from './services/CacheService.js';
export * from './services/AnswerGenerator.js';
export * from './services/CompanionProbe.js';
export * from './server.js';

const PORT = parseInt(process.env.PORT || '3001', 10);

// Auto-start server when run directly (cross-platform path check)
const scriptPath = (process.argv?.[1] || '').replace(/\\/g, '/');
if (scriptPath.includes('dist/index') || scriptPath.includes('src/index')) {
  const apiServer = new ApiServer();
  apiServer.listen(PORT, () => {
    console.log(`[Aura API] Research Orchestration & Search Server listening on http://localhost:${PORT}`);
    console.log(`[Aura API] General Search Provider: DuckDuckGo Open Web (Live)`);
    console.log(`[Aura API] Cache TTL: 15 minutes | Rate Limiting: 60 req/min`);
    console.log(`[Aura API] Companion Probe: 127.0.0.1:5892 (Strict socket audit)`);
  });
}
