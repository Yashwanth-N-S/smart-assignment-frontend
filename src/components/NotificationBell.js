import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const fetchNotifications = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.filter(n => !n.read).slice(0, 5));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await api.put(`/notifications/${notificationId}/read`);
      setNotifications(notifications.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  return (
    <div className="notification-bell" style={{ position: 'relative' }}>
      <button
        className="notification-button"
        onClick={() => setShowDropdown(!showDropdown)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          position: 'relative',
          padding: '0.5rem',
          borderRadius: 'var(--radius)',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = 'var(--bg-tertiary)'}
        onMouseLeave={(e) => e.target.style.background = 'none'}
      >
        <span style={{ fontSize: '1.25rem' }}>🔔</span>
        {notifications.length > 0 && (
          <span className="notification-badge">
            {notifications.length}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <h4>Notifications</h4>
            {notifications.length > 0 && (
              <button
                onClick={() => setNotifications([])}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--primary)',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                Clear all
              </button>
            )}
          </div>
          
          <div className="notification-list">
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>
                <div className="animate-spin" style={{ 
                  width: '20px', 
                  height: '20px', 
                  border: '2px solid var(--border)', 
                  borderTop: '2px solid var(--primary)', 
                  borderRadius: '50%', 
                  margin: '0 auto' 
                }}></div>
              </div>
            ) : notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification._id} className="notification-item">
                  <div className="notification-content">
                    <div className="notification-title">
                      {notification.title}
                    </div>
                    <div className="notification-message">
                      {notification.message}
                    </div>
                    <div className="notification-time">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="notification-close"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="notification-empty">
                <span style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</span>
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;