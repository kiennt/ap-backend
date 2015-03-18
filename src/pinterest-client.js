import HttpClient from './http-client'
import Promise from './lib/promise';

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
  constructor(accessToken, httpHeaders) {
    this.accessToken = accessToken;
    this.httpHeaders = httpHeaders;
    this.httpClient = new HttpClient();
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

  getPinsOfUser(userId, pageSize) {
    let fields = 'pin.images[474x, 1200x],pin.rich_summary(),pin.pinner(),' +
      'pin.dominant_color,pin.place_summary(),pin.board(),pin.embed(),' +
      'pin.lookbook(),pin.via_pinner()';
    let params = {
      'access_token': this.accessToken,
      'add_fields': fields,
      'page_size': pageSize
    };
    return this.request('GET', `users/${userId}/pins/`, params, {})
      .then(JSON.parse).get('data');
  }

  likeAPin(pinId) {
    return this.request('PUT', `pins/${pinId}/like/`, {}, {})
      .then(validateResponse).then((content) => true, (error) => false);
  }
}
