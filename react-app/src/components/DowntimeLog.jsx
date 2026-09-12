export default function DowntimeLog({ downtimeLog }) {
  if (!downtimeLog.length) {
    return (
      <div className="panel">
        <h2>Downtime log</h2>
        <div className="locked">No downtime events yet this shift.</div>
      </div>
    );
  }
  const max = Math.max(...downtimeLog.map((d) => d.mins));
  return (
    <div className="panel">
      <h2>Downtime log</h2>
      <div style={{ maxHeight: 170, overflow: 'auto' }}>
        {downtimeLog.map((d, i) => (
          <div className="downtime-row" key={i}>
            <div style={{ width: 70, color: 'var(--ink)' }}>{d.station}</div>
            <div className="bar" style={{ width: (d.mins / max) * 80 + 10 }} />
            <div className="dur">{d.mins}m</div>
            <div style={{ color: 'var(--ink-dim)' }}>{d.cause}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
