// src/services/cache.js
// Thin caching layer over localStorage with TTL + namespacing, used to
// avoid recomputing/refetching AI explanations, manual search results,
// and to persist alert acknowledgement + user session state across reloads.

const NAMESPACE = 'smq-dashboard:v1:';

function keyFor(key) {
  return `${NAMESPACE}${key}`;
}

export const cache = {
  set(key, value, ttlMs = 5 * 60 * 1000) {
    try {
      const record = { value, expiresAt: Date.now() + ttlMs };
      window.localStorage.setItem(keyFor(key), JSON.stringify(record));
      return true;
    } catch (err) {
      // localStorage can throw (quota exceeded, private mode). Fail soft.
      console.warn('cache.set failed', err);
      return false;
    }
  },

  get(key) {
    try {
      const raw = window.localStorage.getItem(keyFor(key));
      if (!raw) return null;
      const record = JSON.parse(raw);
      if (Date.now() > record.expiresAt) {
        window.localStorage.removeItem(keyFor(key));
        return null;
      }
      return record.value;
    } catch (err) {
      console.warn('cache.get failed', err);
      return null;
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(keyFor(key));
    } catch (err) {
      console.warn('cache.remove failed', err);
    }
  },

  clearAll() {
    try {
      Object.keys(window.localStorage)
        .filter((k) => k.startsWith(NAMESPACE))
        .forEach((k) => window.localStorage.removeItem(k));
    } catch (err) {
      console.warn('cache.clearAll failed', err);
    }
  }
};
