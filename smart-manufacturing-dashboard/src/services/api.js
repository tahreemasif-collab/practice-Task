// src/services/api.js
// A resilient "API client" used for anything that would, in a real system,
// be a network call (AI explanation generation, manual retrieval, export
// jobs). Since this project runs against a simulated backend, `simulateCall`
// stands in for `fetch`, but it fails/latency-jitters randomly so the
// resilience layer (timeout, retry+backoff, circuit breaker, cache
// fallback) is genuinely exercised rather than decorative.

import { cache } from './cache';

class CircuitBreaker {
  constructor({ failureThreshold = 3, cooldownMs = 8000 } = {}) {
    this.failureThreshold = failureThreshold;
    this.cooldownMs = cooldownMs;
    this.failures = 0;
    this.state = 'closed'; // closed -> open -> half-open -> closed
    this.openedAt = 0;
  }

  canRequest() {
    if (this.state === 'open') {
      if (Date.now() - this.openedAt > this.cooldownMs) {
        this.state = 'half-open';
        return true;
      }
      return false;
    }
    return true;
  }

  recordSuccess() {
    this.failures = 0;
    this.state = 'closed';
  }

  recordFailure() {
    this.failures += 1;
    if (this.failures >= this.failureThreshold) {
      this.state = 'open';
      this.openedAt = Date.now();
    }
  }
}

// One breaker per logical endpoint so a flaky AI service doesn't also
// block manual retrieval.
const breakers = new Map();
function breakerFor(endpoint) {
  if (!breakers.has(endpoint)) breakers.set(endpoint, new CircuitBreaker());
  return breakers.get(endpoint);
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timed out')), ms))
  ]);
}

/**
 * Simulated unreliable network call. Swap this out for `fetch(...)` to
 * point the app at a real backend without touching call sites.
 */
export function simulateCall(endpoint, payload, { failRate = 0.18, minLatency = 300, maxLatency = 1400 } = {}) {
  const latency = minLatency + Math.random() * (maxLatency - minLatency);
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < failRate) {
        reject(new Error(`${endpoint} request failed (simulated network error)`));
      } else {
        resolve(payload());
      }
    }, latency);
  });
}

/**
 * Resilient call wrapper: circuit breaker -> retry w/ exponential backoff
 * + jitter -> timeout -> optional cache fallback if every attempt fails.
 */
export async function resilientRequest({
  endpoint,
  fn,
  cacheKey = null,
  cacheTtlMs = 5 * 60 * 1000,
  retries = 2,
  timeoutMs = 3000,
  onAttempt = null
}) {
  const breaker = breakerFor(endpoint);

  if (!breaker.canRequest()) {
    const cached = cacheKey ? cache.get(cacheKey) : null;
    if (cached) return { data: cached, source: 'cache', degraded: true };
    throw new Error(`${endpoint} is temporarily unavailable (circuit open). Please retry shortly.`);
  }

  let lastError = null;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      onAttempt?.(attempt);
      const data = await withTimeout(fn(), timeoutMs);
      breaker.recordSuccess();
      if (cacheKey) cache.set(cacheKey, data, cacheTtlMs);
      return { data, source: 'network', degraded: false, attempts: attempt + 1 };
    } catch (err) {
      lastError = err;
      breaker.recordFailure();
      if (attempt < retries) {
        const backoff = Math.min(2000, 250 * 2 ** attempt) + Math.random() * 200;
        await delay(backoff);
      }
    }
  }

  // All attempts failed — fall back to cache if we have anything.
  const cached = cacheKey ? cache.get(cacheKey) : null;
  if (cached) {
    return { data: cached, source: 'cache', degraded: true, error: lastError?.message };
  }
  throw lastError || new Error(`${endpoint} failed`);
}

export function getBreakerStatus(endpoint) {
  return breakerFor(endpoint).state;
}
