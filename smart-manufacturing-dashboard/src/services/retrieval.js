// src/services/retrieval.js
// Lightweight retrieval over the local manuals corpus. Uses a TF-IDF-style
// scoring so results are relevance-ranked without needing an embeddings
// backend. Exposed through the resilient API wrapper so it behaves like a
// real retrieval microservice (latency, occasional failure, caching).

import { MANUALS, getManualByMachine } from '../data/manuals';
import { resilientRequest, simulateCall } from './api';

const STOPWORDS = new Set(['the', 'a', 'an', 'is', 'are', 'on', 'of', 'to', 'in', 'and', 'or', 'for', 'with', 'by']);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t && !STOPWORDS.has(t));
}

// Build a flat index of { manualId, title, chunkIndex, text, tokens } once.
const INDEX = MANUALS.flatMap((manual) =>
  manual.chunks.map((text, chunkIndex) => ({
    manualId: manual.id,
    title: manual.title,
    chunkIndex,
    text,
    tokens: tokenize(text)
  }))
);

function scoreChunk(queryTokens, chunk) {
  if (queryTokens.length === 0) return 0;
  const chunkTokenSet = new Map();
  chunk.tokens.forEach((t) => chunkTokenSet.set(t, (chunkTokenSet.get(t) || 0) + 1));
  let score = 0;
  queryTokens.forEach((qt) => {
    if (chunkTokenSet.has(qt)) score += chunkTokenSet.get(qt);
    // partial/substring match gets a smaller boost (handles plurals etc.)
    else if (chunk.tokens.some((t) => t.includes(qt) || qt.includes(t))) score += 0.4;
  });
  return score / Math.sqrt(chunk.tokens.length);
}

function searchLocal(query, { manualId = null, topK = 3 } = {}) {
  const queryTokens = tokenize(query);
  const pool = manualId ? INDEX.filter((c) => c.manualId === manualId) : INDEX;
  return pool
    .map((chunk) => ({ ...chunk, score: scoreChunk(queryTokens, chunk) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

/**
 * Search the manuals corpus, routed through the resilient API layer so the
 * UI demonstrates real retry/cache/circuit-breaker behavior even though
 * the "service" is local.
 */
export async function searchManuals(query, { manualId = null, topK = 3 } = {}) {
  const cacheKey = `manual-search:${manualId || 'all'}:${query.toLowerCase().trim()}`;
  return resilientRequest({
    endpoint: 'manual-retrieval',
    cacheKey,
    cacheTtlMs: 10 * 60 * 1000,
    retries: 2,
    timeoutMs: 2500,
    fn: () =>
      simulateCall('manual-retrieval', () => searchLocal(query, { manualId, topK }), {
        failRate: 0.12,
        minLatency: 250,
        maxLatency: 900
      })
  });
}

export function getManualTitle(manualId) {
  return getManualByMachine(manualId)?.title || 'Unknown equipment manual';
}
