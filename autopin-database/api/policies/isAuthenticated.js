module.exports = function isAuthenticated (req, res, next) {
  var authKey = req.param('auth_key');
  if (!authKey) {
    var postData = req.body;
    if (!postData || !postData['auth_key']) {
      return res.error(401, 'Invalid auth_key');
    } else {
      authKey = postData['auth_key'];
    };
  };

  var query = {
    authKey: authKey
  };
  User.findOne(query)
    .populate('accounts')
    .then(function(userFound) {
      if (userFound) {
        req.options.user = userFound;
        next();
      } else {
        return res.error(401, 'Invalid auth_key');
      }
    })
    .catch(function(err)  {
      return res.error(401, 'Invalid auth_key');
    });
};