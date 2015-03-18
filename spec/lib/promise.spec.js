/* global describe, it, expect, spyOn, jasmine, fail */
/* global beforeEach, afterEach, beforeAll, afterAll */

import Promise from '../../dist/lib/promise';


describe('Promise-extensions', () => {

  describe('Promise.tryUntil', () => {
    it('should reject after exceeds maxRetries', (done) => {
      let promiseFunc = jasmine.createSpy('promiseFunc');
      promiseFunc.and.callFake((x) => Promise.reject(x));

      let maxRetries = 5;
      let failValue = -1;
      let retryConfig = {maxRetries: maxRetries};
      Promise.tryUntil(retryConfig, promiseFunc, failValue)
        .then(() => done(new Error('This Promise should never be resolved')))
        .catch((x) => {
          expect(x).toBe(failValue);
          expect(promiseFunc).toHaveBeenCalledWith(failValue);
          expect(promiseFunc.calls.count()).toBe(maxRetries + 1);
        })
        .then(() => done());
    });

    it('should resolve when succeed', (done) => {
      let promiseFunc = jasmine.createSpy('promiseFunc');
      let counter = 0;
      let counterLimit = 5;
      promiseFunc.and.callFake((x) => {
        if (++counter === counterLimit) {
          return Promise.resolve(x);
        } else {
          return Promise.reject(-1);
        }
      });

      let successValue = 69;
      let retryConfig = {maxRetries: 10};
      Promise.tryUntil(retryConfig, promiseFunc, successValue)
        .then((x) => {
          expect(x).toBe(successValue);
          expect(promiseFunc).toHaveBeenCalledWith(successValue);
          expect(promiseFunc.calls.count()).toBe(counterLimit);
        })
        .catch(() => {
          done(new Error('This Promise should be resolved after some retries'));
        })
        .then(() => done());
    });

    it('should delay after each try', (done) => {
      let promiseFunc = jasmine.createSpy('promiseFunc');
      promiseFunc.and.callFake((x) => Promise.reject(x));

      spyOn(Promise, 'delay').and.callThrough();

      let delay = 1;
      let maxRetries = 3;
      let retryConfig = {maxRetries: maxRetries, delay: delay};
      let failValue = -1;
      Promise.tryUntil(retryConfig, promiseFunc, failValue)
        .catch((x) => {
          expect(x).toBe(failValue);
          expect(promiseFunc.calls.count()).toBe(maxRetries + 1);
          expect(promiseFunc).toHaveBeenCalledWith(failValue);
          expect(Promise.delay.calls.count()).toBe(maxRetries);
          for (let i = 0; i < maxRetries; i++) {
            expect(Promise.delay.calls.argsFor(i)).toEqual([delay]);
          }
          done();
        });
    });

    it('should increase delay after each try', (done) => {
      let promiseFunc = jasmine.createSpy('promiseFunc');
      promiseFunc.and.callFake((x) => Promise.reject(x));

      spyOn(Promise, 'delay').and.callThrough();

      let delay = 1;
      let maxRetries = 3;
      let incrFactor = 2;
      let retryConfig = {
        maxRetries: maxRetries, delay: delay, incrementalFactor: incrFactor
      };
      let failValue = -1;
      Promise.tryUntil(retryConfig, promiseFunc, failValue)
        .catch((x) => {
          expect(x).toBe(failValue);
          expect(promiseFunc.calls.count()).toBe(maxRetries + 1);
          expect(promiseFunc).toHaveBeenCalledWith(failValue);
          expect(Promise.delay.calls.count()).toBe(maxRetries);
          for (let i = 0; i < maxRetries; i++) {
            expect(Promise.delay.calls.argsFor(i)).toEqual([delay]);
            delay *= incrFactor;
          }
          done();
        });
    });

    it('should only retry when willRetry is fulfilled', (done) => {
      let promiseFunc = jasmine.createSpy('promiseFunc');
      promiseFunc.and.callFake((x) => Promise.reject(x));

      let maxRetries = 3;
      let retryConfig = {
        maxRetries: maxRetries,
        willRetry: (x) => x < 0
      };

      let failValue = 10;  // this will not fulfilled (x < 0)
      Promise.tryUntil(retryConfig, promiseFunc, failValue)
        .catch((x) => {
          expect(x).toBe(failValue);
          expect(promiseFunc.calls.count()).toBe(1);
          expect(promiseFunc).toHaveBeenCalledWith(failValue);
          done();
        });
    });

  });

});

