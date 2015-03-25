import _ from 'lodash';
import '../../dist/exts/lodash';


describe('lodash extension', () => {
  describe('randomSample', () => {
    it('should return a collection', () => {
      let collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      let result1 = _.randomSample(collection);
      expect((result1.length >= 1)).toBe(true);
      expect((result1.length <= 10)).toBe(true);

      let result2 = _.randomSample(collection, 40, 50);
      expect((result2.length >= 4)).toBe(true);
      expect((result2.length <= 5)).toBe(true);

      let result3 = _.randomSample(collection, 60, 60);
      expect((result3.length === 6)).toBe(true);
    });
  });
});
