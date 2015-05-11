/**
 * AccountController
 *
 * @description :: Server-side logic for managing Accounts
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  delete: function(req, res) {
    var account = req.options.account;
    account.destroy()
    	.then(function() {
    		return res.send();
    	})
    	.catch(function(err) {
    		return res.error(400, 'Something is wrong. Please try again', err);
    	});
  },
}