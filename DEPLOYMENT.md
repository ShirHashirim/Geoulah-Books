# GitHub Pages Deployment Guide

## Step-by-Step Instructions

### 1. Prepare Your Repository

First, create a new repository on GitHub:

1. Go to https://github.com/new
2. Repository name: `geoulah-books` (or any name you prefer)
3. Description: "Modern multi-book website for Geoulah Books"
4. Choose "Public" (required for free GitHub Pages)
5. **DO NOT** initialize with README, .gitignore, or license (we have these)
6. Click "Create repository"

### 2. Initialize Local Git Repository

Open terminal in the `geoulah-books` directory and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Modern multi-book website"

# Rename branch to main (if needed)
git branch -M main

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/geoulah-books.git

# Push to GitHub
git push -u origin main
```

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**:
   - Select branch: **main**
   - Select folder: **/ (root)**
5. Click **Save**

### 4. Wait for Deployment

GitHub Pages will automatically deploy your site. This usually takes 1-3 minutes.

You can check the deployment status:
- Go to **Actions** tab
- You should see a workflow called "pages build and deployment"
- Wait for the green checkmark ✓

### 5. Access Your Site

Your site will be available at:
```
https://github.com/ShirHashirim/Geoulah-Books/
```

For example, if your username is `shirhashirim`, it would be:
```
https://shirhashirim.github.io/geoulah-books/
```

## Custom Domain (Optional)

If you want to use a custom domain like `books.geoulah.org`:

### 1. Configure DNS

Add a CNAME record in your DNS settings:
```
books.geoulah.org  →  YOUR_USERNAME.github.io
```

### 2. Configure GitHub Pages

1. In your repository Settings → Pages
2. Under "Custom domain", enter: `books.geoulah.org`
3. Click Save
4. Wait for DNS check to complete
5. Enable "Enforce HTTPS" (recommended)

### 3. Update Your Code

If using a custom domain, update the base URL in your files:
- Open Graph meta tags in `index.html`
- Any absolute URLs

## Adding Content

### Adding a New Book

1. Add book cover image:
```bash
# Add image to: images/books/[book-slug]/cover.jpg
```

2. Create content directory:
```bash
mkdir -p content/[book-slug]
```

3. Edit `data/books.json` and add your book:
```json
{
  "id": "new-book",
  "slug": "new-book-slug",
  "title": {
    "he": "שם הספר בעברית",
    "fr": "Titre en français"
  },
  "author": "שם המחבר",
  "description": {
    "he": "תיאור...",
    "fr": "Description..."
  },
  "price": 75,
  "pages": 200,
  "cover": "images/books/new-book-slug/cover.jpg",
  "featured": false,
  "chapters": []
}
```

4. Commit and push:
```bash
git add .
git commit -m "Add new book: [book name]"
git push
```

GitHub Pages will automatically rebuild your site!

### Adding Chapter Content

1. Create HTML file in `content/[book-slug]/chapter-slug.html`
2. Add chapter to book in `data/books.json`
3. Commit and push

## Updating the Site

Whenever you make changes:

```bash
# Make your changes to files

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Update: description of changes"

# Push to GitHub
git push
```

GitHub Pages automatically redeploys within 1-3 minutes!

## Troubleshooting

### Site Not Loading

1. Check GitHub Actions for build errors
2. Ensure GitHub Pages is enabled in Settings
3. Wait a few minutes for deployment
4. Clear browser cache (Ctrl+Shift+R)

### Images Not Showing

1. Verify image paths are correct
2. Image paths are case-sensitive
3. Use relative paths (no leading slash)

### JavaScript Not Working

1. Check browser console for errors (F12)
2. Ensure all files are committed and pushed
3. Check file paths in HTML `<script>` tags

### Books Not Displaying

1. Check `data/books.json` syntax with a JSON validator
2. Verify file paths in book data
3. Check browser console for fetch errors

## Local Development

For local testing before pushing:

```bash
# Option 1: Python
python -m http.server 8000

# Option 2: Node.js
npx http-server -p 8000

# Option 3: PHP
php -S localhost:8000
```

Then open http://localhost:8000 in your browser.

## Best Practices

1. **Always test locally** before pushing to GitHub
2. **Use descriptive commit messages**
3. **Keep `data/books.json` valid** (use JSON validator)
4. **Optimize images** (compress for web)
5. **Check mobile view** on different devices
6. **Regular backups** of your content

## Getting Help

If you encounter issues:
1. Check the browser console (F12)
2. Review GitHub Actions logs
3. Verify all file paths
4. Test locally first

## Next Steps

After deployment:
1. Test all pages and links
2. Check mobile responsiveness
3. Verify language switching
4. Test book and chapter navigation
5. Share with others for feedback!

---

**Your site is now live!** 🎉

Share the link: `https://YOUR_USERNAME.github.io/geoulah-books/`
