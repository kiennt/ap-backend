/**
* Account.js
*
* @description :: Account of Pinterest
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
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
      type: 'integer'
    },
    followersCount: {
      type: 'integer'
    },
    followingCount: {
      type: 'integer'
    },
    commentsCount: {
      type: 'integer'
    },
    status: {
      type: 'boolean',
      defaultsTo: false
    },
    packet: {
      type: 'integer',
      defaultsTo: 0
    },
    timeExecuting: {
      type: 'integer'
    },
    user: {
      model: 'User',
      required: true
    }
  }
};
