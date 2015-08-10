var _ = require('lodash');

function bootstrap(app) {
  var Sails;
  try {
    Sails = require('sails');
  } catch (e) {
    console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
    console.error('To do that, run `npm install sails`');
    console.error('');
    console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
    console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
    console.error('but if it doesn\'t, the app will run with the global sails instead!');
    return;
  }

  // Try to get `rc` dependency
  var rc;
  try {
    rc = require('rc');
  } catch (e0) {
    try {
      rc = require('sails/node_modules/rc');
    } catch (e1) {
      console.error('Could not find dependency: `rc`.');
      console.error('Your `.sailsrc` file(s) will be ignored.');
      console.error('To resolve this, run:');
      console.error('npm install rc --save');
      rc = function () { return {}; };
    }
  }

  Sails.load(rc('sails'), function (err, sails) {
    if (err) console.error('[*] Error while starting Sails:', err);
    console.log('[!] Sails is ready to go!');
    if (_.isFunction(app)) {
      app(sails);
    } else {
      require(app)(sails);
    }
  });
};

process.chdir(__dirname);

if (require.main === module) {
  (function() {
    var argv = require('minimist')(process.argv.slice(2));
    var app = argv['app'];
    if (app) {
      bootstrap(app);
    } else {
      console.error('[*] No application specified! Use --app');
    }
  })();
} else {
  module.exports = bootstrap;
}
