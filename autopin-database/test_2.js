require('./bootstrap')(function(sails) {
  console.log(Object.keys(sails.models));
  console.log(sails.config.environment);
});
