import Promise from '../../dist/lib/promise';


describe('Promise-extensions', () => {

  describe('Promise.tryUntil', () => {
    it('should reject after exceeds maxRetries', (done) => {
      let promiseFunc = jasmine.createSpy('promiseFunc');
      promiseFunc.and.callFake((x) => Promise.reject(x));

      let failValue = -1;
      let retryConfig = {maxRetries: 5};
      Promise.tryUntil(retryConfig, promiseFunc, failValue)
        .then(() => fail('This Promise should never be resolved'))
        .catch((x) => {
          expect(x).toBe(failValue);
          expect(promiseFunc).toHaveBeenCalledWith(failValue);
          expect(promiseFunc.calls.count()).toBe(retryConfig.maxRetries + 1);
        })
        .then(done);
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
        .catch(() => fail('This Promise should be resolved after some retries'))
        .then(done);
    });

    it('should delay after each try', (done) => {
      spyOn(Promise, 'delay').and.callThrough();
      let promiseFunc = jasmine.createSpy('promiseFunc');
      promiseFunc.and.callFake((x) => Promise.reject(x));

      let retryConfig = {
        maxRetries: 3,
        delay: 1
      };
      let failValue = -1;
      Promise.tryUntil(retryConfig, promiseFunc, failValue)
        .catch((x) => {
          expect(x).toBe(failValue);
          expect(promiseFunc.calls.count()).toBe(retryConfig.maxRetries + 1);
          expect(promiseFunc).toHaveBeenCalledWith(failValue);
          expect(Promise.delay.calls.count()).toBe(retryConfig.maxRetries);

          let delay = retryConfig.delay;
          for (let i = 0; i < retryConfig.maxRetries; i++) {
            expect(Promise.delay.calls.argsFor(i)).toEqual([delay]);
          }
          done();
        });
    });

    it('should increase delay after each try', (done) => {
      spyOn(Promise, 'delay').and.callThrough();
      let promiseFunc = jasmine.createSpy('promiseFunc');
      promiseFunc.and.callFake((x) => Promise.reject(x));

      let retryConfig = {
        maxRetries: 3,
        delay: 1,
        incrementalFactor: 2
      };
      let failValue = -1;
      Promise.tryUntil(retryConfig, promiseFunc, failValue)
        .catch((x) => {
          expect(x).toBe(failValue);
          expect(promiseFunc.calls.count()).toBe(retryConfig.maxRetries + 1);
          expect(promiseFunc).toHaveBeenCalledWith(failValue);
          expect(Promise.delay.calls.count()).toBe(retryConfig.maxRetries);

          let delay = 1;
          for (let i = 0; i < retryConfig.maxRetries; i++) {
            expect(Promise.delay.calls.argsFor(i)).toEqual([delay]);
            delay *= retryConfig.incrementalFactor;
          }
          done();
        });
    });

    it('should only retry when willRetry is fulfilled', (done) => {
      let promiseFunc = jasmine.createSpy('promiseFunc');
      promiseFunc.and.callFake((x) => Promise.reject(x));

      let retryConfig = {
        maxRetries: 3,
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

