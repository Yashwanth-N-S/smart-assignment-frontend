import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchFilter from '../components/SearchFilter';
import CountdownTimer from '../components/CountdownTimer';
import SubmissionStatus from '../components/SubmissionStatus';
import api from '../utils/api';
import { formatDate } from '../utils/dateUtils';

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [sortBy, setSortBy] = useState('deadline');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAssignments = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get('/assignments');
      setAssignments(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      console.error('Error fetching assignments:', err);
      setError('Failed to load assignments');
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMySubmissions = React.useCallback(async () => {
    try {
      const res = await api.get('/submissions/my');
      setSubmissions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching submissions:', err);
      setSubmissions([]);
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchAssignments();
      if (user.role === 'student') {
        fetchMySubmissions();
      }
    }
  }, [user, fetchAssignments, fetchMySubmissions]);

  useEffect(() => {
    const filterAndSortAssignments = () => {
      try {
        if (!Array.isArray(assignments)) {
          setFilteredAssignments([]);
          return;
        }
        
        let filtered = assignments.filter(assignment => {
          if (!assignment || !assignment.title) return false;
          const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               (assignment.description || '').toLowerCase().includes(searchTerm.toLowerCase());
          const matchesCategory = !category || assignment.category === category;
          return matchesSearch && matchesCategory;
        });

        filtered.sort((a, b) => {
          switch (sortBy) {
            case 'deadline': return new Date(a.deadline || 0) - new Date(b.deadline || 0);
            case 'created': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
            case 'title': return (a.title || '').localeCompare(b.title || '');
            case 'priority': 
              const priorityOrder = { high: 3, medium: 2, low: 1 };
              return (priorityOrder[b.priority] || 2) - (priorityOrder[a.priority] || 2);
            default: return 0;
          }
        });

        setFilteredAssignments(filtered);
      } catch (err) {
        console.error('Error filtering assignments:', err);
        setFilteredAssignments([]);
      }
    };
    
    filterAndSortAssignments();
  }, [assignments, searchTerm, category, sortBy]);

  const handleDeleteAssignment = async (assignmentId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This will also delete all related submissions.`)) {
      try {
        await api.delete(`/assignments/${assignmentId}`);
        fetchAssignments();
      } catch (err) {
        alert('Failed to delete assignment: ' + (err.response?.data?.message || 'Unknown error'));
      }
    }
  };

  if (authLoading) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-2xl)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto var(--space-md)' }}></div>
        <p className="text-secondary">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-2xl)' }}>
        <h2>Please log in to access the dashboard</h2>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-center">
          🏠 Dashboard
        </h1>
        <p className="text-center text-secondary mb-0">
          {user?.role === 'teacher' ? 'Manage your assignments and track student progress' : 'View your assignments and track your progress'}
        </p>
      </div>
      
      {error && (
        <div className="card" style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-danger">{error}</span>
            <button onClick={() => { setError(''); fetchAssignments(); }} className="btn btn-danger">
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="card-header">
        <div style={{ display: 'flex', gap: 'var(--space-md)', flexWrap: 'wrap' }}>
          {user?.role === 'teacher' && (
            <Link to="/create-assignment" className="btn btn-primary">
              ➕ Create Assignment
            </Link>
          )}
          <Link to={user?.role === 'student' ? '/student-analytics' : '/analytics'} className="btn btn-secondary">
            📊 Analytics
          </Link>
        </div>
      </div>

      <SearchFilter 
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {loading ? (
        <div className="text-center" style={{ padding: 'var(--space-2xl)' }}>
          <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto var(--space-md)' }}></div>
          <p className="text-secondary">Loading assignments...</p>
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="card text-center">
          <h3 className="mb-2">No assignments found</h3>
          <p className="text-secondary mb-3">There are no assignments to display.</p>
          {user?.role === 'teacher' && (
            <Link to="/create-assignment" className="btn btn-primary">
              Create Your First Assignment
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredAssignments.map(assignment => (
            <div key={assignment._id} className="card">
              <div className="card-header">
                <h3 className="card-title">
                  📝 {assignment.title || 'Untitled Assignment'}
                </h3>
              </div>
              <div className="card-body">
                <p className="mb-2">{assignment.description || 'No description'}</p>
                <div className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                  <strong>Deadline:</strong> 
                  <span>{assignment.deadline ? formatDate(assignment.deadline) : 'No deadline'}</span>
                  {assignment.deadline && <CountdownTimer deadline={assignment.deadline} />}
                </div>
                <div className="mb-2">
                  <strong>Max Marks:</strong> {assignment.maxMarks || 0}
                </div>
                <div className="mb-3">
                  <strong>Teacher:</strong> {assignment.teacher?.name || 'Unknown'}
                </div>
                
                {user?.role === 'student' && (
                  <div>
                    <div className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                      <strong>Status:</strong>
                      <SubmissionStatus 
                        assignment={assignment} 
                        submission={submissions.find(s => s.assignment && s.assignment._id === assignment._id) || null}
                      />
                    </div>
                    <Link to={`/submit/${assignment._id}`} className="btn btn-success">
                      📄 Submit Assignment
                    </Link>
                  </div>
                )}
                
                {user?.role === 'teacher' && (
                  <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                    <Link to={`/assignments/${assignment._id}/submissions`} className="btn btn-secondary">
                      📈 Submissions
                    </Link>
                    <Link to={`/edit-assignment/${assignment._id}`} className="btn btn-warning">
                      ✏️ Edit
                    </Link>
                    <button 
                      onClick={() => handleDeleteAssignment(assignment._id, assignment.title)}
                      className="btn btn-danger"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {user?.role === 'student' && submissions.length > 0 && (
        <div className="mt-4">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">My Submission History</h2>
            </div>
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Assignment</th>
                    <th>Submitted</th>
                    <th>Marks</th>
                    <th>Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map(submission => (
                    <tr key={submission._id}>
                      <td>{submission.assignment?.title || 'Unknown'}</td>
                      <td>{formatDate(submission.submittedAt)}</td>
                      <td>
                        {submission.marks !== null && submission.assignment ? `${submission.marks}/${submission.assignment.maxMarks}` : 'Pending'}
                      </td>
                      <td>{submission.feedback || 'No feedback yet'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;