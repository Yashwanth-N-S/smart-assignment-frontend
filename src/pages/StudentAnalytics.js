import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { formatDate } from '../utils/dateUtils';

const StudentAnalytics = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentAnalytics();
  }, []);

  const fetchStudentAnalytics = async () => {
    try {
      const res = await api.get('/student-analytics/student');
      setAnalytics(res.data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
      setAnalytics({});
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-2xl)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto var(--space-md)' }}></div>
        <p className="text-secondary">Loading your analytics...</p>
      </div>
    );
  }
  
  if (!analytics || Object.keys(analytics).length === 0) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="mb-2">No Analytics Data Available</h2>
          <p className="text-secondary">Submit some assignments to see your performance analytics.</p>
        </div>
      </div>
    );
  }

  const getGradeColor = (percentage) => {
    if (percentage >= 90) return '#10b981';
    if (percentage >= 80) return '#3b82f6';
    if (percentage >= 70) return '#f59e0b';
    if (percentage >= 60) return '#ef4444';
    return '#6b7280';
  };

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-center">
          📈 My Performance Analytics
        </h1>
        <p className="text-center text-secondary mb-0">
          Track your academic progress and performance metrics
        </p>
      </div>
      
      <div className="grid grid-4 mb-4">
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white' }}>
          <h3 className="mb-2" style={{ color: 'white' }}>Total Submissions</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{analytics.totalSubmissions || 0}</div>
        </div>
        
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white' }}>
          <h3 className="mb-2" style={{ color: 'white' }}>Average Score</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{analytics.averageScore || 0}%</div>
        </div>
        
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white' }}>
          <h3 className="mb-2" style={{ color: 'white' }}>Completion Rate</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{analytics.completionRate || 0}%</div>
        </div>
        
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)', color: 'white' }}>
          <h3 className="mb-2" style={{ color: 'white' }}>Class Rank</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'white' }}>{analytics.classRank || 'N/A'}</div>
        </div>
      </div>

      <div className="grid grid-2 mb-4">
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Grade Trend</h3>
          </div>
          <div className="card-body">
            <div style={{ height: '200px', display: 'flex', alignItems: 'end', gap: 'var(--space-sm)', padding: 'var(--space-md) 0' }}>
              {analytics.gradeTrend && analytics.gradeTrend.length > 0 ? (
                analytics.gradeTrend.map((grade, index) => (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                    <div style={{ 
                      width: '100%', 
                      height: `${Math.max(grade.percentage * 1.5, 10)}px`, 
                      backgroundColor: getGradeColor(grade.percentage),
                      marginBottom: 'var(--space-sm)',
                      borderRadius: 'var(--radius-sm)'
                    }}></div>
                    <span style={{ fontSize: '0.75rem', textAlign: 'center' }}>
                      {grade.assignment ? grade.assignment.substring(0, 10) + '...' : 'N/A'}
                    </span>
                    <span style={{ fontSize: '0.7rem' }} className="text-secondary">
                      {grade.percentage}%
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ width: '100%', textAlign: 'center' }} className="text-secondary">
                  No graded submissions yet
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Performance by Category</h3>
          </div>
          <div className="card-body">
            {analytics.categoryPerformance && analytics.categoryPerformance.length > 0 ? (
              analytics.categoryPerformance.map(cat => (
                <div key={cat.category} className="mb-3">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-xs)' }}>
                    <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>{cat.category}</span>
                    <span style={{ fontWeight: 'bold' }}>{cat.average}%</span>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '8px', 
                    backgroundColor: 'var(--bg-tertiary)', 
                    borderRadius: 'var(--radius-sm)',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${cat.average}%`, 
                      height: '100%', 
                      backgroundColor: getGradeColor(cat.average),
                      transition: 'width 0.3s ease'
                    }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-secondary">
                No category data available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">Submission Timeline</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-3">
            <div className="text-center p-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="text-success">
                {analytics.onTimeSubmissions || 0}
              </div>
              <div className="text-secondary">On-time Submissions</div>
            </div>
            <div className="text-center p-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="text-warning">
                {analytics.lateSubmissions || 0}
              </div>
              <div className="text-secondary">Late Submissions</div>
            </div>
            <div className="text-center p-3" style={{ backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius)' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }} className="text-danger">
                {analytics.missedSubmissions || 0}
              </div>
              <div className="text-secondary">Missed Assignments</div>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Recent Submissions</h3>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Assignment</th>
                <th>Score</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {analytics.recentSubmissions && analytics.recentSubmissions.length > 0 ? (
                analytics.recentSubmissions.map(sub => (
                  <tr key={sub._id}>
                    <td>{sub.assignment ? sub.assignment.title : 'N/A'}</td>
                    <td>{sub.marks !== null && sub.assignment ? `${sub.marks}/${sub.assignment.maxMarks}` : 'Pending'}</td>
                    <td>
                      <span className={`status-badge ${sub.marks !== null ? 'status-success' : 'status-warning'}`}>
                        {sub.marks !== null ? 'Graded' : 'Pending'}
                      </span>
                    </td>
                    <td>{sub.submittedAt ? formatDate(sub.submittedAt) : 'N/A'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-secondary">
                    No submissions yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentAnalytics;