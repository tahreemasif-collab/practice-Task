function statusClass(kind, v) {
  if (kind === 'oee') return v > 0.75 ? 'good' : v > 0.6 ? 'warn' : 'bad';
  if (kind === 'def') return v < 5 ? 'good' : v < 15 ? 'warn' : 'bad';
  if (kind === 'alerts') return v === 0 ? 'good' : v < 3 ? 'warn' : 'bad';
  return '';
}

export default function KpiRow({ metrics }) {
  const oee = metrics.oeeHist.at(-1) ?? 0;
  const qual = metrics.qualHist.at(-1) ?? 1;
  const defRate = (1 - qual) * 100;
  const downMins = metrics.downtimeLog.reduce((a, d) => a + d.mins, 0);
  const openAlerts = metrics.alerts.filter((a) => !a.ack).length;

  return (
    <div className="kpi-row">
      <div className="kpi">
        <div className="label">OEE</div>
        <div className={`val ${statusClass('oee', oee)}`}>{(oee * 100).toFixed(1)}%</div>
        <div className="delta">Availability × Performance × Quality</div>
      </div>
      <div className="kpi">
        <div className="label">Defect Rate</div>
        <div className={`val ${statusClass('def', defRate)}`}>{defRate.toFixed(1)}%</div>
        <div className="delta">last 60s window</div>
      </div>
      <div className="kpi">
        <div className="label">Downtime (shift)</div>
        <div className="val">{downMins} min</div>
        <div className="delta">planned vs unplanned</div>
      </div>
      <div className="kpi">
        <div className="label">Open Alerts</div>
        <div className={`val ${statusClass('alerts', openAlerts)}`}>{openAlerts}</div>
        <div className="delta">unacknowledged</div>
      </div>
    </div>
  );
}
