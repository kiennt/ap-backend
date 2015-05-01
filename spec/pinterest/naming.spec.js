import _ from 'lodash';
import Promise from 'bluebird';

import Naming from '../../dist/pinterest/naming';


describe('PinterestNaming', () => {

  it('getCategoryName', () => {
    expect(Naming.getCategoryName('other')).toBe('Other');
    expect(Naming.getCategoryName('otHer')).toBe('Other');
    expect(Naming.getCategoryName(null)).toBe(undefined);
  });

  it('getCategoryKey', () => {
    expect(Naming.getCategoryKey('Animals & Pets')).toBe('animals');
    expect(Naming.getCategoryKey('animals & pets')).toBe('animals');
    expect(Naming.getCategoryKey('Foo foo')).toBe(undefined);
  });

});
