import React from 'react';
import AnomalyExplanation from './AnomalyExplanation';
import { useAuth } from '../context/AuthContext';

export default function AlertDetailModal({ alert, onClose, onAcknowledge }) {
  const { session } = useAuth();
  if (!alert) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className={`severity-badge sev-${alert.severity}`}>{alert.severity}</span>
            <h3>{alert.machineName}</h3>
            <span className="modal-time">{new Date(alert.timestamp).toLocaleString()}</span>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="modal-message">{alert.message}</p>

        <AnomalyExplanation alert={alert} />

        <div className="modal-footer">
          {alert.acknowledged ? (
            <span className="ack-badge">✓ Acknowledged</span>
          ) : session.permissions.acknowledge ? (
            <button className="btn-primary" onClick={() => onAcknowledge(alert.id)}>
              Acknowledge alert
            </button>
          ) : (
            <span className="readonly-note">Read-only role — cannot acknowledge alerts</span>
          )}
        </div>
      </div>
    </div>
  );
}
