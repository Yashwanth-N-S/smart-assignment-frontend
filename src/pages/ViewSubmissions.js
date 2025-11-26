import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import QuickGrade from '../components/QuickGrade';
import BulkActions from '../components/BulkActions';
import AssignmentStats from '../components/AssignmentStats';
import api from '../utils/api';
import { formatDate, formatDateTime } from '../utils/dateUtils';

const ViewSubmissions = () => {
  const { id } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [assignment, setAssignment] = useState(null);
  const [gradingData, setGradingData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('submittedAt');
  const BACKEND_URL = "https://smart-assignment-backend.onrender.com";

  const fetchData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [submissionsRes, assignmentRes] = await Promise.all([
        api.get(`/submissions/assignment/${id}`),
        api.get(`/assignments/${id}`)
      ]);
      setSubmissions(submissionsRes.data);
      setAssignment(assignmentRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleGrade = async (submissionId) => {
    try {
      const data = gradingData[submissionId];
      if (!data || data.marks === undefined) return;

      await api.put(`/submissions/${submissionId}/grade`, data);
      await fetchData();
      setGradingData({ ...gradingData, [submissionId]: {} });
    } catch (err) {
      console.error('Error grading submission:', err);
    }
  };

  const updateGradingData = (submissionId, field, value) => {
    setGradingData({
      ...gradingData,
      [submissionId]: {
        ...gradingData[submissionId],
        [field]: value
      }
    });
  };

  const handleBulkGrade = async (submissionIds, marks, feedback) => {
    try {
      for (const submissionId of submissionIds) {
        await api.put(`/submissions/${submissionId}/grade`, { marks, feedback });
      }
      await fetchData();
    } catch (err) {
      console.error('Error bulk grading:', err);
    }
  };

  const getFilteredSubmissions = () => {
    let filtered = submissions;
    
    switch (filter) {
      case 'graded':
        filtered = submissions.filter(s => s.marks !== null);
        break;
      case 'ungraded':
        filtered = submissions.filter(s => s.marks === null);
        break;
      case 'late':
        filtered = submissions.filter(s => 
          new Date(s.submittedAt) > new Date(assignment?.deadline)
        );
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case 'submittedAt':
          return new Date(b.submittedAt) - new Date(a.submittedAt);
        case 'marks':
          return (b.marks || 0) - (a.marks || 0);
        case 'student':
          return a.student.name.localeCompare(b.student.name);
        default:
          return 0;
      }
    });
  };

  const getPlagiarismColor = (score) => {
    if (score > 70) return '#ef4444';
    if (score > 30) return '#f59e0b';
    return '#10b981';
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-2xl)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto var(--space-md)' }}></div>
        <p className="text-secondary">Loading submissions...</p>
      </div>
    );
  }

  const filteredSubmissions = getFilteredSubmissions();

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-center">
          📊 Assignment Submissions
        </h1>
        <p className="text-center text-secondary mb-0">
          {assignment?.title || 'Loading...'}
        </p>
      </div>

      {assignment && submissions.length > 0 && (
        <AssignmentStats assignment={assignment} submissions={submissions} />
      )}

      <div className="card mb-4">
        <div className="card-header">
          <h3 className="card-title">🔍 Filter & Sort</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-4">
            <div>
              <label className="form-label">Filter by Status</label>
              <select 
                className="form-input"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Submissions ({submissions.length})</option>
                <option value="graded">Graded ({submissions.filter(s => s.marks !== null).length})</option>
                <option value="ungraded">Ungraded ({submissions.filter(s => s.marks === null).length})</option>
                <option value="late">Late Submissions ({submissions.filter(s => new Date(s.submittedAt) > new Date(assignment?.deadline)).length})</option>
              </select>
            </div>
            <div>
              <label className="form-label">Sort by</label>
              <select 
                className="form-input"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="submittedAt">📅 Submission Date</option>
                <option value="marks">📊 Marks</option>
                <option value="student">👤 Student Name</option>
              </select>
            </div>
            <div className="text-center" style={{ display: 'flex', alignItems: 'end' }}>
              <div className="status-badge status-info">
                📋 {filteredSubmissions.length} Results
              </div>
            </div>
          </div>
        </div>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="card text-center">
          <h3 className="mb-2">No submissions found</h3>
          <p className="text-secondary">
            {filter === 'all' ? 'No students have submitted this assignment yet.' : `No ${filter} submissions found.`}
          </p>
        </div>
      ) : (
        <>
          <BulkActions 
            submissions={filteredSubmissions.filter(s => s.marks === null)}
            onBulkGrade={handleBulkGrade}
          />
          
          <div className="grid gap-4">
            {filteredSubmissions.map(submission => {
              const isLate = new Date(submission.submittedAt) > new Date(assignment?.deadline);
              const isGraded = submission.marks !== null;
              
              return (
                <div key={submission._id} className="card">
                  <div className="card-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <div>
                        <h4 className="card-title mb-1">
                          👤 {submission.student.name}
                        </h4>
                        <p className="text-secondary mb-0">{submission.student.email}</p>
                      </div>
                      <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center' }}>
                        {isLate && (
                          <span className="status-badge status-warning">⏰ Late</span>
                        )}
                        {isGraded && (
                          <span className="status-badge status-success">
                            ✅ {submission.marks}/{assignment?.maxMarks}
                          </span>
                        )}
                        <span className="status-badge status-info">
                          📅 {formatDate(submission.submittedAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="grid grid-2">
                      <div>
                        {submission.plagiarismScore > 0 && (
                          <div className="mb-3 p-3 rounded" style={{ 
                            backgroundColor: `${getPlagiarismColor(submission.plagiarismScore)}15`,
                            border: `1px solid ${getPlagiarismColor(submission.plagiarismScore)}30`
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                              <span style={{ fontSize: '1.2rem' }}>🔍</span>
                              <div>
                                <strong>Plagiarism Score: {submission.plagiarismScore}%</strong>
                                {submission.plagiarismScore > 70 && <span className="text-danger ml-2">⚠️ High Risk</span>}
                                {submission.plagiarismScore > 30 && submission.plagiarismScore <= 70 && <span className="text-warning ml-2">⚠️ Medium Risk</span>}
                              </div>
                            </div>
                          </div>
                        )}

                        {submission.content && (
                          <div className="mb-3">
                            <h5 className="mb-2">📝 Text Submission</h5>
                            <div className="p-3 rounded" style={{ backgroundColor: 'var(--bg-tertiary)', border: '1px solid var(--border)', whiteSpace: 'pre-wrap', maxHeight: '200px', overflowY: 'auto' }}>
                              {submission.content}
                            </div>
                          </div>
                        )}

                

                        {submission.files && submission.files.length > 0 && (
                          <div className="mb-3">
                            <strong>📎 Attached Files:</strong>
                            <div style={{ marginTop: 'var(--space-sm)' }}>
                              {submission.files.map((file, index) => {
                                // Ensure path does NOT start with localhost or leading slash
                                const cleanPath = file.path.replace(/^\/+/, "");
                                const fileUrl = `${BACKEND_URL}/${cleanPath}`;

                                return (
                                  <a 
                                    key={index}
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline"
                                    style={{ marginRight: 'var(--space-sm)', marginBottom: 'var(--space-sm)' }}
                                  >
                                    📄 {file.filename}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}

                      </div>

                      <div>
                        <div className="card" style={{ background: 'var(--bg-tertiary)' }}>
                          <div className="card-header">
                            <h5 className="card-title">📊 Grading</h5>
                          </div>
                          <div className="card-body">
                            {isGraded ? (
                              <div>
                                <div className="mb-2">
                                  <strong>Score:</strong> 
                                  <span className="status-badge status-success ml-2">
                                    {submission.marks}/{assignment?.maxMarks}
                                  </span>
                                </div>
                                <div className="mb-2">
                                  <strong>Feedback:</strong>
                                  <p className="mt-1 text-secondary">{submission.feedback || 'No feedback provided'}</p>
                                </div>
                                <div className="text-muted">
                                  <small>Graded on {formatDateTime(submission.gradedAt)}</small>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <QuickGrade 
                                  maxMarks={assignment?.maxMarks || 100}
                                  onQuickGrade={(marks) => updateGradingData(submission._id, 'marks', marks)}
                                />
                                
                                <div className="form-group">
                                  <label className="form-label">Marks (out of {assignment?.maxMarks})</label>
                                  <input
                                    type="number"
                                    className="form-input"
                                    min="0"
                                    max={assignment?.maxMarks}
                                    value={gradingData[submission._id]?.marks || ''}
                                    onChange={(e) => updateGradingData(submission._id, 'marks', parseInt(e.target.value))}
                                    placeholder="Enter marks..."
                                  />
                                </div>
                                
                                <div className="form-group">
                                  <label className="form-label">Feedback</label>
                                  <textarea
                                    className="form-input"
                                    value={gradingData[submission._id]?.feedback || ''}
                                    onChange={(e) => updateGradingData(submission._id, 'feedback', e.target.value)}
                                    rows="3"
                                    placeholder="Provide constructive feedback..."
                                  />
                                </div>
                                
                                <button
                                  onClick={() => handleGrade(submission._id)}
                                  className="btn btn-primary"
                                  style={{ width: '100%' }}
                                >
                                  🎯 Grade Submission
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ViewSubmissions;