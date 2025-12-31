import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>📸 IG Content Generator</h3>
          <p>Transform your ideas into Instagram-ready content</p>
        </div>
        
        <div className="footer-section">
          <h4>Features</h4>
          <ul>
            <li>Instagram Posts (1080x1080)</li>
            <li>Instagram Reels (1080x1920)</li>
            <li>Batch Processing</li>
            <li>ZIP Export</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li>Max 24 posts per upload</li>
            <li>JSON format required</li>
            <li>Max file size: 5MB</li>
            <li>PNG export format</li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Tech Stack</h4>
          <ul>
            <li>React 18.2</li>
            <li>Fabric.js 5.3</li>
            <li>JSZip 3.10</li>
            <li>Modern CSS</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {currentYear} Instagram Content Generator. Built with ⚛️ React</p>
        <p className="footer-tagline">Empowering content creators worldwide 🌍</p>
      </div>
    </footer>
  );
};

export default Footer;
