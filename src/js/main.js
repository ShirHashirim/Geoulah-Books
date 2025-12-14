//src/js/main.js
import app from './core/app.js';
import { Header } from './components/header.js';
import { BookCatalog } from './components/book-catalog.js';
import { i18n } from './core/i18n.js';

// Initialize Components
const header = new Header(document.querySelector('.site-header'), app);
const catalog = new BookCatalog(document.querySelector('#book-grid'), app);

// Load Data
async function init() {
  try {
    const books = await app.services.books.getAll();
    const currentLang = app.getState().currentLanguage;

    // Render Hero (Featured Book)
    const featuredBook = books.find(b => b.featured);
    if (featuredBook) {
      const heroContent = document.querySelector('.hero-content');
      if (heroContent) {
        // FIXED: Relative link for the button
        heroContent.innerHTML = `
          <h1>${featuredBook.title[currentLang]}</h1>
          <p>${featuredBook.description[currentLang]}</p>
          <a href="book.html?id=${featuredBook.slug}" class="btn-primary">
            ${i18n.t('startReading')}
          </a>
        `;
      }
    }

    // Render Catalog
    catalog.render(books);

  } catch (error) {
    console.error('App init failed:', error);
  }
}

// Event Listeners for Language Change
document.addEventListener('app:languageChange', () => {
  init(); // Re-render content
});

init();