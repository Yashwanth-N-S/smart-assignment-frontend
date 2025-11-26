import React, { useState } from 'react';

const BulkActions = ({ submissions, onBulkGrade }) => {
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [bulkMarks, setBulkMarks] = useState('');
  const [bulkFeedback, setBulkFeedback] = useState('');

  const handleSelectAll = () => {
    if (selectedSubmissions.length === submissions.length) {
      setSelectedSubmissions([]);
    } else {
      setSelectedSubmissions(submissions.map(s => s._id));
    }
  };

  const handleSubmissionSelect = (submissionId) => {
    if (selectedSubmissions.includes(submissionId)) {
      setSelectedSubmissions(selectedSubmissions.filter(id => id !== submissionId));
    } else {
      setSelectedSubmissions([...selectedSubmissions, submissionId]);
    }
  };

  const handleBulkGrade = () => {
    if (selectedSubmissions.length === 0 || !bulkMarks) return;
    onBulkGrade(selectedSubmissions, parseInt(bulkMarks), bulkFeedback);
    setSelectedSubmissions([]);
    setBulkMarks('');
    setBulkFeedback('');
  };

  if (submissions.length === 0) return null;

  return (
    <div className="card mb-4">
      <div className="card-header">
        <h3 className="card-title">⚡ Bulk Actions</h3>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <button
            className="btn btn-outline"
            onClick={handleSelectAll}
          >
            {selectedSubmissions.length === submissions.length ? 'Deselect All' : 'Select All'} ({submissions.length})
          </button>
        </div>
        
        {selectedSubmissions.length > 0 && (
          <div className="grid grid-3">
            <div className="form-group">
              <label className="form-label">Bulk Marks</label>
              <input
                type="number"
                className="form-input"
                value={bulkMarks}
                onChange={(e) => setBulkMarks(e.target.value)}
                placeholder="Enter marks..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bulk Feedback</label>
              <input
                type="text"
                className="form-input"
                value={bulkFeedback}
                onChange={(e) => setBulkFeedback(e.target.value)}
                placeholder="Enter feedback..."
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <button
                className="btn btn-primary"
                onClick={handleBulkGrade}
                disabled={!bulkMarks}
              >
                Grade {selectedSubmissions.length} Submissions
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActions;