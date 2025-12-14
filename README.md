# Geoulah Books - Multi-Book Website

Modern, responsive website for publishing multiple Hebrew and French books.

## Features

- ✨ Modern, clean design
- 📱 Fully responsive (mobile, tablet, desktop)
- 🌐 Multi-language support (Hebrew RTL & French LTR)
- 📚 Multiple book catalog
- 🔍 SEO optimized
- ⚡ Fast, vanilla JavaScript (no frameworks)
- 🚀 Deployed on GitHub Pages

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/geoulah-books.git
cd geoulah-books
```

2. Serve locally:
```bash
# Python
python -m http.server 8000

# Or Node.js
npx http-server -p 8000

# Or PHP
php -S localhost:8000
```

3. Open http://localhost:8000

### GitHub Pages Deployment

1. Create new repository on GitHub named `geoulah-books`

2. Push code:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/geoulah-books.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Settings → Pages
   - Source: "main" branch
   - Save

4. Site live at: `https://YOUR_USERNAME.github.io/geoulah-books/`

## Adding New Books

Edit `data/books.json`:
```json
{
  "id": "new-book",
  "slug": "new-book-slug",
  "title": { "he": "שם הספר", "fr": "Titre" },
  "author": "המחבר",
  "description": { "he": "תיאור", "fr": "Description" },
  "price": 80,
  "pages": 200,
  "cover": "images/books/new-book/cover.jpg",
  "featured": false,
  "chapters": []
}
```

## Technology

- Vanilla JavaScript (ES6 modules)
- Pure CSS3 (Flexbox/Grid)
- No build step needed
- Works directly in browser

## License

All rights reserved © Geoulah Books
