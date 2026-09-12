export const PLANTS = [
  { id: 'austin', name: 'Plant A — Austin, TX', stations: ['CNC-4400', 'Weld Cell 2', 'Paint Line', 'Final Assy'] },
  { id: 'monterrey', name: 'Plant B — Monterrey, MX', stations: ['Stamping-11', 'CNC-4400', 'Weld Cell 1', 'Pack Line'] },
  { id: 'katowice', name: 'Plant C — Katowice, PL', stations: ['Injection-7', 'CNC-2200', 'Weld Cell 3', 'Final Assy'] },
];

export const ROLE_PERMS = {
  operator: { canAck: false, canExport: false, label: 'view-only' },
  supervisor: { canAck: true, canExport: true, label: 'acknowledge + export' },
  manager: { canAck: true, canExport: true, label: 'full access, all plants' },
};

export function plantById(id) {
  return PLANTS.find((p) => p.id === id);
}
