// Book Catalog Component - renders the book grid and featured book
import bookStore from './main.js';

class BookCatalog {
  constructor(containerSelector) {
    this.container = document.querySelector(containerSelector);
    this.lang = bookStore.currentLanguage;
  }

  async render() {
    // Wait for books to load
    while (bookStore.books.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.lang = bookStore.currentLanguage;
    const featured = bookStore.getFeaturedBooks();
    const allBooks = bookStore.getAllBooks();

    // Render featured book if exists
    if (featured.length > 0) {
      this.renderFeatured(featured[0]);
    }

    // Render all books grid
    this.renderGrid(allBooks);
  }

  renderFeatured(book) {
    if (!book) return;

    const featuredSection = document.querySelector('.featured-book');
    if (!featuredSection) return;

    const quote = book.quote && book.quote[this.lang] 
      ? `<blockquote class="book-quote">"${book.quote[this.lang]}"</blockquote>` 
      : '';

    featuredSection.innerHTML = `
      <div class="container">
        <div class="book-showcase">
          <div class="book-cover-wrapper">
            <img src="${book.cover}" alt="${book.title[this.lang]}" class="featured-cover">
          </div>
          <div class="book-info">
            <h2>${book.title[this.lang]}</h2>
            <p class="author">${book.author}</p>
            ${quote}
            <p class="description">${book.description[this.lang]}</p>
            <div class="book-meta">
              <span class="pages">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v8h6V4H5z"/>
                </svg>
                ${book.pages} ${bookStore.getTranslation('pages')}
              </span>
              <span class="price">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM6 7h1V5h2v2h1v2H9v2H7V9H6V7z"/>
                </svg>
                ${book.price} ₪
              </span>
            </div>
            <a href="book.html?id=${book.slug}" class="btn-primary">
              ${bookStore.getTranslation('readMore')}
            </a>
          </div>
        </div>
      </div>
    `;
  }

  renderGrid(books) {
    const grid = document.querySelector('.books-grid');
    if (!grid) return;

    if (books.length === 0) {
      grid.innerHTML = `<p class="no-books">${this.lang === 'he' ? 'אין ספרים זמינים' : 'Aucun livre disponible'}</p>`;
      return;
    }

    grid.innerHTML = books.map(book => `
      <article class="book-card">
        <div class="book-card-image">
          <img src="${book.cover}" alt="${book.title[this.lang]}" loading="lazy">
          ${book.status === 'coming_soon' ? `
            <span class="book-badge">${this.lang === 'he' ? 'בקרוב' : 'Bientôt'}</span>
          ` : ''}
        </div>
        <div class="book-card-content">
          <h3>${book.title[this.lang]}</h3>
          <p class="author">${book.author}</p>
          <p class="price">${book.price} ₪</p>
          <a href="book.html?id=${book.slug}" class="btn-secondary">
            ${bookStore.getTranslation('moreDetails')}
          </a>
        </div>
      </article>
    `).join('');
  }
}

// Auto-initialize on catalog page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.books-catalog')) {
    const catalog = new BookCatalog('.books-catalog');
    catalog.render();
  }
});

export default BookCatalog;
