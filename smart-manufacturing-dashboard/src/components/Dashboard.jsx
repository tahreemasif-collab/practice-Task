import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PLANTS } from '../data/simulator';
import { useLiveData } from '../hooks/useLiveData';
import Header from './Header';
import KPICard from './KPICard';
import MachineGrid from './MachineGrid';
import AlertsPanel from './AlertsPanel';
import DefectsPanel from './DefectsPanel';
import DowntimePanel from './DowntimePanel';
import ManualSearch from './ManualSearch';
import ErrorBoundary from './ErrorBoundary';
import { exportJSON } from '../services/export';

export default function Dashboard() {
  const { session } = useAuth();
  const { status, machineSnapshots, history, defectLog, downtimeLog, alerts, acknowledgeAlert } = useLiveData();

  const visiblePlants = PLANTS.filter((p) => session.assignedPlants.includes(p.id));
  const [selectedPlantId, setSelectedPlantId] = useState(visiblePlants[0].id);
  const activePlant = visiblePlants.find((p) => p.id === selectedPlantId) || visiblePlants[0];

  const plantMachines = activePlant.machines;
  const plantMachineIds = new Set(plantMachines.map((m) => m.id));

  const plantSnapshots = useMemo(() => {
    const list = plantMachines.map((m) => machineSnapshots[m.id]).filter(Boolean);
    return list;
  }, [plantMachines, machineSnapshots]);

  const avgOEE = plantSnapshots.length ? plantSnapshots.reduce((s, m) => s + m.oee, 0) / plantSnapshots.length : 0;
  const avgAvailability = plantSnapshots.length ? plantSnapshots.reduce((s, m) => s + m.availability, 0) / plantSnapshots.length : 0;
  const totalThroughput = plantSnapshots.reduce((s, m) => s + m.throughputUnitsPerMin, 0);
  const totalDefectUnits = plantSnapshots.reduce((s, m) => s + m.defectUnits, 0);

  const plantAlerts = alerts.filter((a) => plantMachineIds.has(a.machineId));
  const plantDefects = defectLog.filter((d) => plantMachineIds.has(d.machineId));
  const plantDowntime = downtimeLog.filter((d) => plantMachineIds.has(d.machineId));

  function handleExportAll() {
    exportJSON(`plant-snapshot-${activePlant.id}-${Date.now()}.json`, {
      plant: activePlant.name,
      exportedAt: new Date().toISOString(),
      kpis: { avgOEE, avgAvailability, totalThroughput, totalDefectUnits },
      machines: plantSnapshots,
      alerts: plantAlerts,
      defects: plantDefects,
      downtime: plantDowntime
    });
  }

  return (
    <div className="dashboard">
      <Header status={status} plants={visiblePlants} selectedPlantId={activePlant.id} onSelectPlant={setSelectedPlantId} />

      <main className="dashboard-body">
        <section className="kpi-row">
          <KPICard label="Plant OEE" value={avgOEE.toFixed(1)} unit="%" tone={avgOEE >= 75 ? 'good' : avgOEE >= 55 ? 'warn' : 'bad'} />
          <KPICard label="Availability" value={avgAvailability.toFixed(1)} unit="%" />
          <KPICard label="Throughput" value={totalThroughput.toFixed(0)} unit=" units/min" />
          <KPICard label="Defect units (live)" value={totalDefectUnits.toFixed(0)} unit=" /min" tone={totalDefectUnits > 10 ? 'bad' : 'default'} />
          {session.permissions.export && (
            <button className="btn-primary export-all-btn" onClick={handleExportAll}>
              Export plant snapshot
            </button>
          )}
        </section>

        <ErrorBoundary>
          <section className="panel">
            <div className="panel-header">
              <h2>Machines — {activePlant.name}</h2>
            </div>
            <MachineGrid machines={plantMachines} snapshots={machineSnapshots} history={history} />
          </section>
        </ErrorBoundary>

        <div className="two-col">
          <ErrorBoundary>
            <AlertsPanel alerts={plantAlerts} onAcknowledge={acknowledgeAlert} />
          </ErrorBoundary>
          <ErrorBoundary>
            <ManualSearch machines={plantMachines} />
          </ErrorBoundary>
        </div>

        <div className="two-col">
          <ErrorBoundary>
            <DefectsPanel defectLog={plantDefects} />
          </ErrorBoundary>
          <ErrorBoundary>
            <DowntimePanel downtimeLog={plantDowntime} />
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}
