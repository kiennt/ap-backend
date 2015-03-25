import _ from 'lodash';

_.randomBoolean = function randomBoolean() {
  return Boolean(_.random(1));
};

_.randomSample = function randomSample(collection, min, max) {
  min = min || 0;
  max = max || 100;

  let begin = Math.floor(min * collection.length / 100);
  let end = Math.floor(max * collection.length / 100);

  return _.sample(collection, _.random(begin, end));
};
