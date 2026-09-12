import { useEffect, useRef, useState, useCallback } from 'react';
import { plantById } from '../data/plants.js';
import { retrieveManual } from '../data/manuals.js';

const rand = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function freshMetrics(plant) {
  return {
    oeeHist: [], qualHist: [], perfHist: [],
    defects: Object.fromEntries(plant.stations.map((s) => [s, 0])),
    downtimeLog: [],
    alerts: [],
  };
}

function explainAnomaly(cause, station) {
  const hit = retrieveManual(`${station} ${cause}`);
  const causeText = {
    quality: 'Pattern matches a quality-driven anomaly: defect count rose sharply relative to the trailing baseline while throughput stayed flat, pointing to a process/tooling condition rather than a volume issue.',
    availability: 'Pattern matches an availability-driven anomaly: a sudden gap in cycle completions with no corresponding defect spike suggests a stoppage or starve condition rather than a quality fault.',
    performance: 'Pattern matches a performance-driven anomaly: cycle times drifted upward gradually rather than stopping outright, consistent with mechanical wear or a minor stoppage pattern.',
  }[cause];
  const manualLine = hit ? `Per ${hit.title}: ${hit.text}` : 'No matching manual section found — recommend manual inspection.';
  return `${causeText} ${manualLine}`;
}

/**
 * Drives one plant's live metrics. Kept as a single hook (rather than a
 * global store) so each plant tab could — with trivial changes — run an
 * independent simulation/subscription, the same way a real WebSocket
 * connection would be scoped per plant.
 */
export function useSimulation(plantId) {
  const [metrics, setMetrics] = useState(() => freshMetrics(plantById(plantId)));
  const [connState, setConnState] = useState('live'); // live | retry | down
  const [tick, setTick] = useState(0);
  const timerRef = useRef(null);
  const plantRef = useRef(plantId);
  plantRef.current = plantId;

  // reset series when plant changes (mirrors subscribing to a new WS topic)
  useEffect(() => {
    setMetrics(freshMetrics(plantById(plantId)));
  }, [plantId]);

  const doTick = useCallback(() => {
    setTick((t) => t + 1);
    setMetrics((prev) => {
      const plant = plantById(plantRef.current);
      const avail = clamp(rand(0.90, 0.99) - (Math.random() < 0.05 ? rand(0.1, 0.25) : 0), 0.5, 1);
      const perf = clamp(rand(0.85, 0.97) - (Math.random() < 0.05 ? rand(0.1, 0.2) : 0), 0.5, 1);
      const qual = clamp(rand(0.95, 0.995) - (Math.random() < 0.06 ? rand(0.08, 0.22) : 0), 0.5, 1);
      const oee = avail * perf * qual;

      const oeeHist = [...prev.oeeHist, oee].slice(-60);
      const qualHist = [...prev.qualHist, qual].slice(-60);
      const perfHist = [...prev.perfHist, perf].slice(-60);

      const defects = { ...prev.defects };
      plant.stations.forEach((s) => {
        if (Math.random() < 0.4) defects[s] = (defects[s] || 0) + Math.floor(rand(0, 3));
      });

      let downtimeLog = prev.downtimeLog;
      if (Math.random() < 0.12) {
        const s = plant.stations[Math.floor(Math.random() * plant.stations.length)];
        const causes = ['changeover', 'material starve', 'unplanned stop', 'jam clearance', 'calibration'];
        downtimeLog = [
          { station: s, mins: Math.round(rand(2, 18)), cause: causes[Math.floor(Math.random() * causes.length)], ts: Date.now() },
          ...prev.downtimeLog,
        ].slice(0, 8);
      }

      let alerts = prev.alerts;
      if (oee < 0.62 || qual < 0.80 || avail < 0.68) {
        const s = plant.stations[Math.floor(Math.random() * plant.stations.length)];
        let cause, sev;
        if (qual < 0.80) { cause = 'quality'; sev = qual < 0.72 ? 'critical' : 'warn'; }
        else if (avail < 0.68) { cause = 'availability'; sev = 'critical'; }
        else { cause = 'performance'; sev = 'warn'; }
        const msg = {
          quality: `Defect rate spike detected at ${s} — quality factor dropped to ${(qual * 100).toFixed(1)}%.`,
          availability: `Unplanned stoppage suspected at ${s} — availability fell to ${(avail * 100).toFixed(1)}%.`,
          performance: `Cycle-time degradation at ${s} — performance factor at ${(perf * 100).toFixed(1)}%.`,
        }[cause];
        alerts = [
          { id: 'a' + Date.now() + Math.random().toString(16).slice(2, 6), sev, msg, ai: explainAnomaly(cause, s), station: s, ack: false, ts: Date.now() },
          ...prev.alerts,
        ].slice(0, 25);
      }

      return { oeeHist, qualHist, perfHist, defects, downtimeLog, alerts };
    });
  }, []);

  useEffect(() => {
    timerRef.current = setInterval(doTick, 1000);
    return () => clearInterval(timerRef.current);
  }, [doTick]);

  const acknowledge = useCallback((alertId) => {
    setMetrics((prev) => ({
      ...prev,
      alerts: prev.alerts.map((a) => (a.id === alertId ? { ...a, ack: true } : a)),
    }));
  }, []);

  // simulate a dropped feed recovering via exponential backoff — the same
  // resilience pattern the Node/WS backend implements server-side
  const simulateDrop = useCallback(() => {
    if (connState !== 'live') return;
    clearInterval(timerRef.current);
    setConnState('retry');
    let attempt = 0;
    const tryReconnect = () => {
      attempt++;
      const backoff = Math.min(1000 * 2 ** attempt, 8000);
      setTimeout(() => {
        if (Math.random() < 0.55 || attempt >= 4) {
          setConnState('live');
          timerRef.current = setInterval(doTick, 1000);
        } else {
          tryReconnect();
        }
      }, backoff);
    };
    tryReconnect();
  }, [connState, doTick]);

  return { metrics, tick, connState, acknowledge, simulateDrop };
}
