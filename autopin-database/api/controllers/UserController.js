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
        User.create(user, function(err, newUser) {
          if (err) {
            sails.log.error(err);
            res.status(400);
            return res.send({error: 'Email already exist'});
          };
          return res.send({'auth_key': newUser.authKey});
        });
      })
      .catch(function(err) {
        sails.log.error(err);
        res.status(401);
        return res.send({error: 'Can not login to Pinterest. Please check username and password again'});
      });
  }
};
