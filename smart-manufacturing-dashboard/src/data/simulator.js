// src/data/simulator.js
// Simulates a live production/inspection data feed for multiple plants and
// machines. Designed to mimic the event shape a real WebSocket/MQTT bridge
// would deliver, so swapping in a real backend later only means replacing
// this module.

export const PLANTS = [
  {
    id: 'plant-a',
    name: 'Austin Assembly',
    machines: [
      { id: 'm1', name: 'CNC Mill 12', manualId: 'cnc-mill' },
      { id: 'm2', name: 'Robotic Welder 3', manualId: 'robotic-welder' },
      { id: 'm3', name: 'Injection Molder 7', manualId: 'injection-molder' }
    ]
  },
  {
    id: 'plant-b',
    name: 'Querétaro Fabrication',
    machines: [
      { id: 'm4', name: 'CNC Mill 4', manualId: 'cnc-mill' },
      { id: 'm5', name: 'Stamping Press 2', manualId: 'stamping-press' }
    ]
  },
  {
    id: 'plant-c',
    name: 'Penang Electronics',
    machines: [
      { id: 'm6', name: 'SMT Line 1', manualId: 'smt-line' },
      { id: 'm7', name: 'Reflow Oven 2', manualId: 'reflow-oven' },
      { id: 'm8', name: 'AOI Inspector 1', manualId: 'aoi-inspector' }
    ]
  }
];

const DOWNTIME_REASONS = [
  'Changeover',
  'Unplanned maintenance',
  'Material shortage',
  'Operator break',
  'Quality hold',
  'Tooling adjustment'
];

const DEFECT_TYPES = ['Dimensional', 'Surface finish', 'Missing component', 'Solder bridge', 'Misalignment', 'Contamination'];

function rand(min, max) {
  return Math.random() * (max - min) + min;
}
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

let tickCounter = 0;
let alertSeq = 0;

/**
 * Generates one simulated tick of data for every machine in every plant.
 * Occasionally injects anomalies (OEE crashes, defect spikes, downtime,
 * alerts) so the dashboard has something interesting to react to.
 */
function generateTick(state) {
  tickCounter += 1;
  const timestamp = Date.now();
  const events = [];

  for (const plant of PLANTS) {
    for (const machine of plant.machines) {
      const key = machine.id;
      const prev = state.machineState[key] || {
        availability: rand(85, 98),
        performance: rand(80, 97),
        quality: rand(94, 99.5),
        throughput: rand(40, 90),
        anomalyCooldown: 0
      };

      // Random walk for realism
      let availability = clamp(prev.availability + rand(-2, 2), 40, 100);
      let performance = clamp(prev.performance + rand(-3, 3), 35, 100);
      let quality = clamp(prev.quality + rand(-1, 1), 60, 100);
      let throughput = clamp(prev.throughput + rand(-5, 5), 10, 120);

      let anomaly = null;
      const anomalyCooldown = Math.max(0, prev.anomalyCooldown - 1);

      // ~4% chance per tick of an anomaly, unless on cooldown
      if (anomalyCooldown === 0 && Math.random() < 0.04) {
        const kind = pick(['oee_drop', 'defect_spike', 'downtime', 'quality_drop']);
        if (kind === 'oee_drop') {
          performance = clamp(performance - rand(25, 45), 10, 100);
          anomaly = {
            type: 'oee_drop',
            severity: performance < 40 ? 'critical' : 'warning',
            message: `Performance dropped sharply on ${machine.name}`
          };
        } else if (kind === 'defect_spike') {
          quality = clamp(quality - rand(10, 25), 30, 100);
          anomaly = {
            type: 'defect_spike',
            severity: quality < 70 ? 'critical' : 'warning',
            message: `Defect rate spiking on ${machine.name}`,
            defectType: pick(DEFECT_TYPES)
          };
        } else if (kind === 'downtime') {
          availability = clamp(availability - rand(20, 40), 10, 100);
          anomaly = {
            type: 'downtime',
            severity: availability < 50 ? 'critical' : 'warning',
            message: `Unplanned downtime detected on ${machine.name}`,
            reason: pick(DOWNTIME_REASONS)
          };
        } else {
          quality = clamp(quality - rand(15, 30), 30, 100);
          performance = clamp(performance - rand(10, 20), 20, 100);
          anomaly = {
            type: 'quality_drop',
            severity: 'critical',
            message: `Combined quality/performance degradation on ${machine.name}`
          };
        }
      }

      const oee = (availability / 100) * (performance / 100) * (quality / 100) * 100;

      const machineTick = {
        machineId: machine.id,
        machineName: machine.name,
        plantId: plant.id,
        manualId: machine.manualId,
        timestamp,
        availability: Number(availability.toFixed(1)),
        performance: Number(performance.toFixed(1)),
        quality: Number(quality.toFixed(1)),
        oee: Number(oee.toFixed(1)),
        throughputUnitsPerMin: Number(throughput.toFixed(1)),
        goodUnits: Math.round(throughput * (quality / 100)),
        defectUnits: Math.round(throughput * (1 - quality / 100))
      };

      events.push({ type: 'production_tick', payload: machineTick });

      if (Math.random() < 0.15) {
        events.push({
          type: 'inspection_result',
          payload: {
            id: `insp-${tickCounter}-${key}`,
            machineId: machine.id,
            machineName: machine.name,
            plantId: plant.id,
            timestamp,
            passed: Math.random() > (1 - quality / 100),
            defectType: Math.random() > quality / 100 ? pick(DEFECT_TYPES) : null
          }
        });
      }

      if (anomaly) {
        alertSeq += 1;
        events.push({
          type: 'alert',
          payload: {
            id: `alert-${alertSeq}`,
            plantId: plant.id,
            machineId: machine.id,
            machineName: machine.name,
            manualId: machine.manualId,
            timestamp,
            severity: anomaly.severity,
            type: anomaly.type,
            message: anomaly.message,
            reason: anomaly.reason || null,
            defectType: anomaly.defectType || null,
            metrics: {
              availability: machineTick.availability,
              performance: machineTick.performance,
              quality: machineTick.quality,
              oee: machineTick.oee
            },
            acknowledged: false
          }
        });
      }

      state.machineState[key] = {
        availability,
        performance,
        quality,
        throughput,
        anomalyCooldown: anomaly ? 6 : anomalyCooldown
      };
    }
  }

  return events;
}

/**
 * LiveFeed mimics a resilient streaming connection (e.g. WebSocket/SSE).
 * It supports subscribe/unsubscribe, and can simulate connection drops so
 * the UI's resilience layer has something real to handle.
 */
export class LiveFeed {
  constructor({ intervalMs = 1500, dropRate = 0.02 } = {}) {
    this.intervalMs = intervalMs;
    this.dropRate = dropRate;
    this.listeners = new Set();
    this.statusListeners = new Set();
    this.timer = null;
    this.status = 'disconnected';
    this.state = { machineState: {} };
  }

  onData(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  onStatus(cb) {
    this.statusListeners.add(cb);
    return () => this.statusListeners.delete(cb);
  }

  setStatus(status) {
    this.status = status;
    this.statusListeners.forEach((cb) => cb(status));
  }

  connect() {
    if (this.timer) return;
    this.setStatus('connecting');
    // simulate handshake latency
    setTimeout(() => {
      this.setStatus('connected');
      this.timer = setInterval(() => {
        // simulate an occasional dropped connection
        if (Math.random() < this.dropRate) {
          this.setStatus('reconnecting');
          clearInterval(this.timer);
          this.timer = null;
          setTimeout(() => this.connect(), 1200 + Math.random() * 1500);
          return;
        }
        const events = generateTick(this.state);
        this.listeners.forEach((cb) => cb(events));
      }, this.intervalMs);
    }, 400);
  }

  disconnect() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.setStatus('disconnected');
  }
}
