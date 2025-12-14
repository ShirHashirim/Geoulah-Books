src/js/services/book-service.js
export class BookService {
  constructor() {
    // Ensures we look for data/books.json relative to the deployed root
    this.baseUrl = `${import.meta.env.BASE_URL}data`;
    this.cache = new Map();
  }

  async getAll() {
    // Fetches from /Geoulah-Books/data/books.json in prod
    // Fetches from /data/books.json in dev
    const response = await fetch(`${this.baseUrl}/books.json`);
    const data = await response.json();
    return data.books || [];
  }

  async getById(id) {
    const books = await this.getAll();
    return books.find(b => b.id === id || b.slug === id);
  }

  async getChapterContent(contentFile) {
    // contentFile comes from JSON as "content/book/file.html"
    // We explicitly add BASE_URL to ensure it works in subdirectories
    const path = `${import.meta.env.BASE_URL}${contentFile}`;
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.text();
  }
  
  // Helpers for navigation
  getChapter(book, slug) {
    return book?.chapters?.find(c => c.slug === slug || c.id === slug);
  }
  
  getNextChapter(book, currentSlug) {
    const idx = book?.chapters?.findIndex(c => c.slug === currentSlug || c.id === currentSlug);
    return (idx >= 0 && idx < book.chapters.length - 1) ? book.chapters[idx + 1] : null;
  }

  getPreviousChapter(book, currentSlug) {
    const idx = book?.chapters?.findIndex(c => c.slug === currentSlug || c.id === currentSlug);
    return (idx > 0) ? book.chapters[idx - 1] : null;
  }
}

export default new BookService();