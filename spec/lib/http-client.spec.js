import _ from 'lodash';
import Promise from 'bluebird';
import nock from 'nock';

import HttpClient from '../../dist/lib/http-client';
import Errors from '../../dist/lib/errors';


describe('HttpClient', () => {
  let client = new HttpClient();

  beforeAll(() => HttpClient.disableAutoRetry());

  afterAll(() => HttpClient.enableAutoRetry());

  describe('getfullURL', () => {
    it('should return value', () => {
      expect(client.getFullURL('test', {a: 10, b: 20}))
        .toBe('test?a=10&b=20');
    });

    it('should not have `?` if call with empty params', () => {
      expect(client.getFullURL('test', {})).toBe('test');
    });
  });

  describe('request', () => {
    it('should call getFullURL', (done) => {
      spyOn(client, 'getFullURL');
      client.request('get', 'a').catch(() => {
        expect(client.getFullURL).toHaveBeenCalled();
        done();
      });
    });

    describe('should reject with exact error classes when failed', () => {
      it('should throw HttpError with wrong HTTP method', (done) => {
        client.request('FOO').catch((error) => {
          expect(error).toEqual(jasmine.any(Errors.HttpError));
          expect(error.constructor.name).toEqual('HttpError');
          done();
        });
      });

      it('should throw HttpRequestError with bad request structure', (done) => {
        client.get().catch((error) => {
          expect(error).toEqual(jasmine.any(Errors.HttpRequestError));
          expect(error.message).toBe('options.uri is a required argument');
          done();
        });
      });

      it('should throw HttpRequestError when not able to connect', (done) => {
        client.get('http://localhost:6969/').catch((error) => {
          expect(error).toEqual(jasmine.any(Errors.HttpRequestError));
          expect(error.cause.name).toBe('NetConnectNotAllowedError');
          done();
        });
      });

      it('should throw HttpResponseError with bad HTTP StatusCode', (done) => {
        nock('http://test.com').get('/test').reply(404);
        client.get('http://test.com/test').catch((error) => {
          expect(error).toEqual(jasmine.any(Errors.HttpResponseError));
          done();
        });
      });
    });

    describe('request with valid method', () => {
      it('should return promise if GET request success', (done) => {
        nock('http://test.com').get('/test').reply(200, 'ok');
        client.get('http://test.com/test').then((x) => {
          expect(x).toBe('ok');
          done();
        });
      });

      it('should return promise if POST request success', (done) => {
        nock('http://test.com').post('/test', {foo: 'ABC'}).reply(200, 'ok');
        client.post('http://test.com/test', {}, {foo: 'ABC'})
          .then((x) => {
            expect(x).toBe('ok');
            done();
          }
        );
      });
    });

    describe('should have correct auto-retry behavior', () => {
      let retryConfig = {};

      beforeAll(() => {
        HttpClient.enableAutoRetry();
        // Patching retry configuration
        retryConfig = _.clone(HttpClient.getRetryConfiguration());
        retryConfig.delay = 1;
        retryConfig.incrementalFactor = 1;
        retryConfig.maxRetries = 3;
        HttpClient.setRetryConfiguration(retryConfig);
      });

      afterAll(() => {
        HttpClient.disableAutoRetry();
        HttpClient.setRetryConfiguration(undefined);  // use default
      });

      it('should retry with HttpRequestError', (done) => {
        spyOn(Promise.prototype, 'spread').and.callThrough();
        client.get('http://localhost:6969/').catch((error) => {
          expect(error).toEqual(jasmine.any(Errors.HttpRequestError));
          let callCount = Promise.prototype.spread.calls.count();
          expect(callCount).toBe(1 + retryConfig.maxRetries);
          done();
        });
      });

      it('should not retry with anything else', (done) => {
        nock('http://test.com').get('/test').reply(500);
        spyOn(Promise.prototype, 'spread').and.callThrough();
        client.get('http://test.com/test').catch((error) => {
          expect(error).not.toEqual(jasmine.any(Errors.HttpRequestError));
          expect(Promise.prototype.spread.calls.count()).toBe(1);
          done();
        });
      });
    });
  });
});
