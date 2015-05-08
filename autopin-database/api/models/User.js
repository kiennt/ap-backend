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
    user.password = encryptString(user.password);
    user.authKey = encryptString(user.email + user.password);
    sails.log.info('create user', user);
    cb();
  }
};

encryptString = function (str) {
  var encryptedString = CryptoJS.HmacSHA256(str, SECRET);
  return encryptedString.toString(CryptoJS.enc.Hex);
};
