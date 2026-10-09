import React from 'react';
import { Activity, ShieldCheck, Cpu, Mic, FileAudio, Radio, Database, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="page-wrapper" style={{ padding: '1rem 0' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
          border: '1px solid var(--glass-border)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span className="badge badge-approved">
                <CheckCircle size={14} /> Approved User Access
              </span>
              <span className="badge badge-admin" style={{ background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-secondary)' }}>
                <ShieldCheck size={14} /> Single Active Session Enforced
              </span>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem' }}>
              Your audio analysis session is active and securely authenticated with MongoDB.
            </p>
          </div>

          <div
            style={{
              padding: '1rem 1.5rem',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '16px',
              border: '1px solid var(--glass-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
          >
            <Radio className="pulse" size={24} style={{ color: 'var(--success)' }} />
            <div>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: '600' }}>
                Session Status
              </div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--success)' }}>
                1 Active Browser Token
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-primary)',
              }}
            >
              <Cpu size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Analysis Engine</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>Ready</div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>AI Audio processing engine initialized</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-secondary)',
              }}
            >
              <Database size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Database Store</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-primary)' }}>MongoDB Connected</div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Session token versioning active</div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--success)',
              }}
            >
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Account Status</div>
              <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)', textTransform: 'capitalize' }}>
                {user?.status}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Admin approved access token</div>
        </div>
      </div>

      {/* Audio Analysis Studio Card */}
      <div className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              padding: '0.6rem',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
              color: '#fff',
            }}
          >
            <Mic size={20} />
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)' }}>
            Audio Analysis Workspace
          </h2>
        </div>

        <div
          style={{
            border: '2px dashed var(--glass-border)',
            borderRadius: '16px',
            padding: '3.5rem 2rem',
            textAlign: 'center',
            background: 'rgba(0, 0, 0, 0.08)',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: 'var(--accent-primary)',
            }}
          >
            <FileAudio size={32} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            Upload or Drag & Drop Audio Files
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            Supports MP3, WAV, FLAC, M4A up to 100MB. Phase 1 authentication & single active session control is fully active.
          </p>
          <button className="btn-primary" style={{ width: 'auto', display: 'inline-flex', padding: '0.75rem 2rem' }}>
            <Activity size={18} />
            <span>Select Audio File</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
