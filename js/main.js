import 'whatwg-fetch';
// Main application logic and BookStore class
class BookStore {
  constructor() {
    this.books = [];
    this.currentLanguage = 'he';
    this.init();
  }

  async init() {
    await this.loadBooks();
    this.detectLanguage();
    this.setupLanguageSwitcher();
    this.setupMobileMenu();
  }

  async loadBooks() {
    try {
      const response = await fetch('/Geoulah-Books/data/books.json');
      const data = await response.json();
      this.books = data.books;
      console.log(`Loaded ${this.books.length} books`);
    } catch (error) {
      console.error('Error loading books:', error);
      this.books = [];
    }
  }

  detectLanguage() {
    // Check URL parameter first
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get('lang');
    
    // Then check localStorage
    const storedLang = localStorage.getItem('preferredLanguage');
    
    // Default to Hebrew
    this.currentLanguage = langParam || storedLang || 'he';
    
    // Apply language to document
    document.documentElement.setAttribute('lang', this.currentLanguage);
    document.documentElement.setAttribute('dir', this.currentLanguage === 'he' ? 'rtl' : 'ltr');
    
    // Update active language link
    this.updateLanguageLinks();
  }

  updateLanguageLinks() {
    const langLinks = document.querySelectorAll('[data-lang]');
    langLinks.forEach(link => {
      if (link.dataset.lang === this.currentLanguage) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setupLanguageSwitcher() {
    const langLinks = document.querySelectorAll('[data-lang]');
    langLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = link.dataset.lang;
        this.switchLanguage(lang);
      });
    });
  }

  switchLanguage(lang) {
    this.currentLanguage = lang;
    localStorage.setItem('preferredLanguage', lang);
    
    // Update URL and reload
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.location.href = url.toString();
  }

  setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const nav = document.querySelector('.main-nav');
    
    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        nav.classList.toggle('active');
        toggle.classList.toggle('active');
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!nav.contains(e.target) && !toggle.contains(e.target)) {
          nav.classList.remove('active');
          toggle.classList.remove('active');
        }
      });
    }
  }

  getBook(slug) {
    return this.books.find(book => book.slug === slug);
  }

  getFeaturedBooks() {
    return this.books.filter(book => book.featured);
  }

  getAllBooks() {
    return this.books;
  }

  getTranslation(key) {
    const translations = {
      he: {
        readMore: 'קרא עוד',
        moreDetails: 'פרטים נוספים',
        buyNow: 'רכוש עכשיו',
        pages: 'עמודים',
        price: 'מחיר',
        toc: 'תוכן עניינים',
        allBooks: 'כל הספרים',
        home: 'בית',
        books: 'ספרים',
        about: 'אודות',
        contact: 'צור קשר',
        bookNotFound: 'הספר לא נמצא',
        chapterNotFound: 'הפרק לא נמצא',
        backHome: 'חזרה לעמוד הראשי',
        loadingError: 'שגיאה בטעינת התוכן'
      },
      fr: {
        readMore: 'En savoir plus',
        moreDetails: 'Détails',
        buyNow: 'Acheter',
        pages: 'pages',
        price: 'Prix',
        toc: 'Table des matières',
        allBooks: 'Tous les livres',
        home: 'Accueil',
        books: 'Livres',
        about: 'À propos',
        contact: 'Contact',
        bookNotFound: 'Livre non trouvé',
        chapterNotFound: 'Chapitre non trouvé',
        backHome: 'Retour à l\'accueil',
        loadingError: 'Erreur de chargement'
      }
    };

    return translations[this.currentLanguage][key] || key;
  }
}

// Global instance - available to all modules
const bookStore = new BookStore();

// Export for ES6 modules
export default bookStore;
