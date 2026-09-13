import React, { useMemo } from 'react';
import BarChart from './BarChart';
import { useAuth } from '../context/AuthContext';
import { exportCSV } from '../services/export';

export default function DowntimePanel({ downtimeLog }) {
  const { session } = useAuth();

  const byReason = useMemo(() => {
    const counts = {};
    downtimeLog.forEach((d) => {
      const key = d.reason || 'Unspecified';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [downtimeLog]);

  function handleExport() {
    exportCSV(
      `downtime-${Date.now()}.csv`,
      downtimeLog.map((d) => ({
        id: d.id,
        machine: d.machineName,
        reason: d.reason,
        severity: d.severity,
        timestamp: new Date(d.timestamp).toISOString()
      }))
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Downtime by reason</h2>
        {session.permissions.export && (
          <button className="btn-ghost" onClick={handleExport}>
            Export CSV
          </button>
        )}
      </div>
      {byReason.length === 0 ? <p className="empty-state">No downtime events recorded yet.</p> : <BarChart data={byReason} color="#ffb020" />}

      <h3 className="subhead">Recent downtime events</h3>
      <div className="mini-table">
        {downtimeLog.slice(0, 6).map((d) => (
          <div key={d.id} className="mini-row">
            <span>{d.machineName}</span>
            <span className="muted">{d.reason}</span>
            <span className="muted">{new Date(d.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        {downtimeLog.length === 0 && <p className="empty-state">—</p>}
      </div>
    </div>
  );
}
