import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const EditAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    maxMarks: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignment = async () => {
      try {
        const res = await api.get(`/assignments/${id}`);
        const assignment = res.data;
        setFormData({
          title: assignment.title,
          description: assignment.description,
          deadline: new Date(assignment.deadline).toISOString().slice(0, 16),
          maxMarks: assignment.maxMarks.toString()
        });
      } catch (err) {
        setError('Assignment not found');
      } finally {
        setLoading(false);
      }
    };
    fetchAssignment();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/assignments/${id}`, {
        ...formData,
        maxMarks: parseInt(formData.maxMarks)
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update assignment');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assignment? This will also delete all related submissions.')) {
      try {
        await api.delete(`/assignments/${id}`);
        alert('Assignment deleted successfully');
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete assignment');
      }
    }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h2>Edit Assignment</h2>
      {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Title:</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="form-input"
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
            rows="4"
            className="form-input"
            style={{ resize: 'vertical' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Deadline:</label>
          <input
            type="datetime-local"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            required
            className="form-input"
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Maximum Marks:</label>
          <input
            type="number"
            value={formData.maxMarks}
            onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
            required
            min="1"
            className="form-input"
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button type="submit" className="btn" style={{ flex: 1, backgroundColor: 'var(--primary)', color: 'white' }}>
            Update Assignment
          </button>
          <button type="button" onClick={handleDelete} className="btn" style={{ backgroundColor: 'var(--danger)', color: 'white' }}>
            Delete
          </button>
          <button type="button" onClick={() => navigate('/dashboard')} className="btn" style={{ backgroundColor: 'var(--secondary)', color: 'white' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAssignment;