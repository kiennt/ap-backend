const GET_AUTO_COMPLETE = 'user.follower_count,user.pin_count,board.owner()';

const GET_BOARDS_OF_ME = 'board.id,board.url,board.name,board.category,' +
  'board.created_at,board.layout,board.collaborator_invites_enabled,' +
  'board.cover_images[60x60],board.is_collaborative,board.privacy';

const GET_DETAIL_OF_BOARD = 'board.id,board.url,board.name,board.category,' +
  'board.created_at,board.layout,board.collaborator_invites_enabled,' +
  'board.image_cover_url,board.images[90x90],user.id,user.username,' +
  'user.first_name,user.last_name,user.full_name,user.gender,user.partner(),' +
  'user.image_medium_url,board.description,board.is_collaborative,' +
  'board.collaborator_count,board.followed_by_me,board.collaborated_by_me,' +
  'board.owner(),board.pin_count';

const GET_DETAIL_OF_PIN = 'pin.images[136x136,736x],pin.id,' +
  'pin.description,' +
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

const GET_FEEDS = 'pin.images[236x,736x],pin.id,pin.description,' +
  'pin.image_medium_url,pin.image_medium_size_pixels,pin.created_at,' +
  'pin.like_count,pin.repin_count,pin.comment_count,pin.view_tags,board.id,' +
  'board.url,board.name,board.category,board.created_at,board.layout,' +
  'board.collaborator_invites_enabled,board.image_thumbnail_url,user.id,' +
  'user.username,user.first_name,user.last_name,user.full_name,user.gender,' +
  'user.partner(),user.image_medium_url,pin.liked_by_me,pin.dominant_color,' +
  'pin.rich_summary(),pin.embed(),pin.promoter(),pin.recommendation_reason,' +
  'pin.board(),pin.pinner(),pin.source_interest(),pin.is_video,interest.id,' +
  'interest.name,interest.creation_time,interest.key,' +
  'interest.background_color,interest.url_name,interest.follower_count,' +
  'interest.feed_update_time,interest.images[75x75,150x150(ir.12),' +
  '150x150(ir.24),150x150(ir.48),300x300(ir.24),300x300(ir.48),600x],' +
  'pin.place_summary()';

const GET_INFO_OF_ME = 'user.country,user.default_shipping(),' +
  'user.default_payment()';

const GET_INTERESTS = 'interest.id,interest.name,' +
  'interest.creation_time,interest.key,interest.background_color,' +
  'interest.url_name,interest.follower_count,interest.feed_update_time,' +
  'interest.images[75x75,150x150(ir.12),150x150(ir.24),150x150(ir.48),' +
  '300x300(ir.24),300x300(ir.48),600x]';

const GET_PINS_OF_BOARD = 'pin.images[236x,736x,136x136],pin.id,' +
  'pin.description,pin.image_medium_url,pin.image_medium_size_pixels,' +
  'pin.created_at,pin.like_count,pin.repin_count,pin.comment_count,' +
  'pin.view_tags,board.id,board.url,board.name,board.category,' +
  'board.created_at,board.layout,board.collaborator_invites_enabled,' +
  'board.image_thumbnail_url,user.id,user.username,user.first_name,' +
  'user.last_name,user.full_name,user.gender,user.partner(),' +
  'user.image_medium_url,pin.liked_by_me,pin.dominant_color,' +
  'pin.rich_summary(),pin.embed(),pin.promoter(),pin.recommendation_reason,' +
  'pin.board(),pin.pinner(),pin.source_interest(),pin.is_video,interest.id,' +
  'interest.name,interest.creation_time,interest.key,' +
  'interest.background_color,interest.url_name,interest.follower_count,' +
  'interest.feed_update_time,interest.images[75x75,150x150(ir.12),' +
  '150x150(ir.24),150x150(ir.48),300x300(ir.24),300x300(ir.48),600x],' +
  'place.id,place.name,place.latitude,place.longitude,place.source_icon,' +
  'place.source_name,pin.place(),place.street,place.locality,place.region,' +
  'place.country';

const GET_RELATED_PINS = 'pin.images[236x,736x],pin.id,pin.description,' +
  'pin.image_medium_url,pin.image_medium_size_pixels,pin.created_at,' +
  'pin.like_count,pin.repin_count,pin.comment_count,pin.view_tags,board.id,' +
  'board.url,board.name,board.category,board.created_at,board.layout,' +
  'board.collaborator_invites_enabled,board.image_thumbnail_url,user.id,' +
  'user.username,user.first_name,user.last_name,user.full_name,user.gender,' +
  'user.partner(),user.image_medium_url,pin.liked_by_me,pin.dominant_color,' +
  'pin.rich_summary(),pin.embed(),pin.promoter(),pin.recommendation_reason,' +
  'pin.board(),pin.pinner(),pin.source_interest(),pin.is_video,interest.id,' +
  'interest.name,interest.creation_time,interest.key,' +
  'interest.background_color,interest.url_name,interest.follower_count,' +
  'interest.feed_update_time,interest.images[75x75,150x150(ir.12),' +
  '150x150(ir.24),150x150(ir.48),300x300(ir.24),300x300(ir.48),600x],' +
  'pin.place_summary()';

const GET_USER_BOARDS = 'board.id,board.url,board.name,board.category,' +
  'board.created_at,board.layout,board.collaborator_invites_enabled,' +
  'board.image_cover_url,board.images[90x90],board.collaborated_by_me,' +
  'board.is_collaborative,board.followed_by_me,board.privacy,board.owner(),' +
  'board.pin_count';

const GET_USER_FOLLOWERS = 'user.id,user.username,user.first_name,' +
  'user.last_name,user.full_name,user.gender,user.partner(),' +
  'user.image_medium_url,user.website_url,user.domain_verified,' +
  'user.location,user.explicitly_followed_by_me,' +
  'user.implicitly_followed_by_me,user.blocked_by_me,user.pin_count,' +
  'user.follower_count,user.pin_thumbnail_urls';

const GET_USER_FOLLOWING = 'user.id,user.username,user.first_name,' +
  'user.last_name,user.full_name,user.gender,user.partner(),' +
  'user.image_medium_url,user.website_url,user.domain_verified,' +
  'user.location,user.explicitly_followed_by_me,' +
  'user.implicitly_followed_by_me,user.blocked_by_me,user.pin_count,' +
  'user.follower_count,user.pin_thumbnail_urls';

const GET_USER_INFO = 'user.partner()';

const GET_USER_LIKED = 'pin.images[236x,736x],pin.id,pin.description,' +
  'pin.image_medium_url,pin.image_medium_size_pixels,pin.created_at,' +
  'pin.like_count,pin.repin_count,pin.comment_count,pin.view_tags,' +
  'board.id,board.url,board.name,board.category,board.created_at,' +
  'board.layout,board.collaborator_invites_enabled,board.image_thumbnail_url,' +
  'user.id,user.username,user.first_name,user.last_name,user.full_name,' +
  'user.gender,user.partner(),user.image_medium_url,pin.liked_by_me,' +
  'pin.dominant_color,pin.rich_summary(),pin.embed(),pin.promoter(),' +
  'pin.recommendation_reason,pin.board(),pin.pinner(),pin.source_interest(),' +
  'pin.is_video,interest.id,interest.name,interest.creation_time,' +
  'interest.key,interest.background_color,interest.url_name,' +
  'interest.follower_count,interest.feed_update_time,' +
  'interest.images[75x75,150x150(ir.12),150x150(ir.24),150x150(ir.48),' +
  '300x300(ir.24),300x300(ir.48),600x],pin.place_summary()';

const GET_USER_PINS = 'pin.images[236x,736x],pin.id,pin.description,' +
  'pin.image_medium_url,pin.image_medium_size_pixels,pin.created_at,' +
  'pin.like_count,pin.repin_count,pin.comment_count,pin.view_tags,board.id,' +
  'board.url,board.name,board.category,board.created_at,board.layout,' +
  'board.collaborator_invites_enabled,board.image_thumbnail_url,user.id,' +
  'user.username,user.first_name,user.last_name,user.full_name,user.gender,' +
  'user.partner(),user.image_medium_url,pin.liked_by_me,pin.dominant_color,' +
  'pin.rich_summary(),pin.embed(),pin.promoter(),pin.recommendation_reason,' +
  'pin.board(),pin.pinner(),pin.source_interest(),pin.is_video,interest.id,' +
  'interest.name,interest.creation_time,interest.key,' +
  'interest.background_color,interest.url_name,interest.follower_count,' +
  'interest.feed_update_time,interest.images[75x75,150x150(ir.12),' +
  '150x150(ir.24),150x150(ir.48),300x300(ir.24),300x300(ir.48),600x],' +
  'pin.place_summary()';

const SEARCH_TYPE_BOARD = 'board.id,board.url,board.name,' +
  'board.category,board.created_at,board.layout,' +
  'board.collaborator_invites_enabled,board.image_cover_url,' +
  'board.images[90x90],board.collaborated_by_me,board.is_collaborative,' +
  'board.followed_by_me,board.privacy,board.owner(),board.pin_count';

const SEARCH_TYPE_PIN = 'pin.images[236x,736x],pin.id,pin.description,' +
  'pin.image_medium_url,pin.image_medium_size_pixels,pin.created_at,' +
  'pin.like_count,pin.repin_count,pin.comment_count,pin.view_tags,board.id,' +
  'board.url,board.name,board.category,board.created_at,board.layout,' +
  'board.collaborator_invites_enabled,board.image_thumbnail_url,user.id,' +
  'user.username,user.first_name,user.last_name,user.full_name,user.gender,' +
  'user.partner(),user.image_medium_url,pin.liked_by_me,pin.dominant_color,' +
  'pin.rich_summary(),pin.embed(),pin.promoter(),pin.recommendation_reason,' +
  'pin.board(),pin.pinner(),pin.source_interest(),pin.is_video,interest.id,' +
  'interest.name,interest.creation_time,interest.key,' +
  'interest.background_color,interest.url_name,interest.follower_count,' +
  'interest.feed_update_time,interest.images[75x75,150x150(ir.12),' +
  '150x150(ir.24),150x150(ir.48),300x300(ir.24),300x300(ir.48),600x],' +
  'pin.place_summary()';

const SEARCH_TYPE_USER = 'user.id,user.username,user.first_name,' +
  'user.last_name,user.full_name,user.gender,user.partner(),' +
  'user.image_medium_url,user.website_url,user.domain_verified,user.location,' +
  'user.explicitly_followed_by_me,user.implicitly_followed_by_me,' +
  'user.blocked_by_me,user.pin_count,user.follower_count,' +
  'user.pin_thumbnail_urls';

const FIELDS = {
  'getAutoCompleteText': GET_AUTO_COMPLETE,
  'getBoardsOfMe': GET_BOARDS_OF_ME,
  'getDetailOfBoard': GET_DETAIL_OF_BOARD,
  'getDetailOfPin': GET_DETAIL_OF_PIN,
  'getFeeds': GET_FEEDS,
  'getInfoOfMe': GET_INFO_OF_ME,
  'getInterests': GET_INTERESTS,
  'getPinsOfBoard': GET_PINS_OF_BOARD,
  'getUserBoards': GET_USER_BOARDS,
  'getUserFollowers': GET_USER_FOLLOWERS,
  'getUserFollowing': GET_USER_FOLLOWING,
  'getUserInfo': GET_USER_INFO,
  'getUserPins': GET_USER_PINS,
  'search.board': SEARCH_TYPE_BOARD,
  'search.pin': SEARCH_TYPE_PIN,
  'search.user': SEARCH_TYPE_USER
};

function getFields(functionName) {
  return FIELDS[functionName];
}

export default {
  getFields: getFields
};
