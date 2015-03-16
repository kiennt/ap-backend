/* global describe, it, expect */

import HttpClient from '../dist/http-client'
import PinterestClient from '../dist/pinterest-client';
import httpHeaders from '../dist/config/http-headers';
import nock from 'nock';
import path from 'path';

describe('PinterestClient', () => {
  let validPinId = '83879611786469438';
  let invalidPinId = '83879611786469438111111100000111';
  let validUserId = '10414780296729982';
  let invalidUserId = '104147802967299821111111111';
  let accessToken = 'this_is_access_token';
  let headers = httpHeaders.randomHeaders();
  let client = new PinterestClient(accessToken, headers);
  let fixtureDir = path.join(__dirname, '../spec/fixture');

  // Disable auto-retry
  HttpClient.setRetryConfiguration({willRetry: (error) => false});

  it('should have accessToken', () => {
    expect(client.accessToken).toBe(accessToken);
  });

  describe('commentAPin', () => {
    let text = 'this is comment';
    it('should return true when pinId is valid', (done) => {
      let fixture = path.join(fixtureDir, 'pin-comment.json');
      nock(`https://api.pinterest.com/v3/pins/${validPinId}`)
        .post('/comment/', {'text': text, 'access_token': accessToken})
        .replyWithFile(200, fixture);
      client.commentAPin(validPinId, text).then((x) => {
        expect(x).toBe(true);
        done();
      });
    });

    it('should return false when pinId is invalid', (done) => {
      let fixture = path.join(fixtureDir, 'pin-comment-invalid-pin-id.json');
      nock(`https://api.pinterest.com/v3/pins/${invalidPinId}`)
        .post('/comment/', {'text': text, 'access_token': accessToken})
        .replyWithFile(200, fixture);
      client.commentAPin(validPinId, text).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });

  describe('followUser', () => {
    it('should return true when userId is valid', (done) => {
      let fixture = path.join(fixtureDir, 'user-follow.json');
      nock(`https://api.pinterest.com/v3/users/${validUserId}`)
        .put('/follow/', {'access_token': accessToken})
        .replyWithFile(200, fixture);
      client.followUser(validUserId).then((x) => {
        expect(x).toBe(true);
        done();
      });
    });

    it('should return false when userId is invalid', (done) => {
      let fixture = path.join(fixtureDir, 'user-follow-invalid-user-id.json');
      nock(`https://api.pinterest.com/v3/users/${invalidUserId}`)
        .put('/follow/', {'access_token': accessToken})
        .replyWithFile(200, fixture);
      client.followUser(invalidUserId).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });

  describe('getPinsOfUser', () => {
    it('should return list of pins of user when userId is valid', (done) => {
      let fixture = path.join(fixtureDir, 'user-pins.json');
      let pageSize = 25;
      let params = {
        'access_token': accessToken,
        'page_size': pageSize
      };

      nock(`https://api.pinterest.com`)
        .get(`/v3/users/${validUserId}/pins/?access_token=${accessToken}&page_size=${pageSize}`)
        .replyWithFile(200, fixture);
      client.getPinsOfUser(validUserId, pageSize).then((data) => {
        expect(data[0].id).toBe('164944405079105168');
        done();
      });
    });
  });

  describe('likeAPin', () => {
    it('should return true when pinId is valid', (done) => {
      let fixture = path.join(fixtureDir, 'pin-like.json');
      nock(`https://api.pinterest.com/v3/pins/${validPinId}`)
        .put('/like/', {'access_token': accessToken})
        .replyWithFile(200, fixture);
      client.likeAPin(validPinId).then((x) => {
        expect(x).toBe(true);
        done();
      });
    });

    it('should return false when pinId is invalid', (done) => {
      let fixture = path.join(fixtureDir, 'pin-like-invalid-pin-id.json');
      nock(`https://api.pinterest.com/v3/pins/${invalidPinId}`)
        .put('/like/', {'access_token': accessToken})
        .replyWithFile(200, fixture);
      client.likeAPin(invalidPinId).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });

});
