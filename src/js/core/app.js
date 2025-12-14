/**
 * Main Application Controller
 * Coordinates all application components and state
 */

import { BookService } from '../services/book-service.js';
import { StorageService } from '../services/storage-service.js';
import { i18n } from './i18n.js';

class App {
  constructor() {
    this.state = {
      books: [],
      currentLanguage: 'he',
      isLoading: true,
      error: null,
      isOnline: navigator.onLine
    };

    this.services = {
      books: new BookService(),
      storage: new StorageService()
    };

    this.components = new Map();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      console.log('Initializing Geoulah Books application...');

      // Detect and set language
      const detectedLang = this.detectLanguage();
      this.setLanguage(detectedLang);

      // Setup event listeners
      this.setupEventListeners();

      // Load data
      await this.loadData();

      // Initialize components after data is loaded
      this.initComponents();

      // Register service worker (if in production)
      if (import.meta.env.PROD) {
        this.registerServiceWorker();
      }

      this.setState({ isLoading: false });
      console.log('Application initialized successfully');
    } catch (error) {
      console.error('Application initialization error:', error);
      this.handleError(error);
    }
  }

  /**
   * Detect user's preferred language
   * @returns {string} Language code
   */
  detectLanguage() {
    // Priority: URL param > localStorage > browser language > default
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');

    if (langParam && ['he', 'fr'].includes(langParam)) {
      return langParam;
    }

    const storedLang = this.services.storage.get('preferredLanguage');
    if (storedLang && ['he', 'fr'].includes(storedLang)) {
      return storedLang;
    }

    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'fr' ? 'fr' : 'he';
  }

  /**
   * Set application language
   * @param {string} lang - Language code ('he' or 'fr')
   */
  setLanguage(lang) {
    if (!['he', 'fr'].includes(lang)) {
      console.warn(`Invalid language: ${lang}, defaulting to 'he'`);
      lang = 'he';
    }

    this.state.currentLanguage = lang;
    this.services.storage.set('preferredLanguage', lang);

    // Update document attributes
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'he' ? 'rtl' : 'ltr');

    // Update i18n
    i18n.setLanguage(lang);

    // Update page title if it exists
    this.updatePageTitle();

    // Emit language change event
    this.emit('languageChange', { language: lang });

    console.log(`Language set to: ${lang}`);
  }

  /**
   * Update page title based on current language
   */
  updatePageTitle() {
    const titleElement = document.querySelector('title');
    if (titleElement) {
      const currentLang = this.state.currentLanguage;
      const baseTitle = currentLang === 'he'
        ? 'ספרי גאולה - Geoulah Books'
        : 'Geoulah Books - ספרי גאולה';
      titleElement.textContent = baseTitle;
    }
  }

  /**
   * Initialize all components on the current page
   */
  initComponents() {
    // Components will be initialized dynamically based on page
    // This is called from page-specific scripts
    console.log('Ready to initialize components');
  }

  /**
   * Register a component
   * @param {string} name - Component name
   * @param {Object} component - Component instance
   */
  registerComponent(name, component) {
    this.components.set(name, component);
    console.log(`Component registered: ${name}`);
  }

  /**
   * Get a registered component
   * @param {string} name - Component name
   * @returns {Object|undefined} Component instance
   */
  getComponent(name) {
    return this.components.get(name);
  }

  /**
   * Load application data
   */
  async loadData() {
    try {
      this.setState({ isLoading: true });
      const books = await this.services.books.getAll();
      this.setState({ books, isLoading: false, error: null });
      console.log(`Loaded ${books.length} books`);
    } catch (error) {
      console.error('Error loading data:', error);
      this.setState({ error: error.message, isLoading: false });
      throw error;
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Online/offline detection
    window.addEventListener('online', () => this.handleOnlineStatus(true));
    window.addEventListener('offline', () => this.handleOnlineStatus(false));

    // Visibility change (for performance optimization)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.onPageHidden();
      } else {
        this.onPageVisible();
      }
    });

    // Handle errors globally
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
    });
  }

  /**
   * Update application state
   * @param {Object} newState - State updates
   */
  setState(newState) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };

    // Emit state change event
    this.emit('stateChange', {
      newState: this.state,
      oldState,
      changes: newState
    });
  }

  /**
   * Get current application state
   * @returns {Object} Current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Emit custom event
   * @param {string} eventName - Event name
   * @param {*} data - Event data
   */
  emit(eventName, data) {
    const event = new CustomEvent(`app:${eventName}`, {
      detail: data,
      bubbles: true
    });
    document.dispatchEvent(event);
  }

  /**
   * Listen to app events
   * @param {string} eventName - Event name (without 'app:' prefix)
   * @param {Function} handler - Event handler
   * @returns {Function} Cleanup function
   */
  on(eventName, handler) {
    const fullEventName = `app:${eventName}`;
    document.addEventListener(fullEventName, handler);

    // Return cleanup function
    return () => document.removeEventListener(fullEventName, handler);
  }

  /**
   * Register service worker for PWA
   */
  async registerServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered:', registration.scope);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }

  /**
   * Handle errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    console.error('Application error:', error);
    this.setState({ error: error.message });

    // Show user-friendly error message
    this.showNotification(i18n.t('errors.general'), 'error');
  }

  /**
   * Handle online/offline status changes
   * @param {boolean} isOnline - Online status
   */
  handleOnlineStatus(isOnline) {
    this.setState({ isOnline });

    const message = isOnline
      ? i18n.t('status.online')
      : i18n.t('status.offline');

    this.showNotification(message, isOnline ? 'success' : 'warning');

    console.log(`Network status: ${isOnline ? 'online' : 'offline'}`);
  }

  /**
   * Show notification to user
   * @param {string} message - Notification message
   * @param {string} type - Notification type ('info', 'success', 'warning', 'error')
   * @param {number} duration - Duration in ms (0 = permanent)
   */
  showNotification(message, type = 'info', duration = 3000) {
    // Simple console notification for now
    // Can be enhanced with toast/snackbar UI component
    console.log(`[${type.toUpperCase()}] ${message}`);

    // Emit notification event for UI components to handle
    this.emit('notification', { message, type, duration });
  }

  /**
   * Page hidden event handler
   */
  onPageHidden() {
    // Pause non-critical operations when page is hidden
    console.log('Page hidden');
  }

  /**
   * Page visible event handler
   */
  onPageVisible() {
    // Resume operations when page becomes visible
    console.log('Page visible');
  }

  /**
   * Get book by ID or slug
   * @param {string} identifier - Book ID or slug
   * @returns {Promise<Object>} Book object
   */
  async getBook(identifier) {
    return this.services.books.getBySlug(identifier);
  }

  /**
   * Get all books
   * @returns {Array} Books from state
   */
  getBooks() {
    return this.state.books;
  }

  /**
   * Reload application data
   */
  async reload() {
    this.services.books.clearCache();
    await this.loadData();
  }
}

// Create and export singleton instance
const app = new App();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

export default app;
