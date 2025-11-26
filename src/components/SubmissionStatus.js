import React from 'react';

const SubmissionStatus = ({ assignment, submission }) => {
  // Safety checks
  if (!assignment) {
    return <span style={{ color: '#6b7280' }}>⏳ Loading...</span>;
  }

  const isLate = submission && submission.submittedAt && assignment.deadline && 
    new Date(submission.submittedAt) > new Date(assignment.deadline);
  const isOverdue = !submission && assignment.deadline && new Date() > new Date(assignment.deadline);

  if (isOverdue) {
    return <span style={{ color: '#dc2626', fontWeight: 'bold' }}>⚠️ Overdue</span>;
  }
  
  if (isLate) {
    return <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>⏰ Late Submission</span>;
  }
  
  if (submission && submission.marks !== null && submission.marks !== undefined) {
    return <span style={{ color: '#059669' }}>✅ Graded: {submission.marks}/{assignment.maxMarks || 0}</span>;
  }
  
  if (submission) {
    return <span style={{ color: '#2563eb' }}>📄 Submitted</span>;
  }
  
  return <span style={{ color: '#6b7280' }}>⏳ Not Submitted</span>;
};

export default SubmissionStatus;