/**
 * Header Component
 * Handles navigation, mobile menu, and language switching
 */

import { i18n } from '../core/i18n.js';

export class Header {
  constructor(element, app) {
    this.element = element;
    this.app = app;
    this.mobileMenuToggle = element.querySelector('.mobile-menu-toggle');
    this.mainNav = element.querySelector('.main-nav');
    this.langButtons = element.querySelectorAll('.lang-btn');

    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupLanguageSwitcher();
    this.setupEventListeners();
  }

  setupMobileMenu() {
    if (!this.mobileMenuToggle || !this.mainNav) return;

    this.mobileMenuToggle.addEventListener('click', () => {
      const isExpanded = this.mobileMenuToggle.getAttribute('aria-expanded') === 'true';

      this.mobileMenuToggle.setAttribute('aria-expanded', !isExpanded);
      this.mainNav.classList.toggle('active');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target) && this.mainNav.classList.contains('active')) {
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.mainNav.classList.remove('active');
      }
    });

    // Close menu when clicking on a link
    const navLinks = this.mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        this.mainNav.classList.remove('active');
      });
    });
  }

  setupLanguageSwitcher() {
    if (!this.langButtons.length) return;

    this.langButtons.forEach(button => {
      button.addEventListener('click', () => {
        const lang = button.dataset.lang;
        this.switchLanguage(lang);
      });
    });
  }

  switchLanguage(lang) {
    // Update app language
    this.app.setLanguage(lang);

    // Update button states
    this.langButtons.forEach(btn => {
      const isActive = btn.dataset.lang === lang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive);
    });

    // Update nav labels
    this.updateNavLabels();
  }

  updateNavLabels() {
    const navLinks = this.mainNav.querySelectorAll('a');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');

      // Update labels based on href
      if (href === '/' || href === '/index.html') {
        link.textContent = i18n.t('home');
      } else if (href === '#books') {
        link.textContent = i18n.t('books');
      } else if (href === '/about.html' || href.includes('about')) {
        link.textContent = i18n.t('about');
      } else if (href === '/contact.html' || href.includes('contact')) {
        link.textContent = i18n.t('contact');
      }
    });
  }

  setupEventListeners() {
    // Listen to language change events
    document.addEventListener('app:languageChange', () => {
      this.updateNavLabels();
    });
  }
}
