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

  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  }, []);

  const handleJsonTextChange = useCallback((text) => {
    setJsonText(text);
  }, []);

  const loadSampleJSON = useCallback(() => {
    const sampleData = {
      post_1: {
        content: 'Welcome to our new product launch! 🚀',
        caption: 'Exciting news coming your way! #ProductLaunch #Innovation',
        music: 'upbeat-intro.mp3',
        type: 'post'
      },
      post_2: {
        content: 'Check out our latest video tutorial',
        caption: 'Learn something new today! 📚 #Tutorial #Learning',
        music: 'background-music.mp3',
        type: 'video',
        duration: 20
      },
      post_3: {
        content: 'Special offer: 50% OFF this weekend only!',
        caption: 'Don\'t miss out on this amazing deal! 🎉 #Sale #Weekend',
        music: 'energetic-beat.mp3',
        type: 'post'
      },
      post_4: {
        content: 'Behind the scenes of our creative process',
        caption: 'Creating magic ✨ #BehindTheScenes #Creative',
        music: 'chill-vibes.mp3',
        type: 'video',
        duration: 30
      },
      post_5: {
        content: 'Monday Motivation: You got this! 💪',
        caption: 'Start your week strong! #MondayMotivation #Success',
        music: 'motivational.mp3',
        type: 'post'
      },
      post_6: {
        content: 'Quick tips for productivity',
        caption: 'Work smarter, not harder 🎯 #Productivity #Tips',
        music: 'focus-music.mp3',
        type: 'video',
        duration: 15
      }
    };
    
    setJsonText(JSON.stringify(sampleData, null, 2));
    showNotification('Sample JSON loaded!', 'success');
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
      
      const content = await generateContentFromJSON(parsedData);
      setGeneratedContent(content);
      
      showNotification(`Successfully generated ${content.length} content items!`, 'success');
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [jsonText, showNotification]);

  const handleExportAll = useCallback(async (onProgress) => {
    try {
      await exportAllContent(generatedContent, jsonData, onProgress);
      showNotification('All content exported successfully!', 'success');
    } catch (error) {
      showNotification(`Export failed: ${error.message}`, 'error');
    }
  }, [generatedContent, jsonData, showNotification]);

  const handleReset = useCallback(() => {
    setJsonData(null);
    setJsonText('');
    setGeneratedContent([]);
    showNotification('Reset complete', 'success');
  }, [showNotification]);

  const handleClearAll = useCallback(() => {
    setJsonData(null);
    setJsonText('');
    setGeneratedContent([]);
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
