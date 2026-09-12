import { useEffect, useRef } from 'react';

export default function DefectChart({ defects }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const w = c.clientWidth || 300, h = 150;
    c.width = w * 2; c.height = h * 2; ctx.setTransform(2, 0, 0, 2, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const entries = Object.entries(defects);
    if (!entries.length) return;
    const max = Math.max(...entries.map((e) => e[1]), 1);
    const bw = w / entries.length;
    ctx.font = '10px monospace'; ctx.textAlign = 'center';
    entries.forEach(([station, count], i) => {
      const bh = (count / max) * (h - 24);
      ctx.fillStyle = count > max * 0.7 ? '#d9534f' : '#e8a33d';
      ctx.fillRect(i * bw + 8, h - 24 - bh, bw - 16, bh);
      ctx.fillStyle = '#8b96a5';
      ctx.fillText(station.split('-')[0].slice(0, 8), i * bw + bw / 2, h - 10);
      ctx.fillText(String(count), i * bw + bw / 2, h - 24 - bh - 4);
    });
  }, [defects]);

  return (
    <div className="panel">
      <h2>Defects by station</h2>
      <canvas ref={canvasRef} height={150} />
    </div>
  );
}
