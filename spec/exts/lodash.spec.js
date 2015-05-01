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
      let str = 'aa__++bb\'b_--,\\CC++D';
      let result = _.normalizedString(str);
      expect(result).toBe('Aa Bbb Cc D');
    });
    it('should return empty string', () => {
      let result = _.normalizedString(undefined);
      expect(result).toBe('');
    });
  });

  describe('isSimilarString', () => {
    it('should return true', () => {
      let result1 = _.isSimilarString('animal_pets', 'Animal & Pets');
      expect(result1).toBeTruthy();

      let result2 = _.isSimilarString('womens-fashion', 'Women\'s fashion');
      expect(result2).toBeTruthy();

      let result3 = _.isSimilarString(
        'Hello-world+this-i\'s_nova', 'heLlo wOrld tHiS is nova');
      expect(result3).toBeTruthy();
    });

    it('should return false', () => {
      let result = _.isSimilarString('Men Fashion', 'Women Fashion');
      expect(result).toBeFalsy();
    });
  });
});
