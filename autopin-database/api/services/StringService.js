var CryptoJS = require('crypto-js');
var SECRET = 'OhYeah-HarderAndHarder';

module.exports = {

  encryptString: function (str) {
    var encryptedString = CryptoJS.HmacSHA256(str, SECRET);
    return encryptedString.toString(CryptoJS.enc.Hex);
  }
};
