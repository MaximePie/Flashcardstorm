import moment from 'moment';

/**
 * Converts a date to French format
 * @param date The date to be converted
 * @returns {string}
 */
export function toLocale(date) {
  return moment(date).format('Do MMMM YYYY');
}

/**
 * Tells if the viewport is mobile or not
 * @returns {boolean}
 */
export function isMobile() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0) < 768;
}

/**
 * Shuffles array in place. ES6 version
 * @param {Array} a items An array containing the items.
 */
export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
