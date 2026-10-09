import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Shield, User as UserIcon, LayoutDashboard, Terminal } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="glass-sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="sidebar-logo-icon">
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              AudioPulse
            </div>
            <div style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Analysis Suite
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {user && (
          <Link to="/" className={`sidebar-nav-item ${isActive('/') ? 'active' : ''}`}>
            <LayoutDashboard size={18} />
            <span>Audio Workspace</span>
          </Link>
        )}

        {user && (
          <Link to="/logs" className={`sidebar-nav-item ${isActive('/logs') ? 'active' : ''}`}>
            <Terminal size={18} />
            <span>API Logs</span>
            <span
              style={{
                marginLeft: 'auto',
                fontSize: '0.68rem',
                padding: '0.15rem 0.45rem',
                borderRadius: '10px',
                background: isActive('/logs') ? 'rgba(255, 255, 255, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                color: isActive('/logs') ? '#ffffff' : 'var(--accent-secondary)',
                fontWeight: '700',
              }}
            >
              LIVE
            </span>
          </Link>
        )}

        {user && user.role === 'admin' && (
          <Link to="/admin" className={`sidebar-nav-item ${isActive('/admin') ? 'active' : ''}`}>
            <Shield size={18} />
            <span>Admin Control</span>
          </Link>
        )}
      </nav>

      {/* Footer User Info & Controls */}
      <div className="sidebar-footer">
        <div style={{ marginBottom: '1rem', width: '100%' }}>
          <ThemeToggle />
        </div>

        {user && (
          <div className="sidebar-user-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="sidebar-user-avatar">
                <UserIcon size={18} />
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.88rem', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  {user.role}
                </div>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }} title="Logout">
              <LogOut size={18} style={{ color: 'var(--danger)' }} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
