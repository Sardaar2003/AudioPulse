import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0, 0, 0, 0.25)',
        border: '1px solid var(--glass-border)',
        borderRadius: '30px',
        padding: '3px',
        width: '100%',
        maxWidth: '220px',
        position: 'relative',
        userSelect: 'none',
      }}
      className="theme-segmented-container"
    >
      {/* Light Option Segment */}
      <button
        type="button"
        onClick={() => {
          if (isDark) toggleTheme();
        }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          padding: '0.45rem 0.75rem',
          borderRadius: '24px',
          border: 'none',
          fontSize: '0.78rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: !isDark
            ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
            : 'transparent',
          color: !isDark ? '#ffffff' : 'var(--text-muted)',
          boxShadow: !isDark ? '0 3px 12px rgba(245, 158, 11, 0.4)' : 'none',
        }}
      >
        <Sun size={14} />
        <span>Light</span>
      </button>

      {/* Dark Option Segment */}
      <button
        type="button"
        onClick={() => {
          if (!isDark) toggleTheme();
        }}
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.45rem',
          padding: '0.45rem 0.75rem',
          borderRadius: '24px',
          border: 'none',
          fontSize: '0.78rem',
          fontWeight: '700',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          background: isDark
            ? 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
            : 'transparent',
          color: isDark ? '#ffffff' : 'var(--text-muted)',
          boxShadow: isDark ? '0 3px 12px var(--accent-glow)' : 'none',
        }}
      >
        <Moon size={14} />
        <span>Dark</span>
      </button>
    </div>
  );
};

export default ThemeToggle;
