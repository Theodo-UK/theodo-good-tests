// @flow
import main from '../src/main';

/*
  As mentioned if you specify a second argument (factory) then you have to define everything you intend to call
  If you only want to mock part of a module you can use requireActual to spread the actual module first
    before mocking the functions you want to
*/

jest.mock('../src/functions.js', () => ({
  ...require.requireActual('../src/functions.js'),
  bar: num => `${num} mocked bar`,
}));

describe('Using partly mocked module', () => {
  it('Tests partly mocked module -> no undefined', () => {
    expect(main()).toBe('In main function: 2 foo 3 mocked bar 10 foo foobar');
  });
});
