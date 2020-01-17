import moment from 'moment';

export function toLocale(date) {
  return moment(date).format('Do MMMM YYYY');
}

export function isMobile() {
  return Math.max(document.documentElement.clientWidth, window.innerWidth || 0) < 768;
}
