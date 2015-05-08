module.exports = function(code, message, err) {
  var res = this.res;

  if (err) {
    sails.log.error(err);
  }
  res.status(code);
  return res.send({error: message});
};