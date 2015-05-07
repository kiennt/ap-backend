/**
* User.js
*
* @description :: User of Autopin
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var CryptoJS = require('crypto-js');
var SECRET = 'OhYeah-HarderAndHarder';

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
    }
  },

  beforeCreate: function (user, cb) {
    var newPassword = CryptoJS.HmacSHA256(user.password, SECRET);
    var authKey = CryptoJS.HmacSHA256(user.email + newPassword, SECRET);
    user.password = newPassword.toString(CryptoJS.enc.Hex);
    user.authKey = authKey.toString(CryptoJS.enc.Hex);
    sails.log.info('create user', user);
    cb();
  }
};
