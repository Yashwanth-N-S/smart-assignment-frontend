import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    description: '',
    semester: '',
    year: new Date().getFullYear()
  });
  const [searchCode, setSearchCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      if (user?.role === 'teacher') {
        const res = await api.get('/courses/my-courses');
        setCourses(res.data);
      } else {
        const res = await api.get('/courses/enrolled');
        setEnrolledCourses(res.data);
      }
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await api.post('/courses', newCourse);
      setNewCourse({
        name: '',
        code: '',
        description: '',
        semester: '',
        year: new Date().getFullYear()
      });
      fetchCourses();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create course');
    }
  };

  const handleEnrollInCourse = async () => {
    try {
      const res = await api.get(`/courses/search/${searchCode}`);
      await api.post(`/courses/${res.data._id}/enroll`);
      setSearchCode('');
      fetchCourses();
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Course not found or enrollment failed');
    }
  };

  if (loading) {
    return (
      <div className="container text-center" style={{ padding: 'var(--space-2xl)' }}>
        <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTop: '3px solid var(--primary)', borderRadius: '50%', margin: '0 auto var(--space-md)' }}></div>
        <p className="text-secondary">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in">
      <div className="page-header">
        <h1 className="page-title text-center">
          🎓 Courses
        </h1>
        <p className="text-center text-secondary mb-0">
          {user?.role === 'teacher' ? 'Manage your courses and enrolled students' : 'View and enroll in courses'}
        </p>
      </div>

      {error && (
        <div className="card mb-3" style={{ background: 'rgb(239 68 68 / 0.1)', border: '1px solid rgb(239 68 68 / 0.2)' }}>
          <div className="text-danger text-center">{error}</div>
        </div>
      )}

      {user?.role === 'teacher' ? (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title">➕ Create New Course</h2>
            </div>
            <form onSubmit={handleCreateCourse} className="card-body">
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Course Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    placeholder="e.g., Introduction to Computer Science"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Course Code</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    placeholder="e.g., CS101"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-input"
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  placeholder="Course description..."
                  rows="3"
                />
              </div>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Semester</label>
                  <input
                    type="text"
                    className="form-input"
                    value={newCourse.semester}
                    onChange={(e) => setNewCourse({ ...newCourse, semester: e.target.value })}
                    placeholder="e.g., Fall, Spring"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Year</label>
                  <input
                    type="number"
                    className="form-input"
                    value={newCourse.year}
                    onChange={(e) => setNewCourse({ ...newCourse, year: parseInt(e.target.value) })}
                    min="2020"
                    max="2030"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                🚀 Create Course
              </button>
            </form>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📚 My Courses</h2>
            </div>
            <div className="card-body">
              {courses.length === 0 ? (
                <p className="text-center text-secondary">No courses created yet.</p>
              ) : (
                <div className="grid grid-2">
                  {courses.map(course => (
                    <div key={course._id} className="card" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="card-header">
                        <h3 className="card-title">{course.name}</h3>
                        <span className="status-badge status-info">{course.code}</span>
                      </div>
                      <div className="card-body">
                        <p className="text-secondary mb-2">{course.description}</p>
                        <div className="mb-2">
                          <strong>Students Enrolled:</strong> {course.students?.length || 0}
                        </div>
                        <div className="text-muted">
                          <small>{course.semester} {course.year}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card mb-4">
            <div className="card-header">
              <h2 className="card-title">🔍 Enroll in Course</h2>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <input
                  type="text"
                  className="form-input"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder="Enter course code (e.g., CS101)"
                  style={{ flex: 1 }}
                />
                <button
                  onClick={handleEnrollInCourse}
                  className="btn btn-primary"
                  disabled={!searchCode}
                >
                  📝 Enroll
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">📚 My Enrolled Courses</h2>
            </div>
            <div className="card-body">
              {enrolledCourses.length === 0 ? (
                <p className="text-center text-secondary">No courses enrolled yet. Use course codes to enroll.</p>
              ) : (
                <div className="grid grid-2">
                  {enrolledCourses.map(course => (
                    <div key={course._id} className="card" style={{ background: 'var(--bg-tertiary)' }}>
                      <div className="card-header">
                        <h3 className="card-title">{course.name}</h3>
                        <span className="status-badge status-success">{course.code}</span>
                      </div>
                      <div className="card-body">
                        <p className="text-secondary mb-2">{course.description}</p>
                        <div className="mb-2">
                          <strong>Teacher:</strong> {course.teacher?.name}
                        </div>
                        <div className="text-muted">
                          <small>{course.semester} {course.year}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Courses;