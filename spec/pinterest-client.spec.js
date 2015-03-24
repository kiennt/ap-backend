import _ from 'lodash';

import Promise from '../dist/lib/promise';
import Fields from '../dist/lib/fields';
import HttpClient from '../dist/lib/http-client';
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
    let fullHeaders = _.clone(headers);
    fullHeaders.Authorization = `Bearer ${accessToken}`;

    client.request('GET', relativeUrl, params, {});
    expect(client.httpClient.request).toHaveBeenCalledWith(
      'GET', fullUrl, params, expectedData, fullHeaders);
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

  describe('getDetailOfPin', () => {
    it('should return detail of pin when pinId is valid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('pin-detail.json'));

      let fields = Fields.getFields('getDetailOfPin');
      let params = {
        'fields': fields
      };
      let url = `pins/${validPinId}/`;

      client.getDetailOfPin(validPinId).then((data) => {
        expect(data.id).toBe('494481234063127024');
        expect(client.request).toHaveBeenCalledWith('GET', url, params, {});
        done();
      });
    });
  });

  describe('getFeeds', () => {
    it('should return list of fields', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('feeds-home.json'));

      let fields = Fields.getFields('getFeeds');
      let params = {
        'fields': fields,
        'page_size': 1
      };
      let url = 'feeds/home/';

      client.getFeeds(1).then((response) => {
        let data = response.data;
        expect(data[0].id).toBe('321303754641945912');
        expect(client.request).toHaveBeenCalledWith('GET', url, params, {});
        done();
      });
    });
  });

  describe('getFollowersOfUser', () => {
    it('should return a list of followers when userId is valid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('user-followers.json'));

      let fields = Fields.getFields('getFollowersOfUser');
      let params = {
        'fields': fields,
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

      let fields = Fields.getFields('getFollowersOfUser');
      let params = {
        'fields': fields,
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

  describe('getFollowingOfUser', () => {
    it('should return a list of following when userId is valid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('user-following.json'));

      let fields = Fields.getFields('getFollowingOfUser');
      let params = {
        'fields': fields,
        'page_size': 1
      };
      let url = `users/${validUserId}/following/`;

      client.getFollowingOfUser(validUserId, 1).then((data) => {
        expect(data[0].id).toBe('355854945464877577');
        expect(client.request).toHaveBeenCalledWith('GET', url, params, {});
        done();
      });
    });

    it('should return request_id when userId is invalid', (done) => {
      spyOn(client, 'request').and.returnValue(
        fixtureAsync('user-following-invalid-user-id.json'));

      let fields = Fields.getFields('getFollowingOfUser');
      let params = {
        'fields': fields,
        'page_size': 1
      };
      let url = `users/${invalidUserId}/following/`;

      client.getFollowingOfUser(invalidUserId, 1).then((data) => {
        expect(data['request_id']).toBe('464710910159');
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
