////src/js/pages/book.js
import app from '../core/app.js';
import { Header } from '../components/header.js';
import { i18n } from '../core/i18n.js';

// Initialize Header
const headerEl = document.querySelector('.site-header');
if (headerEl) new Header(headerEl, app);

// Get Book ID
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

if (id) {
  loadBook(id);
}

async function loadBook(id) {
  try {
    const book = await app.services.books.getById(id);
    if (!book) throw new Error('Book not found');
    
    // Update Page Title
    const lang = app.getState().currentLanguage;
    document.title = `${book.title[lang]} - Geoulah Books`;

    renderBookDetails(book, lang);
  } catch (e) {
    console.error(e);
    document.getElementById('book-detail').innerHTML = '<p>Book not found.</p>';
  }
}

function renderBookDetails(book, lang) {
  const container = document.getElementById('book-detail');
  const baseUrl = import.meta.env.BASE_URL;

  // Render Hero Section
  container.innerHTML = `
    <div class="book-hero">
      <img src="${baseUrl}${book.coverImage}" alt="${book.title[lang]}">
      <div class="info">
        <h1>${book.title[lang]}</h1>
        <p class="author">${book.author}</p>
        <p class="desc">${book.description[lang]}</p>
      </div>
    </div>
    
    <div class="chapter-list">
      <h2>${i18n.t('tableOfContents')}</h2>
      <ul>
        ${book.chapters.map(chapter => `
          <li>
            <!-- FIXED: Relative Link (No leading slash) -->
            <a href="chapter.html?book=${book.slug}&chapter=${chapter.slug}">
              <span class="num">${chapter.id}</span>
              <span class="title">${chapter.title[lang]}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </div>
  `;
}