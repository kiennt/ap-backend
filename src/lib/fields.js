const GET_DETAIL_OF_FIELDS = 'pin.images[136x136,736x],pin.id,' +
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

const GET_FOLLOWERS_OF_USER = 'fields user.id,user.username,user.first_name,' +
  'user.last_name,user.full_name,user.gender,user.partner(),' +
  'user.image_medium_url,user.website_url,user.domain_verified,user.location,' +
  'user.explicitly_followed_by_me,user.implicitly_followed_by_me,' +
  'user.blocked_by_me,user.pin_count,user.follower_count,' +
  'user.pin_thumbnail_urls';

const GET_FOLLOWING_OF_USER = 'user.implicitly_followed_by_me,' +
  'user.blocked_by_me,' +
  'user.follower_count,user.domain_verified,user.pin_thumbnail_urls,' +
  'user.explicitly_followed_by_me,user.location,user.website_url,' +
  'user.following_count';

const GET_INFO_OF_ME = 'user.country,user.default_shipping(),' +
  'user.default_payment()';

const SEARCH_TYPE_BOARD = 'board.id,board.url,board.name,' +
  'board.category,board.created_at,board.layout,' +
  'board.collaborator_invites_enabled,board.image_cover_url,' +
  'board.images[90x90],board.collaborated_by_me,board.is_collaborative,' +
  'board.followed_by_me,board.privacy,board.owner(),board.pin_count';

const SEARCH_TYPE_PIN = 'fields pin.images[236x,736x],pin.id,pin.description,' +
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

const SEARCH_TYPE_USER = 'fields  user.id,user.username,user.first_name,' +
  'user.last_name,user.full_name,user.gender,user.partner(),' +
  'user.image_medium_url,user.website_url,user.domain_verified,user.location,' +
  'user.explicitly_followed_by_me,user.implicitly_followed_by_me,' +
  'user.blocked_by_me,user.pin_count,user.follower_count,' +
  'user.pin_thumbnail_urls';

const FIELDS = {
  'getDetailOfPin': GET_DETAIL_OF_FIELDS,
  'getFollowersOfUser': GET_FOLLOWERS_OF_USER,
  'getFollowingOfUser': GET_FOLLOWING_OF_USER,
  'getInfoOfMe': GET_INFO_OF_ME,
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
