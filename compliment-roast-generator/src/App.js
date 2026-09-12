import React, { useState } from "react";

const compliments = [
  "{name}, your energy lights up the whole room! ✨",
  "{name}, you're way more talented than you give yourself credit for! 💪",
  "{name}, your smile is the best vibe in here! 😄",
  "{name}, you turn everything you touch into something special! 🌟",
  "{name}, your hard work is never going to waste! 🚀",
];

const roasts = [
  "{name}, you're so slow even a loading bar finishes before you! 🐢",
  "{name}, your brain disconnects more often than your Wi-Fi! 📶",
  "{name}, you make decisions like GPS searching for signal! 🗺️",
  "{name}, your jokes are so old they're eligible for retirement! 👴",
  "{name}, you're about as punctual as a delayed flight! ⏰",
];

function App() {
  const [name, setName] = useState("");
  const [mode, setMode] = useState("compliment");
  const [message, setMessage] = useState("");

  const generate = () => {
    if (!name.trim()) {
      setMessage("Type a name or a word first! 👀");
      return;
    }
    const list = mode === "compliment" ? compliments : roasts;
    const random = list[Math.floor(Math.random() * list.length)];
    setMessage(random.replace("{name}", name));
  };

  return (
    <div className="app-container">
      <h1>🎭 Compliment / Roast Generator</h1>
      <p>Type a name or anything else and see what you get!</p>

      <input
        type="text"
        placeholder="e.g. Ali, Monday, Code..."
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="name-input"
      />

      <div className="mode-toggle">
        <button
          className={mode === "compliment" ? "active" : ""}
          onClick={() => setMode("compliment")}
        >
          😇 Compliment
        </button>
        <button
          className={mode === "roast" ? "active" : ""}
          onClick={() => setMode("roast")}
        >
          🔥 Roast
        </button>
      </div>

      <button className="generate-btn" onClick={generate}>
        Generate
      </button>

      {message && <div className="result-card fade">{message}</div>}
    </div>
  );
}

export default App;
