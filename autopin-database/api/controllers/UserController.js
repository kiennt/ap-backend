/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var authentication = require('../../../dist/lib/authentication');
var headers = require('../../../dist/config/http-headers');


module.exports = {
  signin: function(req, res) {
    var query = {
      email: req.body.email.toLowerCase(),
      password: StringService.encryptString(req.body.password)
    };
    User.findOne(query)
      .then(function(userFound) {
        if (!userFound) {
          return res.error(401, 'Wrong email or password');
        } else {
          return res.send({'auth_key': userFound.authKey});
        }
      })
      .catch(function(err) {
        res.error(401, 'Wrong email or password', err);
      });
  },

  signup: function(req, res) {
    var user = {
      email: req.body.email.toLowerCase(),
      password: req.body.password
    };
    var randomHeader = headers.randomHeaders();
    authentication.getAccessToken(user.email, user.password, randomHeader)
      .then(function(data) {
        User.create(user)
          .then(function(newUser) {
            var account = {
              header: randomHeader,
              email: newUser.email,
              accessToken: data['access_token'],
              user: newUser.id
            };
            Account.create(account)
              .then(function(newAccount) {
                return res.send({'auth_key': newUser.authKey});
              })
              .catch(function(err) {
                return res.error(400, 'This Pinterest account is already used', err);
              });
          })
          .catch(function(err) {
            return res.error(400, 'Email already exists', err);
          });
      })
      .catch(function(err) {
        return res.error(401, 'Can not login to Pinterest. Please check your Pinterest username and password again', err);
      });
  }
};
