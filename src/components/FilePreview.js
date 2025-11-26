import React, { useState } from 'react';

const FilePreview = ({ file, onRemove }) => {
  const [preview, setPreview] = useState(null);

  React.useEffect(() => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  }, [file]);

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('text')) return '📝';
    return '📎';
  };

  return (
    <div style={{ 
      border: '2px dashed var(--border)', 
      borderRadius: '8px', 
      padding: '1rem', 
      margin: '0.5rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      {preview ? (
        <img src={preview} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
      ) : (
        <div style={{ fontSize: '2rem' }}>{getFileIcon(file.type)}</div>
      )}
      
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: '600' }}>{file.name}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
          {(file.size / 1024 / 1024).toFixed(2)} MB
        </div>
      </div>
      
      {onRemove && (
        <button 
          onClick={() => onRemove(file)}
          style={{ 
            background: 'var(--danger)', 
            color: 'white', 
            border: 'none', 
            borderRadius: '50%', 
            width: '30px', 
            height: '30px',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default FilePreview;