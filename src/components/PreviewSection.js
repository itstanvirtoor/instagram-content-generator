import React, { useState } from 'react';
import './PreviewSection.css';
import PreviewItem from './PreviewItem';

const PreviewSection = ({ content, onExportAll, onReset, showNotification }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState('');

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      await onExportAll((status) => {
        setExportStatus(status);
      });
    } finally {
      setIsExporting(false);
      setExportStatus('');
    }
  };

  return (
    <section className="preview-section">
      <div className="preview-header">
        <h2>Generated Content ({content.length})</h2>
        <div className="preview-controls">
          <button 
            className="btn btn-success" 
            onClick={handleExportAll}
            disabled={isExporting}
            title="Download all content as ZIP"
          >
            {isExporting ? (
              <>⏳ {exportStatus}</>
            ) : (
              <>⬇ Export All</>
            )}
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={onReset}
            title="Clear all content and start over"
          >
            ↺ Reset
          </button>
        </div>
      </div>
      
      <div className="preview-grid">
        {content.map((item) => (
          <PreviewItem 
            key={item.id} 
            item={item}
            showNotification={showNotification}
          />
        ))}
      </div>
    </section>
  );
};

export default PreviewSection;
