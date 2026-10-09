import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, LogOut, Shield, User as UserIcon, LayoutDashboard, Terminal, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Collapsible state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('sidebar_collapsed') === 'true';
  });

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <aside className={`glass-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        {isCollapsed ? (
          <button
            onClick={toggleSidebar}
            className="sidebar-logo-toggle-btn"
            title="Expand Sidebar"
          >
            <Activity size={22} />
          </button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Link
              to="/"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}
              title="AudioPulse Workspace"
            >
              <div className="sidebar-logo-icon" style={{ flexShrink: 0 }}>
                <Activity size={22} />
              </div>
              <div style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                  AudioPulse
                </div>
                <div style={{ fontSize: '0.65rem', fontWeight: '600', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Analysis Suite
                </div>
              </div>
            </Link>

            <button
              onClick={toggleSidebar}
              className="sidebar-toggle-btn"
              title="Collapse Sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="sidebar-nav">
        {user && (
          <Link
            to="/"
            className={`sidebar-nav-item ${isActive('/') ? 'active' : ''}`}
            title={isCollapsed ? 'Audio Workspace' : undefined}
          >
            <LayoutDashboard size={18} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>Audio Workspace</span>}
          </Link>
        )}

        {user && (
          <Link
            to="/logs"
            className={`sidebar-nav-item ${isActive('/logs') ? 'active' : ''}`}
            title={isCollapsed ? 'API Logs' : undefined}
          >
            <Terminal size={18} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>API Logs</span>}
            {!isCollapsed && (
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
            )}
          </Link>
        )}

        {user && user.role === 'admin' && (
          <Link
            to="/admin"
            className={`sidebar-nav-item ${isActive('/admin') ? 'active' : ''}`}
            title={isCollapsed ? 'Admin Control' : undefined}
          >
            <Shield size={18} style={{ flexShrink: 0 }} />
            {!isCollapsed && <span>Admin Control</span>}
          </Link>
        )}
      </nav>

      {/* Footer User Info & Controls */}
      <div className="sidebar-footer">
        <div style={{ marginBottom: isCollapsed ? '0.75rem' : '1rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
          <ThemeToggle collapsed={isCollapsed} />
        </div>

        {user && (
          <div className={`sidebar-user-card ${isCollapsed ? 'collapsed' : ''}`}>
            {!isCollapsed ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', minWidth: 0, flex: 1 }}>
                  <div className="sidebar-user-avatar" style={{ flexShrink: 0 }}>
                    <UserIcon size={18} />
                  </div>
                  <div style={{ overflow: 'hidden', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.88rem',
                        fontWeight: '700',
                        color: 'var(--text-primary)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                      title={user.name}
                    >
                      {user.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                      {user.role}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  style={{
                    padding: '0.45rem',
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.12)',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  title="Logout"
                >
                  <LogOut size={16} style={{ color: 'var(--danger)' }} />
                </button>
              </>
            ) : (
              <>
                <div
                  className="sidebar-user-avatar"
                  title={`${user.name} (${user.role})`}
                  style={{ flexShrink: 0 }}
                >
                  <UserIcon size={18} />
                </div>
                <button
                  onClick={handleLogout}
                  className="logout-btn"
                  style={{
                    padding: '0.5rem',
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.15)',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s ease',
                  }}
                  title="Logout"
                >
                  <LogOut size={16} style={{ color: 'var(--danger)' }} />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
