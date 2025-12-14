/**
 * Book Details Page
 * Displays book information and table of contents
 */

import app from '../core/app.js';
import { Header } from '../components/header.js';
import { i18n } from '../core/i18n.js';

// Initialize header
const headerElement = document.querySelector('.site-header');
if (headerElement) {
  new Header(headerElement, app);
}

// Get book ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get('id');

if (!bookId) {
  showError('לא צוין מזהה ספר');
} else {
  loadBook(bookId);
}

async function loadBook(bookId) {
  try {
    const book = await app.getBook(bookId);
    const lang = app.getState().currentLanguage;

    // Update page title and meta
    document.title = `${book.title[lang]} - ספרי גאולה`;
    document.querySelector('meta[name="description"]').content = book.description[lang] || '';

    // Update breadcrumb
    const breadcrumbTitle = document.getElementById('breadcrumb-title');
    if (breadcrumbTitle) {
      breadcrumbTitle.textContent = book.title[lang];
    }

    // Update structured data
    const schemaScript = document.getElementById('book-schema');
    if (schemaScript) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "Book",
        "name": book.title[lang],
        "author": {
          "@type": "Person",
          "name": book.author
        },
        "numberOfPages": book.pages,
        "inLanguage": lang,
        "datePublished": book.publishedDate,
        "description": book.description[lang]
      };
      schemaScript.textContent = JSON.stringify(schema, null, 2);
    }

    // Render book details
    renderBookDetails(book, lang);

    // Listen to language change
    document.addEventListener('app:languageChange', () => {
      const newLang = app.getState().currentLanguage;
      document.title = `${book.title[newLang]} - ספרי גאולה`;
      breadcrumbTitle.textContent = book.title[newLang];
      renderBookDetails(book, newLang);
    });

  } catch (error) {
    console.error('Error loading book:', error);
    showError(i18n.t('errors.bookNotFound'));
  }
}

function renderBookDetails(book, lang) {
  const container = document.getElementById('book-content');
  if (!container) return;

  const coverImage = book.cover || book.media?.cover || `images/books/${book.slug}/cover.png`;

  container.innerHTML = `
    <div class="book-header">
      <div style="max-width: 400px;">
        <img
          src="${coverImage}"
          alt="${escapeHtml(book.title[lang])}"
          class="book-cover-large"
          loading="eager"
        >
      </div>
      <div class="book-info">
        <h1 class="book-title">${escapeHtml(book.title[lang])}</h1>
        <p class="book-author">
          <strong>${i18n.t('author')}:</strong> ${escapeHtml(book.author)}
        </p>

        ${book.quote && book.quote[lang] ? `
          <blockquote class="book-quote">
            ${escapeHtml(book.quote[lang])}
          </blockquote>
        ` : ''}

        ${book.description && book.description[lang] ? `
          <p style="line-height: var(--line-height-relaxed); color: var(--color-text-medium);">
            ${escapeHtml(book.description[lang])}
          </p>
        ` : ''}

        <div class="book-meta">
          ${book.pages ? `
            <div class="meta-item">
              <div class="meta-label">${i18n.t('pages')}</div>
              <div class="meta-value">${book.pages}</div>
            </div>
          ` : ''}
          ${book.price ? `
            <div class="meta-item">
              <div class="meta-label">${i18n.t('price')}</div>
              <div class="meta-value">${book.price} ${book.currency || '₪'}</div>
            </div>
          ` : ''}
        </div>

        <div style="display: flex; gap: var(--space-md); margin-top: var(--space-lg); flex-wrap: wrap;">
          <a href="/purchase.html?book=${book.slug}" class="btn-primary">
            ${i18n.t('buyNow')}
          </a>
          <a href="/" class="btn-secondary">
            ${i18n.t('backToCatalog')}
          </a>
        </div>
      </div>
    </div>

    ${book.chapters && book.chapters.length > 0 ? `
      <div class="table-of-contents">
        <h2>${i18n.t('tableOfContents')}</h2>
        <ul class="toc-list" role="list">
          ${book.chapters.map((chapter, index) => `
            <li class="toc-item" role="listitem">
              <a href="/chapter.html?book=${book.slug}&chapter=${chapter.slug}">
                <span class="chapter-number">${index + 1}</span>
                <span class="chapter-title-text">${escapeHtml(chapter.title[lang])}</span>
              </a>
            </li>
          `).join('')}
        </ul>
      </div>
    ` : ''}
  `;
}

function showError(message) {
  const container = document.getElementById('book-content');
  if (container) {
    container.innerHTML = `
      <div style="text-align: center; padding: var(--space-3xl); color: var(--color-error);">
        <h2>${message}</h2>
        <p style="margin-top: var(--space-md);">
          <a href="/" class="btn-primary">${i18n.t('backToCatalog')}</a>
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
