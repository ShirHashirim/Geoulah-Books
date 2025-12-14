/**
 * Storage Service
 * LocalStorage wrapper with error handling
 */

export class StorageService {
  constructor(prefix = 'geoulah_') {
    this.prefix = prefix;
    this.isAvailable = this.checkAvailability();
  }

  /**
   * Check if localStorage is available
   * @returns {boolean}
   */
  checkAvailability() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available:', e);
      return false;
    }
  }

  /**
   * Get prefixed key
   * @param {string} key
   * @returns {string}
   */
  getKey(key) {
    return `${this.prefix}${key}`;
  }

  /**
   * Get item from localStorage
   * @param {string} key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*}
   */
  get(key, defaultValue = null) {
    if (!this.isAvailable) {
      return defaultValue;
    }

    try {
      const item = localStorage.getItem(this.getKey(key));
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (e) {
      console.error(`Error reading from localStorage (key: ${key}):`, e);
      return defaultValue;
    }
  }

  /**
   * Set item in localStorage
   * @param {string} key
   * @param {*} value
   * @returns {boolean} Success status
   */
  set(key, value) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(this.getKey(key), serialized);
      return true;
    } catch (e) {
      console.error(`Error writing to localStorage (key: ${key}):`, e);
      return false;
    }
  }

  /**
   * Remove item from localStorage
   * @param {string} key
   * @returns {boolean} Success status
   */
  remove(key) {
    if (!this.isAvailable) {
      return false;
    }

    try {
      localStorage.removeItem(this.getKey(key));
      return true;
    } catch (e) {
      console.error(`Error removing from localStorage (key: ${key}):`, e);
      return false;
    }
  }

  /**
   * Clear all items with our prefix
   * @returns {boolean} Success status
   */
  clear() {
    if (!this.isAvailable) {
      return false;
    }

    try {
      const keys = Object.keys(localStorage);
      const prefixedKeys = keys.filter(key => key.startsWith(this.prefix));
      prefixedKeys.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (e) {
      console.error('Error clearing localStorage:', e);
      return false;
    }
  }

  /**
   * Check if key exists
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    if (!this.isAvailable) {
      return false;
    }

    return localStorage.getItem(this.getKey(key)) !== null;
  }

  /**
   * Get all keys with our prefix
   * @returns {Array<string>}
   */
  keys() {
    if (!this.isAvailable) {
      return [];
    }

    try {
      const allKeys = Object.keys(localStorage);
      return allKeys
        .filter(key => key.startsWith(this.prefix))
        .map(key => key.substring(this.prefix.length));
    } catch (e) {
      console.error('Error getting localStorage keys:', e);
      return [];
    }
  }

  /**
   * Get storage size in bytes (approximate)
   * @returns {number}
   */
  getSize() {
    if (!this.isAvailable) {
      return 0;
    }

    try {
      const keys = Object.keys(localStorage);
      let size = 0;
      keys.forEach(key => {
        if (key.startsWith(this.prefix)) {
          const value = localStorage.getItem(key);
          size += key.length + (value ? value.length : 0);
        }
      });
      return size;
    } catch (e) {
      console.error('Error calculating localStorage size:', e);
      return 0;
    }
  }
}

export default new StorageService();
