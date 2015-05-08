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
    },
    accounts: {
      collection: 'Account'
    }
  },

  beforeCreate: function (user, cb) {
    user.password = encryptPassword(user.password);
    var authKey = CryptoJS.HmacSHA256(user.email + user.password, SECRET);
    user.authKey = authKey.toString(CryptoJS.enc.Hex);
    sails.log.info('create user', user);
    cb();
  }
};

encryptPassword = function (password) {
  var encryptedPassword = CryptoJS.HmacSHA256(password, SECRET);
  return encryptedPassword.toString(CryptoJS.enc.Hex);
};
