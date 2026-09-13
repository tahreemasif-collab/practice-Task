import React from 'react';
import { useAuth } from '../context/AuthContext';

const STATUS_LABEL = {
  connected: 'Live',
  connecting: 'Connecting…',
  reconnecting: 'Reconnecting…',
  disconnected: 'Offline'
};

export default function Header({ status, plants, selectedPlantId, onSelectPlant }) {
  const { session, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>Smart Manufacturing Quality Dashboard</h1>
        <span className={`status-pill status-${status}`}>
          <span className="status-dot" /> {STATUS_LABEL[status] || status}
        </span>
      </div>

      <div className="header-right">
        {plants.length > 1 && (
          <select className="plant-select" value={selectedPlantId} onChange={(e) => onSelectPlant(e.target.value)}>
            {plants.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
        {plants.length === 1 && <span className="plant-badge">{plants[0].name}</span>}

        <div className="user-chip">
          <div className="user-avatar">{session.name.slice(0, 1).toUpperCase()}</div>
          <div className="user-meta">
            <div className="user-name">{session.name}</div>
            <div className="user-role">{session.role}</div>
          </div>
        </div>
        <button className="btn-ghost" onClick={logout}>
          Sign out
        </button>
      </div>
    </header>
  );
}
