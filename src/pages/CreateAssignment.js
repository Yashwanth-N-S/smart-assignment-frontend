import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    maxMarks: '',
    course: '',
    category: 'homework',
    priority: 'medium'
  });
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCourses = React.useCallback(async () => {
    try {
      const res = await api.get('/courses/my-courses');
      setCourses(res.data);
    } catch (err) {
      console.error('Error fetching courses:', err);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        maxMarks: parseInt(formData.maxMarks)
      };
      await api.post('/assignments', submitData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-center">
          ✨ Create New Assignment
        </h1>
        <p className="text-center text-secondary mb-0">
          Design engaging assignments for your students
        </p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {error && (
          <div className="card mb-3" style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
            <div className="text-danger">{error}</div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📝 Assignment Details</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body">
            <div className="grid grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">
                  📚 Assignment Title
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter assignment title..."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  📊 Maximum Marks
                </label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.maxMarks}
                  onChange={(e) => setFormData({ ...formData, maxMarks: e.target.value })}
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group mb-4">
              <label className="form-label">
                📝 Description
              </label>
              <textarea
                className="form-input form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the assignment requirements, objectives, and instructions..."
                rows="4"
                required
              />
            </div>

            <div className="grid grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">
                  ⏰ Deadline
                </label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  🎓 Course (Optional)
                </label>
                <select
                  className="form-input"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="">Open Assignment (All Students)</option>
                  {courses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.name} ({course.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-2 mb-4">
              <div className="form-group">
                <label className="form-label">
                  📂 Category
                </label>
                <select
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="homework">📝 Homework</option>
                  <option value="project">🚀 Project</option>
                  <option value="quiz">❓ Quiz</option>
                  <option value="exam">📋 Exam</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  🎯 Priority
                </label>
                <select
                  className="form-input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
            </div>



            <div className="mt-4" style={{ display: 'flex', gap: 'var(--space-md)' }}>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? (
                  <>
                    <div className="animate-spin" style={{ width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%' }}></div>
                    Creating...
                  </>
                ) : (
                  <>🚀 Create Assignment</>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/dashboard')} 
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                ❌ Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAssignment;