function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString([], { hour12: false });
}

export default function AlertsPanel({ alerts, canAck, onAck }) {
  return (
    <div className="panel" style={{ flex: 1 }}>
      <h2>Alerts &amp; anomaly explanations</h2>
      {!alerts.length && <div className="locked">No anomalies detected. Feed is nominal.</div>}
      {alerts.map((a) => (
        <div className={`alert ${a.sev === 'warn' ? 'warn' : ''} ${a.ack ? 'ack' : ''}`} key={a.id}>
          <div className="top">
            <span className="sev">{a.sev}</span>
            <span className="time">{fmtTime(a.ts)}</span>
          </div>
          <div className="msg">{a.msg}</div>
          <div className="ai"><b>AI explanation</b>{a.ai}</div>
          <div className="actions">
            {a.ack
              ? <span className="locked">acknowledged</span>
              : canAck
                ? <button onClick={() => onAck(a.id)}>Acknowledge</button>
                : <span className="locked">view-only role — cannot acknowledge</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
