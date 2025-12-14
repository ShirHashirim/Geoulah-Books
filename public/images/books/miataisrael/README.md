# Book Cover Image

## Current Status
This directory contains a placeholder SVG image for the book cover.

## Replacing the Cover

1. **Prepare your image:**
   - Format: JPG or PNG
   - Recommended size: 600x900 pixels (2:3 ratio)
   - File size: Under 500KB (optimize for web)

2. **Replace the file:**
   ```bash
   # Replace cover.svg with your actual cover image
   # Rename your file to: cover.jpg or cover.png
   ```

3. **Update books.json:**
   Edit `data/books.json` and change:
   ```json
   "cover": "images/books/miataisrael/cover.jpg"
   ```
   or
   ```json
   "cover": "images/books/miataisrael/cover.png"
   ```

4. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update book cover image"
   git push
   ```

## Image Optimization Tips

- Use tools like TinyPNG or ImageOptim to compress
- Maintain aspect ratio (2:3 for book covers)
- Use web-optimized formats (JPG for photos, PNG for graphics)

## Alternative: Keep SVG

The SVG placeholder will work fine if you don't have a cover image yet. Just update the text and colors in the SVG file to match your needs.
