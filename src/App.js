import React, { useState, useCallback } from 'react';
import './App.css';
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import PreviewSection from './components/PreviewSection';
import Notification from './components/Notification';
import Footer from './components/Footer';
import { generateContentFromJSON, exportAllContent } from './utils/contentGenerator';

function App() {
  const [jsonData, setJsonData] = useState(null);
  const [jsonText, setJsonText] = useState('');
  const [generatedContent, setGeneratedContent] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notification, setNotification] = useState(null);
  const [postTemplate, setPostTemplate] = useState(null);
  const [reelTemplate, setReelTemplate] = useState(null);
  const [watermarkText, setWatermarkText] = useState('Generated with IG Creator');

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleJsonTextChange = useCallback((text) => {
    setJsonText(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSampleJSON = useCallback(() => {
    const sampleData = {
      post_1: {
        content: 'Welcome to our new product launch! 🚀',
        caption: 'Exciting news coming your way! #ProductLaunch #Innovation',
        type: 'post'
      },
      post_2: {
        content: 'Check out our latest video tutorial',
        caption: 'Learn something new today! 📚 #Tutorial #Learning',
        type: 'video',
        duration: 20
      },
      post_3: {
        content: 'Special offer: 50% OFF this weekend only!',
        caption: 'Don\'t miss out on this amazing deal! 🎉 #Sale #Weekend',
        type: 'post'
      },
      post_4: {
        content: 'Behind the scenes of our creative process',
        caption: 'Creating magic ✨ #BehindTheScenes #Creative',
        type: 'video',
        duration: 30
      },
      post_5: {
        content: 'Monday Motivation: You got this! 💪',
        caption: 'Start your week strong! #MondayMotivation #Success',
        type: 'post'
      },
      post_6: {
        content: 'Quick tips for productivity',
        caption: 'Work smarter, not harder 🎯 #Productivity #Tips',
        type: 'video',
        duration: 15
      }
    };
    
    setJsonText(JSON.stringify(sampleData, null, 2));
    showNotification('Sample JSON loaded!', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const processJSON = useCallback(async () => {
    if (!jsonText.trim()) {
      showNotification('Please enter or upload JSON data', 'error');
      return;
    }

    setIsProcessing(true);
    
    try {
      const parsedData = JSON.parse(jsonText);
      setJsonData(parsedData);
      
      const content = await generateContentFromJSON(parsedData, postTemplate, reelTemplate, watermarkText);
      setGeneratedContent(content);
      
      const templateMsg = (postTemplate || reelTemplate) ? ' with custom template(s)' : '';
      showNotification(`Successfully generated ${content.length} content items${templateMsg}!`, 'success');
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonText, postTemplate, reelTemplate, showNotification]);

  const handleExportAll = useCallback(async (onProgress) => {
    try {
      await exportAllContent(generatedContent, jsonData, onProgress);
      showNotification('All content exported successfully!', 'success');
    } catch (error) {
      showNotification(`Export failed: ${error.message}`, 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generatedContent, jsonData, showNotification]);

  const handleReset = useCallback(() => {
    setJsonData(null);
    setJsonText('');
    setGeneratedContent([]);
    showNotification('Reset complete', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const handleClearAll = useCallback(() => {
    setJsonData(null);
    setJsonText('');
    setGeneratedContent([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePostTemplateUpload = useCallback((templateDataUrl) => {
    setPostTemplate(templateDataUrl);
    showNotification('Post template uploaded successfully!', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const handleReelTemplateUpload = useCallback((templateDataUrl) => {
    setReelTemplate(templateDataUrl);
    showNotification('Reel template uploaded successfully!', 'success');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const handleRemovePostTemplate = useCallback(() => {
    setPostTemplate(null);
    showNotification('Post template removed', 'info');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const handleRemoveReelTemplate = useCallback(() => {
    setReelTemplate(null);
    showNotification('Reel template removed', 'info');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotification]);

  const handleWatermarkChange = useCallback((text) => {
    setWatermarkText(text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <Header />
      
      <main className="main-container">
        <UploadSection
          jsonText={jsonText}
          onJsonTextChange={handleJsonTextChange}
          onLoadSample={loadSampleJSON}
          onProcess={processJSON}
          isProcessing={isProcessing}
          showNotification={showNotification}
          onClearAll={handleClearAll}
          hasProcessSection={generatedContent.length > 0}
          postTemplate={postTemplate}
          reelTemplate={reelTemplate}
          onPostTemplateUpload={handlePostTemplateUpload}
          onReelTemplateUpload={handleReelTemplateUpload}
          onRemovePostTemplate={handleRemovePostTemplate}
          onRemoveReelTemplate={handleRemoveReelTemplate}
          watermarkText={watermarkText}
          onWatermarkChange={handleWatermarkChange}
        />

        {generatedContent.length > 0 && (
          <PreviewSection
            content={generatedContent}
            onExportAll={handleExportAll}
            onReset={handleReset}
            showNotification={showNotification}
          />
        )}
      </main>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
        />
      )}
      
      <Footer />
    </div>
  );
}

export default App;
