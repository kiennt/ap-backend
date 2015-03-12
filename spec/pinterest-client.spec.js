/* global describe, it, expect */

import PinterestClient from '../dist/pinterest-client';

describe('PinterestClient', () => {
  var client = new PinterestClient('');

  it('should have accessToken', () => {
    expect(client.accessToken).toBe('');
  });

});
