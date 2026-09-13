import React, { useMemo } from 'react';
import BarChart from './BarChart';
import { useAuth } from '../context/AuthContext';
import { exportCSV } from '../services/export';

export default function DefectsPanel({ defectLog }) {
  const { session } = useAuth();

  const byType = useMemo(() => {
    const counts = {};
    defectLog.forEach((d) => {
      const key = d.defectType || 'Unspecified';
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [defectLog]);

  function handleExport() {
    exportCSV(
      `defects-${Date.now()}.csv`,
      defectLog.map((d) => ({
        id: d.id,
        machine: d.machineName,
        defectType: d.defectType,
        timestamp: new Date(d.timestamp).toISOString()
      }))
    );
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h2>Defects by type</h2>
        {session.permissions.export && (
          <button className="btn-ghost" onClick={handleExport}>
            Export CSV
          </button>
        )}
      </div>
      {byType.length === 0 ? <p className="empty-state">No defects recorded yet.</p> : <BarChart data={byType} color="#ff5c5c" />}

      <h3 className="subhead">Recent failed inspections</h3>
      <div className="mini-table">
        {defectLog.slice(0, 6).map((d) => (
          <div key={d.id} className="mini-row">
            <span>{d.machineName}</span>
            <span className="muted">{d.defectType || 'Unspecified'}</span>
            <span className="muted">{new Date(d.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        {defectLog.length === 0 && <p className="empty-state">—</p>}
      </div>
    </div>
  );
}
