/* global jest, describe, it, expect */

'use strict';

jest.autoMockOff();

describe('HttpClient', function() {
  var HttpClient = require('../http-client');
  var client = new HttpClient();
  var absolutePath = 'test';
  var params = {
    a: 10,
    b: 'test'
  };

  it('get full url with params', function() {
    expect(client.getFullURL(absolutePath, params)).toBe('test?a=10&b=test');
  });
});
