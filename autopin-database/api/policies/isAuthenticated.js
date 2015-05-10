module.exports = function isAuthenticated (req, res, next) {

  var postData = req.body;
  if (!postData || !postData['auth_key']) {
    return res.error(401, 'Invalid authkey');
  };

  var query = {
    authKey: req.body['auth_key']
  };
  User.findOne(query)
    .populate('accounts')
    .then(function(userFound) {
      req.options.user = userFound;
      next();
    })
    .catch(function(err)  {
      return res.error(401, 'Invalid auth_key');
    });
};