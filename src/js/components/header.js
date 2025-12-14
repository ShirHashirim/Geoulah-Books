//src/js/components/header.js
import { i18n } from '../core/i18n.js';

export class Header {
  constructor(element, app) {
    this.element = element;
    this.app = app;
    this.render();
  }

  render() {
    const lang = this.app.getState().currentLanguage;
    
    // FIXED: Logo href is "index.html" (relative), NOT "/" (absolute)
    this.element.innerHTML = `
      <div class="header-content">
        <a href="index.html" class="logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text">Geoulah Books</span>
        </a>
        
        <nav>
          <button id="lang-toggle" class="btn-text">
            ${lang === 'he' ? 'Français' : 'עברית'}
          </button>
        </nav>
      </div>
    `;

    // Attach Event Listeners
    this.element.querySelector('#lang-toggle').addEventListener('click', () => {
      const newLang = lang === 'he' ? 'fr' : 'he';
      this.app.setState({ currentLanguage: newLang });
    });
  }
}