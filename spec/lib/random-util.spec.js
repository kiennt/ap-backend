import RandomUtil from '../../dist/lib/random-util';

describe('getRandomMaxRetry', () => {
  it('should return a number in range [2, 5]', () => {
    let number = RandomUtil.randomMaxRetry(2, 5);
    expect((number <= 5)).toBe(true);
    expect((number >= 2)).toBe(true);
  });

  it('should return 5', () => {
    let number = RandomUtil.randomMaxRetry(5, 5);
    expect(number).toBe(5);
  });
});

describe('randomDelay', () => {
  it('should return a time in second', () => {
    let number = RandomUtil.randomDelay(10, 15);
    expect((number <= 15000)).toBe(true);
    expect((number >= 10000)).toBe(true);
  });
});
