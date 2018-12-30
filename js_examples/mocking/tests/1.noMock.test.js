// @flow
import { foo, bar, foobar } from '../src/functions';
import main from '../src/main';

/*
  Basic testing with no mocking
  Use this file to familiarise yourself with the basic functions
*/

describe('no mocking', () => {
  it('functions work as expected', () => {
    expect(foo(2)).toBe('2 foo');
    expect(bar(3)).toBe('3 bar');
    expect(foobar(foo)).toBe('10 foo foobar');
  });

  it('main returns as expected', () => {
    expect(main()).toBe('In main function: 2 foo 3 bar 10 foo foobar');
  });
});
