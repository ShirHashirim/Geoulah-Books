// Book Details Page Component
import bookStore from './main.js';

class BookDetails {
  constructor() {
    this.lang = bookStore.currentLanguage;
    this.bookSlug = this.getBookSlugFromURL();
    this.book = null;
  }

  getBookSlugFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
  }

  async render() {
    // Wait for books to load
    while (bookStore.books.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.lang = bookStore.currentLanguage;
    this.book = bookStore.getBook(this.bookSlug);
    
    if (!this.book) {
      this.show404();
      return;
    }

    // Update page title
    document.title = `${this.book.title[this.lang]} - ספרי גאולה`;

    this.renderBookHeader();
    this.renderTableOfContents();
  }

  renderBookHeader() {
    const header = document.querySelector('.book-header');
    if (!header) return;

    const quote = this.book.quote && this.book.quote[this.lang]
      ? `<blockquote class="book-quote">"${this.book.quote[this.lang]}"</blockquote>`
      : '';

    header.innerHTML = `
      <div class="book-cover-section">
        <img src="${this.book.cover}" alt="${this.book.title[this.lang]}" class="book-cover-large">
      </div>
      <div class="book-details">
        <h1>${this.book.title[this.lang]}</h1>
        <p class="author">${this.book.author}</p>
        ${quote}
        <p class="description">${this.book.description[this.lang]}</p>
        
        <div class="book-specs">
          <div class="spec-item">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2h8a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm1 2v8h6V4H5z"/>
            </svg>
            <span>${bookStore.getTranslation('pages')}: ${this.book.pages}</span>
          </div>
          <div class="spec-item">
            <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM6 7h1V5h2v2h1v2H9v2H7V9H6V7z"/>
            </svg>
            <span>${bookStore.getTranslation('price')}: ${this.book.price} ₪</span>
          </div>
        </div>
        
        <div class="book-actions">
          <a href="purchase.html?book=${this.book.slug}" class="btn-purchase">
            ${bookStore.getTranslation('buyNow')}
          </a>
          <a href="index.html" class="btn-back">
            ${this.lang === 'he' ? '← חזרה לקטלוג' : 'Retour au catalogue →'}
          </a>
        </div>
      </div>
    `;
  }

  renderTableOfContents() {
    const tocSection = document.querySelector('.toc');
    if (!tocSection) return;

    if (!this.book.chapters || this.book.chapters.length === 0) {
      tocSection.style.display = 'none';
      return;
    }

    const tocList = document.querySelector('.chapters-list');
    if (!tocList) return;

    tocList.innerHTML = this.book.chapters.map((chapter, index) => `
      <li class="chapter-item">
        <a href="chapter.html?book=${this.book.slug}&chapter=${chapter.slug}">
          <span class="chapter-number">${index + 1}</span>
          <span class="chapter-title">${chapter.title[this.lang]}</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M6 3l6 5-6 5V3z"/>
          </svg>
        </a>
      </li>
    `).join('');
  }

  show404() {
    const main = document.querySelector('main');
    if (!main) return;

    main.innerHTML = `
      <div class="error-404">
        <h1>${bookStore.getTranslation('bookNotFound')}</h1>
        <p>${this.lang === 'he' ? 'הספר שחיפשת לא נמצא במערכת' : 'Le livre que vous cherchez n\'existe pas'}</p>
        <a href="index.html" class="btn-primary">
          ${bookStore.getTranslation('backHome')}
        </a>
      </div>
    `;
  }
}

// Auto-initialize on book details page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.book-page')) {
    const bookDetails = new BookDetails();
    bookDetails.render();
  }
});

export default BookDetails;
