import _ from 'lodash';


let subModuleNames = ['./base', './http'];
let subModules = _(subModuleNames)
  .map((subModuleName) => require(subModuleName))
  .value();

let exports = _.assign({}, ...subModules);

export default exports;
