import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './styles/global.css';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateAssignment from './pages/CreateAssignment';
import EditAssignment from './pages/EditAssignment';
import SubmitAssignment from './pages/SubmitAssignment';
import ViewSubmissions from './pages/ViewSubmissions';
import Analytics from './pages/Analytics';
import StudentAnalytics from './pages/StudentAnalytics';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import MySubmissions from './pages/MySubmissions';
import TestNotifications from './pages/TestNotifications';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const TeacherRoute = ({ children }) => {
  const { user } = useAuth();
  return user?.role === 'teacher' ? children : <Navigate to="/dashboard" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/create-assignment" element={
              <ProtectedRoute>
                <TeacherRoute>
                  <CreateAssignment />
                </TeacherRoute>
              </ProtectedRoute>
            } />
            <Route path="/edit-assignment/:id" element={
              <ProtectedRoute>
                <TeacherRoute>
                  <EditAssignment />
                </TeacherRoute>
              </ProtectedRoute>
            } />
            <Route path="/submit/:id" element={
              <ProtectedRoute>
                <SubmitAssignment />
              </ProtectedRoute>
            } />
            <Route path="/assignments/:id/submissions" element={
              <ProtectedRoute>
                <TeacherRoute>
                  <ViewSubmissions />
                </TeacherRoute>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <Analytics />
              </ProtectedRoute>
            } />
            <Route path="/student-analytics" element={
              <ProtectedRoute>
                <StudentAnalytics />
              </ProtectedRoute>
            } />
            <Route path="/assignments" element={
              <ProtectedRoute>
                <Assignments />
              </ProtectedRoute>
            } />
            <Route path="/my-submissions" element={
              <ProtectedRoute>
                <MySubmissions />
              </ProtectedRoute>
            } />
            <Route path="/courses" element={
              <ProtectedRoute>
                <Courses />
              </ProtectedRoute>
            } />
            <Route path="/test-notifications" element={
              <ProtectedRoute>
                <TestNotifications />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;