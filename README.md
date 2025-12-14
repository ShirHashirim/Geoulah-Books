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

## Project Structure

```
geoulah-books/
├── index.html              # Homepage with book catalog
├── book.html              # Individual book details page
├── chapter.html           # Chapter reading page
├── about.html             # About page
├── contact.html           # Contact page
├── data/
│   └── books.json         # Book data configuration
├── js/
│   ├── main.js           # Core app logic
│   ├── bookCatalog.js    # Book catalog component
│   ├── bookDetails.js    # Book details page logic
│   └── chapterView.js    # Chapter viewer
├── css/
│   └── style.css         # Main stylesheet
├── images/
│   ├── books/            # Book covers and images
│   │   ├── miataisrael/
│   │   └── [other-books]/
│   └── site/             # Site assets (logo, icons)
└── content/
    ├── miataisrael/      # Book chapter content
    │   ├── mavo.html
    │   ├── tanakh.html
    │   └── ...
    └── [other-books]/
```

## Quick Start

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/geoulah-books.git
cd geoulah-books
```

2. Serve locally (choose one):

**Option A: Python**
```bash
python -m http.server 8000
```

**Option B: Node.js (http-server)**
```bash
npx http-server -p 8000
```

**Option C: PHP**
```bash
php -S localhost:8000
```

3. Open http://localhost:8000 in your browser

### GitHub Pages Deployment

1. Push to GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "main" branch
   - Click "Save"

3. Your site will be live at:
   `https://YOUR_USERNAME.github.io/geoulah-books/`

## Adding New Books

1. Add book cover image to `images/books/[book-slug]/cover.jpg`

2. Create content directory: `content/[book-slug]/`

3. Add book to `data/books.json`:
```json
{
  "id": "new-book-id",
  "slug": "new-book-slug",
  "title": {
    "he": "שם הספר בעברית",
    "fr": "Nom du livre en français"
  },
  "author": "שם המחבר",
  "description": {
    "he": "תיאור הספר...",
    "fr": "Description..."
  },
  "price": 80,
  "currency": "ILS",
  "pages": 200,
  "cover": "images/books/new-book-slug/cover.jpg",
  "featured": false,
  "status": "available",
  "chapters": []
}
```

4. Push changes and GitHub Pages will auto-update!

## Configuration

### Language Support
- Default language: Hebrew (RTL)
- Language switcher in header
- Preference stored in localStorage
- URL parameter: `?lang=fr` or `?lang=he`

### Book Status
- `available` - Ready for purchase
- `coming_soon` - Pre-order/announcement
- `out_of_stock` - Temporarily unavailable

## Technology Stack

- **Frontend**: Vanilla JavaScript (ES6+ modules)
- **Styling**: Pure CSS3 with Flexbox/Grid
- **Fonts**: Google Fonts (Heebo for Hebrew, Inter for Latin)
- **Deployment**: GitHub Pages
- **No build step required** - works directly in browser

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

All rights reserved © Geoulah Books

## Contact

For questions or support, visit the contact page or email: books@geulah.org.il
