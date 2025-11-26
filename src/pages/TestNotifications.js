import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const TestNotifications = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching notifications for user:', user?._id);
      const response = await api.get('/notifications');
      console.log('Notifications response:', response.data);
      setNotifications(response.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const createTestNotification = async () => {
    try {
      const response = await api.post('/notifications/test', {
        title: 'Test Notification',
        message: 'This is a test notification',
        type: 'system'
      });
      console.log('Test notification created:', response.data);
      fetchNotifications();
    } catch (err) {
      console.error('Error creating test notification:', err);
      setError('Failed to create test notification');
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>🔔 Notification Test Page</h2>
          <p>User: {user?.name} ({user?.role})</p>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button onClick={fetchNotifications} className="btn btn-primary" disabled={loading}>
              {loading ? 'Loading...' : 'Refresh Notifications'}
            </button>
            <button onClick={createTestNotification} className="btn btn-secondary">
              Create Test Notification
            </button>
          </div>

          {error && (
            <div style={{ background: '#fee', color: '#c00', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
              Error: {error}
            </div>
          )}

          <h3>Notifications ({notifications.length})</h3>
          {notifications.length === 0 ? (
            <p>No notifications found</p>
          ) : (
            <div>
              {notifications.map(notification => (
                <div key={notification._id} style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  marginBottom: '0.5rem',
                  borderRadius: '4px',
                  background: notification.read ? '#f9f9f9' : '#fff'
                }}>
                  <div style={{ fontWeight: 'bold' }}>{notification.title}</div>
                  <div>{notification.message}</div>
                  <div style={{ fontSize: '0.8rem', color: '#666' }}>
                    Type: {notification.type} | Read: {notification.read ? 'Yes' : 'No'} | 
                    Created: {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestNotifications;