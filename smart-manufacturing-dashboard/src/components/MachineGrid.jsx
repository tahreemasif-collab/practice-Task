import React from 'react';
import OEEGauge from './OEEGauge';
import LineChart from './LineChart';

export default function MachineGrid({ machines, snapshots, history }) {
  return (
    <div className="machine-grid">
      {machines.map((m) => {
        const snap = snapshots[m.id];
        const h = history[m.id] || [];
        const series = [
          { name: 'OEE', data: h.map((p) => ({ t: p.t, value: p.oee })) }
        ];
        return (
          <div className="machine-card" key={m.id}>
            <div className="machine-card-top">
              <OEEGauge value={snap?.oee ?? 0} size={96} />
              <div className="machine-meta">
                <div className="machine-name">{m.name}</div>
                <div className="machine-sub">
                  A {snap?.availability ?? '—'}% · P {snap?.performance ?? '—'}% · Q {snap?.quality ?? '—'}%
                </div>
                <div className="machine-sub muted">{snap?.throughputUnitsPerMin ?? '—'} units/min</div>
              </div>
            </div>
            <LineChart series={series} height={110} yMin={0} yMax={100} unit="%" />
          </div>
        );
      })}
    </div>
  );
}
