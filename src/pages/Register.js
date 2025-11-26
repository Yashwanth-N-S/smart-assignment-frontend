import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', teacherCode: '' });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
            Join EduAssign
          </h1>
          <p className="text-secondary">
            Create your account to start managing assignments
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
              ✨ Create Account
            </h2>
          </div>
          <form onSubmit={handleSubmit} className="card-body">
            <div className="form-group">
              <label className="form-label">
                👤 Full Name
              </label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name..."
                required
              />
            </div>

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
                placeholder="Create a strong password..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                🎭 Role
              </label>
              <select
                className="form-input"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">👨‍🎓 Student</option>
                <option value="teacher">👨‍🏫 Teacher</option>
              </select>
            </div>
            {formData.role === 'teacher' && (
              <div className="form-group">
                <label className="form-label">
                  🔑 Teacher Verification Code
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.teacherCode}
                  onChange={(e) => setFormData({ ...formData, teacherCode: e.target.value })}
                  placeholder="Enter teacher verification code..."
                  required
                />
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: 'block', marginTop: '0.25rem' }}>
                  💡 Contact admin for teacher verification code
                </small>
              </div>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ width: '100%', marginBottom: 'var(--space-md)' }}
            >
              🚀 Create Account
            </button>

            <div className="text-center">
              <p className="text-secondary mb-0">
                Already have an account? 
                <Link to="/login" className="text-primary ml-1" style={{ textDecoration: 'none', fontWeight: '500' }}>
                  Sign In
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

export default Register;