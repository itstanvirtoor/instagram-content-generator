# Instagram Content Generator

A professional web application for creating Instagram posts and reels from JSON data with automated template generation.

## Features

✨ **Key Features:**
- Upload JSON files with up to 24 content items
- Automatically generate Instagram posts (1080x1080px)
- Automatically generate Instagram reels/video frames (1080x1920px)
- Beautiful gradient templates with 8 color schemes
- Export individual items or all content as a ZIP file
- Drag & drop file upload
- Real-time preview

## JSON Format

```json
{
    "post_1": {
        "content": "Your main content text here",
        "caption": "Your Instagram caption with #hashtags",
        "type": "post"
    },
    "post_2": {
        "content": "Another content item",
        "caption": "Another caption",
        "type": "video"
    }
}
```

### JSON Structure Requirements:
- **content**: Main text to display on the visual (required)
- **caption**: Instagram caption text (required)
- **type**: Either "post" (for images) or "video" (for reels) (required)

## Installation & Usage

### Option 1: Direct Browser Usage
1. Open `index.html` in any modern web browser
2. No installation required!

### Option 2: Local Web Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Then open http://localhost:8000 in your browser
```

## How to Use

1. **Load Data**: 
   - Click "Load Sample JSON" to see an example
   - Or upload your own JSON file
   - Or paste JSON directly into the editor

2. **Process**: 
   - Click "Process Content" to generate Instagram-ready visuals

3. **Preview**: 
   - View all generated posts and reels
   - Each item shows the visual, and caption

4. **Export**:
   - Export individual items as PNG files
   - Or click "Export All" to download everything as a ZIP

## Technical Details

### Dependencies
- **Fabric.js** (v5.3.0): Canvas manipulation and rendering
- **JSZip** (v3.10.1): ZIP file generation for bulk exports

### Supported Formats
- **Instagram Posts**: 1080x1080px (1:1 ratio) - Standard square posts
- **Instagram Reels**: 1080x1920px (9:16 ratio) - Vertical video format

### Browser Compatibility
- Chrome (recommended)
- Firefox
- Safari
- Edge

## File Structure

```
Project/
├── index.html          # Main HTML interface
├── styles.css          # Styling and responsive design
├── templates.js        # Instagram template generator
├── app.js             # Application logic
└── README.md          # This file
```

## Customization

### Adding New Color Schemes
Edit the `colorSchemes` array in `templates.js`:

```javascript
colorSchemes: [
    { bg: '#667eea', accent: '#764ba2', text: '#ffffff' },
    // Add your custom colors here
]
```

### Modifying Templates
Customize the template generation in `templates.js`:
- `createPostCanvas()`: Modify post design
- `createReelCanvas()`: Modify reel design
- `addDecorativeElements()`: Change visual elements

## Limitations

- Maximum 24 content items per upload
- Generates static frames for videos (not actual video files)

## Future Enhancements

- [ ] Video generation
- [ ] Custom font selection
- [ ] Image upload for backgrounds
- [ ] Animation effects for reels
- [ ] Direct Instagram API integration
- [ ] More template styles

## License

This project is open source and available for personal and commercial use.

## Support

For issues or questions, please create an issue in the project repository.

---

**Created with ❤️ for content creators and social media managers**
