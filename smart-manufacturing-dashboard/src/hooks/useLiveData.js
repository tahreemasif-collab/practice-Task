// src/hooks/useLiveData.js
// Subscribes to the simulated LiveFeed and maintains rolling in-memory
// buffers for streaming charts, latest per-machine snapshots, a defect
// log, a downtime log, and an alert list. Also persists acknowledged
// alert IDs to cache so acknowledgement survives a page reload.

import { useEffect, useRef, useState, useCallback } from 'react';
import { LiveFeed } from '../data/simulator';
import { cache } from '../services/cache';

const HISTORY_LIMIT = 60; // points kept per machine for streaming charts
const LOG_LIMIT = 200;
const ACK_KEY = 'acknowledged-alerts';

export function useLiveData() {
  const feedRef = useRef(null);
  const [status, setStatus] = useState('disconnected');
  const [machineSnapshots, setMachineSnapshots] = useState({}); // machineId -> latest tick
  const [history, setHistory] = useState({}); // machineId -> [oee points]
  const [defectLog, setDefectLog] = useState([]);
  const [downtimeLog, setDowntimeLog] = useState([]);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const feed = new LiveFeed({ intervalMs: 1500, dropRate: 0.02 });
    feedRef.current = feed;

    const ackSet = new Set(cache.get(ACK_KEY) || []);

    const unsubData = feed.onData((events) => {
      setMachineSnapshots((prev) => {
        const next = { ...prev };
        events
          .filter((e) => e.type === 'production_tick')
          .forEach((e) => {
            next[e.payload.machineId] = e.payload;
          });
        return next;
      });

      setHistory((prev) => {
        const next = { ...prev };
        events
          .filter((e) => e.type === 'production_tick')
          .forEach((e) => {
            const p = e.payload;
            const arr = next[p.machineId] ? [...next[p.machineId]] : [];
            arr.push({ t: p.timestamp, oee: p.oee, availability: p.availability, performance: p.performance, quality: p.quality, throughput: p.throughputUnitsPerMin });
            if (arr.length > HISTORY_LIMIT) arr.shift();
            next[p.machineId] = arr;
          });
        return next;
      });

      const newDefects = events
        .filter((e) => e.type === 'inspection_result' && !e.payload.passed)
        .map((e) => e.payload);
      if (newDefects.length) {
        setDefectLog((prev) => [...newDefects, ...prev].slice(0, LOG_LIMIT));
      }

      const newDowntime = events
        .filter((e) => e.type === 'alert' && e.payload.type === 'downtime')
        .map((e) => e.payload);
      if (newDowntime.length) {
        setDowntimeLog((prev) => [...newDowntime, ...prev].slice(0, LOG_LIMIT));
      }

      const newAlerts = events
        .filter((e) => e.type === 'alert')
        .map((e) => ({ ...e.payload, acknowledged: ackSet.has(e.payload.id) }));
      if (newAlerts.length) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, LOG_LIMIT));
      }
    });

    const unsubStatus = feed.onStatus(setStatus);

    feed.connect();

    return () => {
      unsubData();
      unsubStatus();
      feed.disconnect();
    };
  }, []);

  const acknowledgeAlert = useCallback((alertId) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a)));
    const ackList = new Set(cache.get(ACK_KEY) || []);
    ackList.add(alertId);
    cache.set(ACK_KEY, Array.from(ackList), 7 * 24 * 60 * 60 * 1000);
  }, []);

  return { status, machineSnapshots, history, defectLog, downtimeLog, alerts, acknowledgeAlert };
}
