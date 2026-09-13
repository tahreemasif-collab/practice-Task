// src/context/AuthContext.jsx
// Simple role-based access control. Roles determine which plants a user
// can see and whether they can acknowledge alerts / export data. This is
// a local simulation of an auth/session system (no real backend), but the
// shape mirrors what a JWT-claims-based session would provide.

import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';
import { PLANTS } from '../data/simulator';
import { cache } from '../services/cache';

const AuthContext = createContext(null);

export const ROLES = {
  ADMIN: 'Administrator',
  PLANT_MANAGER: 'Plant Manager',
  QUALITY_ENGINEER: 'Quality Engineer',
  OPERATOR: 'Operator'
};

const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: { allPlants: true, acknowledge: true, export: true },
  [ROLES.PLANT_MANAGER]: { allPlants: false, acknowledge: true, export: true },
  [ROLES.QUALITY_ENGINEER]: { allPlants: false, acknowledge: true, export: true },
  [ROLES.OPERATOR]: { allPlants: false, acknowledge: false, export: false }
};

const SESSION_KEY = 'session';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => cache.get(SESSION_KEY));

  const login = useCallback(({ name, role, plantId }) => {
    const perms = ROLE_PERMISSIONS[role];
    const assignedPlants = perms.allPlants ? PLANTS.map((p) => p.id) : [plantId];
    const next = { name, role, assignedPlants, permissions: perms };
    setSession(next);
    cache.set(SESSION_KEY, next, 8 * 60 * 60 * 1000); // 8h session
  }, []);

  const logout = useCallback(() => {
    setSession(null);
    cache.remove(SESSION_KEY);
  }, []);

  const value = useMemo(() => ({ session, login, logout, roles: ROLES }), [session, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
