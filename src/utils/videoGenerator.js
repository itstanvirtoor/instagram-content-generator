// Video Generator Utility
// Creates MP4 video from static canvas frames

export class VideoGenerator {
  constructor(canvas, duration = 15) {
    this.canvas = canvas;
    this.duration = duration; // seconds
    this.fps = 30;
  }

  async generateVideo() {
    try {
      // Create a temporary canvas for video recording
      const videoCanvas = document.createElement('canvas');
      videoCanvas.width = this.canvas.width;
      videoCanvas.height = this.canvas.height;
      const ctx = videoCanvas.getContext('2d');

      // Get the static image from the original canvas
      const staticImage = await this.loadImage(this.canvas.toDataURL());

      // Setup MediaRecorder
      const stream = videoCanvas.captureStream(this.fps);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
        videoBitsPerSecond: 5000000 // 5 Mbps for good quality
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      return new Promise((resolve, reject) => {
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'video/webm' });
          resolve(blob);
        };

        mediaRecorder.onerror = (error) => {
          reject(error);
        };

        // Start recording
        mediaRecorder.start();

        // Draw static frame repeatedly
        const totalFrames = this.duration * this.fps;
        let frameCount = 0;

        const drawFrame = () => {
          if (frameCount >= totalFrames) {
            mediaRecorder.stop();
            return;
          }

          // Draw the static image
          ctx.drawImage(staticImage, 0, 0, videoCanvas.width, videoCanvas.height);
          
          frameCount++;
          requestAnimationFrame(drawFrame);
        };

        drawFrame();
      });
    } catch (error) {
      console.error('Video generation error:', error);
      throw new Error('Failed to generate video: ' + error.message);
    }
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }
}

// Alternative: Create video using canvas animation
export const createStaticVideo = async (canvas, duration = 15, showProgress) => {
  const videoCanvas = document.createElement('canvas');
  videoCanvas.width = canvas.width;
  videoCanvas.height = canvas.height;
  const ctx = videoCanvas.getContext('2d');

  // Draw the canvas content once
  ctx.drawImage(canvas.lowerCanvasEl, 0, 0);

  const stream = videoCanvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm',
    videoBitsPerSecond: 5000000
  });

  const chunks = [];
  
  mediaRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      chunks.push(e.data);
    }
  };

  return new Promise((resolve, reject) => {
    let startTime;
    let animationId;

    mediaRecorder.onstop = () => {
      cancelAnimationFrame(animationId);
      const blob = new Blob(chunks, { type: 'video/webm' });
      resolve(blob);
    };

    mediaRecorder.onerror = (error) => {
      cancelAnimationFrame(animationId);
      reject(error);
    };

    mediaRecorder.start();
    startTime = Date.now();

    // Keep the stream active by continuously drawing (even though content doesn't change)
    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      
      if (showProgress) {
        showProgress(Math.min((elapsed / duration) * 100, 100));
      }

      if (elapsed >= duration) {
        mediaRecorder.stop();
        return;
      }

      // Redraw to keep stream active
      ctx.drawImage(canvas.lowerCanvasEl, 0, 0);
      animationId = requestAnimationFrame(animate);
    };

    animate();
  });
};
