import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SessionInvalidatedModal = () => {
  const { sessionInvalidated, acknowledgeSessionInvalidated } = useAuth();
  const navigate = useNavigate();

  if (!sessionInvalidated) return null;

  const handleClose = () => {
    acknowledgeSessionInvalidated();
    navigate('/login');
  };

  return (
    <div className="modal-overlay">
      <div className="glass-card modal-content" style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            color: 'var(--danger)',
          }}
        >
          <AlertTriangle size={32} />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: '700', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Session Terminated
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Your account was logged into from another browser or session. For security, your previous session has been invalidated.
        </p>

        <button onClick={handleClose} className="btn-primary">
          <LogIn size={18} />
          <span>Return to Login</span>
        </button>
      </div>
    </div>
  );
};

export default SessionInvalidatedModal;
