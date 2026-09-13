// src/components/LineChart.jsx
// A small dependency-free SVG line chart built for streaming data. Redraws
// smoothly as new points are appended without pulling in a charting
// library.

import React, { useMemo } from 'react';

const COLORS = ['#4f8cff', '#33d69f', '#ffb020', '#ff5c5c'];

export default function LineChart({ series, height = 180, yMin = 0, yMax = 100, unit = '%' }) {
  const width = 600;
  const padding = { top: 12, right: 12, bottom: 22, left: 34 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;

  const paths = useMemo(() => {
    return series.map((s, idx) => {
      const points = s.data;
      if (!points.length) return { color: COLORS[idx % COLORS.length], d: '', name: s.name };
      const n = points.length;
      const d = points
        .map((p, i) => {
          const x = padding.left + (n === 1 ? innerW : (i / (n - 1)) * innerW);
          const clampVal = Math.max(yMin, Math.min(yMax, p.value));
          const y = padding.top + innerH - ((clampVal - yMin) / (yMax - yMin || 1)) * innerH;
          return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');
      return { color: COLORS[idx % COLORS.length], d, name: s.name, last: points[n - 1]?.value };
    });
  }, [series, innerH, innerW, yMin, yMax]);

  const gridLines = 4;

  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="line-chart" preserveAspectRatio="none">
        {Array.from({ length: gridLines + 1 }).map((_, i) => {
          const y = padding.top + (i / gridLines) * innerH;
          const val = yMax - (i / gridLines) * (yMax - yMin);
          return (
            <g key={i}>
              <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="grid-line" />
              <text x={2} y={y + 3} className="axis-label">
                {Math.round(val)}
              </text>
            </g>
          );
        })}
        {paths.map((p, i) => (
          <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth="2" />
        ))}
      </svg>
      <div className="chart-legend">
        {paths.map((p, i) => (
          <span key={i} className="legend-item">
            <span className="legend-dot" style={{ background: p.color }} />
            {p.name} {p.last !== undefined ? `— ${p.last.toFixed(1)}${unit}` : ''}
          </span>
        ))}
      </div>
    </div>
  );
}
