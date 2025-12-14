/**
 * Internationalization (i18n) System
 * Handles translation strings for UI elements
 */

class I18n {
  constructor() {
    this.currentLanguage = 'he';
    this.translations = {
      he: {
        // Navigation
        home: 'בית',
        books: 'ספרים',
        about: 'אודות',
        contact: 'צור קשר',
        purchase: 'רכישה',

        // Common UI
        loading: 'טוען...',
        error: 'שגיאה',
        close: 'סגור',
        back: 'חזרה',
        next: 'הבא',
        previous: 'הקודם',
        readMore: 'קרא עוד',
        viewDetails: 'פרטים נוספים',
        moreDetails: 'פרטים נוספים',

        // Book catalog
        featuredBook: 'ספר מומלץ',
        allBooks: 'כל הספרים',
        noBooksAvailable: 'אין ספרים זמינים כרגע',
        comingSoon: 'בקרוב',
        newRelease: 'חדש',

        // Book details
        author: 'מחבר',
        pages: 'עמודים',
        price: 'מחיר',
        tableOfContents: 'תוכן עניינים',
        chapter: 'פרק',
        buyNow: 'קנה עכשיו',
        backToCatalog: 'חזרה לקטלוג',

        // Chapter reading
        chapterNavigation: 'ניווט פרקים',
        previousChapter: 'פרק קודם',
        nextChapter: 'פרק הבא',
        backToBook: 'חזרה לספר',

        // Status messages
        status: {
          online: 'חזרת למצב מקוון',
          offline: 'אתה במצב לא מקוון - תוכן שמור זמין',
          loading: 'טוען...',
          error: 'אירעה שגיאה'
        },

        // Errors
        errors: {
          general: 'אירעה שגיאה. אנא נסה שוב.',
          bookNotFound: 'הספר לא נמצא',
          chapterNotFound: 'הפרק לא נמצא',
          networkError: 'שגיאת רשת. בדוק את החיבור שלך.',
          loadFailed: 'הטעינה נכשלה'
        },

        // Accessibility
        a11y: {
          skipToMain: 'דלג לתוכן הראשי',
          openMenu: 'פתח תפריט',
          closeMenu: 'סגור תפריט',
          changeLanguage: 'שנה שפה',
          loading: 'טוען תוכן',
          imageAlt: 'תמונה של {title}'
        },

        // Currency
        currency: {
          ils: '₪',
          eur: '€',
          usd: '$'
        }
      },
      fr: {
        // Navigation
        home: 'Accueil',
        books: 'Livres',
        about: 'À propos',
        contact: 'Contact',
        purchase: 'Achat',

        // Common UI
        loading: 'Chargement...',
        error: 'Erreur',
        close: 'Fermer',
        back: 'Retour',
        next: 'Suivant',
        previous: 'Précédent',
        readMore: 'Lire la suite',
        viewDetails: 'Voir les détails',
        moreDetails: 'Plus de détails',

        // Book catalog
        featuredBook: 'Livre en vedette',
        allBooks: 'Tous les livres',
        noBooksAvailable: 'Aucun livre disponible actuellement',
        comingSoon: 'Bientôt disponible',
        newRelease: 'Nouveau',

        // Book details
        author: 'Auteur',
        pages: 'Pages',
        price: 'Prix',
        tableOfContents: 'Table des matières',
        chapter: 'Chapitre',
        buyNow: 'Acheter',
        backToCatalog: 'Retour au catalogue',

        // Chapter reading
        chapterNavigation: 'Navigation',
        previousChapter: 'Chapitre précédent',
        nextChapter: 'Chapitre suivant',
        backToBook: 'Retour au livre',

        // Status messages
        status: {
          online: 'Vous êtes de nouveau en ligne',
          offline: 'Vous êtes hors ligne - contenu sauvegardé disponible',
          loading: 'Chargement...',
          error: 'Une erreur s\'est produite'
        },

        // Errors
        errors: {
          general: 'Une erreur s\'est produite. Veuillez réessayer.',
          bookNotFound: 'Livre non trouvé',
          chapterNotFound: 'Chapitre non trouvé',
          networkError: 'Erreur réseau. Vérifiez votre connexion.',
          loadFailed: 'Le chargement a échoué'
        },

        // Accessibility
        a11y: {
          skipToMain: 'Passer au contenu principal',
          openMenu: 'Ouvrir le menu',
          closeMenu: 'Fermer le menu',
          changeLanguage: 'Changer de langue',
          loading: 'Chargement du contenu',
          imageAlt: 'Image de {title}'
        },

        // Currency
        currency: {
          ils: '₪',
          eur: '€',
          usd: '$'
        }
      }
    };
  }

  /**
   * Set current language
   * @param {string} lang - Language code ('he' or 'fr')
   */
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
    } else {
      console.warn(`Language '${lang}' not supported, falling back to 'he'`);
      this.currentLanguage = 'he';
    }
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key (supports dot notation, e.g., 'errors.general')
   * @param {Object} params - Parameters for string interpolation
   * @returns {string} Translated string
   */
  t(key, params = {}) {
    const keys = key.split('.');
    let value = this.translations[this.currentLanguage];

    // Navigate through nested keys
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key '${key}' not found for language '${this.currentLanguage}'`);
        return key;
      }
    }

    // If we got a string, interpolate parameters
    if (typeof value === 'string') {
      return this.interpolate(value, params);
    }

    console.warn(`Translation key '${key}' is not a string`);
    return key;
  }

  /**
   * Interpolate parameters into string
   * @param {string} str - String with placeholders like {name}
   * @param {Object} params - Parameters to interpolate
   * @returns {string} Interpolated string
   */
  interpolate(str, params) {
    return str.replace(/\{(\w+)\}/g, (match, key) => {
      return params.hasOwnProperty(key) ? params[key] : match;
    });
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Check if language is RTL
   * @param {string} lang - Language code (optional, defaults to current)
   * @returns {boolean} True if RTL
   */
  isRTL(lang = this.currentLanguage) {
    return lang === 'he' || lang === 'ar';
  }

  /**
   * Get direction for language
   * @param {string} lang - Language code (optional, defaults to current)
   * @returns {string} 'rtl' or 'ltr'
   */
  getDirection(lang = this.currentLanguage) {
    return this.isRTL(lang) ? 'rtl' : 'ltr';
  }

  /**
   * Get all available languages
   * @returns {Array} Array of language codes
   */
  getAvailableLanguages() {
    return Object.keys(this.translations);
  }

  /**
   * Add or update translations
   * @param {string} lang - Language code
   * @param {Object} translations - Translation object
   */
  addTranslations(lang, translations) {
    if (!this.translations[lang]) {
      this.translations[lang] = {};
    }
    this.translations[lang] = { ...this.translations[lang], ...translations };
  }
}

// Export singleton instance
export const i18n = new I18n();
export default i18n;
