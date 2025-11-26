import React from 'react';

const AssignmentStats = ({ assignment, submissions }) => {
  const totalSubmissions = submissions.length;
  const gradedSubmissions = submissions.filter(s => s.marks !== null).length;
  const avgMarks = gradedSubmissions > 0 
    ? (submissions.filter(s => s.marks !== null).reduce((sum, s) => sum + s.marks, 0) / gradedSubmissions).toFixed(1)
    : 0;
  const lateSubmissions = submissions.filter(s => 
    new Date(s.submittedAt) > new Date(assignment.deadline)
  ).length;

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">📈 Assignment Statistics</h3>
      </div>
      <div className="card-body">
        <div className="grid grid-4">
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
              {totalSubmissions}
            </div>
            <div className="text-secondary">Total Submissions</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>
              {gradedSubmissions}
            </div>
            <div className="text-secondary">Graded</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--info)' }}>
              {avgMarks}
            </div>
            <div className="text-secondary">Average Marks</div>
          </div>
          <div className="text-center">
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>
              {lateSubmissions}
            </div>
            <div className="text-secondary">Late Submissions</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentStats;