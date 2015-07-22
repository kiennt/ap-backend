import mongo from 'mongodb';
import Promise from 'bluebird';

Promise.promisifyAll(mongo.MongoClient);
Promise.promisifyAll(mongo.Collection.prototype);
mongo.Collection.prototype._find = mongo.Collection.prototype.find;
mongo.Collection.prototype.find = function() {
  let cursor = this._find.apply(this, arguments);
  cursor.toArrayAsync = Promise.promisify(cursor.toArray, cursor);
  return cursor;
};

export default mongo;
