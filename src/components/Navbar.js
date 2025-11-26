import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user?._id) {
      fetchNotifications();
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data.filter(n => !n.read));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!user) return null;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/dashboard" className="navbar-brand">
            📚 EduAssign
          </Link>
          
          <div className="navbar-nav">
            <Link 
              to="/dashboard" 
              className={`navbar-link ${isActive('/dashboard') ? 'active' : ''}`}
            >
              🏠 Dashboard
            </Link>
            
            <Link 
              to="/assignments" 
              className={`navbar-link ${isActive('/assignments') ? 'active' : ''}`}
            >
              📋 Assignments
            </Link>
            
            <Link 
              to="/courses" 
              className={`navbar-link ${isActive('/courses') ? 'active' : ''}`}
            >
              🎓 Courses
            </Link>
          
          {user.role === 'teacher' ? (
            <>
              <Link 
                to="/create-assignment" 
                className={`navbar-link ${isActive('/create-assignment') ? 'active' : ''}`}
              >
                ➕ Create
              </Link>
              <Link 
                to="/analytics" 
                className={`navbar-link ${isActive('/analytics') ? 'active' : ''}`}
              >
                📊 Analytics
              </Link>
            </>
          ) : (
            <>
              <Link 
                to="/my-submissions" 
                className={`navbar-link ${isActive('/my-submissions') ? 'active' : ''}`}
              >
                📄 My Work
              </Link>
              <Link 
                to="/student-analytics" 
                className={`navbar-link ${isActive('/student-analytics') ? 'active' : ''}`}
              >
                📈 Progress
              </Link>
            </>
          )}

            {/* Notification Bell */}
            <div 
              className="notification-bell"
              onClick={() => setShowNotifications(!showNotifications)}
              style={{ position: 'relative', cursor: 'pointer', padding: '0.5rem' }}
            >
              <span style={{ fontSize: '1.25rem' }}>🔔</span>
              {notifications.length > 0 && (
                <span className="notification-badge">
                  {notifications.length}
                </span>
              )}
            
            {showNotifications && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: 'white',
                borderRadius: '10px',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)',
                minWidth: '300px',
                maxHeight: '400px',
                overflowY: 'auto',
                zIndex: 1000,
                marginTop: '0.5rem'
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                  <h4 style={{ fontWeight: '600' }}>Notifications</h4>
                </div>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification._id} style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e2e8f0'
                    }}>
                      <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                        {notification.title}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#718096' }}>
                        {notification.message}
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#718096' }}>
                    No new notifications
                  </div>
                )}
              </div>
            )}
          </div>

            {/* User Menu */}
            <div className="user-menu">
              <span className="user-name">
                👤 {user.name}
              </span>
              <button 
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;