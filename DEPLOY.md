# Deployment Guide - Geoulah Books

## Quick Deploy to GitHub Pages

### Method 1: Using npm deploy script (Recommended)

```bash
npm run deploy
```

This will:
1. Build the project (`npm run build`)
2. Deploy the `dist/` folder to `gh-pages` branch
3. Your site will be live at: `https://ShirHashirim.github.io/Geoulah-Books/`

### Method 2: Manual Deploy

1. **Build the project:**
   ```bash
   npm run build
   ```

2. **Commit and push the dist folder:**
   ```bash
   git add dist -f
   git commit -m "Deploy production build"
   git push origin main
   ```

3. **Configure GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` / `root`
   - Save

### GitHub Pages Configuration

Your site will be available at:
```
https://ShirHashirim.github.io/Geoulah-Books/
```

**Important URLs:**
- Homepage: `https://ShirHashirim.github.io/Geoulah-Books/`
- Book Page: `https://ShirHashirim.github.io/Geoulah-Books/book.html?id=miataisrael`
- Chapter: `https://ShirHashirim.github.io/Geoulah-Books/chapter.html?book=miataisrael&chapter=mavo`

## Troubleshooting

### 404 Errors on Page Reload

If you get 404 errors when accessing `/book.html` or `/chapter.html` directly:

**Solution:** GitHub Pages doesn't handle client-side routing automatically.

**Option A:** Always link from the homepage
- Navigate: Home → Book → Chapter

**Option B:** Use hash-based routing (future enhancement)
- Update URLs to use `#/book/...` format

### Base Path Issues

The project is configured with:
```js
// vite.config.js
base: '/Geoulah-Books/'  // for production
```

If you deploy to a different URL, update this in `vite.config.js` and rebuild.

### Images Not Loading

Make sure images are in `public/images/` and rebuild:
```bash
npm run build
```

## Development vs Production

**Development** (local):
```bash
npm run dev
# Opens: http://localhost:3000/
# Base path: './' (relative)
```

**Production** (deployed):
```bash
npm run build
npm run preview
# Opens: http://localhost:4173/
# Base path: '/Geoulah-Books/'
```

## Deployment Checklist

Before deploying:
- [ ] All images copied to `public/images/`
- [ ] Books data updated in `public/data/books.json`
- [ ] Chapter content files in `content/`
- [ ] Test locally with `npm run preview`
- [ ] Commit all changes to git
- [ ] Run `npm run deploy`
- [ ] Verify site at GitHub Pages URL

## Custom Domain (Optional)

To use a custom domain:

1. Create `public/CNAME` file with your domain:
   ```
   books.yourdomain.com
   ```

2. Configure DNS:
   - Add CNAME record pointing to `ShirHashirim.github.io`

3. Enable in GitHub Settings → Pages → Custom domain

4. Rebuild and deploy:
   ```bash
   npm run deploy
   ```

## Continuous Deployment (Optional)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

This will auto-deploy on every push to main branch.

## Need Help?

- Check GitHub Pages status: Repository Settings → Pages
- View deployment logs: Actions tab
- Test locally first: `npm run preview`
