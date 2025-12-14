# Geoulah Books - Complete Multi-Book Website
## Modern Vanilla JavaScript Implementation

### 📦 What's Included

Your complete website is ready! Here's what you get:

**Core Files:**
- `index.html` - Homepage with book catalog
- `book.html` - Individual book details page
- `chapter.html` - Chapter reading page

**JavaScript (Vanilla ES6):**
- `js/main.js` - Core BookStore class & language handling
- `js/bookCatalog.js` - Homepage book grid
- `js/bookDetails.js` - Book detail pages
- `js/chapterView.js` - Chapter navigation & display

**Styling:**
- `css/style.css` - Complete responsive CSS with RTL support
- Modern gradient design
- Mobile-responsive
- Hebrew & French language support

**Data & Content:**
- `data/books.json` - All book data (easily editable)
- `content/miataisrael/` - Sample chapter content
- `content/book2/` - Placeholder for second book

**Deployment Tools:**
- `deploy.sh` - One-click deployment for Mac/Linux
- `deploy.bat` - One-click deployment for Windows
- `QUICKSTART.md` - 5-minute setup guide
- `DEPLOYMENT.md` - Comprehensive deployment guide
- `README.md` - Full documentation

### 🚀 Three Ways to Deploy

#### Option 1: GitHub Pages (Recommended - Free!)

**Using the automated script:**

Mac/Linux:
```bash
cd geoulah-books
./deploy.sh
```

Windows:
```cmd
cd geoulah-books
deploy.bat
```

Then enable GitHub Pages in repository settings.

**Manual deployment:**
```bash
cd geoulah-books
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/geoulah-books.git
git push -u origin main
```

Go to Settings > Pages, select "main" branch, Save.

Your site: `https://YOUR-USERNAME.github.io/geoulah-books/`

#### Option 2: Your Existing Server (geoulah.org.il)

Upload via FTP/SFTP to your subdomain:
```
books.geoulah.org.il/
├── index.html
├── book.html
├── chapter.html
├── data/
├── js/
├── css/
├── images/
└── content/
```

Or use git on your server:
```bash
cd /var/www/html
git clone https://github.com/YOUR-USERNAME/geoulah-books.git
```

#### Option 3: Docker (Like Your Teamim Project)

Create `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy:
```bash
docker build -t geoulah-books .
docker run -d -p 80:80 geoulah-books
```

### 📝 Managing Content

#### Add a New Book

1. **Edit `data/books.json`:**
```json
{
  "id": "thirdbook",
  "slug": "third-book",
  "title": {
    "he": "ספר שלישי",
    "fr": "Troisième livre"
  },
  "author": "מחבר",
  "description": {
    "he": "תיאור הספר...",
    "fr": "Description..."
  },
  "price": 85,
  "pages": 300,
  "cover": "images/books/thirdbook/cover.jpg",
  "featured": false,
  "status": "available",
  "chapters": [
    {
      "id": "chapter1",
      "title": {"he": "פרק ראשון", "fr": "Premier chapitre"},
      "slug": "chapter1",
      "contentFile": "content/thirdbook/chapter1.html"
    }
  ]
}
```

2. **Add book cover:**
   - Place image at: `images/books/thirdbook/cover.jpg`
   - Recommended size: 300x450 pixels

3. **Create content:**
   - Create directory: `content/thirdbook/`
   - Add chapter files: `chapter1.html`, `chapter2.html`, etc.

4. **Deploy:**
```bash
git add .
git commit -m "Added new book"
git push
```

#### Update Chapter Content

Simply edit the HTML file in `content/[book-slug]/[chapter].html`:

```html
<h2>Chapter Title</h2>
<p>Chapter content...</p>

<h3>Subsection</h3>
<p>More content...</p>

<blockquote>
    <p>Important quote...</p>
</blockquote>
```

Save, commit, and push!

### 🎨 Customization

#### Change Colors

Edit `css/style.css`:
```css
:root {
  --primary-color: #2c5aa0;     /* Your blue */
  --secondary-color: #7b68ee;   /* Your purple */
  --accent-color: #d4af37;      /* Your gold */
}
```

#### Change Fonts

Add Hebrew fonts (recommended: Heebo, Rubik, Varela Round):

In HTML `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;600;700&display=swap" rel="stylesheet">
```

In CSS:
```css
body.lang-he {
  font-family: 'Heebo', 'Arial Hebrew', Arial, sans-serif;
}
```

### 🌍 Multi-Language Support

The site automatically handles Hebrew (RTL) and French (LTR).

**How it works:**
- URL parameter: `?lang=fr` switches to French
- Stored in localStorage for persistence
- Auto-detects direction (RTL/LTR)

**Adding translations:**
Update `title` and `description` in books.json:
```json
"title": {
  "he": "כותרת בעברית",
  "fr": "Titre en français"
}
```

### 📱 Mobile Support

The site is fully responsive:
- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: 3-column grid

Hamburger menu appears automatically on mobile!

### 🔧 Technical Details

**No Build Step Required!**
- Pure vanilla JavaScript (ES6)
- No npm, webpack, or bundlers needed
- Just open index.html or serve with any web server

**Browser Support:**
- Modern browsers (Chrome, Firefox, Safari, Edge)
- IE11 not supported (uses ES6 features)

**Performance:**
- Lazy loading images (can be added)
- Minimal dependencies
- Fast load times

### 📊 File Structure

```
geoulah-books/
├── index.html              # Homepage
├── book.html               # Book details
├── chapter.html            # Chapter viewer
├── data/
│   └── books.json          # All books data
├── js/
│   ├── main.js             # Core functionality
│   ├── bookCatalog.js      # Catalog display
│   ├── bookDetails.js      # Book pages
│   └── chapterView.js      # Chapter reader
├── css/
│   └── style.css           # All styles
├── images/
│   └── books/
│       ├── miataisrael/
│       │   └── cover.jpg
│       └── book2/
│           └── cover.jpg
├── content/
│   ├── miataisrael/        # Chapter HTML files
│   │   ├── mavo.html
│   │   ├── tanakh.html
│   │   ├── golah.html
│   │   ├── shivah.html
│   │   └── goyim.html
│   └── book2/
│       └── intro.html
├── deploy.sh               # Deployment script (Mac/Linux)
├── deploy.bat              # Deployment script (Windows)
├── QUICKSTART.md           # Quick start guide
├── DEPLOYMENT.md           # Deployment details
└── README.md               # Full documentation
```

### ✅ Next Steps

1. **Extract the archive** (geoulah-books.zip or .tar.gz)
2. **Replace placeholder images** with real book covers
3. **Update books.json** with real book data
4. **Add chapter content** (replace placeholder HTML)
5. **Test locally** (use Python/PHP/Node server)
6. **Deploy** (run deploy script or push to GitHub)

### 🆘 Troubleshooting

**Books not showing?**
- Open browser console (F12)
- Check if books.json is valid JSON (use jsonlint.com)
- Verify file paths are correct

**Images not loading?**
- Check file names match books.json exactly
- Verify file extensions (.jpg, .png, etc.)
- Make sure images are in correct directories

**Changes not appearing?**
- Clear browser cache (Ctrl+Shift+R)
- Wait 1-2 minutes for GitHub Pages to rebuild
- Check GitHub Actions tab for deployment status

### 📚 Resources

- **Test JSON:** https://jsonlint.com/
- **GitHub Pages Guide:** https://pages.github.com/
- **Hebrew Fonts:** https://fonts.google.com/?subset=hebrew
- **SVG Book Covers:** https://www.canva.com/

### 🎯 Features Included

✅ Modern, clean design
✅ Fully responsive (mobile, tablet, desktop)
✅ RTL Hebrew support
✅ Multi-language (Hebrew/French)
✅ Book catalog with featured books
✅ Individual book pages
✅ Chapter navigation
✅ Search engine friendly (SEO)
✅ Easy to update (just edit JSON)
✅ No database required
✅ GitHub Pages ready
✅ Mobile-friendly navigation

### 💡 Future Enhancements (Optional)

You can add later:
- Shopping cart functionality
- User reviews/ratings
- Search functionality
- Newsletter signup
- Social media integration
- Analytics (Google Analytics or Plausible)
- PDF download links
- Audio book integration

---

**You're all set!** 🎉

The complete website is ready to deploy. Just follow the QUICKSTART.md guide!
