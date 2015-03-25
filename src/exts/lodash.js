import _ from 'lodash';

_.randomBoolean = function() {
  return _.random(1);
};

_.sampleCollection = function(collection) {
  return _.sample(collection, _.random(1, collection.length));
};
