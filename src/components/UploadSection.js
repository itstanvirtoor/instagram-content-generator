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
  hasProcessSection,
  postTemplate,
  reelTemplate,
  onPostTemplateUpload,
  onReelTemplateUpload,
  onRemovePostTemplate,
  onRemoveReelTemplate,
  watermarkText,
  onWatermarkChange
}) => {
  const fileInputRef = useRef(null);
  const postTemplateInputRef = useRef(null);
  const reelTemplateInputRef = useRef(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile, onJsonTextChange, showNotification]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('drag-over');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('drag-over');
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadedFile, validateAndSetFile, showNotification, onClearAll]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveFile = useCallback(() => {
    setUploadedFile(null);
    onClearAll();
    showNotification('File removed and data cleared', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onClearAll, showNotification]);

  const validateImageAspectRatio = useCallback((file, requiredRatio, templateType, onSuccess) => {
    const reader = new FileReader();
    
    reader.onerror = () => {
      showNotification('Error reading image. Please try again.', 'error');
    };
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onerror = () => {
        showNotification('Invalid image file. Please upload a valid image.', 'error');
      };
      
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        const tolerance = 0.05; // 5% tolerance
        
        if (Math.abs(aspectRatio - requiredRatio) > tolerance) {
          const ratioText = requiredRatio === 1 ? '1:1 (square)' : '9:16 (vertical)';
          const actualRatioText = aspectRatio.toFixed(2);
          showNotification(
            `Invalid aspect ratio for ${templateType}! Required: ${ratioText}. Your image: ${actualRatioText}:1. Please upload a different image.`,
            'error'
          );
          return;
        }
        
        onSuccess(e.target.result);
      };
      
      img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const handlePostTemplateUpload = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('Please upload a valid image file (PNG, JPG, etc.)', 'error');
        return;
      }
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showNotification('Image too large. Maximum size is 10MB', 'error');
        return;
      }
      
      validateImageAspectRatio(file, 1, 'Post Template (1:1)', onPostTemplateUpload);
    }
    
    event.target.value = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification, validateImageAspectRatio, onPostTemplateUpload]);

  const handleReelTemplateUpload = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        showNotification('Please upload a valid image file (PNG, JPG, etc.)', 'error');
        return;
      }
      
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        showNotification('Image too large. Maximum size is 10MB', 'error');
        return;
      }
      
      validateImageAspectRatio(file, 9/16, 'Reel Template (9:16)', onReelTemplateUpload);
    }
    
    event.target.value = '';
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification, validateImageAspectRatio, onReelTemplateUpload]);

  const handlePostTemplateClick = useCallback(() => {
    postTemplateInputRef.current?.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReelTemplateClick = useCallback(() => {
    reelTemplateInputRef.current?.click();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
          placeholder='{"post_1": {"content": "Your content here", "caption": "Your caption", "type": "post"}}'
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

      <div className="upload-card template-card">
        <h2>Post Template - 1:1 Square (Optional)</h2>
        <div 
          className={`upload-area template-area ${postTemplate ? 'has-template' : ''}`}
          onClick={handlePostTemplateClick}
        >
          {postTemplate ? (
            <>
              <img src={postTemplate} alt="Post Template" className="template-preview" />
              <p className="template-status">📸 Post Template Ready (1:1)</p>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>Upload square image template for posts (1:1 ratio)</p>
              <p className="template-hint">1080x1080 or similar square dimensions (max 10MB)</p>
            </>
          )}
          <input 
            type="file" 
            ref={postTemplateInputRef}
            accept="image/*" 
            onChange={handlePostTemplateUpload}
            style={{ display: 'none' }}
          />
        </div>
        {postTemplate && (
          <div className="button-group">
            <button 
              className="btn btn-secondary" 
              onClick={onRemovePostTemplate}
            >
              Remove Post Template
            </button>
          </div>
        )}
      </div>

      <div className="upload-card template-card">
        <h2>Reel Template - 9:16 Vertical (Optional)</h2>
        <div 
          className={`upload-area template-area ${reelTemplate ? 'has-template' : ''}`}
          onClick={handleReelTemplateClick}
        >
          {reelTemplate ? (
            <>
              <img src={reelTemplate} alt="Reel Template" className="template-preview reel-preview" />
              <p className="template-status">🎬 Reel Template Ready (9:16)</p>
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>Upload vertical image template for reels (9:16 ratio)</p>
              <p className="template-hint">1080x1920 or similar vertical dimensions (max 10MB)</p>
            </>
          )}
          <input 
            type="file" 
            ref={reelTemplateInputRef}
            accept="image/*" 
            onChange={handleReelTemplateUpload}
            style={{ display: 'none' }}
          />
        </div>
        {reelTemplate && (
          <div className="button-group">
            <button 
              className="btn btn-secondary" 
              onClick={onRemoveReelTemplate}
            >
              Remove Reel Template
            </button>
          </div>
        )}
      </div>
      
      <div className="upload-card watermark-card">
        <h3>Custom Watermark Text</h3>
        <input 
          type="text"
          className="watermark-input"
          value={watermarkText}
          onChange={(e) => onWatermarkChange(e.target.value)}
          placeholder="Enter your custom watermark text"
          maxLength={50}
        />
        <p className="watermark-hint">This text will appear at the bottom of all generated posts and reels</p>
      </div>
    </section>
  );
};

export default UploadSection;
