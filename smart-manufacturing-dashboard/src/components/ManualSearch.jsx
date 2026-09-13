import React, { useState } from 'react';
import { searchManuals } from '../services/retrieval';

export default function ManualSearch({ machines }) {
  const [query, setQuery] = useState('');
  const [manualId, setManualId] = useState('all');
  const [state, setState] = useState({ loading: false, error: null, results: [], degraded: false });

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data, degraded } = await searchManuals(query, { manualId: manualId === 'all' ? null : manualId, topK: 4 });
      setState({ loading: false, error: null, results: data, degraded });
    } catch (err) {
      setState({ loading: false, error: err.message || 'Search failed', results: [], degraded: false });
    }
  }

  const uniqueManuals = [...new Map(machines.map((m) => [m.manualId, m])).values()];

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Equipment manual search</h2>
      </div>
      <form className="manual-search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="e.g. defect spike, downtime jam, performance drop…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={manualId} onChange={(e) => setManualId(e.target.value)}>
          <option value="all">All manuals</option>
          {uniqueManuals.map((m) => (
            <option key={m.manualId} value={m.manualId}>
              {m.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary" disabled={state.loading}>
          {state.loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {state.error && <p className="error-text">⚠ {state.error}</p>}
      {state.degraded && <div className="degraded-banner">Showing cached results — retrieval service is temporarily unreachable.</div>}

      <div className="manual-results">
        {state.results.map((r, i) => (
          <div key={i} className="manual-result">
            <div className="manual-result-title">{r.title}</div>
            <div className="manual-result-text">{r.text}</div>
          </div>
        ))}
        {!state.loading && state.results.length === 0 && query && !state.error && <p className="empty-state">No matching passages found.</p>}
      </div>
    </div>
  );
}
