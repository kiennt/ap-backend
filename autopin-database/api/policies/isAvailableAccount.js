module.exports = function isAvailableAccount (req, res, next) {
  var user = req.options.user;
  var email = req.body.email;
  var password = req.body.password;
  if (email && password) {
    email = email.toLowerCase();
    var accountFound = _(user.accounts).find(function(account) {
      return (account.email === email);
    });

    if (accountFound) {
      return res.error(400, 'Account already exist');
    } else {
      next();
    }
  } else {
    return res.error(400, 'Invalid Pinterest account');
  }
};