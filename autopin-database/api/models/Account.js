/**
* Account.js
*
* @description :: Account of Pinterest
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    header: {
      type: 'json',
      required: true
    },
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    accessToken: {
      type: 'string',
      required: true
    },
    likesCount: {
      type: 'integer',
      defaultsTo: 0
    },
    repinsCount: {
      type: 'integer',
      defaultsTo: 0
    },
    followsCount: {
      type: 'integer',
      defaultsTo: 0
    },
    commentsCount: {
      type: 'integer',
      defaultsTo: 0
    },
    status: {
      type: 'boolean',
      defaultsTo: false
    },
    package: {
      type: 'integer',
      defaultsTo: 0
    },
    timeExecuting: {
      type: 'integer',
      defaultsTo: 0
    },
    user: {
      model: 'user',
      required: true
    },
    configuration: {
      type: 'json',
      defaultsTo: {
        'do_like': true,
        'do_repin': true,
        'do_comment': false,
        'do_follow': true,
        'do_unfollow': false,
        'do_unfollow': false,
        'unfollow_who_dont_follow_me': false,
        'speed': 0
      }
    },

    toJSON: function() {
      var account = this.toObject();
      return {
        'id': account.id,
        'email': account.email,
        'likes_count': account.likesCount,
        'repins_count': account.repinsCount,
        'follows_count': account.followsCount,
        'comments_count': account.commentsCount,
        'status': account.status,
        'package': account.package,
        'time_executing': account.timeExecuting,
        'configuration': account.configuration
      };
    }
  }
};
