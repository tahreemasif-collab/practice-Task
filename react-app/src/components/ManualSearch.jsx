import { useState } from 'react';

export default function ManualSearch({ onSearch }) {
  const [q, setQ] = useState('');
  const [entry, setEntry] = useState(null); // { result, cached }

  function handleChange(e) {
    const value = e.target.value;
    setQ(value);
    if (!value.trim()) { setEntry(null); return; }
    setEntry(onSearch(value));
  }

  return (
    <div className="panel">
      <h2>Equipment manual retrieval (AI-assisted)</h2>
      <input
        type="text"
        placeholder="e.g. spindle vibration, conveyor jam, sensor drift…"
        value={q}
        onChange={handleChange}
      />
      {entry && (
        entry.result ? (
          <div className="manual-result">
            <div className="src">
              {entry.result.title}
              {entry.cached && <span className="cache-badge">cached</span>}
            </div>
            <div className="txt">{entry.result.text}</div>
          </div>
        ) : (
          <div className="manual-result">
            <div className="txt">No matching manual passage. Try a different term (e.g. "vibration", "jam", "humidity").</div>
          </div>
        )
      )}
    </div>
  );
}
