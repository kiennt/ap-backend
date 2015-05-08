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
    var postData = req.body;
    if (!postData.email || !postData.password) {
      return res.error(401, 'Wrong username and password');
    };
    var query = {
      email: postData.email.toLowerCase(),
      password: StringService.encryptString(postData.password)
    };
    User.findOne(query)
      .then(function(userFound) {
        if (!userFound) {
          return res.error(401, 'Wrong username and password');
        } else {
          return res.send({'auth_key': userFound.authKey});
        }
      })
      .catch(function(err) {
        res.error(401, 'Wrong username and password', err);
      });
  },

  signup: function(req, res) {
    var postData = req.body;
    if (!postData.email || !postData.password) {
      return res.error(401, 'Wrong username and password');
    };
    var user = {
      email: postData.email.toLowerCase(),
      password: postData.password
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
                return res.error(400, 'Something is wrong. Please check username and password again', err);
              });
          })
          .catch(function(err) {
            return res.error(400, 'Email already exist', err);
          });
      })
      .catch(function(err) {
        return res.error(401, 'Can not login to Pinterest. Please check username and password again', err);
      });
  }
};
