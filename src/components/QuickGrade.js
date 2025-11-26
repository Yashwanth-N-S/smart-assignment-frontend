import React from 'react';

const QuickGrade = ({ maxMarks, onQuickGrade }) => {
  const quickGrades = [
    { label: 'Excellent', percentage: 95 },
    { label: 'Good', percentage: 80 },
    { label: 'Average', percentage: 65 },
    { label: 'Poor', percentage: 40 }
  ];

  return (
    <div className="mb-3">
      <label className="form-label">Quick Grade:</label>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {quickGrades.map(grade => (
          <button
            key={grade.label}
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
            onClick={() => onQuickGrade(Math.round((grade.percentage / 100) * maxMarks))}
          >
            {grade.label} ({Math.round((grade.percentage / 100) * maxMarks)})
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickGrade;