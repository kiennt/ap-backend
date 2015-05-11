var CryptoJS = require('crypto-js');
var SECRET = 'OhYeah-HarderAndHarder';

module.exports = {

  encryptString: function (str) {
    var encryptedString = CryptoJS.HmacSHA256(str, SECRET);
    return encryptedString.toString(CryptoJS.enc.Hex);
  },

  isValidPassword: function (str) {
    var minLength = sails.config.myConfiguration.password.minLength;
    var maxLength = sails.config.myConfiguration.password.maxLength;
    if (!str) {
      return false;
    }
    if (str.length > maxLength || str.length < minLength) {
      return false;
    }
    if (str.indexOf(' ') > -1) {
      return false;
    }
    return true;
  }
};
