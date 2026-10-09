import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, UserPlus, LogIn, AlertCircle, Info, Activity, ShieldCheck, Zap, Radio } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  const { register, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setAuthError(null);

    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      return;
    }

    setIsSubmitting(true);
    const result = await register(name, email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/pending-approval');
    }
  };

  const displayError = localError || authError;

  return (
    <div className="auth-split-container">
      {/* Left Information Side */}
      <div className="auth-info-side">
        <div className="auth-info-tag">
          <Activity size={16} />
          <span>Platform Registration</span>
        </div>

        <h1 className="auth-info-title">
          Join the <span>Audio Analysis</span> Enterprise Suite
        </h1>

        <p className="auth-info-desc">
          Create your account to unlock professional acoustic decomposition tools, audio metrics analytics, and encrypted session security.
        </p>

        {/* Live Audio Status Indicator */}
        <div
          className="glass-panel"
          style={{
            padding: '1.25rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
          }}
        >
          <div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
              Registration Governance
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Administrator Approval Enabled
            </div>
          </div>
          <Radio className="pulse" size={26} style={{ color: 'var(--warning)' }} />
        </div>

        {/* Feature Highlights Grid */}
        <div className="auth-features-list">
          <div className="auth-feature-item">
            <div className="auth-feature-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <Zap size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                High Performance Workspace
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Process multichannel audio files with real-time waveform inspection.
              </p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Protected User Credentials
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Salted bcrypt password hashing and tokenized single-session verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Register Form Card with Top Tab Switcher */}
      <div>
        <div className="glass-card">
          {/* Top Segmented Tab Switcher above Create Account */}
          <div className="auth-tabs-header">
            <Link to="/login" className="auth-tab">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
            <Link to="/register" className="auth-tab active">
              <UserPlus size={16} />
              <span>Register</span>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Create Account
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Register to join the Audio Analysis platform
            </p>
          </div>

          <div className="alert alert-warning" style={{ marginBottom: '1.5rem' }}>
            <Info size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.84rem', lineHeight: '1.4' }}>
              <strong>Admin Approval Required:</strong> New accounts require approval from an administrator before login access is granted.
            </div>
          </div>

          {displayError && (
            <div className="alert alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{displayError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="glass-input-group">
              <label className="glass-label" htmlFor="name">
                Full Name
              </label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  id="name"
                  type="text"
                  className="glass-input"
                  placeholder="Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="glass-input-group">
              <label className="glass-label" htmlFor="email">
                Email Address
              </label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  className="glass-input"
                  placeholder="alex@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="glass-input-group">
              <label className="glass-label" htmlFor="password">
                Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="glass-input-group">
              <label className="glass-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  className="glass-input"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
              {isSubmitting ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <UserPlus size={18} />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Already have an account?{' '}
            <Link to="/login" className="link">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
