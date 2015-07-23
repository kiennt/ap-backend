/**
 * UserController
 *
 * @description :: Server-side logic for managing Users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var authentication = require('../../../dist/lib/authentication');
var headers = require('../../../dist/config/http-headers');


module.exports = {
  getUser: function(req, res) {
    return res.send(req.options.user.toJSON());
  },

  signin: function(req, res) {
    var query = {
      email: req.body.username.toLowerCase(),
      password: StringService.encryptString(req.body.password)
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
    var user = {
      email: req.body.username.toLowerCase(),
      password: req.body.password
    };

    User.create(user)
      .then(function(newUser) {
        return res.send({'auth_key': newUser.authKey});
      })
      .catch(function(err) {
        return res.error(500, 'Something is wrong. Please try again', err);
      });
  },

  signupWithPinterestAccount: function(req, res) {
    var user = {
      email: req.body.username.toLowerCase(),
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
                return res.error(400, 'Something is wrong. Please check username and password again', err);
              });
          })
          .catch(function(err) {
            return res.error(500, 'Something is wrong. Please try again', err);
          });
      })
      .catch(function(err) {
        return res.error(401, 'Can not login to Pinterest. Please check username and password again', err);
      });
  },

  updateUser: function(req, res) {
    var user = req.options.user;
    if (req.body.name) {
      user.name = req.body.name;
    }
    user.save()
      .then(function(newUser) {
        return res.send({'auth_key': newUser.authKey});
      })
      .catch(function(err) {
        return res.error(500, 'Something wrong. Please try again', err);
      });
  },

  changePassword: function(req, res) {
    var user = req.options.user;
    var oldPassword = req.body['old_password'];
    var newPassword = req.body['new_password'];
    if (!oldPassword || !newPassword) {
      return res.error(401, 'Please enter password');
    }
    if (!StringService.isValidPassword(newPassword)) {
      return res.error(401, 'Please enter valid password');
    }
    if (!user.isPasswordMatched(oldPassword)) {
      return res.error(401, 'Wrong password. Please try again');
    }
    user.password = StringService.encryptString(newPassword);
    user.save()
      .then(function(newUser) {
        return res.send({'auth_key': newUser.authKey});
      })
      .catch(function(err) {
        return res.error(500, 'Something wrong. Please try again', err);
      });
  }
};
