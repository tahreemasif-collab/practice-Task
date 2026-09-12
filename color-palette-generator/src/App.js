import React, { useState, useEffect } from "react";

const randomHex = () =>
  "#" +
  Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, "0")
    .toUpperCase();

const generatePalette = (count = 5) =>
  Array.from({ length: count }, () => randomHex());

function App() {
  const [palette, setPalette] = useState(generatePalette());
  const [copiedIndex, setCopiedIndex] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        setPalette(generatePalette());
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const copyToClipboard = (color, idx) => {
    navigator.clipboard.writeText(color);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1000);
  };

  return (
    <div className="app-container">
      <h1>🎨 Color Palette Generator</h1>
      <p>Click "Generate" or press Space to get a new palette. Click a color to copy its code.</p>

      <div className="palette">
        {palette.map((color, idx) => (
          <div
            key={idx}
            className="color-block"
            style={{ background: color }}
            onClick={() => copyToClipboard(color, idx)}
          >
            <span className="hex-code">
              {copiedIndex === idx ? "Copied!" : color}
            </span>
          </div>
        ))}
      </div>

      <button className="generate-btn" onClick={() => setPalette(generatePalette())}>
        🔄 Generate New Palette
      </button>
    </div>
  );
}

export default App;
