import React, { useState, useRef } from "react";

const colors = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#C780FA",
  "#FF9F45",
  "#00C2CB",
  "#F45B69",
];

function App() {
  const [options, setOptions] = useState([
    "Pizza",
    "Biryani",
    "Burger",
    "Chinese",
  ]);
  const [input, setInput] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const wheelRef = useRef(null);

  const addOption = () => {
    if (input.trim() === "") return;
    setOptions([...options, input.trim()]);
    setInput("");
  };

  const removeOption = (idx) => {
    setOptions(options.filter((_, i) => i !== idx));
  };

  const spinWheel = () => {
    if (options.length < 2 || spinning) return;
    setSpinning(true);
    setWinner(null);

    const segmentAngle = 360 / options.length;
    const randomIndex = Math.floor(Math.random() * options.length);
    const extraSpins = 5 * 360;
    const targetAngle =
      extraSpins + (360 - randomIndex * segmentAngle - segmentAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      setWinner(options[randomIndex]);
    }, 4000);
  };

  const segmentAngle = 360 / (options.length || 1);

  return (
    <div className="app-container">
      <h1>🎡 Random Decision Wheel</h1>
      <p>Add your own options and spin the wheel to decide!</p>

      <div className="input-row">
        <input
          type="text"
          placeholder="Add an option..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addOption()}
        />
        <button onClick={addOption}>Add</button>
      </div>

      <div className="options-list">
        {options.map((opt, idx) => (
          <span key={idx} className="option-chip">
            {opt}
            <button onClick={() => removeOption(idx)}>×</button>
          </span>
        ))}
      </div>

      <div className="wheel-wrapper">
        <div className="pointer">▼</div>
        <div
          ref={wheelRef}
          className="wheel"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
            background: `conic-gradient(${options
              .map(
                (_, i) =>
                  `${colors[i % colors.length]} ${i * segmentAngle}deg ${
                    (i + 1) * segmentAngle
                  }deg`
              )
              .join(", ")})`,
          }}
        >
          {options.map((opt, i) => (
            <span
              key={i}
              className="wheel-label"
              style={{
                transform: `rotate(${
                  i * segmentAngle + segmentAngle / 2
                }deg) translate(0, -110px)`,
              }}
            >
              {opt}
            </span>
          ))}
        </div>
      </div>

      <button
        className="spin-btn"
        onClick={spinWheel}
        disabled={options.length < 2 || spinning}
      >
        {spinning ? "Spinning..." : "SPIN"}
      </button>

      {winner && !spinning && (
        <div className="winner-card">🎉 Result: {winner}</div>
      )}
    </div>
  );
}

export default App;
