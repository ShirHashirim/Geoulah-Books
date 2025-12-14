# Quick Start Guide

## 🚀 Deploy to GitHub Pages in 5 Minutes

### Prerequisites
- GitHub account
- Git installed on your computer

### Steps

1. **Download/Clone this project**
   ```bash
   # You already have the files in geoulah-books/
   cd geoulah-books
   ```

2. **Add your book cover image**
   ```bash
   # Replace this placeholder with your actual book cover
   # File: images/books/miataisrael/cover.jpg
   # Recommended size: 600x900 pixels (2:3 ratio)
   ```

3. **Initialize Git and push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/geoulah-books.git
   git push -u origin main
   ```

4. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Source: main branch, / (root)
   - Save
   - Wait 2-3 minutes

5. **Done!** Visit: `https://YOUR_USERNAME.github.io/geoulah-books/`

## 📝 First Customizations

### 1. Update Book Information
Edit `data/books.json` with your book details.

### 2. Add Chapter Content
Replace sample content in `content/miataisrael/*.html` with actual chapters.

### 3. Customize Styling
Edit `css/style.css` to change colors, fonts, etc.

### 4. Update Contact Info
Edit `contact.html` and `purchase.html` with your actual contact details.

## 🎨 Color Customization

In `css/style.css`, change the color variables:
```css
:root {
  --primary-color: #667eea;  /* Main brand color */
  --secondary-color: #764ba2; /* Accent color */
  --accent-color: #f6ad55;   /* Button highlights */
}
```

## 📱 Test Locally

```bash
# Simple Python server
python -m http.server 8000

# Then open: http://localhost:8000
```

## Need Help?

See full `DEPLOYMENT.md` for detailed instructions and troubleshooting.

---

**Happy Publishing!** 📚
