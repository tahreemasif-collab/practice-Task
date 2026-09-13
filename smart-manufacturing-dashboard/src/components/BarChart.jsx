// src/components/BarChart.jsx
// Small dependency-free SVG bar chart for defect-type / downtime-reason
// breakdowns.

import React from 'react';

export default function BarChart({ data, height = 180, color = '#4f8cff' }) {
  const width = 600;
  const padding = { top: 10, right: 12, bottom: 44, left: 34 };
  const innerW = width - padding.left - padding.right;
  const innerH = height - padding.top - padding.bottom;
  const max = Math.max(1, ...data.map((d) => d.value));
  const barGap = 10;
  const barWidth = data.length ? innerW / data.length - barGap : 0;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="bar-chart" preserveAspectRatio="none">
      {data.map((d, i) => {
        const h = (d.value / max) * innerH;
        const x = padding.left + i * (barWidth + barGap);
        const y = padding.top + innerH - h;
        return (
          <g key={d.label}>
            <rect x={x} y={y} width={Math.max(barWidth, 1)} height={Math.max(h, 1)} fill={color} rx="3" />
            <text x={x + barWidth / 2} y={padding.top + innerH + 14} textAnchor="middle" className="axis-label small">
              {d.label}
            </text>
            <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" className="axis-label">
              {d.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
