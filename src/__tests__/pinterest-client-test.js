/* global jest, describe, it, expect */

'use strict';

jest.autoMockOff();

describe('PinterestClient', function() {
  var PinterestClient = require('../pinterest-client');
  var client = new PinterestClient('');

  it('should have accessToken', function() {
    expect(client.accessToken).toBe('');
  });
});
