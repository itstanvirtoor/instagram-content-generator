import React, { useRef, useCallback, useState } from 'react';
import './UploadSection.css';

const UploadSection = ({ 
  jsonText, 
  onJsonTextChange, 
  onLoadSample, 
  onProcess, 
  isProcessing,
  showNotification,
  onClearAll,
  hasProcessSection
}) => {
  const fileInputRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const handleFileUpload = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files[0];
    if (file) {
      // If there's already a file, clear everything first
      if (uploadedFile) {
        onClearAll();
      }
      validateAndSetFile(file);
    }
    
    event.target.value = '';
  }, [uploadedFile, onClearAll]);

  const validateAndSetFile = useCallback((file) => {
    if (!file.type.includes('json') && !file.name.endsWith('.json')) {
      showNotification('Please upload a valid JSON file', 'error');
      return;
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      showNotification('File too large. Maximum size is 5MB', 'error');
      return;
    }
    
    setUploadedFile(file);
    showNotification('File selected! Click "Load File Data" to load the JSON.', 'success');
  }, [showNotification]);

  const loadFileData = useCallback(() => {
    if (!uploadedFile) {
      showNotification('No file selected. Please upload a file first.', 'error');
      return;
    }

    const reader = new FileReader();
    
    reader.onerror = () => {
      showNotification('Error reading file. Please try again.', 'error');
    };
    
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        JSON.parse(content); // Validate JSON
        onJsonTextChange(content);
        showNotification('JSON file loaded successfully!', 'success');
      } catch (error) {
        showNotification(`Invalid JSON file: ${error.message}`, 'error');
      }
    };
    
    reader.readAsText(uploadedFile);
  }, [uploadedFile, onJsonTextChange, showNotification]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length === 0) {
      showNotification('No file selected', 'error');
      return;
    }
    
    // If there's already a file, clear everything first
    if (uploadedFile) {
      onClearAll();
    }
    validateAndSetFile(files[0]);
  }, [uploadedFile, validateAndSetFile, showNotification, onClearAll]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    onClearAll();
    showNotification('File removed and data cleared', 'success');
  }, [onClearAll, showNotification]);

  return (
    <section className={`upload-section ${hasProcessSection ? 'has-process-section' : ''}`}>
      <div className="upload-card">
        <h2>Upload JSON File</h2>
        <div 
          className={`upload-area ${uploadedFile ? 'has-file' : ''}`}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploadedFile ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              <p className="file-name">{uploadedFile.name}</p>
              <p className="file-size">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <p>Drag & drop your JSON file here or click to browse</p>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef}
            accept=".json" 
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
        </div>
        <div className="button-group">
          <button 
            className="btn btn-primary-action" 
            onClick={loadFileData}
            disabled={!uploadedFile}
          >
            Load File Data
          </button>
          <button 
            className="btn btn-danger" 
            onClick={handleRemoveFile}
            disabled={!uploadedFile}
          >
            Remove File
          </button>
        </div>
      </div>

      <div className="json-editor-card">
        <h3>JSON Data</h3>
        <textarea 
          className="json-editor"
          value={jsonText}
          onChange={(e) => onJsonTextChange(e.target.value)}
          placeholder='{"post_1": {"content": "Your content here", "caption": "Your caption", "music": "song.mp3", "type": "post"}}'
        />
        <button 
          className="btn btn-primary" 
          onClick={onProcess}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <span className="loading"></span> Processing...
            </>
          ) : (
            'Process Content'
          )}
        </button>
      </div>
    </section>
  );
};

export default UploadSection;
