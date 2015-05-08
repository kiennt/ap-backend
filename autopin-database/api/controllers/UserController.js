/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var authentication = require('../../../dist/lib/authentication');
var headers = require('../../../dist/config/http-headers');


module.exports = {
  signup: function(req, res) {
    var user = req.body;
    var randomHeader = headers.randomHeaders();
    authentication.getAccessToken(user.email, user.password, randomHeader)
      .then(function(data) {
        User.create(user)
          .then(function(newUser) {
            var account = {
              email: newUser.email,
              accessToken: data['access_token'],
              user: newUser.id
            };
            Account.create(account)
              .then(function(newAccount) {
                return res.send({'auth_key': newUser.authKey});
              })
              .catch(function(err) {
                respondError(res, 400, 'Something is wrong. Please check username and password again', err);
              });
          })
          .catch(function(err) {
            respondError(res, 400, 'Email already exist', err);
          });
      })
      .catch(function(err) {
        respondError(res, 401, 'Can not login to Pinterest. Please check username and password again', err);
      });
  }
};

respondError = function(res, code, message, err) {
  if (!err) {
    sails.log.error(err);
  }
  res.status(code);
  return res.send({error: message});
};
