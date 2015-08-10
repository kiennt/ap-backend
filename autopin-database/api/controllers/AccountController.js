/**
 * AccountController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var authentication = require('../../../dist/lib/authentication');
var headers = require('../../../dist/config/http-headers');


module.exports = {
  create: function(req, res) {
    var user = req.options.user;
    var email = req.body.email.toLowerCase();
    var password = req.body.password;

    var randomHeader = headers.randomHeaders();
    authentication.getAccessToken(email, password, randomHeader)
      .then(function(data) {
        var account = {
          header: randomHeader,
          email: email,
          accessToken: data['access_token'],
          user: user.id
        };
        Account.create(account)
          .then(function(newAccount) {
            return res.send(newAccount);
          })
          .catch(function(err) {
            return res.error(500, 'Something is wrong. Please try again', err);
          });
      })
      .catch(function(err) {
        return res.error(401, 'Can not login to Pinterest. Please check username and password again', err);
      });
  },

  delete: function(req, res) {
    var account = req.options.account;
    account.destroy()
      .then(function() {
        return res.send();
      })
      .catch(function(err) {
        return res.error(500, 'Something is wrong. Please try again', err);
      });
  }
}
