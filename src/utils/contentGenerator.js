import JSZip from 'jszip';
import { InstagramTemplates } from './templates';
import { createStaticVideo } from './videoGenerator';

// Validate JSON data
const validateJSON = (data) => {
  const keys = Object.keys(data);
  
  if (keys.length === 0) {
    throw new Error('JSON data is empty');
  }
  
  if (keys.length > 24) {
    throw new Error('Maximum 24 posts allowed');
  }
  
  keys.forEach(key => {
    const item = data[key];
    if (!item.content) {
      throw new Error(`Missing 'content' in ${key}`);
    }
    if (!item.caption) {
      throw new Error(`Missing 'caption' in ${key}`);
    }
    if (!item.type || !['post', 'video'].includes(item.type)) {
      throw new Error(`Invalid or missing 'type' in ${key}. Must be 'post' or 'video'`);
    }
    // Validate duration for videos
    if (item.type === 'video' && item.duration) {
      const dur = parseInt(item.duration) || 15;
      if (isNaN(dur) || dur < 5 || dur > 90) {
        throw new Error(`Invalid 'duration' in ${key}. Must be between 5-90 seconds`);
      }
    }
  });
};

// Generate single content item
const generateSingleContent = async (key, item, index, postTemplate = null, reelTemplate = null, watermark = 'Generated with IG Creator') => {
  try {
    const template = item.type === 'post' ? postTemplate : reelTemplate;
    const canvas = item.type === 'post' 
      ? await InstagramTemplates.createPostCanvas(item.content, index, template, watermark)
      : await InstagramTemplates.createReelCanvas(item.content, index, template, watermark);
    
    // Allow browser to render
    await new Promise(resolve => setTimeout(resolve, 10));
    
    const imageData = InstagramTemplates.exportAsImage(canvas);
    
    return {
      id: key,
      type: item.type,
      content: item.content,
      caption: item.caption,
      duration: item.type === 'video' ? (parseInt(item.duration) || 15) : null,
      canvas: canvas,
      imageData: imageData
    };
  } catch (error) {
    console.error(`Error generating ${key}:`, error);
    throw new Error(`Failed to generate ${key}: ${error.message}`);
  }
};

// Generate content from JSON
export const generateContentFromJSON = async (jsonData, postTemplate = null, reelTemplate = null, watermark = 'Generated with IG Creator') => {
  validateJSON(jsonData);
  
  const generatedContent = [];
  const keys = Object.keys(jsonData);
  
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const item = jsonData[key];
    
    // Add small delay to prevent browser freeze
    if (i > 0 && i % 5 === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const contentItem = await generateSingleContent(key, item, i, postTemplate, reelTemplate, watermark);
    generatedContent.push(contentItem);
  }
  
  return generatedContent;
};

// Download blob helper
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export single content item
export const exportSingleContent = async (item, onProgress) => {
  if (item.type === 'video') {
    try {
      // Create video from static frame
      if (onProgress) onProgress('Generating video... 0%');
      
      const duration = item.duration || 15;
      const videoBlob = await createStaticVideo(
        item.canvas, 
        duration,
        (progress) => {
          if (onProgress) onProgress(`Generating video... ${Math.round(progress)}%`);
        }
      );
      
      const filename = `${item.id}_reel_${duration}s_${Date.now()}.webm`;
      downloadBlob(videoBlob, filename);
      
      if (onProgress) onProgress('Video exported successfully!');
    } catch (error) {
      console.error('Video export error:', error);
      throw new Error('Failed to export video. Try exporting as PNG frame instead.');
    }
  } else {
    // For posts, export as PNG
    const blob = await InstagramTemplates.exportAsBlob(item.canvas);
    const filename = `${item.id}_post_${Date.now()}.png`;
    downloadBlob(blob, filename);
  }
};

// Export all content as ZIP
export const exportAllContent = async (generatedContent, jsonData, onProgress) => {
  const zip = new JSZip();
  const timestamp = Date.now();
  const metadata = {};
  
  // Create separate folders for posts and videos
  const postsFolder = zip.folder('posts');
  const videosFolder = zip.folder('videos');
  
  let processed = 0;
  const total = generatedContent.length;

  for (const item of generatedContent) {
    if (onProgress) {
      onProgress(`Processing ${processed + 1}/${total}...`);
    }

    if (item.type === 'video') {
      try {
        const duration = item.duration || 15;
        const videoBlob = await createStaticVideo(item.canvas, duration);
        const filename = `${item.id}_reel_${duration}s.webm`;
        videosFolder.file(filename, videoBlob);
        
        // Add info file
        const info = `Instagram Reel: ${item.id}

Format: WebM video (${duration} seconds, static image)
Dimensions: 1080x1920 (9:16 ratio)
Caption: ${item.caption}

Note: This is a WEBM file. Instagram accepts MP4.
To convert to MP4:
1. Use online converter (e.g., CloudConvert, FreeConvert)
2. Or use FFmpeg: ffmpeg -i ${filename} -c:v libx264 output.mp4
3. Upload MP4 to Instagram Reels

Content: ${item.content}`;
        
        videosFolder.file(`${item.id}_INFO.txt`, info);
        
        metadata[item.id] = {
          filename: filename,
          type: 'video',
          format: 'WebM video (convert to MP4 for Instagram)',
          duration: `${duration} seconds convert to MP4 for Instagram)`,
          caption: item.caption,
          content: item.content,
          specifications: '1080x1920, 9:16 ratio, static image video'
        };
      } catch (error) {
        console.error(`Error generating video for ${item.id}:`, error);
        // Fallback to PNG
        const blob = await InstagramTemplates.exportAsBlob(item.canvas);
        videosFolder.file(`${item.id}_frame.png`, blob);
        metadata[item.id] = {
          filename: `${item.id}_frame.png`,
          type: 'video',
          format: 'PNG (video generation failed)',
          note: 'Use video editing software to create video',
          caption: item.caption,
          content: item.content
        };
      }
    } else {
      const blob = await InstagramTemplates.exportAsBlob(item.canvas);
      const filename = `${item.id}_post.png`;
      postsFolder.file(filename, blob);
      
      metadata[item.id] = {
        filename: filename,
        type: 'post',
        format: 'PNG Image - Ready to upload',
        caption: item.caption,
        content: item.content,
        specifications: '1080x1080, 1:1 ratio'
      };
    }
    
    processed++;
  }
  
  // Add comprehensive README
  const readme = `# Instagram Content Export

Generated on: ${new Date().toLocaleString()}
Total Items: ${generatedContent.length}

## Folder Structure

### /posts
Contains Instagram post images (1080x1080)
- Ready to upload directly to Instagram
- PNG format, optimized quality

### /videos  
Contains Instagram Reel videos (1080x1920)
- WebM video format (15 seconds each)
- Static image videos
- Convert to MP4 before uploading to Instagram

## How to Use

### Posts (Images)
1. Go to /posts folder
2. Upload PNG files directly to Instagram
3. Use the captions from metadata.json

### Reels (Videos)
1. Go to /videos folder
2. Convert WEBM to MP4:
   - Online: CloudConvert.com or FreeConvert.com
   - FFmpeg: ffmpeg -i input.webm -c:v libx264 output.mp4
3. Upload MP4 to Instagram Reels

## Video Format Details

- Format: WebM (needs conversion to MP4)
- Duration: 15 seconds
- Type: Static image video
- Dimensions: 1080x1920 (9:16)
- Instagram accepts: MP4, MOV

## Files Included

- metadata.json: Complete information about all content
- original_data.json: Your original JSON input
- README.txt: This file

## Conversion Tools

Online (Free):
- CloudConvert.com
- FreeConvert.com
- Online-Convert.com

Desktop Software:
- HandBrake (Free)
- FFmpeg (Free, Command-line)
- VLC Media Player (Free)

## Support

For questions or issues, refer to the metadata.json file for complete content details.

---
Generated with Instagram Content Generator ⚛️
`;
  
  zip.file('README.txt', readme);
  
  // Add metadata file
  zip.file('metadata.json', JSON.stringify(metadata, null, 2));
  
  // Add original JSON
  zip.file('original_data.json', JSON.stringify(jsonData, null, 2));
  
  if (onProgress) onProgress('Creating ZIP file...');
  
  // Generate and download zip
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, `instagram_content_${timestamp}.zip`);
  
  if (onProgress) onProgress('Export complete!')
}
