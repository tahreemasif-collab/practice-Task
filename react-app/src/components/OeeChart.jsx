import { useEffect, useRef } from 'react';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export default function OeeChart({ oeeHist, qualHist, perfHist }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.clientWidth || 600, h = 140;
    c.width = w * 2; c.height = h * 2; ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, w, h);

    ctx.strokeStyle = '#2a323d'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = h - (h * i) / 4;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }

    const series = [
      { data: oeeHist, color: '#e8a33d' },
      { data: qualHist, color: '#3ba894' },
      { data: perfHist, color: '#4f8ff0' },
    ];
    series.forEach((s) => {
      if (s.data.length < 2) return;
      ctx.strokeStyle = s.color; ctx.lineWidth = 2; ctx.beginPath();
      s.data.forEach((v, i) => {
        const x = (i / 59) * w;
        const y = h - clamp(v, 0, 1) * h;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      });
      ctx.stroke();
    });
  }, [oeeHist, qualHist, perfHist]);

  return (
    <div className="panel">
      <h2>OEE trend — live stream</h2>
      <canvas ref={canvasRef} height={140} />
      <div className="legend">
        <span><i style={{ background: 'var(--amber)' }} />OEE</span>
        <span><i style={{ background: 'var(--teal)' }} />Quality</span>
        <span><i style={{ background: 'var(--blue)' }} />Performance</span>
      </div>
    </div>
  );
}
