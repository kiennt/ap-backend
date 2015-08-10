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
  },

  updateSettings: function(req, res) {
    var account = req.options.account;
    var config = account['configuration'];

    if (req.body['do_like']) {
      config['do_like'] = req.body['do_like'];
    }
    if (req.body['do_repin']) {
      config['do_repin'] = req.body['do_repin'];
    }
    if (req.body['do_comment']) {
      config['do_comment'] = req.body['do_comment'];
    }
    if (req.body['do_follow']) {
      config['do_follow'] = req.body['do_follow'];
    }
    if (req.body['do_unfollow']) {
      config['do_unfollow'] = req.body['do_unfollow'];
    }
    if (req.body['unfollow_who_dont_follow_me']) {
      config['unfollow_who_dont_follow_me'] = req.body['unfollow_who_dont_follow_me'];
    }
    if (req.body['speed']) {
      config['speed'] = req.body['speed'];
    }
    account.configuration = config;
    account.save()
      .then(function(account) {
        return res.send();
      })
      .catch(function(err) {
        return res.error(500, 'Something wrong. Please try again', err);
      });
  },

  start: function(req, res) {
    var account = req.options.account;
    var fakeResult = {
      'time_remaining': 1000
    };
    return res.send(fakeResult);
  }
}