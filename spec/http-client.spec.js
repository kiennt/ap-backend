/* global describe, it, expect, spyOn, beforeEach, afterEach, jasmine */

import HttpClient from '../dist/http-client';
import nock from 'nock';


describe('HttpClient', () => {
  var client = new HttpClient();

  describe('getfullURL', () => {
    it('should return value', () => {
      expect(client.getFullURL('test', {a: 10, b: 20}))
        .toBe('test?a=10&b=20');
    });

    it('should dont have ? if call with empty', () => {
      expect(client.getFullURL('test', {})).toBe('test');
    });
  });

  describe('request', () => {
    it('should return reject promise if call with invalid method', (done) => {
      client.request('a').catch(done);
    });

    it('should call getFullURL', () => {
      spyOn(client, 'getFullURL');
      client.request('get', 'a');
      expect(client.getFullURL).toHaveBeenCalled();
    });

    describe('request with valid method', () => {
      it('should return reject promise if request fail', (done) => {
        nock('http://test.com').get('/test').reply(404);
        client.request('get', 'http://test.com/test').catch(done);
      });

      it('should return promise if request success', (done) => {
        nock('http://test.com').get('/test').reply(200, 'ok');
        client.request('get', 'http://test.com/test').then((x) => {
          expect(x).toBe('ok');
          done();
        });
      });
    });
  });

});

