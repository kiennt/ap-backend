import _ from 'lodash';
import Promise from 'bluebird';

import HttpClient from '../lib/http-client';
import Fields from '../lib/fields';
import {HttpHandlersMixin} from '../mixins/http-handlers';


const DOMAIN = 'https://api.pinterest.com/v3';
const SEARCH_TYPE = {
  PIN: 'pin',
  BOARD: 'board',
  USER: 'user'
};

function validateResponse(jsonString) {
  let content = JSON.parse(jsonString);
  if (content.code) {
    throw new Error('Response not valid, with [code] = ' + content.code +
      ' ::: ' + jsonString);
  }
  return content;
}

function getSearchAddFields(type) {
  let fields = '';
  switch (type) {
    case SEARCH_TYPE.BOARD:
      return Fields.getFields('search.board');
    case SEARCH_TYPE.PIN:
      return Fields.getFields('search.pin');
    case SEARCH_TYPE.USER:
      return Fields.getFields('search.user');
    default:
      throw new Error(`${type} is wrong type`);
  }
}

function getSearchPath(type) {
  switch (type) {
    case SEARCH_TYPE.BOARD:
      return 'search/boards/';
    case SEARCH_TYPE.PIN:
      return 'search/pins/';
    case SEARCH_TYPE.USER:
      return 'search/users/';
    default:
      throw new Error(`${type} is wrong type`);
  }
}

export default class PinterestApi {
  constructor(accessToken, httpHeaders) {
    this.accessToken = accessToken;
    this.httpHeaders = _.clone(httpHeaders);
    this.httpHeaders.Authorization = `Bearer ${accessToken}`;
    this.httpClient = new HttpClient();
  }

  request(httpMethod, relativePath, params={}, data={}) {
    data = _.clone(data);
    data['access_token'] = this.accessToken;
    let absolutePath = `${DOMAIN}/${relativePath}`;
    return this.httpClient.request(
      httpMethod, absolutePath, params, data, this.httpHeaders);
  }

  commentAPin(pinId, text) {
    let data = {
      text: text
    };
    return this.post(`pins/${pinId}/comment/`, {}, data)
      .then(validateResponse).then((content) => true, (error) => false);
  }

  createABoard(name) {
    let data = {
      layout: 'default',
      name: name,
      privacy: 'public'
    };
    return this.put('boards/', {}, data)
      .then(JSON.parse).get('data');
  }

  followUser(userId) {
    return this.put(`users/${userId}/follow/`, {}, {})
      .then(validateResponse).then((content) => true, (error) => false);
  }

  getAutoCompleteText(text) {
    let fields = Fields.getFields('getAutoCompleteText');
    let tag = 'recent_pin_searches,recent_user_searches,recent_board_searches';
    let params = {
      'num_recent_queries': 8,
      'num_people': 10,
      'num_autocompletes': 10,
      'num_boards': 10,
      'add_fields': fields,
      'recent_queries_tags': tag,
      'q': encodeURIComponent(text.toLowerCase())
    };
    return this.get('search/autocomplete/', params, {})
      .then(JSON.parse).get('data');
  }

  getBoardsOfMe() {
    let fields = Fields.getFields('getBoardsOfMe');
    let params = {
      'sort': 'alphabetical',
      'filter': 'all',
      'fields': fields
    };
    return this.get('users/me/boards', params, {})
      .then(JSON.parse).get('data');
  }

  getDetailOfPin(pinId) {
    let fields = Fields.getFields('getDetailOfPin');
    let params = {
      'fields': fields
    };
    return this.get(`pins/${pinId}/`, params, {})
      .then(JSON.parse).get('data');
  }

  getUserBoards(userId, pageSize) {
    let fields = Fields.getFields('getUserBoards');
    let params = {
      'page_size': pageSize,
      'fields': fields
    };
    return this.get(`users/${userId}/boards/`, params, {})
      .then(JSON.parse).get('data');
  }

  getUserFollowers(userId, pageSize, bookmark) {
    let fields = Fields.getFields('getUserFollowers');
    let params = {
      'fields': fields,
      'page_size': pageSize
    };
    if (bookmark) {
      params.bookmark = bookmark;
    }
    return this.get(`users/${userId}/followers/`, params, {})
      .then(JSON.parse);
  }

  getUserFollowing(userId, pageSize, bookmark) {
    let fields = Fields.getFields('getUserFollowing');
    let params = {
      'fields': fields,
      'page_size': pageSize
    };
    if (bookmark) {
      params.bookmark = bookmark;
    }
    return this.get(`users/${userId}/following/`, params, {})
      .then(JSON.parse);
  }

  getUserInfo(userId) {
    let fields = Fields.getFields('getUserInfo');
    let params = {
      'add_fields': fields
    };
    return this.get(`users/${userId}/`, params, {})
      .then(JSON.parse).get('data');
  }

  getUserPins(userId, pageSize, bookmark) {
    let params = {
      'page_size': pageSize,
      'fields': Fields.getFields('getUserPins')
    };
    if (bookmark) {
      params.bookmark = bookmark;
    }
    return this.get(`users/${userId}/pins/`, params, {})
      .then(JSON.parse);
  }

  getFeeds(pageSize, bookmark) {
    let fields = Fields.getFields('getFeeds');
    let params = {
      'fields': fields,
      'page_size': pageSize
    };
    if (bookmark) {
      params.bookmark = bookmark;
    }
    return this.get('feeds/home/', params, {}).then(JSON.parse);
  }

  getInfoOfMe() {
    let fields = Fields.getFields('getInfoOfMe');
    let params = {
      'fields': fields
    };
    return this.get('users/me/', params, {})
      .then(JSON.parse).get('data');
  }

  getRelatedPins(pinId, pageSize, bookmark) {
    let fields = Fields.getFields('getRelatedPins');
    let params = {
      'page_size': pageSize,
      'fields': fields
    };
    if (bookmark) {
      params.bookmark = bookmark;
    }
    return this.get(`pins/${pinId}/related/pin/`, params, {})
      .then(JSON.parse);
  }

  likeAPin(pinId) {
    return this.put(`pins/${pinId}/like/`, {}, {})
      .then(validateResponse).then((content) => true, (error) => false);
  }

  repin(pinId, boardId, description) {
    let uri = `/v3/pins/${pinId}/repin/`;
    let params = {
      'share_twitter': 0,
      'board_id': boardId,
      'description': description
    };
    let request = {
      method: 'POST',
      uri: uri,
      params: params
    };
    let data = {requests: JSON.stringify([request])};

    return this.post('batch/', {}, data)
      .then(JSON.parse)
      .get('data')
      .get(`POST:/v3/pins/${pinId}/repin/`)
      .get('data');
  }

  search(keyword, pageSize, type, bookmark) {
    let keywordWithPlus = keyword.toLowerCase().replace(/ /g, '+');
    let params = {
      'query': encodeURIComponent(keywordWithPlus),
      'page_size': pageSize,
      'fields': getSearchAddFields(type)
    };
    if (type === SEARCH_TYPE.PIN) {
      params.asterix = true;
      params['add_refine[]'] = `${keyword}|typed`;
      params['term_meta[]'] = `${keyword}|typed`;
    }
    if (bookmark) {
      params.bookmark = bookmark;
    }
    return this.get(getSearchPath(type), params, {})
      .then(JSON.parse);
  }
}

_.extend(PinterestApi.prototype, HttpHandlersMixin);
