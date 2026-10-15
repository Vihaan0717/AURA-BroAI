import { SourceCitation, normalizeAndDeduplicateSources } from '@private-browser/shared';
import { SearchProvider } from './SearchProvider.js';

export class MockProvider implements SearchProvider {
  public readonly id = 'fixture_provider';
  public readonly name = 'Offline Sample Fixtures (Test Only)';
  public readonly isConfigured = true;

  async search(
    query: string,
    options?: { maxResults?: number; signal?: AbortSignal }
  ): Promise<SourceCitation[]> {
    const qLower = query.toLowerCase();
    const maxResults = options?.maxResults || 4;

    const fixtures: Partial<SourceCitation>[] = [
      {
        id: `mock-${Date.now()}-1`,
        title: `Standards Documentation: ${query}`,
        url: 'https://standards.org/specifications/core-protocols',
        snippet: 'Standards specification defining deterministic protocol behaviors for testing environments.',
        provenance: 'mock',
        retrievalStatus: 'mocked',
        providerId: this.id,
        retrievalTimestamp: new Date().toISOString(),
      },
      {
        id: `mock-${Date.now()}-2`,
        title: 'Open Source Security Foundation Specification',
        url: 'https://openssf.org/best-practices/verification-integrity',
        snippet: 'Guidelines for evaluating security parameters in automated testing scenarios.',
        provenance: 'mock',
        retrievalStatus: 'mocked',
        providerId: this.id,
        retrievalTimestamp: new Date().toISOString(),
      },
    ];

    if (qLower.includes('passkey')) {
      fixtures.unshift({
        id: `mock-pk-1`,
        title: 'FIDO Alliance: Passkey Technical Architecture & Security Whitepaper',
        url: 'https://fidoalliance.org/passkeys/technical-architecture',
        snippet: 'Passkeys utilize public-key cryptography where the private key never leaves the client device enclave.',
        provenance: 'mock',
        retrievalStatus: 'mocked',
        providerId: this.id,
        retrievalTimestamp: new Date().toISOString(),
      });
    }

    return normalizeAndDeduplicateSources(fixtures, 'mock', this.id).slice(0, maxResults);
  }
}
