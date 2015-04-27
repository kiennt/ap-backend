import lodash from 'lodash';
import changeCase from 'change-case';

/*eslint-disable*/
const SPECIAL_REGEX = /[\`\~\!\@\#\$\%\^\&\*\(\)\;\:\'\"\[\]\{\}\\\|\,\.\/\<\>\?\-\_\=\+\ ]/g;
/*eslint-enable*/

function isSimilarString(str1, str2) {
  if (!str1 || !str2) {
    return false;
  }
  str1 = str1.replace(SPECIAL_REGEX, '').toLowerCase();
  str2 = str2.replace(SPECIAL_REGEX, '').toLowerCase();
  return (str1 === str2);
}

function normalizedString(str) {
  return changeCase.titleCase(str);
}

function randomBoolean(trueRatio, falseRatio) {
  if (trueRatio === undefined || falseRatio === undefined) {
    return Boolean(lodash.random(1));
  } else {
    let rolledNumber = lodash.random(trueRatio + falseRatio - 1);
    return (rolledNumber < trueRatio);
  }
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
