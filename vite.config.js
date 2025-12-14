import { defineConfig } from 'vite';

export default defineConfig({
  // Root directory for source files
  root: '.',

  // Public directory for static assets
  publicDir: 'public',

  // Build configuration
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
    minify: 'terser',

    rollupOptions: {
      input: {
        main: 'index.html',
        book: 'book.html',
        chapter: 'chapter.html',
        // Add other HTML pages when created
        // about: 'about.html',
        // contact: 'contact.html',
      }
     }
    },

   output: {
  // Manual chunks for better caching
  // manualChunks: {
  //   vendor: []
  // },
  cssCodeSplit: true,
  chunkSizeWarningLimit: 500,
  assetsDir: 'assets',
  terserOptions: {
    compress: {
      drop_console: true,
      drop_debugger: true
    }
  }
},

  // Development server configuration
  server: {
    port: 3000,
    strictPort: false,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
  },

  // Preview server configuration
  preview: {
    port: 4173,
    strictPort: false,
    open: true
  },

  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@css': '/src/css',
      '@js': '/src/js',
      '@data': '/src/data',
      '@content': '/content',
      '@images': '/images'
    }
  },

  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {}
  },

  // Environment variables
  envPrefix: 'VITE_',

  // Base public path for GitHub Pages
  // Use '/Geoulah-Books/' for production, './' for local dev
  base: process.env.NODE_ENV === 'production' ? '/Geoulah-Books/' : './',

  // Plugin configuration (placeholder for future plugins)
  plugins: []
});
