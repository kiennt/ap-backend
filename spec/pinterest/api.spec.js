import _ from 'lodash';
import Promise from 'bluebird';

import Fields from '../../dist/lib/fields';
import HttpClient from '../../dist/lib/http-client';
import PinterestApi from '../../dist/pinterest/api';
import httpHeaders from '../../dist/config/http-headers';
import {fixtureAsync} from '../fixtures';


describe('PinterestApi', () => {
  let validPinId = '83879611786469438';
  let invalidPinId = '83879611786469438111111100000111';
  let validUserId = '10414780296729982';
  let invalidUserId = '104147802967299821111111111';
  let accessToken = 'this_is_access_token';
  let headers = httpHeaders.randomHeaders();
  let api = new PinterestApi(accessToken, headers);

  beforeAll(() => HttpClient.disableAutoRetry());

  afterAll(() => HttpClient.enableAutoRetry());

  it('should have accessToken', () => {
    expect(api.accessToken).toBe(accessToken);
  });

  it('should complete request information', () => {
    spyOn(api.httpClient, 'request');

    let params = {'name': 'Nova'};
    let expectedData = {'access_token': accessToken};
    let relativeUrl = 'hello/';
    let fullUrl = `https://api.pinterest.com/v3/${relativeUrl}`;
    let fullHeaders = _.clone(headers);
    fullHeaders.Authorization = `Bearer ${accessToken}`;

    api.get(relativeUrl, params, {});
    expect(api.httpClient.request).toHaveBeenCalledWith(
      'GET', fullUrl, params, expectedData, fullHeaders);
  });

  describe('commentAPin', () => {
    let text = 'this is comment';

    it('should return true when pinId is valid', (done) => {
      spyOn(api, 'post').and.returnValue(
        fixtureAsync('pin-comment.json'));

      let url = `pins/${validPinId}/comment/`;
      let data = {'text': text};

      api.commentAPin(validPinId, text).then((x) => {
        expect(x).toBe(true);
        expect(api.post).toHaveBeenCalledWith(url, {}, data);
        done();
      });
    });

    it('should return false when pinId is invalid', (done) => {
      spyOn(api, 'post').and.returnValue(
        fixtureAsync('pin-comment-invalid-pin-id.json'));

      let url = `pins/${validPinId}/comment/`;
      let data = {'text': text};

      api.commentAPin(validPinId, text).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });

  describe('createABoard', () => {
    it('should return info of board', (done) => {
      spyOn(api, 'put').and.returnValue(
        fixtureAsync('board-create.json'));

      let name = 'test';
      let url = 'boards/';
      let data = {
        layout: 'default',
        name: name,
        privacy: 'public'
      };

      api.createABoard(name).then((x) => {
        expect(x.id).toBe('537265499235702023');
        expect(api.put).toHaveBeenCalledWith(url, {}, data);
        done();
      });
    });
  });

  describe('followUser', () => {
    it('should return true when userId is valid', (done) => {
      spyOn(api, 'put').and.returnValue(
        fixtureAsync('user-follow.json'));

      let url = `users/${validUserId}/follow/`;

      api.followUser(validUserId).then((x) => {
        expect(x).toBe(true);
        expect(api.put).toHaveBeenCalledWith(url, {}, {});
        done();
      });
    });

    it('should return false when userId is invalid', (done) => {
      spyOn(api, 'put').and.returnValue(
        fixtureAsync('user-follow-invalid-user-id.json'));

      let url = `users/${validUserId}/follow/`;

      api.followUser(validUserId).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });

  describe('getAutoCompleteText', () => {
    it('should return list of users, pins, boards', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('search-autocomplete.json'));

      let fields = Fields.getFields('getAutoCompleteText');
      let tag = 'recent_pin_searches,recent_user_searches,' +
        'recent_board_searches';
      let params = {
        'num_recent_queries': 8,
        'num_people': 10,
        'num_autocompletes': 10,
        'num_boards': 10,
        'add_fields': fields,
        'recent_queries_tags': tag,
        'q': 'fuck'
      };
      let url = 'search/autocomplete/';

      api.getAutoCompleteText('fuck').then((data) => {
        expect(data[0].id).toBe('sex toy');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('getBoardsOfMe', () => {
    it('should return list of boards', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('me-boards.json'));

      let fields = Fields.getFields('getBoardsOfMe');
      let params = {
        'sort': 'alphabetical',
        'filter': 'all',
        'fields': fields
      };
      let url = 'users/me/boards';

      api.getBoardsOfMe().then((data) => {
        expect(data[0].name).toBe('Endless love');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('getDetailOfPin', () => {
    it('should return detail of pin when pinId is valid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('pin-detail.json'));

      let fields = Fields.getFields('getDetailOfPin');
      let params = {
        'fields': fields
      };
      let url = `pins/${validPinId}/`;

      api.getDetailOfPin(validPinId).then((data) => {
        expect(data.id).toBe('494481234063127024');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('getDetailOfUser', () => {
    it('should return detail of user when userId is valid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('user-detail.json'));

      let fields = Fields.getFields('getDetailOfUser');
      let params = {
        'add_fields': fields
      };
      let url = `users/${validUserId}/`;

      api.getDetailOfUser(validUserId).then((data) => {
        expect(data.id).toBe('383932074391788460');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('getFeeds', () => {
    it('should return list of feeds', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('feeds-home.json'));

      let fields = Fields.getFields('getFeeds');
      let params = {
        'fields': fields,
        'page_size': 1
      };
      let url = 'feeds/home/';

      api.getFeeds(1).then((response) => {
        let data = response.data;
        expect(data[0].id).toBe('321303754641945912');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('getFollowersOfUser', () => {
    it('should return a list of followers when userId is valid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('user-followers.json'));

      let fields = Fields.getFields('getFollowersOfUser');
      let params = {
        'fields': fields,
        'page_size': 1
      };
      let url = `users/${validUserId}/followers/`;

      api.getFollowersOfUser(validUserId, 1).then((data) => {
        expect(data[0].id).toBe('355854945464877577');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });

    it('should return request_id when userId is invalid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('user-followers-invalid-user-id.json'));

      let fields = Fields.getFields('getFollowersOfUser');
      let params = {
        'fields': fields,
        'page_size': 1
      };
      let url = `users/${invalidUserId}/followers/`;

      api.getFollowersOfUser(invalidUserId, 1).then((data) => {
        expect(data['request_id']).toBe('598443295031');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('getFollowingOfUser', () => {
    it('should return a list of followings when userId is valid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('user-following.json'));

      let fields = Fields.getFields('getFollowingOfUser');
      let params = {
        'fields': fields,
        'page_size': 1
      };
      let url = `users/${validUserId}/following/`;

      api.getFollowingOfUser(validUserId, 1).then((data) => {
        expect(data[0].id).toBe('355854945464877577');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });

    it('should return request_id when userId is invalid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('user-following-invalid-user-id.json'));

      let fields = Fields.getFields('getFollowingOfUser');
      let params = {
        'fields': fields,
        'page_size': 1
      };
      let url = `users/${invalidUserId}/following/`;

      api.getFollowingOfUser(invalidUserId, 1).then((data) => {
        expect(data['request_id']).toBe('464710910159');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('getPinsOfUser', () => {
    it('should return list of pins of user when userId is valid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('user-pins.json'));

      let pageSize = 25;
      let url = `users/${validUserId}/pins/`;
      let params = {
        'page_size': pageSize
      };

      api.getPinsOfUser(validUserId, pageSize).then((data) => {
        expect(data[0].id).toBe('164944405079105168');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('getRelatedPins', () => {
    it('should return list of related pins when pinId is valid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('pin-related.json'));

      let pageSize = 1;
      let url = `pins/${validPinId}/related/pin/`;
      let fields = Fields.getFields('getRelatedPins');
      let params = {
        'page_size': pageSize,
        'fields': fields
      };

      api.getRelatedPins(validPinId, pageSize).then((response) => {
        let data = response.data;
        expect(data[0].id).toBe('373376625330854516');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });

    it('should return list of related pins when pinId is valid', (done) => {
      spyOn(api, 'get').and.returnValue(
        fixtureAsync('pin-related.json'));

      let pageSize = 1;
      let url = `pins/${validPinId}/related/pin/`;
      let fields = Fields.getFields('getRelatedPins');
      let bookmark = 'bookmark';
      let params = {
        'page_size': pageSize,
        'fields': fields,
        'bookmark': bookmark
      };

      api.getRelatedPins(validPinId, pageSize, bookmark).then((response) => {
        let data = response.data;
        expect(data[0].id).toBe('373376625330854516');
        expect(api.get).toHaveBeenCalledWith(url, params, {});
        done();
      });
    });
  });

  describe('likeAPin', () => {
    it('should return true when pinId is valid', (done) => {
      spyOn(api, 'put').and.returnValue(
        fixtureAsync('pin-like.json'));

      let url = `pins/${validPinId}/like/`;

      api.likeAPin(validPinId).then((x) => {
        expect(x).toBe(true);
        expect(api.put).toHaveBeenCalledWith(url, {}, {});
        done();
      });
    });

    it('should return false when pinId is invalid', (done) => {
      spyOn(api, 'put').and.returnValue(
        fixtureAsync('pin-like-invalid-pin-id.json'));

      let url = `pins/${validPinId}/like/`;

      api.likeAPin(validPinId).then((x) => {
        expect(x).toBe(false);
        done();
      });
    });
  });

  describe('repin', () => {
    it('should return result of repining when pinId is valid', (done) => {
      spyOn(api, 'post').and.returnValue(
        fixtureAsync('pin-repin.json'));

      let boardId = '424816246039791020';
      let description = `♡ Father's Day`;

      api.repin('297870962830963512', boardId, description)
        .then((data) => {
          expect(data.id).toBe('424816177327298079');
          done();
        });
    });
  });
});
