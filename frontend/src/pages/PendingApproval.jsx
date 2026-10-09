import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, ArrowRight } from 'lucide-react';

const PendingApproval = () => {
  return (
    <div className="auth-wrapper">
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            color: 'var(--warning)',
          }}
        >
          <Clock size={38} />
        </div>

        <h1 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Registration Submitted!
        </h1>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          Your account has been registered successfully and is awaiting review. Once an administrator approves your access request, you will be able to sign in.
        </p>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            padding: '1rem',
            textAlign: 'left',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--success)' }}>
            <CheckCircle2 size={16} />
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Account Created</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)' }}>
            <Clock size={16} />
            <span style={{ fontSize: '0.88rem', fontWeight: '600' }}>Status: Pending Admin Approval</span>
          </div>
        </div>

        <Link to="/login" className="btn-primary" style={{ textDecoration: 'none' }}>
          <span>Back to Login</span>
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
};

export default PendingApproval;
