import HttpClient from './http-client'
import Promise from './lib/promise';

const DOMAIN = 'https://api.pinterest.com/v3';

const HTTP_HEADERS = {
  'X-Pinterest-Device': 'GT-I9300',
  'X-Pinterest-AppState': 'background',
  'User-Agent': 'Pinterest for Android/4.3.1 (c1lgt; 4.1.2)'
};

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
  }

  request(httpMethod, relativePath, params={}, data={}) {
    data['access_token'] = this.accessToken;
    let absolutePath = `${DOMAIN}/${relativePath}`;
    return this.httpClient.request(
      httpMethod, absolutePath, params, data, HTTP_HEADERS);
  }

  commentAPin(pinId, text) {
    let data = {
      text: text
    };
    return this.request('POST', `pins/${pinId}/comment/`, {}, data)
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
