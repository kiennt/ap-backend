/**
* User.js
*
* @description :: User of Autopin
* @docs        :: http://sailsjs.org/#!documentation/models
*/
module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      required: true,
    },
    authKey: {
      type: 'string'
    },
    accounts: {
      collection: 'Account'
    }
  },

  beforeCreate: function (user, cb) {
    user.email = user.email.toLowerCase();
    user.password = StringService.encryptString(user.password);
    user.authKey = StringService.encryptString(user.email + user.password);
    sails.log.info('create user after encrypting', user);
    cb();
  }
};
