import lodash from 'lodash';


function isSimilarString(str1, str2) {
  if (!str1 || !str2) {
    return false;
  }
  str1 = str1.replace('_', ' ').toLowerCase();
  str2 = str2.replace('_', ' ').toLowerCase();
  return (str1 === str2);
}

function normalizedString(str) {
  if (str) {
    str = str.replace('_', ' ').toLowerCase();
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
