// Chapter Viewer Component
import bookStore from './main.js';

class ChapterViewer {
  constructor() {
    this.lang = bookStore.currentLanguage;
    this.bookSlug = this.getParam('book');
    this.chapterSlug = this.getParam('chapter');
    this.book = null;
    this.chapter = null;
  }

  getParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
  }

  async render() {
    // Wait for books to load
    while (bookStore.books.length === 0) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    this.lang = bookStore.currentLanguage;
    this.book = bookStore.getBook(this.bookSlug);
    
    if (!this.book) {
      this.show404('book');
      return;
    }

    this.chapter = this.book.chapters?.find(ch => ch.slug === this.chapterSlug);
    
    if (!this.chapter) {
      this.show404('chapter');
      return;
    }

    // Update page title
    document.title = `${this.chapter.title[this.lang]} - ${this.book.title[this.lang]}`;

    await this.loadChapterContent();
    this.renderNavigation();
  }

  async loadChapterContent() {
    const titleElement = document.querySelector('.chapter-title');
    const contentArea = document.querySelector('.chapter-content');
    
    if (!contentArea) return;

    if (titleElement) {
      titleElement.textContent = this.chapter.title[this.lang];
    }

    // Show loading state
    contentArea.innerHTML = `<p class="loading">${this.lang === 'he' ? 'טוען...' : 'Chargement...'}</p>`;

    try {
      const response = await fetch(this.chapter.contentFile);
      
      if (!response.ok) {
        throw new Error('Content not found');
      }
      
      const content = await response.text();
      contentArea.innerHTML = content;
    } catch (error) {
      console.error('Error loading chapter content:', error);
      contentArea.innerHTML = `
        <div class="error-message">
          <p>${bookStore.getTranslation('loadingError')}</p>
          <p>${this.lang === 'he' ? 'נא לנסות שוב מאוחר יותר' : 'Veuillez réessayer plus tard'}</p>
        </div>
      `;
    }
  }

  renderNavigation() {
    const nav = document.querySelector('.chapter-nav');
    if (!nav) return;

    const currentIndex = this.book.chapters.findIndex(ch => ch.slug === this.chapterSlug);
    const prevChapter = this.book.chapters[currentIndex - 1];
    const nextChapter = this.book.chapters[currentIndex + 1];

    const isRtl = this.lang === 'he';

    nav.innerHTML = `
      <div class="nav-container">
        ${prevChapter ? `
          <a href="chapter.html?book=${this.book.slug}&chapter=${prevChapter.slug}" class="nav-prev">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="${isRtl ? 'M6 3l6 5-6 5V3z' : 'M10 3L4 8l6 5V3z'}"/>
            </svg>
            <span>${prevChapter.title[this.lang]}</span>
          </a>
        ` : '<div></div>'}
        
        <a href="book.html?id=${this.book.slug}" class="nav-toc">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M2 3h12v2H2V3zm0 4h12v2H2V7zm0 4h8v2H2v-2z"/>
          </svg>
          ${bookStore.getTranslation('toc')}
        </a>
        
        ${nextChapter ? `
          <a href="chapter.html?book=${this.book.slug}&chapter=${nextChapter.slug}" class="nav-next">
            <span>${nextChapter.title[this.lang]}</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="${isRtl ? 'M10 3L4 8l6 5V3z' : 'M6 3l6 5-6 5V3z'}"/>
            </svg>
          </a>
        ` : '<div></div>'}
      </div>
    `;
  }

  show404(type) {
    const main = document.querySelector('main');
    if (!main) return;

    const message = type === 'book' 
      ? bookStore.getTranslation('bookNotFound')
      : bookStore.getTranslation('chapterNotFound');

    main.innerHTML = `
      <div class="error-404">
        <h1>${message}</h1>
        <p>${this.lang === 'he' ? 'התוכן שחיפשת לא נמצא במערכת' : 'Le contenu que vous cherchez n\'existe pas'}</p>
        <a href="index.html" class="btn-primary">
          ${bookStore.getTranslation('backHome')}
        </a>
      </div>
    `;
  }
}

// Auto-initialize on chapter page
document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('.chapter-page')) {
    const chapterViewer = new ChapterViewer();
    chapterViewer.render();
  }
});

export default ChapterViewer;
