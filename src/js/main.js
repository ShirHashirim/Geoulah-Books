/**
 * Main JavaScript Entry Point
 * Initializes the application and loads page-specific components
 */

import app from './core/app.js';
import { BookCatalog } from './components/book-catalog.js';
import { Header } from './components/header.js';

// Initialize header component (present on all pages)
const headerElement = document.querySelector('.site-header');
if (headerElement) {
  new Header(headerElement, app);
}

// Initialize page-specific components based on current page
const currentPage = window.location.pathname;

if (currentPage === '/' || currentPage === '/index.html' || currentPage.endsWith('/Geoulah-Books/')) {
  // Home page - initialize book catalog
  const catalogElement = document.querySelector('.books-catalog');
  if (catalogElement) {
    new BookCatalog(catalogElement, app);
  }
}

// Log initialization
console.log('Geoulah Books initialized');
