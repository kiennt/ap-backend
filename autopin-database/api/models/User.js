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
    name: {
      type: 'string'
    },
    authKey: {
      type: 'string'
    },
    accounts: {
      collection: 'account',
      via: 'user'
    },

    isPasswordMatched: function(inputPassword) {
      var user = this.toObject();
      var encryptedPassword = StringService.encryptString(inputPassword);
      if (user.password === encryptedPassword) {
        return true;
      }
      return false;
    },

    toJSON: function() {
      var user = this.toObject();
      return {
        'email': user.email,
        'name': user.name,
        'auth_key': user.authKey,
        'accounts': user.accounts
      };
    }
  },

  beforeCreate: function (user, cb) {
    user.email = user.email.toLowerCase();
    user.password = StringService.encryptString(user.password);
    user.authKey = StringService.encryptString(user.email + user.password);
    sails.log.info('create user after encrypting', user);
    cb();
  },

  beforeUpdate: function (user, cb) {
    sails.log.info('update user', user);
    user.authKey = StringService.encryptString(user.email + user.password);
    cb();
  }
};
