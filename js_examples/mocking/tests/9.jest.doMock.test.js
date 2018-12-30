// @flow
import main from '../src/main';

/*
  Sometimes you only want to mock a module in one test block of a file
  It's a bit messy but can be done
  In this case you can use a doMock which overrides the hoisting jest does by default
    - You will need to reset the cache of required modules with jest.resetModules
    - You will then need to reimport your functions using require notation
    - Note: the need to use mainTemp.default() in this case
  All following tests will go back to using the real module again
*/

describe('Using jest.mock', () => {
  it('Does a do mock inside with a re require -> jest.resetModules first', () => {
    jest.resetModules();
    jest.doMock('../src/functions.js', () => ({
      foo: num => `${num} mocked foo`,
      bar: jest.fn(),
      foobar: jest.fn(),
    }));
    const mainTemp = require('../src/main');

    expect(mainTemp.default()).toBe('In main function: 2 mocked foo undefined undefined');
  });

  it('calls as normal', () => {
    expect(main()).toBe('In main function: 2 foo 3 bar 10 foo foobar');
  });
});
