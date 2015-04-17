import lodash from 'lodash';
import changeCase from 'change-case';


const SPECIAL_CHARACTERS = ['_', ',', ' ', '\'', '"', '-'];

function isSimilarString(str1, str2) {
  if (!str1 || !str2) {
    return false;
  }
  SPECIAL_CHARACTERS.forEach((char) => {
    let re = new RegExp(char, 'g');
    str1 = str1.replace(re, '');
    str2 = str2.replace(re, '');
  });
  str1 = str1.toLowerCase();
  str2 = str2.toLowerCase();
  return (str1 === str2);
}

function normalizedString(str) {
  return changeCase.titleCase(str);
}

function randomBoolean() {
  return Boolean(lodash.random(1));
}

function randomSample(collection, min, max) {
  min = min || 0;
  max = max || 100;

  let begin = Math.floor(min * collection.length / 100);
  let end = Math.floor(max * collection.length / 100);

  return lodash.sample(collection, lodash.random(begin, end));
}

/*
 * Add functions to both `lodash` and `lodash.prototype`
 */
lodash.mixin({
  randomSample: randomSample
});

/*
 * Add functions to `lodash` only
 */
lodash.isSimilarString = isSimilarString;
lodash.normalizedString = normalizedString;
lodash.randomBoolean = randomBoolean;
