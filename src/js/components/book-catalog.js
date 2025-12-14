//src/js/components/book-catalog.js
import { i18n } from '../core/i18n.js';

export class BookCatalog {
  constructor(container, app) {
    this.container = container;
    this.app = app;
  }

  render(books) {
    if (!this.container) return;

    if (!books || books.length === 0) {
      this.container.innerHTML = `<p class="no-books">${i18n.t('noBooksFound')}</p>`;
      return;
    }

    const currentLang = this.app.getState().currentLanguage;
    const baseUrl = import.meta.env.BASE_URL;

    this.container.innerHTML = books.map(book => `
      <article class="book-card">
        <div class="book-cover">
          <img src="${baseUrl}${book.coverImage}" alt="${book.title[currentLang]}" loading="lazy">
        </div>
        <div class="book-info">
          <h3 class="book-title">${book.title[currentLang]}</h3>
          <p class="book-author">${book.author}</p>
          <div class="book-actions">
            <!-- FIXED: Relative link, no leading slash -->
            <a href="book.html?id=${book.slug}" class="btn-secondary">
              ${i18n.t('readMore')}
            </a>
          </div>
        </div>
      </article>
    `).join('');
  }
}