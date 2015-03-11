const DOMAIN = 'https://api.pinterest.com/v3';
const CLIENT_ID = '1431594';

const HTTP_METHODS = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETT: 'delete'
};

const HTTP_HEADERS = {
  'X-Pixel-Ratio': 2,
  'X-Pinterest-Device': 'iPhone7,2',
  'X-Pinterest-AppState': 'active',
  'User-Agent': 'Pinterest for iOS/4.3 (iPhone; 8.1.1)'
};

export default class PinterestClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  getURL(path, params) {
    let url = `${DOMAIN}/${path}`;

    if (params) {
      let stringOfParams = '';
      for (var key in params) {
        stringOfParams += `${key}=${params[key]}&`;
      }
      url += `?${stringOfParams}`;
    }
    return url;
  }

  // This should be move to a helper class...
  getHttpHandler(httpMethod) {
    var request = require('request');
    switch (httpMethod) {
      case HTTP_METHODS.GET:
        return request.get;
      case HTTP_METHODS.PUT:
        return request.put;
      case HTTP_METHODS.POST:
        return request.post;
      case HTTP_METHODS.DELETE:
        return request.delete;
      default:
        return null;
    }
  }

  get(path, params={}, callback) {
    return this.request(
      HTTP_METHODS.GET, HTTP_HEADERS, path, params, {}, callback);
  }

  post(path, params={}, data={}, callback) {
    return this.request(
      HTTP_METHODS.POST, HTTP_HEADERS, path, params, data, callback);
  }

  put(path, params={}, data={}, callback) {
    return this.request(
      HTTP_METHODS.PUT, HTTP_HEADERS, path, params, data, callback);
  }

  delete(path, params={}, data={}, callback) {
    return this.request(
      HTTP_METHODS.DELETE, HTTP_HEADERS, path, params, data, callback);
  }

  // This should be seperated to 2 different callbacks
  request(httpMethod, path, params={}, data={}, callback) {
    data['access_token'] = this.accessToken;

    let url = this.getURL(path, params);
    let handler = this.getHttpHandler(httpMethod);
    let requestBody = {
      url: url,
      formData: data
    };
    if (handler) {
      handler(requestBody, callback);
    }
  }

  // Again, should be seperated to 2 different callbacks
  likeAPin(pinId, callback) {
    this.request(HTTP_METHODS.PUT, `pins/${pinId}/like/`, {}, {}, callback);
  }
}
