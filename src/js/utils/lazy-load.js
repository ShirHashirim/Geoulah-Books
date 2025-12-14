/**
 * Lazy Loading Utility
 * Progressive image loading using IntersectionObserver
 */

/**
 * Lazy load images with data-src attribute
 * @param {Element} container - Container element to search for images
 */
export function lazyLoadImages(container = document) {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.dataset.src;

          if (src) {
            // Create a new image to preload
            const tempImg = new Image();

            tempImg.onload = () => {
              img.src = src;
              img.removeAttribute('data-src');
              img.classList.add('loaded');
            };

            tempImg.onerror = () => {
              // Fallback: show a placeholder or error image
              console.error(`Failed to load image: ${src}`);
              img.alt = img.alt + ' (failed to load)';
            };

            tempImg.src = src;
            imageObserver.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before image enters viewport
      threshold: 0.01
    });

    // Observe all images with data-src
    const lazyImages = container.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers without IntersectionObserver support
    const lazyImages = container.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

/**
 * Preload critical images
 * @param {Array<string>} urls - Array of image URLs to preload
 */
export function preloadImages(urls) {
  urls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

export default { lazyLoadImages, preloadImages };
