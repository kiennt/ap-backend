module.exports = function isValidAccount (req, res, next) {
  var user = req.options.user;
  var accountId = parseInt(req.body.id);
  if (accountId) {
    var accountFound = _(user.accounts).find(function(account) {
      return (account.id === accountId);
    });

    if (!accountFound) {
      return res.error(403, 'Invalid account');
    } else {
      req.options.account = accountFound;
      next();
    }
  } else {
    return res.error(403, 'Invalid account');
  }
};