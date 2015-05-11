module.exports = function isAvailableEmail (req, res, next) {
  var email = req.body.email.toLowerCase();
  var query = {
    email: email
  };
  User.count(query)
    .then(function(numberOfUser) {
      if (numberOfUser > 0) {
        return res.error(400, 'Email already exist');
      } else {
        next();
      }
    })
    .catch(function(err)  {
      return res.error(500, 'Something wrong. Please try again', err);
    });
};