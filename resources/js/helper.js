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
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Compares both strings once they are flatten according to business rules
 *
 * @param firstString
 * @param secondString
 * */
export function areSimilar(firstString, secondString) {
  let flatProvidedAnswer = firstString.toLowerCase();
  let flatAnswer = secondString.toLowerCase();

  const matchingPattern = {
    a: ['ä', 'â', 'à', 'á'],
    e: ['ë', 'ê', 'è', 'é'],
    u: ['ù', 'û', 'ü'],
    o: ['ô', 'ö', 'ó', 'ō'],
    i: ['î', 'ï'],
    '': ['la ', 'les ', 'le ', 'un ', 'une ', 'des ', 'a ', 'an ', 'to ', 'the ', ' '],
    remove: ["l'", '-'],
  };

  Object.entries(matchingPattern).forEach(
    ([absorbingCharacter, absorbedCharacter]) => {
      absorbedCharacter.forEach((absorbed) => {
        const destinationCharacter = absorbingCharacter !== 'remove' ? absorbingCharacter : '';
        while (flatProvidedAnswer.includes(absorbed)) {
          flatProvidedAnswer = flatProvidedAnswer.replace(
            absorbed,
            destinationCharacter,
          );
        }

        while (flatAnswer.includes(absorbed)) {
          flatAnswer = flatAnswer.replace(absorbed, destinationCharacter);
        }
      });
    },
  );

  return flatProvidedAnswer === flatAnswer;
}
