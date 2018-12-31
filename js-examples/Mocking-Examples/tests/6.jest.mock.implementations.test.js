// @flow
import main from '../src/main';
import { bar, foobar } from '../src/functions';

/*
  As an optional second argument, jest.mock can take a factory
  The factory can define the individual functions, either with new implementations or as mock objects
  Note: If you define the implementation here it won't be a mock object, just a different real function
  Note: if you use jest.mock the factory will replace the actual module
    - so you will have to define everything you intend to use (i.e. doesn't default to jest.fn() anymore)
*/

jest.mock('../src/functions.js', () => ({
  foo: num => `${num} mocked foo`,
  bar: jest.fn(),
  foobar: jest.fn(),
}));

describe('Using jest.mock', () => {
  it('Tests partly mocked module -> 2 undefineds', () => {
    expect(main()).toBe('In main function: 2 mocked foo undefined undefined');
  });

  it('tests bar and foobar have been called -> cant check foo', () => {
    main();

    expect(bar).toHaveBeenCalled();
    expect(foobar).toHaveBeenCalled();
  });

  it('Sets bar mock implementation in function', () => {
    bar.mockImplementation(num => `${num} mock bar in function`);
    expect(main()).toBe('In main function: 2 mocked foo 3 mock bar in function undefined');
  });

  it('Sets bar mock return value in function', () => {
    bar.mockReturnValue('99 mock bars return in function');
    expect(main()).toBe('In main function: 2 mocked foo 99 mock bars return in function undefined');
  });
});
