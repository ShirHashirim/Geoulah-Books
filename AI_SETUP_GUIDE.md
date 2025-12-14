# Geoulah Books - Complete Setup Guide for AI Assistants

## Project Overview

**Geoulah Books** is a bilingual (Hebrew/French) book publishing website built with vanilla HTML/CSS/JavaScript. The site displays religious/spiritual books by Gilalya Tiar with full chapter content, supporting both Hebrew (RTL) and French (LTR) languages.

**Live Site**: https://ShirHashirim.github.io/Geoulah-Books/
**Repository**: https://github.com/ShirHashirim/Geoulah-Books
**Deployment**: GitHub Pages via GitHub Actions

---

## Architecture

### Technology Stack
- **Frontend**: Vanilla JavaScript (ES6 modules), HTML5, CSS3
- **Build Tool**: Vite 5.4.21
- **Deployment**: GitHub Pages with automated GitHub Actions workflow
- **No Frameworks**: Pure JavaScript with component-based architecture
- **Languages**: Hebrew (RTL) and French (LTR) with localStorage persistence

### Key Technical Decisions

1. **Vanilla JS Only**: No React, Vue, or frameworks - uses ES6 modules with class-based components
2. **Vite for Build**: Modern build tool for development server and production optimization
3. **Component Architecture**: Modular components without framework overhead
4. **Service Layer Pattern**: Separate data/storage services from UI components
5. **Event-Driven State**: CustomEvents for component communication
6. **Mobile-First CSS**: Responsive design with fluid typography
7. **Google Fonts CDN**: External font loading for Heebo (Hebrew) and Inter (French)
8. **GitHub Pages**: Static site hosting with base path `/Geoulah-Books/`

---

## Directory Structure

```
Geoulah-Books/
├── .github/
│   └── workflows/
│       └── static.yml              # GitHub Actions deployment workflow
├── src/
│   ├── css/
│   │   ├── base/
│   │   │   ├── variables.css       # CSS custom properties (colors, spacing, typography)
│   │   │   ├── reset.css           # Modern CSS reset
│   │   │   └── typography.css      # Font imports and text styles
│   │   ├── components/
│   │   │   ├── book-card.css       # Book card grid component
│   │   │   ├── buttons.css         # Button styles
│   │   │   ├── footer.css          # Site footer
│   │   │   ├── header.css          # Site header with navigation
│   │   │   └── loading.css         # Loading spinner
│   │   ├── layouts/
│   │   │   ├── home.css            # Homepage layout
│   │   │   ├── book.css            # Book details page layout
│   │   │   └── chapter.css         # Chapter reading page layout
│   │   ├── utilities/
│   │   │   ├── accessibility.css   # WCAG accessibility helpers
│   │   │   └── responsive.css      # Responsive breakpoints
│   │   └── main.css                # Main CSS entry (imports all)
│   ├── js/
│   │   ├── core/
│   │   │   ├── app.js              # Main App controller
│   │   │   └── i18n.js             # Internationalization system
│   │   ├── services/
│   │   │   ├── book-service.js     # Book data service with caching
│   │   │   └── storage-service.js  # LocalStorage wrapper
│   │   ├── components/
│   │   │   ├── book-catalog.js     # Book grid component
│   │   │   └── header.js           # Header component
│   │   ├── pages/
│   │   │   ├── book.js             # Book details page logic
│   │   │   └── chapter.js          # Chapter reader page logic
│   │   ├── utils/
│   │   │   └── lazy-load.js        # Image lazy loading
│   │   └── main.js                 # JS entry point for homepage
├── public/
│   ├── data/
│   │   └── books.json              # Book catalog data (JSON)
│   ├── images/
│   │   ├── books/                  # Book cover images
│   │   │   ├── miataisrael/
│   │   │   └── quiestuisrael/
│   │   └── site/                   # Site assets (favicon, logos)
│   ├── fonts/                      # Self-hosted fonts (currently unused, using CDN)
│   └── manifest.json               # PWA manifest
├── content/
│   ├── miataisrael/                # Hebrew book content
│   │   ├── *.html                  # Chapter HTML files
│   │   ├── images/                 # Chapter-specific images
│   │   └── style/                  # Legacy CSS (embedded in content)
│   └── quiestuisrael/              # French book content
│       ├── *.html                  # Chapter HTML files
│       ├── images/                 # Chapter-specific images
│       └── style/                  # Legacy CSS (embedded in content)
├── dist/                           # Production build output (gitignored)
├── index.html                      # Homepage
├── book.html                       # Book details page
├── chapter.html                    # Chapter reading page
├── about.html                      # About page (placeholder)
├── contact.html                    # Contact page (placeholder)
├── purchase.html                   # Purchase page (placeholder)
├── vite.config.js                  # Vite configuration
├── package.json                    # Node dependencies and scripts
└── .gitignore                      # Git ignore rules
```

---

## Critical Configuration Files

### 1. `vite.config.js`

**Purpose**: Controls build configuration and base paths for dev/production

**Key Settings**:
```javascript
export default defineConfig({
  root: '.',
  publicDir: 'public',

  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: 'index.html',
        book: 'book.html',
        chapter: 'chapter.html',
      }
    }
  },

  // CRITICAL: Base path configuration
  base: process.env.NODE_ENV === 'production' ? '/Geoulah-Books/' : './',

  server: {
    port: 3000,
    open: true,
  },

  preview: {
    port: 4173,
    open: true
  }
});
```

**Why Important**:
- Sets correct base path for GitHub Pages (`/Geoulah-Books/` in production, `./` in dev)
- Configures multi-page app with three HTML entry points
- Development server runs on port 3000

### 2. `src/js/services/book-service.js`

**Purpose**: Handles all book data operations with caching

**Key Code**:
```javascript
export class BookService {
  constructor() {
    // CRITICAL: Uses Vite's BASE_URL to handle dev vs production paths
    this.baseUrl = `${import.meta.env.BASE_URL}data`;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  async getAll() {
    // Fetches from /data/books.json (dev) or /Geoulah-Books/data/books.json (prod)
    const response = await fetch(`${this.baseUrl}/books.json`);
    const data = await response.json();
    return data.books || [];
  }
}
```

**Why Important**:
- `import.meta.env.BASE_URL` automatically resolves to correct path based on environment
- Caching prevents redundant network requests
- Central data layer for all book operations

### 3. `public/data/books.json`

**Purpose**: Book catalog data structure

**Schema**:
```json
{
  "books": [
    {
      "id": "miataisrael",
      "slug": "miataisrael",
      "title": {
        "he": "מי אתה, ישראל?",
        "fr": "Qui es-tu, Israël ?"
      },
      "author": "גִלַלְיָה טיאר",
      "description": {
        "he": "...",
        "fr": "..."
      },
      "coverImage": "/images/books/miataisrael/cover.jpg",
      "language": "he",
      "status": "available",
      "featured": true,
      "publishedDate": "2009-01-01",
      "pages": 274,
      "chapters": [
        {
          "id": "mavo",
          "slug": "mavo",
          "title": { "he": "מבוא", "fr": "Introduction" },
          "contentFile": "/content/miataisrael/mavo.html"
        }
      ]
    }
  ]
}
```

**Critical Fields**:
- `id` / `slug`: Used in URLs (`/book.html?id=miataisrael`)
- `contentFile`: Path to chapter HTML in `/content/` directory
- `language`: Determines RTL/LTR rendering
- `chapters.slug`: Used in chapter URLs (`/chapter.html?book=miataisrael&chapter=mavo`)

### 4. `.github/workflows/static.yml`

**Purpose**: Automates deployment to GitHub Pages

**Workflow**:
```yaml
name: Deploy static content to Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - uses: actions/deploy-pages@v4
```

**How It Works**:
1. Triggers on push to `main` branch
2. Installs Node.js 20 and dependencies
3. Runs `npm run build` (Vite build with `/Geoulah-Books/` base)
4. Uploads `dist/` folder as artifact
5. Deploys to GitHub Pages

---

## Chapter Content Architecture

### Legacy HTML Files

All chapter content lives in `/content/[bookId]/[chapter].html` files. These are **legacy HTML files** with:
- Full HTML structure (DOCTYPE, html, head, body)
- Inline styles and embedded CSS
- Hebrew (RTL) or French (LTR) content
- Internal navigation links

### Navigation Link Updates

**IMPORTANT**: All internal links in chapter HTML files have been updated to use the new app structure:

**Old Format** (direct file links):
```html
<a href="index.html">Home</a>
<a href="mavo.html">Introduction</a>
```

**New Format** (URL parameters):
```html
<a href="/book.html?id=miataisrael">Home</a>
<a href="/chapter.html?book=miataisrael&chapter=mavo">Introduction</a>
```

**Updated Navigation Types**:
1. **Table of Contents** (`div id="passages"`) - Links to all chapters
2. **Arrow Navigation** (`div id="fleches"`) - Previous/Next chapter
3. **Practical Links** (`div id="practical"`) - Contact, Purchase, Links

### Common HTML Issues Fixed

1. **XML Processing Instructions**: Removed `<?xml-stylesheet ...?>` from quiestuisrael files (caused parse errors)
2. **Malformed Attributes**: Fixed `title="תנ" ך"=""` → `title="תנך"` (quote issues in Hebrew text)
3. **BOM Characters**: Files may have UTF-8 BOM (`﻿`) at start - this is normal

---

## Build and Deployment

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:3000)
npm run dev

# The dev server uses base path './' and serves from root
```

### Production Build

```bash
# Build for production
npm run build

# Output goes to dist/ with base path '/Geoulah-Books/'
# Total size: ~60KB, gzipped: ~17KB
```

### Preview Production Build

```bash
# Preview production build locally
npm run preview

# Opens http://localhost:4173 with production configuration
```

### Deploy to GitHub Pages

```bash
# Option 1: Automatic (recommended)
git add .
git commit -m "Update site"
git push origin main
# GitHub Actions workflow runs automatically

# Option 2: Manual (uses gh-pages branch)
npm run deploy
# Builds and pushes dist/ to gh-pages branch
```

---

## Environment Variables

### Vite Environment Variables

Available via `import.meta.env`:

- `import.meta.env.BASE_URL` - Base path (`/Geoulah-Books/` in prod, `./` in dev)
- `import.meta.env.PROD` - Boolean, true in production build
- `import.meta.env.DEV` - Boolean, true in development
- `import.meta.env.MODE` - String, "production" or "development"

**Usage Example**:
```javascript
// Automatically handles correct path in dev and prod
const dataPath = `${import.meta.env.BASE_URL}data/books.json`;
```

---

## Common Issues and Solutions

### Issue 1: Books Not Loading (404 on books.json)

**Symptom**: Console error `Failed to load resource: 404` for `books.json`

**Cause**: Incorrect base URL in `book-service.js`

**Solution**: Ensure `book-service.js` uses `import.meta.env.BASE_URL`:
```javascript
this.baseUrl = `${import.meta.env.BASE_URL}data`;
```

### Issue 2: GitHub Pages 404 on Direct Page Access

**Symptom**: Visiting `https://shirhashirim.github.io/book.html` returns 404

**Cause**: Missing base path in URLs

**Solution**: Always use full base path:
- ✅ `https://shirhashirim.github.io/Geoulah-Books/book.html`
- ❌ `https://shirhashirim.github.io/book.html`

### Issue 3: HTML Parse Errors in Chapter Content

**Symptom**: Vite error `unexpected-question-mark-instead-of-tag-name` or `unexpected-character-in-attribute-name`

**Causes**:
1. XML processing instructions: `<?xml-stylesheet ...?>`
2. Malformed attributes with quotes: `title="text" with"quotes"=""`

**Solutions**:
1. Remove XML processing instructions from HTML files
2. Fix quote escaping in attributes (especially Hebrew text with `"`)

### Issue 4: Images Not Loading

**Symptom**: Book cover images show broken

**Cause**: Images not in `public/images/` directory

**Solution**: Copy images to `public/images/books/[bookId]/`
```bash
cp -r images public/
```

### Issue 5: Service Worker 404

**Symptom**: Console error about service worker registration failure

**Cause**: Service worker file doesn't exist yet

**Solution**: Service worker is disabled in `app.js` - can be enabled when needed:
```javascript
// In src/js/core/app.js
if (import.meta.env.PROD) {
  this.registerServiceWorker(); // Currently commented out
}
```

---

## Data Flow

### Application Initialization

1. **HTML Loaded**: Browser loads `index.html`, `book.html`, or `chapter.html`
2. **JS Module**: Vite injects `<script type="module" src="/src/js/main.js">` (or book.js, chapter.js)
3. **App Initialization**: `App` class instantiated in main.js
4. **Service Creation**: `BookService` and `StorageService` created
5. **Language Detection**: Checks localStorage or defaults to 'he'
6. **Data Loading**: Fetches `/data/books.json` with caching
7. **Component Rendering**: Page-specific components render content
8. **Event Listeners**: Header, navigation, language switcher activated

### Page-Specific Flow

**Homepage** (`index.html` → `main.js`):
1. Load all books from `BookService.getAll()`
2. Filter featured books
3. Render hero section with featured book
4. Render book catalog grid with `BookCatalog` component

**Book Details** (`book.html` → `book.js`):
1. Parse URL: `?id=miataisrael`
2. Fetch book by ID: `BookService.getById('miataisrael')`
3. Render book header (cover, title, description)
4. Render table of contents (clickable chapter list)

**Chapter Reader** (`chapter.html` → `chapter.js`):
1. Parse URL: `?book=miataisrael&chapter=mavo`
2. Fetch book: `BookService.getById('miataisrael')`
3. Find chapter in book.chapters by slug
4. Load chapter HTML: `BookService.getChapterContent('/content/miataisrael/mavo.html')`
5. Render chapter content (full HTML)
6. Render navigation (prev/next chapter)

---

## Code Patterns

### Component Structure

```javascript
export class ComponentName {
  constructor(container, app) {
    this.container = container;
    this.app = app; // Reference to main App instance
    this.init();
  }

  async init() {
    // Initialize component
  }

  render(data) {
    // Render UI
    this.container.innerHTML = `...`;
  }

  attachEventListeners() {
    // Add event listeners
  }
}
```

### Service Pattern

```javascript
export class ServiceName {
  constructor() {
    this.cache = new Map();
  }

  async getData() {
    // Check cache first
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // Fetch from network
    const data = await fetch(url);

    // Cache result
    this.cache.set(key, data);

    return data;
  }
}
```

### Event-Driven Updates

```javascript
// Emit custom event
const event = new CustomEvent('language-changed', {
  detail: { language: 'he' }
});
document.dispatchEvent(event);

// Listen for event
document.addEventListener('language-changed', (e) => {
  console.log('Language changed to:', e.detail.language);
});
```

---

## Deployment URLs

**Development**:
- Local dev: http://localhost:3000
- Preview prod: http://localhost:4173

**Production**:
- Homepage: https://ShirHashirim.github.io/Geoulah-Books/
- Book page: https://ShirHashirim.github.io/Geoulah-Books/book.html?id=miataisrael
- Chapter page: https://ShirHashirim.github.io/Geoulah-Books/chapter.html?book=miataisrael&chapter=mavo

---

## Package Dependencies

### Core Dependencies
- None (vanilla JS, no runtime dependencies)

### Dev Dependencies
- `vite@^5.4.21` - Build tool and dev server
- `gh-pages@^6.0.0` - Deploy to GitHub Pages (optional, workflow handles this)

### Scripts

```json
{
  "scripts": {
    "dev": "vite",                  // Start dev server
    "build": "vite build",          // Build for production
    "preview": "vite preview",      // Preview production build
    "deploy": "npm run build && gh-pages -d dist"  // Manual deploy
  }
}
```

---

## Summary for AI Assistants

**Key Points to Remember**:

1. **Base Path**: Always use `import.meta.env.BASE_URL` in JavaScript, never hardcode paths
2. **Chapter Navigation**: All links in content HTML must use `/book.html?id=...` or `/chapter.html?book=...&chapter=...` format
3. **Build Process**: Vite handles bundling, GitHub Actions handles deployment
4. **Data Location**: Books data is in `public/data/books.json`, NOT `src/data/`
5. **HTML Errors**: Watch for XML processing instructions and malformed attributes in legacy content
6. **Two Books**: miataisrael (Hebrew/RTL) and quiestuisrael (French/LTR)
7. **No Frameworks**: Pure vanilla JS - don't suggest React, Vue, etc.
8. **GitHub Pages**: Base path is `/Geoulah-Books/` in production, `./` in development

**When User Reports Issues**:
1. Check browser console for errors
2. Verify base path configuration in `vite.config.js` and `book-service.js`
3. Ensure images are in `public/images/`
4. Validate chapter HTML for parse errors
5. Test with `npm run preview` before deploying

**This document should be updated whenever**:
- Project structure changes
- New features are added
- Configuration files are modified
- Common issues are discovered
