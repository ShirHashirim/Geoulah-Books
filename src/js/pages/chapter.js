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
    breadcrumbBook.href = `/book.html?id=${book.slug}`;
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

    // Extract just the content if it's a full HTML page
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;

    // Try to find main content - look for common content containers
    let mainContent = tempDiv.querySelector('.chapter-content') ||
                     tempDiv.querySelector('#contenu') ||
                     tempDiv.querySelector('article') ||
                     tempDiv.querySelector('main') ||
                     tempDiv;

    // Clean up the content - remove script tags and some navigation
    const scripts = mainContent.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    const navElements = mainContent.querySelectorAll('#fleches, #entete, .nav');
    navElements.forEach(nav => nav.remove());

    content = mainContent.innerHTML;

    // Get navigation chapters
    const prevChapter = app.services.books.getPreviousChapter(book, chapter.slug);
    const nextChapter = app.services.books.getNextChapter(book, chapter.slug);

    // Render the chapter
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
            <a href="/chapter.html?book=${book.slug}&chapter=${prevChapter.slug}" class="nav-btn nav-btn-prev">
              <span aria-hidden="true">${lang === 'he' ? '→' : '←'}</span>
              <span>${i18n.t('previousChapter')}</span>
            </a>
          ` : '<div></div>'}

          <a href="/book.html?id=${book.slug}" class="nav-btn nav-btn-toc">
            ${i18n.t('tableOfContents')}
          </a>

          ${nextChapter ? `
            <a href="/chapter.html?book=${book.slug}&chapter=${nextChapter.slug}" class="nav-btn nav-btn-next">
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
          <a href="/book.html?id=${book.slug}" class="btn-primary">${i18n.t('backToBook')}</a>
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
          <a href="/" class="btn-primary">${i18n.t('home')}</a>
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
