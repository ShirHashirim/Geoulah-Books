/**
 * Book Catalog Component
 * Displays featured book and grid of all books
 */

import { i18n } from '../core/i18n.js';
import { lazyLoadImages } from '../utils/lazy-load.js';

export class BookCatalog {
  constructor(element, app) {
    this.element = element;
    this.app = app;
    this.gridElement = element.querySelector('#books-grid');
    this.featuredContainer = document.querySelector('#featured-book-container');
    this.books = [];

    this.init();
  }

  async init() {
    // Listen to state changes
    document.addEventListener('app:stateChange', (e) => {
      const { books, isLoading } = e.detail.newState;

      if (books && books.length > 0) {
        this.books = books;
        this.render();
      }

      if (isLoading === false && (!books || books.length === 0)) {
        this.renderEmpty();
      }
    });

    // Listen to language changes
    document.addEventListener('app:languageChange', () => {
      if (this.books.length > 0) {
        this.render();
      }
    });

    // Initial render if books are already loaded
    const state = this.app.getState();
    if (state.books && state.books.length > 0) {
      this.books = state.books;
      this.render();
    }
  }

  render() {
    this.renderFeaturedBook();
    this.renderBookGrid();

    // Initialize lazy loading after rendering
    requestAnimationFrame(() => {
      lazyLoadImages(this.element);
      if (this.featuredContainer) {
        lazyLoadImages(this.featuredContainer);
      }
    });
  }

  renderFeaturedBook() {
    if (!this.featuredContainer) return;

    const featuredBooks = this.books.filter(book => book.featured);
    if (featuredBooks.length === 0) {
      this.featuredContainer.innerHTML = '';
      return;
    }

    const book = featuredBooks[0];
    const lang = this.app.getState().currentLanguage;

    this.featuredContainer.innerHTML = `
      <div class="featured-book-image">
        <img
          data-src="${book.cover || book.media?.cover || 'images/books/' + book.slug + '/cover.png'}"
          alt="${this.escapeHtml(book.title[lang])}"
          loading="lazy"
          width="400"
          height="600"
          style="width: 100%; max-width: 400px; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl);"
        >
      </div>
      <div class="featured-book-details">
        <h3 style="font-size: var(--font-size-2xl); margin-bottom: var(--space-md);">
          ${this.escapeHtml(book.title[lang])}
        </h3>
        <p style="font-size: var(--font-size-md); color: var(--color-text-medium); margin-bottom: var(--space-sm);">
          <strong>${i18n.t('author')}:</strong> ${this.escapeHtml(book.author)}
        </p>
        ${book.quote && book.quote[lang] ? `
          <blockquote style="padding-inline-start: var(--space-md); border-inline-start: 4px solid var(--color-primary); margin: var(--space-lg) 0; font-style: italic; color: var(--color-text-medium);">
            ${this.escapeHtml(book.quote[lang])}
          </blockquote>
        ` : ''}
        ${book.description && book.description[lang] ? `
          <p style="line-height: var(--line-height-relaxed); color: var(--color-text-medium); margin-bottom: var(--space-lg);">
            ${this.escapeHtml(book.description[lang])}
          </p>
        ` : ''}
        <div style="display: flex; gap: var(--space-lg); flex-wrap: wrap; margin-bottom: var(--space-lg);">
          ${book.pages ? `
            <div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-light); text-transform: uppercase;">${i18n.t('pages')}</div>
              <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold);">${book.pages}</div>
            </div>
          ` : ''}
          ${book.price ? `
            <div>
              <div style="font-size: var(--font-size-sm); color: var(--color-text-light); text-transform: uppercase;">${i18n.t('price')}</div>
              <div style="font-size: var(--font-size-lg); font-weight: var(--font-weight-semibold); color: var(--color-primary);">
                ${book.price} ${book.currency || '₪'}
              </div>
            </div>
          ` : ''}
        </div>
        <a href="book.html?id=${book.slug}" class="btn-primary" style="display: inline-block;">
          ${i18n.t('readMore')}
        </a>
      </div>
    `;
  }

  renderBookGrid() {
    if (!this.gridElement) return;

    if (this.books.length === 0) {
      this.renderEmpty();
      return;
    }

    const lang = this.app.getState().currentLanguage;

    this.gridElement.innerHTML = this.books
      .map(book => this.renderBookCard(book, lang))
      .join('');
  }

  renderBookCard(book, lang) {
    const coverImage = book.cover || book.media?.cover || `images/books/${book.slug}/cover.png`;

    return `
      <article class="book-card" role="listitem">
        <div class="book-card__image">
          <img
            data-src="${coverImage}"
            alt="${this.escapeHtml(book.title[lang])}"
            loading="lazy"
            width="300"
            height="450"
          >
          ${book.status === 'coming_soon' ? `
            <span class="book-card__badge">${i18n.t('comingSoon')}</span>
          ` : book.featured ? `
            <span class="book-card__badge">${i18n.t('featuredBook')}</span>
          ` : ''}
        </div>
        <div class="book-card__content">
          <h3 class="book-card__title">${this.escapeHtml(book.title[lang])}</h3>
          <p class="book-card__author">${this.escapeHtml(book.author)}</p>
          ${book.description && book.description[lang] ? `
            <p class="book-card__description">${this.escapeHtml(book.description[lang])}</p>
          ` : ''}
          <div class="book-card__footer">
            ${book.price ? `
              <span class="book-card__price">${book.price} ${book.currency || '₪'}</span>
            ` : ''}
            <a
              href="book.html?id=${book.slug}"
              class="btn-secondary btn-sm"
              aria-label="${i18n.t('viewDetails')} - ${this.escapeHtml(book.title[lang])}"
            >
              ${i18n.t('moreDetails')}
            </a>
          </div>
        </div>
      </article>
    `;
  }

  renderEmpty() {
    if (this.gridElement) {
      this.gridElement.innerHTML = `
        <p style="text-align: center; color: var(--color-text-medium); padding: var(--space-xl);">
          ${i18n.t('noBooksAvailable')}
        </p>
      `;
    }
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}
