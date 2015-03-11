/* global jest, describe, it, expect */

'use strict';

jest.autoMockOff();

describe('PinterestClient', function() {
  var PinterestClient = require('../pinterest-client');
  var client = new PinterestClient('');

  it('should have accessToken', function() {
    expect(client.accessToken).toBe('');
  });

  it('should have valid getURL', function() {
    var url = client.getURL('path', {a: 10, y: 20});
    expect(url).toBe('https://api.pinterest.com/v3/path?a=10&y=20');
  });

});
