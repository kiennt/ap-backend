module.exports = function hasEmailAndPassword (req, res, next) {

  var postData = req.body;
  if (!postData.username || !postData.password) {
    return res.error(400, 'Wrong username and password');
  } else {
    if (!StringService.isValidPassword(postData.password)) {
      return res.error(400, 'Wrong username and password');
    } else {
      next();
    }
  }
};