import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Analytics = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/analytics');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-2xl)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto var(--space-md)' }}></div>
        <p className="text-secondary">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-center">
          📊 Analytics Dashboard
        </h1>
        <p className="text-center text-secondary mb-0">
          {user?.role === 'teacher' ? 'Track your teaching performance and student progress' : 'Monitor your academic progress and performance'}
        </p>
      </div>
      
      <div className="grid grid-4 mb-4">
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
          <h3 className="mb-2" style={{ color: 'white' }}>Total Assignments</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.totalAssignments || 0}</div>
        </div>
        
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
          <h3 className="mb-2" style={{ color: 'white' }}>Total Submissions</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.totalSubmissions || 0}</div>
        </div>
        
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
          <h3 className="mb-2" style={{ color: 'white' }}>Average Score</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.averageScore || 0}%</div>
        </div>
        
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white' }}>
          <h3 className="mb-2" style={{ color: 'white' }}>Completion Rate</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{stats.completionRate || 0}%</div>
        </div>
      </div>

      {user?.role === 'teacher' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Teacher Analytics</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-2">
              <div>
                <h4 className="mb-3">Assignment Categories</h4>
                {stats.categoryStats?.map(cat => (
                  <div key={cat._id} className="mb-2" style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-sm) 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ textTransform: 'capitalize' }}>{cat._id}</span>
                    <span className="status-badge status-info">{cat.count}</span>
                  </div>
                ))}
              </div>
              
              <div>
                <h4 className="mb-3">Recent Activity</h4>
                <div className="text-secondary">
                  <p className="mb-2">📝 {stats.recentSubmissions || 0} submissions this week</p>
                  <p className="mb-2">⏳ {stats.pendingGrades || 0} pending grades</p>
                  <p className="mb-2">📅 {stats.upcomingDeadlines || 0} upcoming deadlines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'student' && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Your Performance</h2>
          </div>
          <div className="card-body">
            <div className="grid grid-2">
              <div>
                <h4 className="mb-3">Grade Distribution</h4>
                <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: 'var(--space-md)', padding: 'var(--space-md) 0' }}>
                  {stats.gradeDistribution?.map((grade, index) => (
                    <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                      <div style={{ 
                        width: '100%', 
                        height: `${Math.max(grade.percentage * 2, 10)}px`, 
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))', 
                        marginBottom: 'var(--space-sm)',
                        borderRadius: 'var(--radius-sm)'
                      }}></div>
                      <span style={{ fontSize: '0.75rem' }}>{grade.range}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="mb-3">Submission Timeline</h4>
                <div className="text-secondary">
                  <p className="mb-2">✅ On-time submissions: {stats.onTimeSubmissions || 0}</p>
                  <p className="mb-2">⏰ Late submissions: {stats.lateSubmissions || 0}</p>
                  <p className="mb-2">❌ Missing submissions: {stats.missedSubmissions || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;