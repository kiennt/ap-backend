import HttpClient from './http-client'
import Promise from './lib/promise';
import HttpHeaders from './config/http-headers';

const DOMAIN = 'https://api.pinterest.com/v3';

function validateResponse(jsonString) {
  let content = JSON.parse(jsonString);
  if (content.code) {
    throw new Error('Response not valid, with [code] = ' + content.code +
      ' ::: ' + jsonString);
  }
  return content;
}

export default class PinterestClient {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.httpClient = new HttpClient();
    this.httpHeaders = HttpHeaders[Math.random() % HttpHeaders.length];
  }

  request(httpMethod, relativePath, params={}, data={}) {
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

  getInfoOfMe() {
    let fields = 'user.country,user.default_shipping(),user.default_payment()';
    let params = {
      'access_token': this.accessToken,
      'add_fields': fields
    };
    return this.request('GET', `users/me/`, params, {})
      .then(JSON.parse).get('data');
  }

  likeAPin(pinId) {
    return this.request('PUT', `pins/${pinId}/like/`, {}, {})
      .then(validateResponse).then((content) => true, (error) => false);
  }
}
