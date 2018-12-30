// @flow
import main from '../src/main';

/*
  Similarly sometimes you don't want to mock something in one case only
  You can use jest.dontMock in this case
*/

jest.mock('../src/functions.js', () => ({
  foo: num => `${num} mocked foo`,
  bar: jest.fn(),
  foobar: jest.fn(),
}));

describe('Using jest.mock', () => {
  it('Does a do mock inside with a re require -> jest.resetModules first', () => {

    expect(main()).toBe('In main function: 2 mocked foo undefined undefined');
  });

  it('calls as normal', () => {
    jest.resetModules();
    jest.dontMock('../src/functions.js');
    const mainTemp = require('../src/main');
    expect(mainTemp.default()).toBe('In main function: 2 foo 3 bar 10 foo foobar');
  });
});
