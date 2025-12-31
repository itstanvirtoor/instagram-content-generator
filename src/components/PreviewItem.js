import React, { useCallback, useState, useRef, useEffect } from 'react';
import './PreviewItem.css';
import { exportSingleContent } from '../utils/contentGenerator';
import { calculateMasonrySpan } from '../utils/masonryHelper';

const PreviewItem = ({ item, showNotification }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const itemRef = useRef(null);

  useEffect(() => {
    // Calculate and set grid row span for masonry layout
    const updateSpan = () => {
      if (itemRef.current) {
        const span = calculateMasonrySpan(itemRef.current);
        itemRef.current.style.gridRowEnd = `span ${span}`;
      }
    };

    // Update on mount and when images load
    updateSpan();
    const timer = setTimeout(updateSpan, 100);

    return () => clearTimeout(timer);
  }, [item]);

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      await exportSingleContent(item, (progress) => {
        setExportProgress(progress);
      });
      showNotification(`${item.id} exported successfully!`, 'success');
    } catch (error) {
      showNotification(`Export failed: ${error.message}`, 'error');
    } finally {
      setIsExporting(false);
      setExportProgress('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, showNotification]);

  return (
    <div className="preview-item" ref={itemRef}>
      <div className="preview-item-header">
        <span className="preview-item-title">{item.id}</span>
        <span className={`preview-item-type type-${item.type}`}>
          {item.type === 'post' ? '📸 Post' : '🎬 Video'}
        </span>
      </div>
      
      <div className="canvas-wrapper">
        <img src={item.imageData} alt={item.id} />
      </div>
      
      <div className="preview-details">
        <h4>Caption:</h4>
        <p>{item.caption}</p>
      </div>
      
      {item.type === 'video' && item.duration && (
        <div className="duration-info">
          ⏱️ Duration: {item.duration}s
        </div>
      )}
      
      <div className="preview-item-actions">
        <button 
          className="btn-export" 
          onClick={handleExport}
          disabled={isExporting}
        >
          {isExporting ? exportProgress : `Export ${item.type === 'post' ? 'Image' : 'Video'}`}
        </button>
      </div>
      
      {item.type === 'video' && (
        <div className="video-notice">
          📹 Exports as WebM video ({item.duration || 15}s) - Convert to MP4 for Instagram
        </div>
      )}
    </div>
  );
};

export default PreviewItem;
