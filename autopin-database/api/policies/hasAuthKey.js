module.exports = function hasAuthKey (req, res, next) {

  var postData = req.body;
  if (!postData || !postData['auth_key']) {
    return res.error(401, 'Invalid authkey');
  } else {
    next();
  }
};