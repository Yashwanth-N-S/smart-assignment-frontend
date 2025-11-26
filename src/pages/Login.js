import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="animate-fade-in" style={{ width: '100%', maxWidth: '500px' }}>
        <div className="text-center mb-4">
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📚
          </div>
          <h1 className="page-title" style={{ marginBottom: '0.5rem' }}>
            Welcome to EduAssign
          </h1>
          <p className="text-secondary">
            Sign in to access your assignments and track your progress
          </p>
        </div>

        {error && (
          <div className="card mb-3" style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
            <div className="text-danger text-center">{error}</div>
          </div>
        )}

        <div className="card" style={{ boxShadow: 'var(--shadow-xl)', border: 'none' }}>
          <div className="card-header" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
            <h2 className="card-title text-center" style={{ color: 'white', margin: 0 }}>
              🔐 Sign In
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-group">
              <label className="form-label">
                📧 Email Address
              </label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                🔒 Password
              </label>
              <input
                type="password"
                className="form-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter your password..."
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
              style={{ width: '100%', marginBottom: 'var(--space-md)' }}
            >
              {loading ? (
                <>
                  <div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%' }}></div>
                  Signing in...
                </>
              ) : (
                <>🚀 Sign In</>
              )}
            </button>

            <div className="text-center">
              <p className="text-secondary mb-2">
                Don't have an account? 
                <Link to="/register" className="text-primary ml-1" style={{ textDecoration: 'none', fontWeight: '500' }}>
                  Create Account
                </Link>
              </p>
            </div>
          </form>
        </div>

        <div className="text-center mt-4">
          <div className="card" style={{ background: 'var(--bg-tertiary)', border: 'none', padding: 'var(--space-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-lg)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <span>🔒 Secure</span>
              <span>📚 Modern</span>
              <span>⚡ Fast</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;