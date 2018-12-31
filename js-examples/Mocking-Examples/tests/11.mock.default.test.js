// @flow

import superMain from '../src/superMain';

/*
  If you wish to mock the default export of a module you have use the following syntax
*/

jest.mock('../src/main', () => ({
  __esModule: true,
  default: () => 'mocked main',
}));

describe('superMain', () => {
  it('it mocks a default export', () => {
    expect(superMain()).toBe('In superMain function: mocked main');
  });
});
