import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, Clock, AlertCircle, Activity, ShieldCheck, Zap, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingMessage, setPendingMessage] = useState(null);

  const { login, authError, setAuthError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    setPendingMessage(null);
    setAuthError(null);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      navigate('/');
    } else if (result.data?.code === 'PENDING_APPROVAL') {
      setPendingMessage(result.data.message);
    }
  };

  return (
    <div className="auth-split-container">
      {/* Left Information Side */}
      <div className="auth-info-side">
        <div className="auth-info-tag">
          <Activity size={16} />
          <span>Audio Intelligence Platform</span>
        </div>

        <h1 className="auth-info-title">
          Advanced Audio Analysis & <span>Real-Time Waveforms</span>
        </h1>

        <p className="auth-info-desc">
          Accelerate acoustic insights, frequency spectrum visualization, and AI audio processing inside a high-security, glassmorphism environment.
        </p>

        {/* Live Soundwave Visualizer Graphic */}
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
              Live Spectral Engine
            </div>
            <div style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              24-bit / 96kHz Acoustic Processing
            </div>
          </div>
          <div className="audio-waveform-bars">
            {[40, 80, 50, 95, 30, 70, 100, 60, 85, 45, 90, 35, 75, 55, 95, 65].map((val, idx) => (
              <div
                key={idx}
                className="waveform-bar"
                style={{
                  animationDelay: `${(idx % 5) * -0.3}s`,
                  height: `${val}%`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="auth-features-list">
          <div className="auth-feature-item">
            <div className="auth-feature-icon" style={{ background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)' }}>
              <Zap size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Instant Audio Signal Processing
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Decompose speech waveforms, acoustic signatures, and multi-track channels with ease.
              </p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-secondary)' }}>
              <LockKeyhole size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Strict Single-Active Session Policy
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Automated token versioning invalidates older sessions if logged into from a new browser.
              </p>
            </div>
          </div>

          <div className="auth-feature-item">
            <div className="auth-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                Admin Governance & Approval Flow
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Role-based access controls require admin review for newly registered user accounts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Login Form Card with Top Tab Switcher */}
      <div>
        <div className="glass-card">
          {/* Top Segmented Tab Switcher above Welcome Back */}
          <div className="auth-tabs-header">
            <Link to="/login" className="auth-tab active">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
            <Link to="/register" className="auth-tab">
              <UserPlus size={16} />
              <span>Register</span>
            </Link>
          </div>

          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              Welcome Back
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              Sign in to access your Audio Analysis workspace
            </p>
          </div>

          {pendingMessage && (
            <div className="alert alert-warning">
              <Clock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Account Pending Approval</strong>
                <div style={{ marginTop: '0.25rem', fontSize: '0.85rem' }}>{pendingMessage}</div>
              </div>
            </div>
          )}

          {authError && !pendingMessage && (
            <div className="alert alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{authError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
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
                  placeholder="name@company.com"
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
                  placeholder="••••••••••••"
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

            <button type="submit" className="btn-primary" disabled={isSubmitting} style={{ marginTop: '1rem' }}>
              {isSubmitting ? (
                <div className="spinner"></div>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Don't have an account?{' '}
            <Link to="/register" className="link">
              Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
