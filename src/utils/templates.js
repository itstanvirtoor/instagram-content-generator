import { fabric } from 'fabric';

// Instagram Templates Configuration
export const InstagramTemplates = {
    // Standard Instagram post size: 1080x1080px (1:1 ratio)
    POST_WIDTH: 1080,
    POST_HEIGHT: 1080,
    
    // Instagram reel size: 1080x1920px (9:16 ratio)
    REEL_WIDTH: 1080,
    REEL_HEIGHT: 1920,
    
    // Color schemes for templates
    colorSchemes: [
        { bg: '#667eea', accent: '#764ba2', text: '#ffffff' },
        { bg: '#f093fb', accent: '#f5576c', text: '#ffffff' },
        { bg: '#4facfe', accent: '#00f2fe', text: '#ffffff' },
        { bg: '#43e97b', accent: '#38f9d7', text: '#ffffff' },
        { bg: '#fa709a', accent: '#fee140', text: '#ffffff' },
        { bg: '#30cfd0', accent: '#330867', text: '#ffffff' },
        { bg: '#a8edea', accent: '#fed6e3', text: '#333333' },
        { bg: '#ff9a9e', accent: '#fecfef', text: '#ffffff' },
    ],
    
    // Generate Instagram Post Template
    createPostCanvas(content, colorIndex = 0, customTemplate = null, watermark = 'Generated with IG Creator') {
        const canvas = new fabric.Canvas(null, {
            width: this.POST_WIDTH,
            height: this.POST_HEIGHT,
            backgroundColor: '#ffffff'
        });
        
        const colors = this.colorSchemes[colorIndex % this.colorSchemes.length];
        
        // If custom template provided, use it as background
        if (customTemplate) {
            return new Promise((resolve) => {
                fabric.Image.fromURL(customTemplate, (img) => {
                    img.scaleToWidth(this.POST_WIDTH);
                    img.scaleToHeight(this.POST_HEIGHT);
                    img.set({
                        left: 0,
                        top: 0,
                        selectable: false
                    });
                    canvas.add(img);
                    
                    // Add content text on top
                    this.addContentText(canvas, content, colors, this.POST_WIDTH, this.POST_HEIGHT);
                    this.addWatermark(canvas, colors, this.POST_WIDTH, this.POST_HEIGHT, watermark);
                    
                    canvas.renderAll();
                    resolve(canvas);
                }, { crossOrigin: 'anonymous' });
            });
        }
        
        // Background gradient
        const gradient = new fabric.Gradient({
            type: 'linear',
            coords: {
                x1: 0,
                y1: 0,
                x2: this.POST_WIDTH,
                y2: this.POST_HEIGHT
            },
            colorStops: [
                { offset: 0, color: colors.bg },
                { offset: 1, color: colors.accent }
            ]
        });
        
        const background = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.POST_WIDTH,
            height: this.POST_HEIGHT,
            fill: gradient
        });
        
        canvas.add(background);
        
        // Add decorative elements
        this.addDecorativeElements(canvas, colors);
        
        // Add content text
        const contentText = new fabric.Textbox(content, {
            left: this.POST_WIDTH / 2,
            top: this.POST_HEIGHT / 2,
            width: this.POST_WIDTH * 0.8,
            fontSize: 60,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: colors.text,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            shadow: new fabric.Shadow({
                color: 'rgba(0,0,0,0.3)',
                blur: 10,
                offsetX: 0,
                offsetY: 4
            })
        });
        
        canvas.add(contentText);
        
        // Add branding watermark
        this.addWatermark(canvas, colors, this.POST_WIDTH, this.POST_HEIGHT - 50, watermark);
        
        return canvas;
    },
    
    // Generate Instagram Reel/Video Template
    createReelCanvas(content, colorIndex = 0, customTemplate = null, watermark = 'Generated with IG Creator') {
        const canvas = new fabric.Canvas(null, {
            width: this.REEL_WIDTH,
            height: this.REEL_HEIGHT,
            backgroundColor: '#000000'
        });
        
        const colors = this.colorSchemes[colorIndex % this.colorSchemes.length];
        
        // If custom template provided, use it as background
        if (customTemplate) {
            return new Promise((resolve) => {
                fabric.Image.fromURL(customTemplate, (img) => {
                    img.scaleToWidth(this.REEL_WIDTH);
                    img.scaleToHeight(this.REEL_HEIGHT);
                    img.set({
                        left: 0,
                        top: 0,
                        selectable: false
                    });
                    canvas.add(img);
                    
                    // Add content text on top
                    this.addContentText(canvas, content, colors, this.REEL_WIDTH, this.REEL_HEIGHT);
                    // this.addPlayButton(canvas, colors);
                    this.addWatermark(canvas, colors, this.REEL_WIDTH, this.REEL_HEIGHT - 80, watermark);
                    
                    canvas.renderAll();
                    resolve(canvas);
                }, { crossOrigin: 'anonymous' });
            });
        }
        
        // Background gradient
        const gradient = new fabric.Gradient({
            type: 'linear',
            coords: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: this.REEL_HEIGHT
            },
            colorStops: [
                { offset: 0, color: colors.bg },
                { offset: 1, color: colors.accent }
            ]
        });
        
        const background = new fabric.Rect({
            left: 0,
            top: 0,
            width: this.REEL_WIDTH,
            height: this.REEL_HEIGHT,
            fill: gradient
        });
        
        canvas.add(background);
        
        // Add decorative elements for reel
        this.addReelDecorativeElements(canvas, colors);
        
        // Add content text
        const contentText = new fabric.Textbox(content, {
            left: this.REEL_WIDTH / 2,
            top: this.REEL_HEIGHT / 2,
            width: this.REEL_WIDTH * 0.85,
            fontSize: 70,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: colors.text,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            shadow: new fabric.Shadow({
                color: 'rgba(0,0,0,0.4)',
                blur: 15,
                offsetX: 0,
                offsetY: 5
            })
        });
        
        canvas.add(contentText);
        
        // Add play button overlay
        this.addPlayButton(canvas, colors);
        
        // Add branding watermark
        this.addWatermark(canvas, colors, this.REEL_WIDTH, this.REEL_HEIGHT - 80, watermark);
        
        return canvas;
    },
    
    // Add decorative elements to post
    addDecorativeElements(canvas, colors) {
        const circle1 = new fabric.Circle({
            left: 100,
            top: 100,
            radius: 80,
            fill: 'transparent',
            stroke: colors.text,
            strokeWidth: 3,
            opacity: 0.3
        });
        
        const circle2 = new fabric.Circle({
            left: this.POST_WIDTH - 180,
            top: this.POST_HEIGHT - 180,
            radius: 100,
            fill: colors.text,
            opacity: 0.1
        });
        
        canvas.add(circle1, circle2);
    },
    
    // Add decorative elements to reel
    addReelDecorativeElements(canvas, colors) {
        const accent1 = new fabric.Rect({
            left: 0,
            top: 0,
            width: 200,
            height: 10,
            fill: colors.text,
            opacity: 0.3
        });
        
        const accent2 = new fabric.Rect({
            left: this.REEL_WIDTH - 200,
            top: this.REEL_HEIGHT - 10,
            width: 200,
            height: 10,
            fill: colors.text,
            opacity: 0.3
        });
        
        canvas.add(accent1, accent2);
    },
    
    // Add play button for reels
    addPlayButton(canvas, colors) {
        const playCircle = new fabric.Circle({
            left: this.REEL_WIDTH / 2,
            top: this.REEL_HEIGHT - 200,
            radius: 50,
            fill: 'rgba(255, 255, 255, 0.2)',
            stroke: colors.text,
            strokeWidth: 3,
            originX: 'center',
            originY: 'center'
        });
        
        const playTriangle = new fabric.Triangle({
            left: this.REEL_WIDTH / 2 + 5,
            top: this.REEL_HEIGHT - 200,
            width: 30,
            height: 35,
            fill: colors.text,
            originX: 'center',
            originY: 'center',
            angle: 90
        });
        
        canvas.add(playCircle, playTriangle);
    },
    
    // Helper method to add content text
    addContentText(canvas, content, colors, width, height) {
        const contentText = new fabric.Textbox(content, {
            left: width / 2,
            top: height / 2,
            width: width * 0.8,
            fontSize: width === this.POST_WIDTH ? 60 : 70,
            fontFamily: 'Arial, sans-serif',
            fontWeight: 'bold',
            fill: colors.text,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            shadow: new fabric.Shadow({
                color: 'rgba(0,0,0,0.5)',
                blur: 20,
                offsetX: 0,
                offsetY: 5
            })
        });
        
        canvas.add(contentText);
    },
    
    // Helper method to add watermark
    addWatermark(canvas, colors, width, top, customWatermark = 'Generated with IG Creator') {
        const watermark = new fabric.Text(customWatermark, {
            left: width / 2,
            top: top,
            fontSize: width === this.POST_WIDTH ? 20 : 24,
            fontFamily: 'Arial, sans-serif',
            fill: colors.text,
            opacity: 0.6,
            originX: 'center',
            originY: 'center'
        });
        
        canvas.add(watermark);
    },
    
    // Export canvas as image
    exportAsImage(canvas, format = 'png') {
        return canvas.toDataURL({
            format: format,
            quality: 1,
            multiplier: 1
        });
    },
    
    // Export canvas as blob for download
    async exportAsBlob(canvas, format = 'png') {
        return new Promise((resolve) => {
            canvas.toCanvasElement().toBlob((blob) => {
                resolve(blob);
            }, `image/${format}`, 1);
        });
    }
};
