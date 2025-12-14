//src/js/pages/chapter.js
import app from '../core/app.js';
import { Header } from '../components/header.js';
import { i18n } from '../core/i18n.js';

// Initialize header
const headerElement = document.querySelector('.site-header');
if (headerElement) new Header(headerElement, app);

// URL Params
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('book');
const chapterId = urlParams.get('chapter');

if (bookId && chapterId) {
  loadChapter(bookId, chapterId);
}

async function loadChapter(bookId, chapterId) {
  try {
    const book = await app.getBook(bookId);
    const chapter = app.services.books.getChapter(book, chapterId);
    if (!chapter) throw new Error('Chapter not found');

    const lang = app.getState().currentLanguage;
    document.title = `${chapter.title[lang]} - ${book.title[lang]}`;

    // Render content
    await renderChapterContent(book, chapter, lang);
    updateNavigation(book, chapter, lang);

  } catch (error) {
    console.error(error);
    document.getElementById('chapter-content').innerHTML = `<p class="error">Error loading chapter.</p>`;
  }
}

async function renderChapterContent(book, chapter, lang) {
  const container = document.getElementById('chapter-content');
  
  // 1. Fetch raw HTML from content file
  let rawHtml = await app.services.books.getChapterContent(chapter.contentFile);

  // 2. Parse HTML to DOM
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // 3. FIX: Rewrite Image Paths (legacy relative -> correct public path)
  // Example: src="images/pic.jpg" -> src="content/miataisrael/images/pic.jpg"
  doc.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('http') && !src.startsWith('/')) {
      img.setAttribute('src', `content/${book.id}/${src}`);
    }
  });

  // 4. FIX: Rewrite Legacy Links
  // Example: href="mavo.html" -> href="chapter.html?book=...&chapter=mavo"
  doc.querySelectorAll('a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && !href.startsWith('http') && !href.startsWith('#')) {
      if (href.endsWith('.html')) {
        const slug = href.replace('.html', '');
        // Check if it's a chapter or main page
        if (slug === 'index') a.setAttribute('href', `book.html?id=${book.id}`);
        else a.setAttribute('href', `chapter.html?book=${book.id}&chapter=${slug}`);
      }
    }
  });

  // 5. Inject Styles
  doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('http')) {
      const newHref = `content/${book.id}/${href}`;
      if (!document.querySelector(`link[href="${newHref}"]`)) {
        const newLink = document.createElement('link');
        newLink.rel = 'stylesheet';
        newLink.href = newHref;
        document.head.appendChild(newLink);
      }
    }
  });

  // 6. Extract Body Content
  let content = doc.body.innerHTML;
  
  // Remove duplicate legacy nav/headers if they exist
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = content;
  tempDiv.querySelectorAll('#header, #menus, #fleches').forEach(el => el.remove());
  
  container.innerHTML = `
    <article class="chapter-reader">
      <h1>${chapter.title[lang]}</h1>
      <div class="chapter-text">${tempDiv.innerHTML}</div>
    </article>
  `;
}

function updateNavigation(book, chapter, lang) {
  const prev = app.services.books.getPreviousChapter(book, chapter.slug);
  const next = app.services.books.getNextChapter(book, chapter.slug);
  const nav = document.querySelector('.chapter-navigation'); // Ensure this exists in your HTML
  
  if (nav) {
    nav.innerHTML = `
      ${prev ? `<a href="chapter.html?book=${book.id}&chapter=${prev.slug}" class="nav-prev">← ${prev.title[lang]}</a>` : '<span></span>'}
      <a href="book.html?id=${book.id}" class="nav-up">Top</a>
      ${next ? `<a href="chapter.html?book=${book.id}&chapter=${next.slug}" class="nav-next">${next.title[lang]} →</a>` : '<span></span>'}
    `;
  }
}