import lodash from 'lodash';


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
lodash.randomBoolean = randomBoolean;
