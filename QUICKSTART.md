# Quick Start Guide - Geoulah Books

## 🚀 Get Started in 5 Minutes

### Step 1: Download the Files

Download all the files to your computer.

### Step 2: Test Locally

#### Option A: Using Python (Easiest)
```bash
cd geoulah-books
python -m http.server 8000
```
Visit: http://localhost:8000

#### Option B: Using PHP
```bash
cd geoulah-books
php -S localhost:8000
```
Visit: http://localhost:8000

#### Option C: Using Node.js
```bash
cd geoulah-books
npx http-server
```
Visit: http://localhost:8080

### Step 3: Deploy to GitHub Pages

#### Easy Way (Use the script):

**On Mac/Linux:**
```bash
cd geoulah-books
./deploy.sh
```

**On Windows:**
Double-click `deploy.bat` or run in Command Prompt:
```cmd
cd geoulah-books
deploy.bat
```

#### Manual Way:

```bash
cd geoulah-books
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/geoulah-books.git
git push -u origin main
```

Then enable GitHub Pages:
1. Go to repository Settings
2. Click Pages
3. Select "main" branch
4. Click Save

Your site will be at: `https://YOUR-USERNAME.github.io/geoulah-books/`

## 📚 Adding Your Content

### Add Book Covers

Replace the placeholder images:
- `images/books/miataisrael/cover.jpg`
- `images/books/book2/cover.jpg`

Recommended size: 300x450 pixels

### Update Book Information

Edit `data/books.json`:
- Update titles, descriptions, prices
- Add/remove books
- Add/remove chapters

### Add Chapter Content

Edit files in `content/[book-slug]/`:
- `content/miataisrael/mavo.html`
- `content/miataisrael/tanakh.html`
- etc.

Use HTML formatting:
```html
<h2>Chapter Heading</h2>
<p>Paragraph text...</p>
<blockquote>
    <p>Quote text...</p>
</blockquote>
```

## 🎨 Customization

### Change Colors

Edit `css/style.css` and modify the CSS variables:
```css
:root {
  --primary-color: #2c5aa0;    /* Main blue */
  --secondary-color: #7b68ee;  /* Purple */
  --accent-color: #d4af37;     /* Gold */
}
```

### Change Fonts

Add to `<head>` in HTML files:
```html
<link href="https://fonts.googleapis.com/css2?family=Heebo:wght@400;700&display=swap" rel="stylesheet">
```

Update CSS:
```css
body.lang-he {
  font-family: 'Heebo', 'Arial Hebrew', Arial, sans-serif;
}
```

## 🔧 Common Tasks

### Add a New Book

1. **Add to books.json:**
```json
{
  "id": "newbook",
  "slug": "new-book-slug",
  "title": {
    "he": "שם הספר",
    "fr": "Titre du livre"
  },
  "author": "שם המחבר",
  "description": {
    "he": "תיאור...",
    "fr": "Description..."
  },
  "price": 80,
  "pages": 250,
  "cover": "images/books/newbook/cover.jpg",
  "chapters": [...]
}
```

2. **Add cover image:**
   - `images/books/newbook/cover.jpg`

3. **Create content directory:**
   - `content/newbook/`

4. **Add chapters:**
   - `content/newbook/chapter1.html`
   - etc.

### Update Existing Content

1. Edit the chapter HTML file
2. Save changes
3. Run deployment script or:
```bash
git add .
git commit -m "Updated chapter content"
git push
```

## 🌐 Language Support

The site supports Hebrew (default) and French.

Users can switch languages via the language switcher in the header.

To add content in French:
- Update `title.fr` and `description.fr` in books.json
- Create French versions of chapter files

## 📱 Mobile Responsive

The site is automatically mobile-responsive. Test on different screen sizes!

## ❓ Troubleshooting

### Books not showing?
- Check browser console (F12)
- Verify books.json is valid (use JSONLint.com)
- Check file paths

### Images not loading?
- Verify image file names match books.json
- Check file extensions (.jpg, .png)
- Clear browser cache

### Changes not appearing?
- Clear browser cache (Ctrl+Shift+R)
- Wait a few minutes for GitHub Pages to update
- Check if files were committed to git

## 🆘 Need Help?

1. Check the browser console for errors (Press F12)
2. Review the DEPLOYMENT.md file
3. Check the README.md for detailed documentation

## 📞 Support

Create an issue on GitHub or contact the development team.

---

**Happy Publishing! 📖**
