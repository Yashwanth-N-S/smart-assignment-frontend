import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatDate } from '../utils/dateUtils';

const Assignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('deadline');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const assignmentsRes = await api.get('/assignments');
      setAssignments(assignmentsRes.data);
      
      if (user?.role === 'student') {
        const submissionsRes = await api.get('/submissions/my');
        setSubmissions(submissionsRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSubmissionStatus = (assignmentId) => {

    
  // CHANGE TO:
    const submission = submissions.find(s => s?.assignment?._id === assignmentId);
    if (!submission) return { status: 'not_submitted', color: 'var(--text-muted)' };
    if (submission.marks !== null && submission.marks !== undefined) return { status: 'graded', color: 'var(--success)', submission };
    return { status: 'submitted', color: 'var(--primary)', submission };
  };

  const getFilteredAssignments = () => {
    let filtered = assignments;
    
    if (user?.role === 'student') {
      switch (filter) {
        case 'pending':
          filtered = assignments.filter(a => !submissions.find(s => s?.assignment?._id === a._id));
          break;
        case 'submitted':
          filtered = assignments.filter(a => submissions.find(s => s?.assignment?._id === a._id));
          break;
        case 'graded':
          filtered = assignments.filter(a => {
            // CHANGE TO:
            const sub = submissions.find(s => s?.assignment?._id === a._id);
            return sub && sub.marks !== null && sub.marks !== undefined;
          });
          break;
        default:
          break;
      }
    } else {
      switch (filter) {
        case 'recent':
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          filtered = assignments.filter(a => new Date(a.createdAt) >= weekAgo);
          break;
        case 'upcoming':
          const threeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);
          filtered = assignments.filter(a => new Date(a.deadline) <= threeDays && new Date(a.deadline) > new Date());
          break;
        default:
          break;
      }
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          return new Date(a.deadline) - new Date(b.deadline);
        case 'created':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  const handleDeleteAssignment = async (assignmentId, title) => {
    if (window.confirm(`Delete "${title}"? This will remove all submissions.`)) {
      try {
        await api.delete(`/assignments/${assignmentId}`);
        fetchData();
      } catch (error) {
        alert('Failed to delete assignment');
      }
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-2xl)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto var(--space-md)' }}></div>
        <p className="text-secondary">Loading assignments...</p>
      </div>
    );
  }

  const filteredAssignments = getFilteredAssignments();

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-center">
          📋 {user?.role === 'teacher' ? 'My Assignments' : 'Available Assignments'}
        </h1>
        <p className="text-center text-secondary mb-0">
          {user?.role === 'teacher' 
            ? 'Manage and track your created assignments' 
            : 'Browse and submit your assignments'}
        </p>
      </div>

      {/* Action Bar */}
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
              <select 
                className="form-input" 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                style={{ minWidth: '150px' }}
              >
                <option value="all">All Assignments</option>
                {user?.role === 'student' ? (
                  <>
                    <option value="pending">📝 Pending</option>
                    <option value="submitted">📤 Submitted</option>
                    <option value="graded">✅ Graded</option>
                  </>
                ) : (
                  <>
                    <option value="recent">🆕 Recent</option>
                    <option value="upcoming">⏰ Due Soon</option>
                  </>
                )}
              </select>
              
              <select 
                className="form-input" 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                style={{ minWidth: '120px' }}
              >
                <option value="deadline">📅 Deadline</option>
                <option value="created">🆕 Created</option>
                <option value="title">📝 Title</option>
              </select>
            </div>
            
            {user?.role === 'teacher' && (
              <Link to="/create-assignment" className="btn btn-primary">
                ➕ New Assignment
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Assignments Grid */}
      {filteredAssignments.length === 0 ? (
        <div className="card text-center">
          <h3 className="mb-2">No assignments found</h3>
          <p className="text-secondary mb-3">
            {user?.role === 'teacher' 
              ? 'Create your first assignment to get started.' 
              : 'No assignments available at the moment.'}
          </p>
          {user?.role === 'teacher' && (
            <Link to="/create-assignment" className="btn btn-primary">
              Create Assignment
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredAssignments.map(assignment => {
            const isOverdue = new Date() > new Date(assignment.deadline);
            const daysLeft = Math.ceil((new Date(assignment.deadline) - new Date()) / (1000 * 60 * 60 * 24));
            const statusInfo = user?.role === 'student' ? getSubmissionStatus(assignment._id) : null;
            
            return (
              <div key={assignment._id} className="card">
                <div className="card-header">
                  <h3 className="card-title">
                    {assignment.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
                    {assignment.priority === 'high' && (
                      <span className="status-badge" style={{ 
                        background: 'var(--danger)', 
                        color: 'white',
                        fontSize: '0.75rem',
                        fontWeight: 'bold'
                      }}>
                        🔥 HIGH
                      </span>
                    )}
                    <span className="status-badge status-info">
                      {assignment.category}
                    </span>
                    {user?.role === 'student' && statusInfo && (
                      <span className="status-badge" style={{ 
                        background: `${statusInfo.color}15`, 
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.color}30`
                      }}>
                        {statusInfo.status === 'graded' ? '✅ Graded' : 
                         statusInfo.status === 'submitted' ? '📤 Submitted' : '⏳ Pending'}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="card-body">
                  <p className="text-secondary mb-3" style={{ lineHeight: '1.5' }}>
                    {assignment.description}
                  </p>
                  
                  <div className="grid grid-2 mb-3">
                    <div>
                      <strong>📅 Due Date:</strong>
                      <div style={{ color: isOverdue ? 'var(--danger)' : 'var(--text-primary)' }}>
                        {formatDate(assignment.deadline)}
                        {!isOverdue && daysLeft >= 0 && (
                          <small className="text-secondary ml-2">
                            ({daysLeft === 0 ? 'Today' : `${daysLeft} days left`})
                          </small>
                        )}
                        {isOverdue && <small className="text-danger ml-2">(Overdue)</small>}
                      </div>
                    </div>
                    <div>
                      <strong>📊 Max Marks:</strong>
                      <div>{assignment.maxMarks}</div>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <strong>👨‍🏫 Teacher:</strong> {assignment.teacher?.name}
                    {assignment.course && (
                      <div><strong>🎓 Course:</strong> {assignment.course.name} ({assignment.course.code})</div>
                    )}
                  </div>
                  
                  {user?.role === 'student' && statusInfo?.submission?.marks !== null && statusInfo?.submission?.marks !== undefined && (
                    <div className="mb-3 p-3 rounded" style={{ background: 'var(--bg-tertiary)' }}>
                      <strong>Your Grade:</strong> {statusInfo.submission.marks}/{assignment.maxMarks}
                      {statusInfo.submission.feedback && (
                        <div className="text-secondary mt-1">
                          <strong>Feedback:</strong> {statusInfo.submission.feedback}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)', flexWrap: 'wrap' }}>
                    {user?.role === 'student' ? (
                      statusInfo?.status === 'not_submitted' && (
                        <Link 
                          to={`/submit/${assignment._id}`} 
                          className="btn btn-primary"
                          style={{ flex: 1, minWidth: '120px' }}
                        >
                          📝 Submit
                        </Link>
                      )
                    ) : (
                      <>
                        <Link 
                          to={`/assignments/${assignment._id}/submissions`} 
                          className="btn btn-secondary"
                          style={{ flex: 1, minWidth: '140px' }}
                        >
                          📈 Submissions
                        </Link>
                        <Link 
                          to={`/edit-assignment/${assignment._id}`} 
                          className="btn btn-warning"
                          style={{ flex: 1, minWidth: '100px' }}
                        >
                          ✏️ Edit
                        </Link>
                        <button 
                          onClick={() => handleDeleteAssignment(assignment._id, assignment.title)}
                          className="btn btn-danger"
                          style={{ flex: 1, minWidth: '100px' }}
                        >
                          🗑️ Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Assignments;