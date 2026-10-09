import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const CustomModal = ({
  isOpen,
  title,
  message,
  type = 'info', // 'success' | 'error' | 'warning' | 'info' | 'confirm'
  confirmVariant = 'primary', // 'primary' | 'danger'
  onClose,
  onConfirm,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
}) => {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={32} style={{ color: 'var(--success)' }} />;
      case 'error':
        return <AlertCircle size={32} style={{ color: 'var(--danger)' }} />;
      case 'warning':
        return <AlertTriangle size={32} style={{ color: 'var(--warning)' }} />;
      case 'confirm':
        return confirmVariant === 'danger' ? (
          <AlertTriangle size={32} style={{ color: 'var(--danger)' }} />
        ) : (
          <CheckCircle2 size={32} style={{ color: 'var(--accent-primary)' }} />
        );
      case 'info':
      default:
        return <Info size={32} style={{ color: 'var(--accent-primary)' }} />;
    }
  };

  const getHeaderColor = () => {
    switch (type) {
      case 'success':
        return 'var(--success)';
      case 'error':
        return 'var(--danger)';
      case 'warning':
        return 'var(--warning)';
      case 'confirm':
        return confirmVariant === 'danger' ? 'var(--danger)' : 'var(--text-primary)';
      default:
        return 'var(--text-primary)';
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 1000 }}>
      <div
        className="glass-card modal-content"
        style={{
          maxWidth: '460px',
          width: '90%',
          padding: '1.75rem',
          textAlign: 'center',
          animation: 'fadeIn 0.25 ease',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ padding: '0.35rem', border: 'none', background: 'transparent', color: 'var(--text-muted)' }}
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.05)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            border: '1px solid var(--glass-border)',
          }}
        >
          {getIcon()}
        </div>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: getHeaderColor(), marginBottom: '0.6rem' }}>
          {title || (type === 'error' ? 'Action Failed' : type === 'success' ? 'Success' : 'Notice')}
        </h3>

        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '1.75rem' }}>
          {message}
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
          {type === 'confirm' ? (
            <>
              <button
                onClick={onClose}
                className="btn-secondary"
                style={{ flex: 1, padding: '0.65rem 1rem', fontSize: '0.88rem' }}
              >
                {cancelText}
              </button>
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  onClose();
                }}
                className="btn-primary"
                style={{
                  flex: 1,
                  padding: '0.65rem 1rem',
                  fontSize: '0.88rem',
                  background: confirmVariant === 'danger'
                    ? 'linear-gradient(135deg, var(--danger), #dc2626)'
                    : 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                }}
              >
                {confirmText}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="btn-primary"
              style={{ width: '100%', padding: '0.65rem 1.5rem', fontSize: '0.88rem' }}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
