import React, { useState, useRef, useEffect } from "react";

const sentences = [
  "The quick brown fox jumps over the lazy dog.",
  "React makes it easy to build interactive user interfaces.",
  "Practice makes a person perfect at any skill.",
  "Consistency and patience are the keys to success.",
  "Coding every day helps you become a better developer.",
];

function App() {
  const [target, setTarget] = useState(
    sentences[Math.floor(Math.random() * sentences.length)]
  );
  const [input, setInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [finished, setFinished] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [target]);

  const handleChange = (e) => {
    const value = e.target.value;

    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    setInput(value);

    if (value === target) {
      const timeTakenMinutes = (Date.now() - startTime) / 60000;
      const wordsCount = target.split(" ").length;
      setWpm(Math.round(wordsCount / timeTakenMinutes));

      let correctChars = 0;
      for (let i = 0; i < target.length; i++) {
        if (value[i] === target[i]) correctChars++;
      }
      setAccuracy(Math.round((correctChars / target.length) * 100));
      setFinished(true);
    }
  };

  const restart = () => {
    const newSentence = sentences[Math.floor(Math.random() * sentences.length)];
    setTarget(newSentence);
    setInput("");
    setStartTime(null);
    setWpm(null);
    setAccuracy(null);
    setFinished(false);
  };

  const renderTarget = () => {
    return target.split("").map((char, idx) => {
      let color = "#888";
      if (idx < input.length) {
        color = input[idx] === char ? "#4CAF50" : "#e74c3c";
      }
      return (
        <span key={idx} style={{ color }}>
          {char}
        </span>
      );
    });
  };

  return (
    <div className="app-container">
      <h1>⌨️ Typing Speed Test</h1>
      <p>Type the sentence below as fast and accurately as you can!</p>

      <div className="target-text">{renderTarget()}</div>

      <textarea
        ref={inputRef}
        className="typing-box"
        value={input}
        onChange={handleChange}
        disabled={finished}
        placeholder="Start typing here..."
        rows={3}
      />

      {finished && (
        <div className="result-card">
          <h2>🎉 Result</h2>
          <p>Speed: <strong>{wpm} WPM</strong></p>
          <p>Accuracy: <strong>{accuracy}%</strong></p>
        </div>
      )}

      <button className="restart-btn" onClick={restart}>
        🔄 New Sentence
      </button>
    </div>
  );
}

export default App;
