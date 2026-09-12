export const MANUALS = [
  {
    id: 'cnc4400',
    title: 'CNC-4400 Machining Center — Maintenance Manual §4.2',
    text: 'Elevated spindle vibration above 4.5 mm/s RMS typically indicates bearing wear or tool imbalance. Inspect spindle bearings, verify tool balance, and check coolant flow before resuming full-speed cuts.',
    tags: ['spindle', 'vibration', 'bearing', 'cnc'],
  },
  {
    id: 'weldcell',
    title: 'Weld Cell Robotic Arm — Service Guide §6.1',
    text: 'Weld porosity defects often trace to shielding gas flow drop or contact-tip wear. Check gas line pressure (target 18-22 CFH) and inspect contact tip for spatter buildup.',
    tags: ['weld', 'porosity', 'gas', 'contact-tip'],
  },
  {
    id: 'conveyor',
    title: 'Conveyor & Pack Line — Troubleshooting §2.3',
    text: 'Intermittent conveyor jams are commonly caused by misaligned guide rails or product buildup at transfer points. Clear debris, verify rail alignment within 2mm tolerance, and check drive belt tension.',
    tags: ['conveyor', 'jam', 'rail', 'belt'],
  },
  {
    id: 'paint',
    title: 'Paint Line Booth — Quality Bulletin §3.4',
    text: 'Paint defects such as orange peel or runs correlate with booth humidity outside the 45-65% RH band or atomizer air pressure drift. Recalibrate atomizer pressure and check HVAC setpoints.',
    tags: ['paint', 'humidity', 'atomizer', 'booth'],
  },
  {
    id: 'sensor',
    title: 'Inline Vision & Sensor Suite — Calibration Manual §1.7',
    text: 'Gradual sensor drift causing false-reject spikes usually stems from lens contamination or ambient light change. Clean lens optics and recalibrate white balance against the reference target.',
    tags: ['sensor', 'vision', 'drift', 'calibration'],
  },
  {
    id: 'injection',
    title: 'Injection Molding Press — Operations Manual §5.5',
    text: 'Short-shot and flash defects usually stem from barrel temperature deviation or clamp pressure drift. Verify zone temperatures against setpoint and check clamp tonnage calibration.',
    tags: ['injection', 'molding', 'temperature', 'clamp'],
  },
];

/** Simple keyword-scoring retrieval — swap for embeddings + a vector DB for real semantic RAG. */
export function retrieveManual(query) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  let best = null;
  let bestScore = 0;
  for (const m of MANUALS) {
    const hay = (m.title + ' ' + m.text + ' ' + m.tags.join(' ')).toLowerCase();
    let score = 0;
    for (const t of terms) if (hay.includes(t)) score++;
    if (score > bestScore) { bestScore = score; best = m; }
  }
  return bestScore > 0 ? best : null;
}
