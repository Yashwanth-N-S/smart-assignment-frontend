import React, { useState, useEffect } from 'react';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '✅';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return { bg: '#dcfce7', border: '#16a34a', text: '#166534' };
      case 'error': return { bg: '#fee2e2', border: '#dc2626', text: '#991b1b' };
      case 'warning': return { bg: '#fef3c7', border: '#d97706', text: '#92400e' };
      case 'info': return { bg: '#dbeafe', border: '#2563eb', text: '#1e40af' };
      default: return { bg: '#dcfce7', border: '#16a34a', text: '#166534' };
    }
  };

  const colors = getColor();

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: '8px',
        padding: '1rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        zIndex: 1000,
        transform: visible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s ease',
        minWidth: '250px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>{getIcon()}</span>
      <span>{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onClose, 300);
        }}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          cursor: 'pointer',
          marginLeft: 'auto',
          color: colors.text
        }}
      >
        ×
      </button>
    </div>
  );
};

export default Toast;