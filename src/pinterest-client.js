const DOMAIN = 'https://api.pinterest.com/v3';
const CLIENT_ID = "1431594";

const HTTP_METHODS = {
  GET : "get",
  POST : "post",
  PUT : "put",
  DELETE : "delete"
};

var request = require('request');

export class PinterestClient {
  constructor(authKey) {
    this.authKey = authKey;
  }

  getURL(path, params) {
    let url = `${DOMAIN}/${path}`;

    if (params) {
      let stringOfParams = "";
      for (var key in params) {
        stringOfParams += `${key}=${params[key]}&`;
      };
      url += `?${stringOfParams}`;
    }

    return url;
  }

  // This should be move to a helper class...
  getHttpHandler(httpMethod) {
    switch(httpMethod) {
      case HTTP_METHODS.GET:
        return request.get;
      case HTTP_METHODS.PUT:
        return request.put;
      case HTTP_METHODS.POST:
        return request.post;
      case HTTP_METHODS.DELETE:
        return request.delete;
      default:
        return undefined;
    }
  }

  get(path, params={}, callback) {
    return this.request(HTTP_METHODS.GET, path, params, {}, callback);
  }

  post(path, params={}, data={}, callback) {
    return this.request(HTTP_METHODS.POST, path, params, data, callback);
  }

  put(path, params={}, data={}, callback) {
    return this.request(HTTP_METHODS.PUT, path, params, data, callback);
  }

  delete(path, params={}, data={}, callback) {
    return this.request(HTTP_METHODS.DELETE, path, params, data, callback);
  }

  // This should be seperated to 2 different callbacks
  request(httpMethod, path, params={}, data={}, callback) {
    let url = this.getURL(path, params);
    console.log(url);

    let handler = this.getHttpHandler(httpMethod);

    let requestBody = {
      url: url,
      formData: {
        access_token: this.authKey
      }
    };

    if (handler)
      handler(requestBody, callback);
  }

  // Again, should be seperated to 2 different callbacks
  likeAPin(pinId, callback) {
    let params = {
      access_token : this.authKey
    };
    this.request(HTTP_METHODS.PUT, `pins/${pinId}/like/`, null, params, callback);
  }
}
