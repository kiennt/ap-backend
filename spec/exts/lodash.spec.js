import _ from 'lodash';
import '../../dist/exts/lodash';


describe('lodash extension', () => {
  describe('randomSample', () => {
    it('should return a collection', () => {
      let collection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      let result1 = _.randomSample(collection);
      expect(result1.length >= 0).toBe(true);
      expect(result1.length <= 10).toBe(true);

      let result2 = _.randomSample(collection, 40, 50);
      expect(result2.length >= 4).toBe(true);
      expect(result2.length <= 5).toBe(true);

      let result3 = _.randomSample(collection, 60, 60);
      expect(result3.length).toBe(6);

      let result4 = _(collection).randomSample(50, 50).value();
      expect(result4.length).toBe(5);
    });
  });

  describe('normalizedString', () => {
    it('should return normalized string', () => {
      let str = 'aa__bB_CC';
      let result = _.normalizedString(str);
      expect(result).toBe('Aa Bb Cc');
    });
    it('should return undefined', () => {
      let result = _.normalizedString(undefined);
      expect(result).toBe(undefined);
    });
  });

  describe('isSimilarString', () => {
    it('should return true', () => {
      let str1 = 'Aa_Bb_Cc';
      let str2 = 'AA BB CC';
      let result = _.isSimilarString(str1, str2);
      expect(result).toBe(true);
    });
    it('should return false', () => {
      let str1 = 'Aa_bBb_Cc';
      let str2 = 'AA BB CC';
      let result = _.isSimilarString(str1, str2);
      expect(result).toBe(false);
    });
  });
});
