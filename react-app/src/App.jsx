import { useState } from 'react';
import Header from './components/Header.jsx';
import KpiRow from './components/KpiRow.jsx';
import OeeChart from './components/OeeChart.jsx';
import DefectChart from './components/DefectChart.jsx';
import DowntimeLog from './components/DowntimeLog.jsx';
import AlertsPanel from './components/AlertsPanel.jsx';
import ManualSearch from './components/ManualSearch.jsx';
import { useSimulation } from './hooks/useSimulation.js';
import { useManualCache } from './hooks/useManualCache.js';
import { plantById, ROLE_PERMS } from './data/plants.js';

export default function App() {
  const [plant, setPlant] = useState('austin');
  const [role, setRole] = useState('supervisor');
  const { metrics, tick, connState, acknowledge, simulateDrop } = useSimulation(plant);
  const { search, stats } = useManualCache();

  const perms = ROLE_PERMS[role];

  function exportCsv() {
    if (!perms.canExport) return;
    const rows = [['timestamp', 'severity', 'station', 'message', 'acknowledged']];
    metrics.alerts.forEach((a) => rows.push([new Date(a.ts).toISOString(), a.sev, a.station, a.msg.replace(/,/g, ';'), a.ack]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `floorline_alerts_${plant}_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div id="app">
      <Header
        plant={plant} setPlant={setPlant}
        role={role} setRole={setRole}
        connState={connState}
        onSimulateDrop={simulateDrop}
        onExport={exportCsv}
        canExport={perms.canExport}
      />

      <KpiRow metrics={metrics} />

      <main>
        <div className="col">
          <OeeChart oeeHist={metrics.oeeHist} qualHist={metrics.qualHist} perfHist={metrics.perfHist} />
          <div className="charts-grid">
            <DefectChart defects={metrics.defects} />
            <DowntimeLog downtimeLog={metrics.downtimeLog} />
          </div>
          <ManualSearch onSearch={search} />
        </div>
        <div className="col">
          <AlertsPanel alerts={metrics.alerts} canAck={perms.canAck} onAck={acknowledge} />
        </div>
      </main>

      <footer>
        <span>tick {tick} · {plantById(plant).name} · role: {perms.label}</span>
        <span>cache: {stats.hits} hits / {stats.lookups} lookups</span>
      </footer>
    </div>
  );
}
