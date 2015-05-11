var CryptoJS = require('crypto-js');
var SECRET = 'OhYeah-HarderAndHarder';

module.exports = {

  encryptString: function (str) {
    var encryptedString = CryptoJS.HmacSHA256(str, SECRET);
    return encryptedString.toString(CryptoJS.enc.Hex);
  },

  isValidPassword: function (str) {
    var minLength = sails.config.autopin.constraints.password.minLength;
    var maxLength = sails.config.autopin.constraints.password.maxLength;
    var forbiddenCharacters =
      sails.config.autopin.constraints.password.forbiddenCharacters;

    if (str && str.length >= minLength && str.length <= maxLength) {
      return _.all(forbiddenCharacters, function(char) {
        return str.indexOf(char) < 0;
      });
    } else {
      return false;
    }
  }
};
