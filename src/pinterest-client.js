import HttpClient from './http-client'
import Promise from './lib/promise';

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
      return 'board.owner(),board.pin_thumbnail_urls,' +
        'board.image_cover_url,board.follower_count,board.pin_count';
    case SEARCH_TYPE.PIN:
      return 'pin.images[474x, 1200x],pin.rich_summary(),pin.pinner(),' +
        'pin.dominant_color,pin.place_summary(),pin.board(),pin.embed(),' +
        'pin.lookbook(),pin.via_pinner()';
    case SEARCH_TYPE.USER:
      return 'user.blocked_by_me,user.implicitly_followed_by_me,' +
        'user.follower_count,user.domain_verified,user.pin_thumbnail_urls,' +
        'user.explicitly_followed_by_me,user.location,user.website_url,' +
        'user.following_count';
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

export default class PinterestClient {
  constructor(accessToken, httpHeaders) {
    this.accessToken = accessToken;
    this.httpHeaders = httpHeaders;
    //TODO: need to create new object before modifying object
    this.httpHeaders.Authorization = `Bearer ${accessToken}`;
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

  getDetailOfPin(pinId) {
    let fields = 'pin.images[136x136,736x],pin.id,pin.description,' +
      'pin.image_medium_url,pin.image_medium_size_pixels,pin.created_at,' +
      'pin.like_count,pin.repin_count,pin.comment_count,pin.view_tags,' +
      'board.id,board.url,board.name,board.category,board.created_at,' +
      'board.layout,board.collaborator_invites_enabled,user.id,user.username,' +
      'user.first_name,user.last_name,user.full_name,user.gender,' +
      'user.partner(),place.id,place.name,place.latitude,place.longitude,' +
      'place.source_icon,place.source_name,board.image_thumbnail_url,' +
      'user.image_medium_url,pin.link,pin.liked_by_me,pin.tracked_link,' +
      'pin.domain,pin.board(),pin.comment_count,pin.pinned_to_board,' +
      'pin.pinner(),pin.via_pinner(),pin.rich_metadata(),pin.rich_summary(),' +
      'pin.embed(),pin.canonical_pin,user.blocked_by_me,pin.place(),' +
      'place.street,place.locality,place.region,place.country,place.phone,' +
      'place.url,pin.is_video';
    let params = {
      'fields': fields
    };
    return this.request('GET', `pins/${pinId}/`, params, {})
      .then(JSON.parse).get('data');
  }

  getFollowersOfUser(userId, pageSize) {
    let fields = 'user.implicitly_followed_by_me,user.blocked_by_me,' +
      'user.follower_count,user.domain_verified,user.pin_thumbnail_urls,' +
      'user.explicitly_followed_by_me,user.location,user.website_url,' +
      'user.following_count';
    let params = {
      'access_token': this.accessToken,
      'add_fields': fields,
      'page_size': pageSize
    };
    return this.request('GET', `users/${userId}/followers/`, params, {})
      .then(JSON.parse).get('data');
  }

  getFollowingOfUser(userId, pageSize) {
    let fields = 'user.implicitly_followed_by_me,user.blocked_by_me,' +
      'user.follower_count,user.domain_verified,user.pin_thumbnail_urls,' +
      'user.explicitly_followed_by_me,user.location,user.website_url,' +
      'user.following_count';
    let params = {
      'access_token': this.accessToken,
      'add_fields': fields,
      'page_size': pageSize
    };
    return this.request('GET', `users/${userId}/following/`, params, {})
      .then(JSON.parse).get('data');
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
    let params = {
      'access_token': this.accessToken,
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
      'access_token': this.accessToken,
      'add_refine[]': `${keyword}|typed`,
      'add_fields': getSearchAddFields(type),
      'asterix': true,
      'page_size': pageSize,
      'query': `${keyword}`,
      'term_meta[]': `${keyword}|typed`
    };
    return this.request('GET', getSearchPath(type), params, {})
      .then(JSON.parse).get('data');
  }
}
