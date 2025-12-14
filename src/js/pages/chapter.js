/**
 * Chapter Reading Page
 * Displays chapter content with navigation
 */

import app from '../core/app.js';
import { Header } from '../components/header.js';
import { i18n } from '../core/i18n.js';

// Initialize header
const headerElement = document.querySelector('.site-header');
if (headerElement) {
  new Header(headerElement, app);
}

// Get parameters from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('book');
const chapterId = urlParams.get('chapter');

if (!bookId || !chapterId) {
  showError('לא צוינו פרמטרים נדרשים');
} else {
  loadChapter(bookId, chapterId);
}

async function loadChapter(bookId, chapterId) {
  try {
    const book = await app.getBook(bookId);
    const chapter = app.services.books.getChapter(book, chapterId);

    if (!chapter) {
      throw new Error('Chapter not found');
    }

    const lang = app.getState().currentLanguage;

    // Update page title
    document.title = `${chapter.title[lang]} - ${book.title[lang]} - ספרי גאולה`;

    // Update breadcrumbs
    updateBreadcrumbs(book, chapter, lang);

    // Load and render chapter content
    await renderChapter(book, chapter, lang);

    // Listen to language change
    document.addEventListener('app:languageChange', async () => {
      const newLang = app.getState().currentLanguage;
      document.title = `${chapter.title[newLang]} - ${book.title[newLang]} - ספרי גאולה`;
      updateBreadcrumbs(book, chapter, newLang);
      await renderChapter(book, chapter, newLang);
    });

  } catch (error) {
    console.error('Error loading chapter:', error);
    showError(i18n.t('errors.chapterNotFound'));
  }
}

function updateBreadcrumbs(book, chapter, lang) {
  const breadcrumbBook = document.getElementById('breadcrumb-book');
  const breadcrumbChapter = document.getElementById('breadcrumb-chapter');

  if (breadcrumbBook) {
    breadcrumbBook.textContent = book.title[lang];
    // No leading slash for GitHub Pages compatibility
    breadcrumbBook.href = `book.html?id=${book.slug}`;
  }

  if (breadcrumbChapter) {
    breadcrumbChapter.textContent = chapter.title[lang];
  }
}

async function renderChapter(book, chapter, lang) {
  const container = document.getElementById('chapter-content');
  if (!container) return;

  try {
    // Show loading state
    container.innerHTML = `
      <div class="loading" role="status" aria-live="polite">
        <span class="spinner" aria-hidden="true"></span>
        <span>${i18n.t('loading')}</span>
      </div>
    `;

    // Load chapter content
    let content = await app.services.books.getChapterContent(chapter.contentFile);

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');

    // --- FIX 1: IMAGE PATHS ---
    const images = doc.querySelectorAll('img');
    images.forEach(img => {
      const src = img.getAttribute('src');
      if (src && !src.startsWith('http') && !src.startsWith('/') && !src.startsWith('content/')) {
        img.setAttribute('src', `content/${book.id}/${src}`);
      }
    });

    // --- FIX 2: CSS FILES ---
    const styles = doc.querySelectorAll('link[rel="stylesheet"]');
    styles.forEach(link => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('http') && !href.startsWith('/')) {
        const newHref = `content/${book.id}/${href}`;
        if (!document.querySelector(`link[href*="${newHref}"]`)) {
          const newLink = document.createElement('link');
          newLink.rel = 'stylesheet';
          newLink.type = 'text/css';
          newLink.href = newHref;
          document.head.appendChild(newLink);
        }
      }
    });

    // --- FIX 3: INTERNAL NAVIGATION LINKS (NEW) ---
    // This looks for links like <a href="tanakh.html"> and converts them to
    // <a href="chapter.html?book=miataisrael&chapter=tanakh">
    const links = doc.querySelectorAll('a');
    links.forEach(a => {
        const href = a.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('#')) {
            // Check if it's a link to an HTML file
            if (href.endsWith('.html')) {
                // Extract the clean filename (e.g., "tanakh" from "tanakh.html")
                const targetSlug = href.replace('.html', '');
                
                // Check if this slug exists in the book's chapters
                const targetChapter = book.chapters.find(c => c.slug === targetSlug || c.id === targetSlug);

                if (targetChapter) {
                    // It is a chapter link -> Rewrite to SPA format
                    a.setAttribute('href', `chapter.html?book=${book.slug}&chapter=${targetSlug}`);
                } else if (targetSlug === 'index' || targetSlug === 'book') {
                     // Link to book home
                     a.setAttribute('href', `book.html?id=${book.slug}`);
                } else if (['purchase', 'contact', 'about'].includes(targetSlug)) {
                     // Link to static site pages
                     a.setAttribute('href', `${targetSlug}.html`);
                }
            }
        }
    });

    // Extract content
    let mainContent = doc.querySelector('.chapter-content') ||
                     doc.querySelector('#contenu') ||
                     doc.querySelector('article') ||
                     doc.querySelector('main') ||
                     doc.body;

    // Cleanup scripts and old navigation
    const scripts = mainContent.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    const navElements = mainContent.querySelectorAll('#fleches, #entete, .nav, #header, #menus');
    navElements.forEach(nav => nav.remove());

    content = mainContent.innerHTML;

    // Get navigation chapters
    const prevChapter = app.services.books.getPreviousChapter(book, chapter.slug);
    const nextChapter = app.services.books.getNextChapter(book, chapter.slug);

    container.innerHTML = `
      <div class="chapter-container">
        <header class="chapter-header">
          <h1 class="chapter-title">${escapeHtml(chapter.title[lang])}</h1>
          <p class="chapter-meta">${escapeHtml(book.title[lang])} - ${escapeHtml(book.author)}</p>
        </header>

        <article class="chapter-content">
          ${content}
        </article>

        <nav class="chapter-navigation" aria-label="${i18n.t('chapterNavigation')}">
          ${prevChapter ? `
            <a href="chapter.html?book=${book.slug}&chapter=${prevChapter.slug}" class="nav-btn nav-btn-prev">
              <span aria-hidden="true">${lang === 'he' ? '→' : '←'}</span>
              <span>${i18n.t('previousChapter')}</span>
            </a>
          ` : '<div></div>'}

          <a href="book.html?id=${book.slug}" class="nav-btn nav-btn-toc">
            ${i18n.t('tableOfContents')}
          </a>

          ${nextChapter ? `
            <a href="chapter.html?book=${book.slug}&chapter=${nextChapter.slug}" class="nav-btn nav-btn-next">
              <span>${i18n.t('nextChapter')}</span>
              <span aria-hidden="true">${lang === 'he' ? '←' : '→'}</span>
            </a>
          ` : '<div></div>'}
        </nav>
      </div>
    `;

  } catch (error) {
    console.error('Error rendering chapter:', error);
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-3xl); color: var(--color-error);">
        <h2>${i18n.t('errors.loadFailed')}</h2>
        <p style="margin-top: var(--space-md);">
          <a href="book.html?id=${book.slug}" class="btn-primary">${i18n.t('backToBook')}</a>
        </p>
      </div>
    `;
  }
}

function showError(message) {
  const container = document.getElementById('chapter-content');
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-3xl); color: var(--color-error);">
        <h2>${message}</h2>
        <p style="margin-top: var(--space-md);">
          <a href="index.html" class="btn-primary">${i18n.t('home')}</a>
        </p>
      </div>
    `;
  }
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}