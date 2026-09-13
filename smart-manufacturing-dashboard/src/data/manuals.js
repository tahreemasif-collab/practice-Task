// src/data/manuals.js
// A small local knowledge base standing in for a document store of
// equipment manuals. Each manual is split into retrievable chunks so the
// retrieval service can return the most relevant passage(s) instead of a
// whole document.

export const MANUALS = [
  {
    id: 'cnc-mill',
    title: 'CNC Mill — Operations & Troubleshooting Manual',
    chunks: [
      'Section 3.2 Performance loss: A sudden drop in spindle performance is most often caused by tool wear, incorrect feed rate override, or coolant flow restriction. Check the tool wear offset table before adjusting feed rate.',
      'Section 4.1 Dimensional defects: Out-of-tolerance parts are frequently linked to thermal drift after long runs. Allow a 15 minute warm-up cycle and verify the work offset (G54) after any tool change.',
      'Section 5.4 Unplanned stops: If the machine halts with alarm 1024 (servo overload), check for chip buildup in the Y-axis way cover before restarting the spindle.',
      'Section 6.0 Preventive maintenance: Inspect ball screw lubrication weekly; inadequate lubrication is a leading cause of positioning drift and gradual performance degradation.'
    ]
  },
  {
    id: 'robotic-welder',
    title: 'Robotic Welder — Maintenance Guide',
    chunks: [
      'Section 2.3 Weld quality: Porosity or missing-component style defects usually trace back to shielding gas flow below 15 CFH or a worn contact tip. Replace the contact tip every 40,000 welds.',
      'Section 3.1 Downtime causes: The most common unplanned stop is wire feed jam; check the liner for kinks and confirm drive roll tension matches the wire diameter chart.',
      'Section 4.4 Arc stability: Voltage fluctuation beyond +/-1.5V indicates a degraded ground connection, which shows up as intermittent performance loss and misalignment defects.'
    ]
  },
  {
    id: 'injection-molder',
    title: 'Injection Molder — Process Reference',
    chunks: [
      'Section 1.5 Surface finish defects: Flow lines and surface finish issues typically stem from melt temperature drift or injection speed set too low for the resin viscosity.',
      'Section 2.2 Cycle time / performance: Increased cycle time often results from mold cooling channel scale buildup; descale the cooling circuit if performance trends downward over multiple shifts.',
      'Section 3.6 Contamination: Black specks or contamination defects usually indicate degraded resin from excessive barrel residence time or a hopper contamination event.'
    ]
  },
  {
    id: 'stamping-press',
    title: 'Stamping Press — Safety & Operations Manual',
    chunks: [
      'Section 2.1 Misalignment: Part misalignment defects are commonly caused by worn die guide pins; inspect and replace guide bushings every 250,000 strokes.',
      'Section 3.3 Downtime: Unplanned downtime is frequently due to progressive die jams from slug retention; verify the scrap chute is clear and the slug detection sensor is calibrated.',
      'Section 4.2 Performance: A gradual reduction in strokes-per-minute usually signals hydraulic pressure loss; check accumulator pre-charge pressure.'
    ]
  },
  {
    id: 'smt-line',
    title: 'SMT Placement Line — Reference Manual',
    chunks: [
      'Section 5.1 Placement defects: Missing component or misalignment defects on the SMT line are most often caused by feeder calibration drift or worn nozzle tips; recalibrate feeders after every 500k placements.',
      'Section 5.5 Throughput / performance: Performance dips are frequently linked to vision system recognition failures from a dirty fiducial camera lens.',
      'Section 6.2 Solder bridge defects: Solder bridging is typically a stencil aperture or paste volume issue; verify stencil wipe frequency and paste print height.'
    ]
  },
  {
    id: 'reflow-oven',
    title: 'Reflow Oven — Thermal Profile Manual',
    chunks: [
      'Section 2.4 Solder defects: Solder bridge and cold-joint defects correlate strongly with an out-of-spec thermal profile; re-run a profile board if any zone deviates more than 5C from setpoint.',
      'Section 3.2 Downtime: Conveyor stalls are the leading unplanned downtime cause; check chain tension and clear any board jam sensors before restart.'
    ]
  },
  {
    id: 'aoi-inspector',
    title: 'Automated Optical Inspection — User Guide',
    chunks: [
      'Section 1.2 False rejects / quality drop: A sudden rise in false rejects (showing as a quality drop) usually indicates lighting drift; recalibrate the ring light and re-teach the golden board.',
      'Section 2.5 Throughput: Reduced inspection throughput often results from image processing backlog; verify the vision PC is not running background updates during production hours.'
    ]
  }
];

export function getManualByMachine(manualId) {
  return MANUALS.find((m) => m.id === manualId) || null;
}
