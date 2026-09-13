import React, { useEffect, useState, useCallback } from 'react';
import { explainAnomaly } from '../services/aiExplain';

export default function AnomalyExplanation({ alert }) {
  const [state, setState] = useState({ loading: true, error: null, result: null, degraded: false });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { data, degraded } = await explainAnomaly(alert);
      setState({ loading: false, error: null, result: data, degraded });
    } catch (err) {
      setState({ loading: false, error: err.message || 'Failed to generate explanation', result: null, degraded: false });
    }
  }, [alert]);

  useEffect(() => {
    load();
  }, [load]);

  if (state.loading) {
    return (
      <div className="ai-explain loading">
        <div className="spinner" />
        <p>Analyzing anomaly and searching equipment manuals…</p>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="ai-explain error">
        <p>⚠ {state.error}</p>
        <button className="btn-ghost" onClick={load}>
          Retry
        </button>
      </div>
    );
  }

  const r = state.result;
  return (
    <div className="ai-explain">
      {state.degraded && <div className="degraded-banner">Showing cached explanation — live AI service is temporarily unreachable.</div>}
      <p className="ai-summary">{r.summary}</p>
      <p className="ai-severity">{r.severityLine}</p>

      <h4>Likely cause(s)</h4>
      <ul>
        {r.likelyCauses.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>

      <h4>Recommended action</h4>
      <p>{r.recommendation}</p>

      {r.citedManual && <div className="cited-manual">Source: {r.citedManual}</div>}

      <button className="btn-ghost" onClick={load}>
        Regenerate
      </button>
    </div>
  );
}
