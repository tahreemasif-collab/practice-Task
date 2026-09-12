import { PLANTS, ROLE_PERMS } from '../data/plants.js';

export default function Header({ plant, setPlant, role, setRole, connState, onSimulateDrop, onExport, canExport }) {
  return (
    <header>
      <div className="brand">
        <div className="mark">FL</div>
        <div>
          <div className="name">FLOORLINE</div>
          <div className="sub">Smart Manufacturing Quality Dashboard</div>
        </div>
      </div>

      <label className="status">
        Plant
        <select value={plant} onChange={(e) => setPlant(e.target.value)}>
          {PLANTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </label>

      <label className="status">
        Role
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          {Object.keys(ROLE_PERMS).map((r) => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
        </select>
      </label>

      <div className="status">
        <span className={`dot ${connState === 'down' ? 'down' : connState === 'retry' ? 'retry' : ''}`} />
        <span>
          {connState === 'live' ? 'Live · streaming' : connState === 'retry' ? 'Reconnecting (backoff)…' : 'Feed down'}
        </span>
      </div>

      <button className="ghost" onClick={onSimulateDrop} title="Simulate a feed interruption to demo retry/backoff">
        Simulate drop
      </button>
      <button className="primary" onClick={onExport} disabled={!canExport}>Export CSV</button>
    </header>
  );
}
