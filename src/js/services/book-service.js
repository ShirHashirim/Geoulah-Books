/**
 * Book Service
 * Handles all book-related data operations with caching
 */

export class BookService {
  constructor() {
    // Use Vite's base URL - automatically handles dev vs production
    this.baseUrl = `${import.meta.env.BASE_URL}data`;
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Get all books from JSON file
   * @returns {Promise<Array>} Array of book objects
   */
  async getAll() {
    const cacheKey = 'all-books';

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    // Fetch from network
    try {
      const response = await fetch(`${this.baseUrl}/books.json`);
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
      }

      const data = await response.json();
      const books = data.books || [];

      // Cache the result
      this.cache.set(cacheKey, {
        data: books,
        timestamp: Date.now()
      });

      return books;
    } catch (error) {
      console.error('Error fetching books:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        console.warn('Using expired cache data');
        return this.cache.get(cacheKey).data;
      }

      throw error;
    }
  }

  /**
   * Get book by slug
   * @param {string} slug - Book slug identifier
   * @returns {Promise<Object>} Book object
   */
  async getBySlug(slug) {
    const books = await this.getAll();
    const book = books.find(b => b.slug === slug || b.id === slug);

    if (!book) {
      throw new Error(`Book not found: ${slug}`);
    }

    return book;
  }

  /**
   * Get book by ID
   * @param {string} id - Book ID
   * @returns {Promise<Object>} Book object
   */
  async getById(id) {
    return this.getBySlug(id);
  }

  /**
   * Get all featured books
   * @returns {Promise<Array>} Array of featured books
   */
  async getFeatured() {
    const books = await this.getAll();
    return books.filter(book => book.featured === true);
  }

  /**
   * Get books by status
   * @param {string} status - Book status ('available', 'coming_soon', etc.)
   * @returns {Promise<Array>} Array of books with given status
   */
  async getByStatus(status) {
    const books = await this.getAll();
    return books.filter(book => book.status === status);
  }

  /**
   * Get chapter content from HTML file
   * @param {string} contentFile - Path to chapter content file
   * @returns {Promise<string>} Chapter HTML content
   */
  async getChapterContent(contentFile) {
    const cacheKey = `chapter-${contentFile}`;

    // Check cache
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      const response = await fetch(contentFile);
      if (!response.ok) {
        throw new Error(`Chapter not found: ${contentFile}`);
      }

      const content = await response.text();

      // Cache the result
      this.cache.set(cacheKey, {
        data: content,
        timestamp: Date.now()
      });

      return content;
    } catch (error) {
      console.error('Error loading chapter:', error);

      // Return cached data if available, even if expired
      if (this.cache.has(cacheKey)) {
        console.warn('Using expired cache for chapter');
        return this.cache.get(cacheKey).data;
      }

      throw error;
    }
  }

  /**
   * Get chapter from book by chapter slug
   * @param {Object} book - Book object
   * @param {string} chapterSlug - Chapter slug
   * @returns {Object|null} Chapter object or null
   */
  getChapter(book, chapterSlug) {
    if (!book || !book.chapters) {
      return null;
    }

    return book.chapters.find(ch => ch.slug === chapterSlug || ch.id === chapterSlug);
  }

  /**
   * Get next chapter
   * @param {Object} book - Book object
   * @param {string} currentChapterSlug - Current chapter slug
   * @returns {Object|null} Next chapter or null
   */
  getNextChapter(book, currentChapterSlug) {
    if (!book || !book.chapters) {
      return null;
    }

    const currentIndex = book.chapters.findIndex(
      ch => ch.slug === currentChapterSlug || ch.id === currentChapterSlug
    );

    if (currentIndex === -1 || currentIndex === book.chapters.length - 1) {
      return null;
    }

    return book.chapters[currentIndex + 1];
  }

  /**
   * Get previous chapter
   * @param {Object} book - Book object
   * @param {string} currentChapterSlug - Current chapter slug
   * @returns {Object|null} Previous chapter or null
   */
  getPreviousChapter(book, currentChapterSlug) {
    if (!book || !book.chapters) {
      return null;
    }

    const currentIndex = book.chapters.findIndex(
      ch => ch.slug === currentChapterSlug || ch.id === currentChapterSlug
    );

    if (currentIndex <= 0) {
      return null;
    }

    return book.chapters[currentIndex - 1];
  }

  /**
   * Clear all cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Remove specific item from cache
   * @param {string} key - Cache key
   */
  removeCacheItem(key) {
    this.cache.delete(key);
  }

  /**
   * Get cache stats
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    const entries = Array.from(this.cache.entries());
    const now = Date.now();

    return {
      totalItems: this.cache.size,
      validItems: entries.filter(([, v]) => now - v.timestamp < this.cacheExpiry).length,
      expiredItems: entries.filter(([, v]) => now - v.timestamp >= this.cacheExpiry).length
    };
  }

  /**
   * Preload all book data
   * @returns {Promise<void>}
   */
  async preload() {
    try {
      await this.getAll();
      console.log('Book data preloaded successfully');
    } catch (error) {
      console.error('Failed to preload book data:', error);
    }
  }
}

export default new BookService();
