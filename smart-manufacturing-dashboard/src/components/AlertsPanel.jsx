import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import AlertDetailModal from './AlertDetailModal';
import { exportCSV } from '../services/export';

export default function AlertsPanel({ alerts, onAcknowledge }) {
  const { session } = useAuth();
  const [filter, setFilter] = useState('all'); // all | unacknowledged | critical
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return alerts.filter((a) => {
      if (filter === 'unacknowledged') return !a.acknowledged;
      if (filter === 'critical') return a.severity === 'critical';
      return true;
    });
  }, [alerts, filter]);

  const unackCount = alerts.filter((a) => !a.acknowledged).length;

  function handleExport() {
    exportCSV(
      `alerts-${Date.now()}.csv`,
      alerts.map((a) => ({
        id: a.id,
        machine: a.machineName,
        type: a.type,
        severity: a.severity,
        message: a.message,
        acknowledged: a.acknowledged,
        timestamp: new Date(a.timestamp).toISOString()
      }))
    );
  }

  return (
    <div className="panel alerts-panel">
      <div className="panel-header">
        <h2>
          Alerts <span className="badge-count">{unackCount} open</span>
        </h2>
        <div className="panel-actions">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="unacknowledged">Unacknowledged</option>
            <option value="critical">Critical only</option>
          </select>
          {session.permissions.export && (
            <button className="btn-ghost" onClick={handleExport}>
              Export CSV
            </button>
          )}
        </div>
      </div>

      <div className="alert-list">
        {filtered.length === 0 && <p className="empty-state">No alerts match this filter.</p>}
        {filtered.slice(0, 30).map((a) => (
          <button key={a.id} className={`alert-row sev-${a.severity} ${a.acknowledged ? 'acked' : ''}`} onClick={() => setSelected(a)}>
            <span className={`severity-dot sev-${a.severity}`} />
            <span className="alert-row-main">
              <span className="alert-row-title">{a.machineName}</span>
              <span className="alert-row-msg">{a.message}</span>
            </span>
            <span className="alert-row-time">{new Date(a.timestamp).toLocaleTimeString()}</span>
            {a.acknowledged && <span className="ack-check">✓</span>}
          </button>
        ))}
      </div>

      <AlertDetailModal alert={selected} onClose={() => setSelected(null)} onAcknowledge={(id) => { onAcknowledge(id); setSelected((s) => (s ? { ...s, acknowledged: true } : s)); }} />
    </div>
  );
}
