module.exports = function hasEmailAndPassword (req, res, next) {

  var postData = req.body;
  if (!postData.email || !postData.password) {
    return res.error(400, 'Wrong email or password');
  } else {
    next();
  }
};
