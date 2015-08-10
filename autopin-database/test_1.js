import sails from 'sails';

export default function () {
    //      sails.config
    //  sails.models
    //      sails.connections
    // and so on
  console.log(Object.keys(sails.models));
  console.log(sails.config.environment);
}
