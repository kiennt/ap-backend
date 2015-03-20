import Promise from '../dist/lib/promise';
import HttpClient from '../dist/http-client'
import PinterestClient from '../dist/pinterest-client';
import httpHeaders from '../dist/config/http-headers';
import {fixtureAsync} from './fixtures';


describe('PinterestClient', () => {
  let validPinId = '83879611786469438';
  let invalidPinId = '83879611786469438111111100000111';
  let validUserId = '10414780296729982';
  let invalidUserId = '104147802967299821111111111';
  let accessToken = 'this_is_access_token';
  let headers = httpHeaders.randomHeaders();
  let client = new PinterestClient(accessToken, headers);

  beforeAll(() => HttpClient.disableAutoRetry());

  afterAll(() => HttpClient.enableAutoRetry());

  it('should have accessToken', () => {
    expect(client.accessToken).toBe(accessToken);
  });

  it('should complete request information', () => {
    spyOn(client.httpClient, 'request');

    let params = {'name': 'Nova'};
    let expectedData = {'access_token': accessToken};
    let relativeUrl = 'hello/';
    let fullUrl = `https://api.pinterest.com/v3/${relativeUrl}`;

    client.request('GET', relativeUrl, params, {});
    expect(client.httpClient.request).toHaveBeenCalledWith(
      'GET', fullUrl, params, expectedData, headers);
  });

  describe('commentAPin', () => {
    let text = 'this is comment';

    it('should return true when pinId is valid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('pin-comment.json'));

      let url = `pins/${validPinId}/comment/`;
      let data = {'text': text};

      client.commentAPin(validPinId, text).then((x) => {
        expect(x).toBe(true);
        expect(client.request).toHaveBeenCalledWith('POST', url, {}, data);
        done();
      });
    });

    it('should return false when pinId is invalid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('pin-comment-invalid-pin-id.json'));

      let url = `pins/${validPinId}/comment/`;
      let data = {'text': text};

      client.commentAPin(validPinId, text).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });

  describe('followUser', () => {
    it('should return true when userId is valid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('user-follow.json'));

      let url = `users/${validUserId}/follow/`;

      client.followUser(validUserId).then((x) => {
        expect(x).toBe(true);
        expect(client.request).toHaveBeenCalledWith('PUT', url, {}, {});
        done();
      });
    });

    it('should return false when userId is invalid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('user-follow-invalid-user-id.json'));

      let url = `users/${validUserId}/follow/`;

      client.followUser(validUserId).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });

  describe('getFollowersOfUser', () => {
    it('should return a list of followers when userId is valid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('user-followers.json'));

      let fields = 'user.implicitly_followed_by_me,user.blocked_by_me,' +
        'user.follower_count,user.domain_verified,user.pin_thumbnail_urls,' +
        'user.explicitly_followed_by_me,user.location,user.website_url,' +
        'user.following_count';
      let params = {
        'access_token': accessToken,
        'add_fields': fields,
        'page_size': 1
      };
      let url = `users/${validUserId}/followers/`;

      client.getFollowersOfUser(validUserId, 1).then((data) => {
        expect(data[0].id).toBe('355854945464877577');
        expect(client.request).toHaveBeenCalledWith('GET', url, params, {});
        done();
      });
    });

    it('should return request_id when userId is invalid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('user-followers-invalid-user-id.json'));

      let fields = 'user.implicitly_followed_by_me,user.blocked_by_me,' +
        'user.follower_count,user.domain_verified,user.pin_thumbnail_urls,' +
        'user.explicitly_followed_by_me,user.location,user.website_url,' +
        'user.following_count';
      let params = {
        'access_token': accessToken,
        'add_fields': fields,
        'page_size': 1
      };
      let url = `users/${invalidUserId}/followers/`;

      client.getFollowersOfUser(invalidUserId, 1).then((data) => {
        expect(data['request_id']).toBe('598443295031');
        expect(client.request).toHaveBeenCalledWith('GET', url, params, {});
        done();
      });
    });
  });

  describe('getPinsOfUser', () => {
    it('should return list of pins of user when userId is valid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('user-pins.json'));

      let pageSize = 25;
      let url = `users/${validUserId}/pins/`;
      let params = {
        'access_token': accessToken,
        'page_size': pageSize
      };

      client.getPinsOfUser(validUserId, pageSize).then((data) => {
        expect(data[0].id).toBe('164944405079105168');
        expect(client.request).toHaveBeenCalledWith('GET', url, params, {});
        done();
      });
    });
  });

  describe('likeAPin', () => {
    it('should return true when pinId is valid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('pin-like.json'));

      let url = `pins/${validPinId}/like/`;

      client.likeAPin(validPinId).then((x) => {
        expect(x).toBe(true);
        expect(client.request).toHaveBeenCalledWith('PUT', url, {}, {});
        done();
      });
    });

    it('should return false when pinId is invalid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('pin-like-invalid-pin-id.json'));

      let url = `pins/${validPinId}/like/`;

      client.likeAPin(validPinId).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });
});
