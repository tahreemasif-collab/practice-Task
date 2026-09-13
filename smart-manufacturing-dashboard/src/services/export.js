// src/services/export.js
// Client-side export helpers — no backend required. Builds a Blob and
// triggers a download for the current view's data (alerts, defects,
// downtime log, etc).

function toCSV(rows) {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const escape = (val) => {
    const s = val === null || val === undefined ? '' : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  rows.forEach((row) => {
    lines.push(headers.map((h) => escape(row[h])).join(','));
  });
  return lines.join('\n');
}

function download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportCSV(filename, rows) {
  download(filename, toCSV(rows), 'text/csv;charset=utf-8;');
}

export function exportJSON(filename, data) {
  download(filename, JSON.stringify(data, null, 2), 'application/json;charset=utf-8;');
}
