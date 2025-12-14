//vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        book: 'book.html',
        chapter: 'chapter.html',
      }
    }
  },

  // CRITICAL: Base path configuration
  // This ensures assets load correctly at https://user.github.io/Geoulah-Books/
  base: process.env.NODE_ENV === 'production' ? '/Geoulah-Books/' : './',

  server: {
    port: 3000,
    open: true,
  }
});