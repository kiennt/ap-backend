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
                sails.log.error(err);
                res.status(401);
                return res.send({error: 'Something is wrong. Please check username and password again'});
              });
          })
          .catch(function(err) {
            sails.log.error(err);
            res.status(400);
            return res.send({error: 'Email already exist'});
          });
      })
      .catch(function(err) {
        sails.log.error(err);
        res.status(401);
        return res.send({error: 'Can not login to Pinterest. Please check username and password again'});
      });
  }
};
