import React, { useState } from 'react';
import { useAuth, ROLES } from '../context/AuthContext';
import { PLANTS } from '../data/simulator';

export default function LoginScreen() {
  const { login, roles } = useAuth();
  const [name, setName] = useState('');
  const [role, setRole] = useState(ROLES.ADMIN);
  const [plantId, setPlantId] = useState(PLANTS[0].id);

  const needsPlant = role !== roles.ADMIN;

  function handleSubmit(e) {
    e.preventDefault();
    login({ name: name.trim() || 'Guest User', role, plantId: needsPlant ? plantId : null });
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Smart Manufacturing Quality Dashboard</h1>
        <p className="login-sub">Sign in to view real-time OEE, quality and alert data for your assigned plant(s).</p>

        <label>
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Operator" />
        </label>

        <label>
          Role
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            {Object.values(roles).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </label>

        {needsPlant && (
          <label>
            Plant
            <select value={plantId} onChange={(e) => setPlantId(e.target.value)}>
              {PLANTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>
        )}

        <p className="role-hint">
          {role === roles.ADMIN && 'Administrators can view every plant and acknowledge alerts.'}
          {role === roles.PLANT_MANAGER && 'Plant Managers see their assigned plant and can acknowledge alerts / export data.'}
          {role === roles.QUALITY_ENGINEER && 'Quality Engineers see their assigned plant, focused on defects and AI anomaly explanations.'}
          {role === roles.OPERATOR && 'Operators have read-only access to their assigned plant.'}
        </p>

        <button type="submit">Enter Dashboard</button>
      </form>
    </div>
  );
}
