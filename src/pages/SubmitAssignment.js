import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { formatDateTime } from '../utils/dateUtils';

const SubmitAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [content, setContent] = useState('');
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/assignments/${id}`);
        setAssignment(res.data);
      } catch (err) {
        setError('Assignment not found');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchAssignment();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('assignmentId', id);
      formData.append('content', content);
      
      for (let file of files) {
        formData.append('files', file);
      }

      await api.post('/submissions', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit assignment');
    }
  };

  if (loading) return (
    <div className="container text-center" style={{ padding: '2rem' }}>
      <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
      <p className="text-secondary">Loading assignment...</p>
    </div>
  );
  
  if (error && !assignment) return (
    <div className="container text-center" style={{ padding: '2rem' }}>
      <div className="card" style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
        <div className="text-danger">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div className="card-header">
          <h2 className="card-title">Submit Assignment: {assignment?.title}</h2>
        </div>
        <div className="card-body">
      <div className="card" style={{ marginBottom: '2rem', background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}>
        <p><strong>Description:</strong> {assignment?.description}</p>
        <p><strong>Deadline:</strong> {formatDateTime(assignment?.deadline)}</p>
        <p><strong>Max Marks:</strong> {assignment?.maxMarks}</p>
        {new Date() > new Date(assignment?.deadline) && (
          <div className="card" style={{ marginTop: '1rem', background: 'rgb(245 158 11 / 0.1)', border: '1px solid rgb(245 158 11 / 0.2)' }}>
            <div className="text-warning" style={{ fontWeight: '600' }}>
              ⚠️ <strong>Late Submission:</strong> This assignment is past its deadline. Your submission will be marked as late.
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="card mb-3" style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
          <div className="text-danger">{error}</div>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Text Submission:</label>
          <textarea
            className="form-input"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter your assignment text here..."
            rows="12"
            style={{ minHeight: '250px', width: '100%', resize: 'vertical' }}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">File Attachments (PDF, Images):</label>
          <input
            type="file"
            className="form-input"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.gif"
            onChange={(e) => setFiles(Array.from(e.target.files))}
          />
          {files.length > 0 && (
            <div style={{ marginTop: '0.5rem' }}>
              <strong>Selected files:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                {files.map((file, index) => (
                  <li key={index}>{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
            Submit Assignment
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn btn-secondary" style={{ flex: 1 }}>
            Cancel
          </button>
        </div>
      </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitAssignment;