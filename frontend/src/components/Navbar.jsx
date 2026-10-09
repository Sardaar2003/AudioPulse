import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav
      className="glass-panel"
      style={{
        margin: '1.25rem 1.5rem 0 1.5rem',
        padding: '0.85rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 50,
      }}
    >
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 15px var(--accent-glow)',
          }}
        >
          <Activity size={24} />
        </div>
        <div>
          <span style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '-0.5px', color: 'var(--text-primary)' }}>
            AudioPulse
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '0.68rem',
              fontWeight: '600',
              color: 'var(--accent-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginTop: '-2px',
            }}
          >
            Analysis Suite
          </span>
        </div>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <ThemeToggle />

        {user ? (
          <>
            {user.role === 'admin' && (
              <Link to="/admin" className="btn-secondary" style={{ textDecoration: 'none', fontSize: '0.88rem' }}>
                <Shield size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Admin Panel</span>
              </Link>
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.4rem 0.8rem',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50px',
                border: '1px solid var(--glass-border)',
              }}
            >
              <UserIcon size={16} style={{ color: 'var(--text-secondary)' }} />
              <span style={{ fontSize: '0.88rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                {user.name}
              </span>
              <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-approved'}`}>
                {user.role}
              </span>
            </div>

            <button onClick={handleLogout} className="btn-secondary" title="Logout">
              <LogOut size={16} />
              <span style={{ fontSize: '0.88rem' }}>Logout</span>
            </button>
          </>
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;
