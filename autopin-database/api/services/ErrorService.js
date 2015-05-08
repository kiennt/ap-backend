module.exports = {

  respondError: function (res, code, message, err) {
    if (err) {
      sails.log.error(err);
    }
    res.status(code);
    return res.send({error: message});
  }
};