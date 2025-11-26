import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { formatDate, formatDateTime } from '../utils/dateUtils';

const MySubmissions = () => {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const BACKEND_URL = "https://smart-assignment-backend.onrender.com";


  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const response = await api.get('/submissions/my');
      const submissionsData = response.data;
      setSubmissions(submissionsData);
      

    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredSubmissions = () => {
    let filtered = submissions;
    
    switch (filter) {
      case 'graded':
        filtered = submissions.filter(s => s.marks !== null);
        break;
      case 'pending':
        filtered = submissions.filter(s => s.marks === null);
        break;
      case 'late':
        filtered = submissions.filter(s => 
          new Date(s.submittedAt) > new Date(s.assignment.deadline)
        );
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case 'grade':
          return (b.marks || 0) - (a.marks || 0);
        case 'assignment':
          return (a.assignment?.title || '').localeCompare(b.assignment?.title || '');
        default:
          return 0;
      }
    });
  };



  if (loading) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-2xl)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto var(--space-md)' }}></div>
        <p className="text-secondary">Loading your submissions...</p>
      </div>
    );
  }

  const filteredSubmissions = getFilteredSubmissions();

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-center">
          📄 My Work
        </h1>
        <p className="text-center text-secondary mb-0">
          View your submitted assignments and grades
        </p>
      </div>

      {/* Filter and Sort */}
      <div className="card mb-4">
        <div className="card-body">
          <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center', flexWrap: 'wrap' }}>
            <select 
              className="form-input" 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="all">All Submissions</option>
              <option value="graded">✅ Graded</option>
              <option value="pending">⏳ Pending</option>
              <option value="late">⏰ Late</option>
            </select>
            
            <select 
              className="form-input" 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              style={{ minWidth: '150px' }}
            >
              <option value="recent">📅 Most Recent</option>
              <option value="grade">📊 Highest Grade</option>
              <option value="assignment">📝 Assignment Name</option>
            </select>
            

          </div>
        </div>
      </div>

      {/* Submissions List */}
      {filteredSubmissions.length === 0 ? (
        <div className="card text-center">
          <h3 className="mb-2">No submissions found</h3>
          <p className="text-secondary mb-3">
            {filter === 'all' 
              ? "You haven't submitted any assignments yet." 
              : `No ${filter} submissions found.`}
          </p>
          <Link to="/assignments" className="btn btn-primary">
            Browse Assignments
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredSubmissions.map(submission => {
            const isLate = new Date(submission.submittedAt) > new Date(submission.assignment?.deadline);
            const isGraded = submission.marks !== null;
            
            return (
              <div key={submission._id} className="card">
                <div className="card-header">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                    <div>
                      <h3 className="card-title mb-1">
                        📝 {submission.assignment?.title || 'Unknown Assignment'}
                      </h3>
                      <p className="text-secondary mb-0">
                        Submitted: {formatDateTime(submission.submittedAt)}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                      {isLate && (
                        <span className="status-badge status-warning">⏰ Late</span>
                      )}
                      {isGraded ? (
                        <span className="status-badge status-success">
                          ✅ {submission.marks}/{submission.assignment?.maxMarks}
                        </span>
                      ) : (
                        <span className="status-badge status-warning">⏳ Pending</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <div className="grid grid-2 mb-3">
                    <div>
                      <strong>📅 Due Date:</strong>
                      <div>{formatDate(submission.assignment?.deadline)}</div>
                    </div>
                    <div>
                      <strong>📊 Max Marks:</strong>
                      <div>{submission.assignment?.maxMarks}</div>
                    </div>
                  </div>
                  
                  {submission.content && (
                    <div className="mb-3">
                      <strong>📝 Your Submission:</strong>
                      <div className="p-3 rounded" style={{ 
                        background: 'var(--bg-tertiary)', 
                        border: '1px solid var(--border)',
                        marginTop: 'var(--space-sm)',
                        maxHeight: '100px',
                        overflowY: 'auto'
                      }}>
                        {submission.content}
                      </div>
                    </div>
                  )}
                  
                  {submission.files && submission.files.length > 0 && (
                    <div className="mb-3">
                      <strong>📎 Attached Files:</strong>
                      <div style={{ marginTop: 'var(--space-sm)' }}>
                        {submission.files.map((file, index) => (
                          <a 
                            key={index}
                            href={`${BACKEND_URL}/${file.path}`}
 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-outline"
                            style={{ marginRight: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}
                          >
                            📄 {file.filename}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {isGraded && (
                    <div className="p-3 rounded" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
                      <div className="mb-2">
                        <strong>🏆 Grade:</strong> {submission.marks}/{submission.assignment?.maxMarks}
                      </div>
                      {submission.gradedAt && (
                        <div className="mb-2">
                          <strong>📅 Graded:</strong> {formatDate(submission.gradedAt)}
                        </div>
                      )}
                      {submission.feedback && (
                        <div>
                          <strong>💬 Feedback:</strong>
                          <div className="text-secondary mt-1">{submission.feedback}</div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', marginTop: 'var(--space-md)' }}>
                    <Link 
                      to={`/submit/${submission.assignment?._id}`} 
                      className="btn btn-outline"
                    >
                      ✏️ Resubmit
                    </Link>

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

export default MySubmissions;