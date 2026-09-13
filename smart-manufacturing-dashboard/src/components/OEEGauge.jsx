// src/components/OEEGauge.jsx
import React from 'react';

function colorFor(value) {
  if (value >= 85) return '#33d69f';
  if (value >= 65) return '#ffb020';
  return '#ff5c5c';
}

export default function OEEGauge({ value = 0, label = 'OEE', size = 120 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.max(0, Math.min(100, value));
  const offset = circumference * (1 - pct / 100);
  const color = colorFor(pct);

  return (
    <div className="gauge">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#26314a" strokeWidth="10" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth="10"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
        <text x="50%" y="48%" textAnchor="middle" className="gauge-value">
          {pct.toFixed(0)}%
        </text>
        <text x="50%" y="66%" textAnchor="middle" className="gauge-label">
          {label}
        </text>
      </svg>
    </div>
  );
}
