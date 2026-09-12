import React, { useState } from "react";

const moods = {
  Happy: {
    emoji: "😄",
    color: "#FFD93D",
    songs: [
      "Pharrell Williams - Happy",
      "Justin Timberlake - Can't Stop the Feeling",
      "Katrina & The Waves - Walking on Sunshine",
    ],
  },
  Sad: {
    emoji: "😢",
    color: "#6C7A89",
    songs: [
      "Adele - Someone Like You",
      "Sam Smith - Stay With Me",
      "Billie Eilish - When the Party's Over",
    ],
  },
  Chill: {
    emoji: "😌",
    color: "#7FD8BE",
    songs: [
      "Jack Johnson - Better Together",
      "Norah Jones - Come Away With Me",
      "Zach Bryan - Something in the Orange",
    ],
  },
  Energetic: {
    emoji: "⚡",
    color: "#FF6B6B",
    songs: [
      "Dua Lipa - Levitating",
      "The Weeknd - Blinding Lights",
      "Imagine Dragons - Believer",
    ],
  },
};

function App() {
  const [selectedMood, setSelectedMood] = useState(null);

  const currentMood = selectedMood ? moods[selectedMood] : null;

  return (
    <div
      className="app-container"
      style={{
        background: currentMood ? currentMood.color : "#282c34",
      }}
    >
      <h1>🎵 Mood-Based Music Suggester</h1>
      <p>How are you feeling right now?</p>

      <div className="mood-buttons">
        {Object.keys(moods).map((mood) => (
          <button
            key={mood}
            className={`mood-btn ${selectedMood === mood ? "active" : ""}`}
            onClick={() => setSelectedMood(mood)}
          >
            {moods[mood].emoji} {mood}
          </button>
        ))}
      </div>

      {currentMood && (
        <div className="playlist">
          <h2>
            {currentMood.emoji} Suggested Playlist for {selectedMood}
          </h2>
          <ul>
            {currentMood.songs.map((song, idx) => (
              <li key={idx}>{song}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
