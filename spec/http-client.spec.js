import HttpClient from '../dist/http-client';
import nock from 'nock';


describe('HttpClient', () => {
  // TODO: need a test for auto-retry
  let client = new HttpClient();

  beforeAll(() => HttpClient.disableAutoRetry());

  afterAll(() => HttpClient.enableAutoRetry());

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

    it('should call getFullURL', (done) => {
      spyOn(client, 'getFullURL');
      client.request('get', 'a').catch(() => {
        expect(client.getFullURL).toHaveBeenCalled();
        done();
      });
    });

    describe('request with valid method', () => {
      it('should return reject promise if request fail', (done) => {
        nock('http://test.com').get('/test').reply(404);
        client.request('get', 'http://test.com/test').catch(done);
      });

      it('should return promise if GET request success', (done) => {
        nock('http://test.com').get('/test').reply(200, 'ok');
        client.request('get', 'http://test.com/test').then((x) => {
          expect(x).toBe('ok');
          done();
        });
      });

      it('should return promise if POST request success', (done) => {
        nock('http://test.com').post('/test', {foo: 'ABC'}).reply(200, 'ok');
        client.request('post', 'http://test.com/test', {}, {foo: 'ABC'})
          .then((x) => {
            expect(x).toBe('ok');
            done();
          }
        );
      });
    });
  });

});

