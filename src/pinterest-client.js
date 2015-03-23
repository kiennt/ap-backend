import _ from 'lodash';

import Promise from './lib/promise';
import HttpClient from './lib/http-client';
import Fields from './lib/fields';


const DOMAIN = 'https://api.pinterest.com/v3';
const SEARCH_TYPE = {
  PIN: 'pin',
  BOARD: 'board',
  USER: 'user'
};

function validateResponse(jsonString) {
  let content = JSON.parse(jsonString);
  if (content.code) {
    // TODO: Chỗ này cần 1 cái error class kiểu khác
    // vì nó liên quan chặt đến cấu trúc dữ liệu trả về của Pinterest
    // Anh em bàn bạc sau nhé
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
      // DISCUSS: Chỗ này thì em nghĩ là có thể không cần lắm
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

export default class PinterestClient {
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
    return this.request('POST', `pins/${pinId}/comment/`, {}, data)
      .then(validateResponse).then((content) => true, (error) => false);
  }

  followUser(userId) {
    return this.request('PUT', `users/${userId}/follow/`, {}, {})
      .then(validateResponse).then((content) => true, (error) => false);
  }

  getDetailOfPin(pinId) {
    let fields = Fields.getFields('getDetailOfPin');
    let params = {
      'fields': fields
    };
    return this.request('GET', `pins/${pinId}/`, params, {})
      .then(JSON.parse).get('data');
  }

  getFeeds(pageSize, bookMark) {
    let fields = Fields.getFields('getFeeds');
    let params = {
      'fields': fields,
      'page_size': pageSize
    };
    if (bookMark) {
      params['book_mark'] = bookMark;
    }
    return this.request('GET', 'feeds/home/', params, {}).then(JSON.parse);
  }

  getFollowersOfUser(userId, pageSize) {
    let fields = Fields.getFields('getFollowersOfUser');
    let params = {
      'fields': fields,
      'page_size': pageSize
    };
    return this.request('GET', `users/${userId}/followers/`, params, {})
      .then(JSON.parse).get('data');
  }

  getFollowingOfUser(userId, pageSize) {
    let fields = Fields.getFields('getFollowingOfUser');
    let params = {
      'fields': fields,
      'page_size': pageSize
    };
    return this.request('GET', `users/${userId}/following/`, params, {})
      .then(JSON.parse).get('data');
  }

  getInfoOfMe() {
    let fields = Fields.getFields('getInfoOfMe');
    let params = {
      'fields': fields
    };
    return this.request('GET', 'users/me/', params, {})
      .then(JSON.parse).get('data');
  }

  getPinsOfUser(userId, pageSize) {
    let params = {
      'page_size': pageSize
    };
    return this.request('GET', `users/${userId}/pins/`, params, {})
      .then(JSON.parse).get('data');
  }

  likeAPin(pinId) {
    return this.request('PUT', `pins/${pinId}/like/`, {}, {})
      .then(validateResponse).then((content) => true, (error) => false);
  }

  search(keyword, pageSize, type) {
    let params = {
      'fields': getSearchAddFields(type),
      'page_size': pageSize,
      'query': `${keyword}`
    };
    if (type === SEARCH_TYPE.PIN) {
      params.asterix = true;
      params['add_refine[]'] = `${keyword}|typed`;
      params['term_meta[]'] = `${keyword}|typed`;
    }
    return this.request('GET', getSearchPath(type), params, {})
      .then(JSON.parse).get('data');
  }
}
