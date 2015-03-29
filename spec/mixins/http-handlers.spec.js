import _ from 'lodash';

import mixins from '../../dist/mixins/http-handlers';


class SampleClass {
  request(method, url) {}
  foo(method, url) {}
}

describe('HttpHandlersMixin', () => {
  it('should add default http methods when using default mixin', () => {
    let httpMethods = ['get', 'post', 'put', 'patch', 'delete', 'head'];
    _.extend(SampleClass.prototype, mixins.HttpHandlersMixin);

    let obj = new SampleClass();
    spyOn(obj, 'request');

    httpMethods.forEach((method) => {
      let data = `hello_${method}`;
      obj[method].call(obj, data);
      expect(obj.request).toHaveBeenCalledWith(method.toUpperCase(), data);
    });
  });

  it('should add specified functions when using custom mixin', () => {
    let newFuncs = ['nova', 'kiennt', 'daniel', 'joe'];
    let customMixin = new mixins.CustomHttpHandlersMixin('foo', newFuncs);
    _.extend(SampleClass.prototype, customMixin);

    let obj = new SampleClass();
    spyOn(obj, 'foo');

    newFuncs.forEach((name) => {
      let data = `welcome_${name}`;
      obj[name].call(obj, data);
      expect(obj.foo).toHaveBeenCalledWith(name.toUpperCase(), data);
    });
  });
});
