module.exports = function isEmailAvailable (req, res, next) {
  var email = req.body.email.toLowerCase();
  var query = {
    email: email
  };
  User.findOne(query)
    .then(function(userFound) {
      if (userFound) {
        return res.error(400, 'Email already exist');
      } else {
        next();
      }
    })
    .catch(function(err) {
      return res.error(500, 'Something wrong. Please try again', err);
    });
};