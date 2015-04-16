import lodash from 'lodash';
import changeCase from 'change-case';


function isSimilarString(str1, str2) {
  if (!str1 || !str2) {
    return false;
  }
  str1 = changeCase.titleCase(str1.toLowerCase());
  str2 = changeCase.titleCase(str2.toLowerCase());
  return (str1 === str2);
}

function normalizedString(str) {
  if (str) {
    str = str.toLowerCase();
    str = changeCase.titleCase(str);
    return str;
  }
  return undefined;
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
