module.exports = function isAccountValid (req, res, next) {
  var user = req.options.user;
  var accountId = parseInt(req.param('id'));
  if (accountId) {
    var accountFound = _(user.accounts).find(function(account) {
      return (account.id === accountId);
    });

    if (!accountFound) {
      return res.error(400, 'Invalid account');
    } else {
      req.options.account = accountFound;
      next();
    }
  } else {
    return res.error(400, 'Invalid account');
  }
};