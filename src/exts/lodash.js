import _ from 'lodash';

_.randomBoolean = function randomBoolean() {
  if (_.random(1) === 0) {
    return false;
  } else {
    return true;
  }
};

_.randomSample = function randomSample(collection, min, max) {
  let begin = 1;
  let end = collection.length;
  if (min !== undefined) {
    begin = Math.floor(min * collection.length / 100);
  }
  if (max !== undefined) {
    end = Math.floor(max * collection.length / 100);
  }

  return _.sample(collection, _.random(begin, end));
};
