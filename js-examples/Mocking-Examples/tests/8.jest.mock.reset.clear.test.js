// @flow
import main from '../src/main';
import { bar, foobar } from '../src/functions';

/*
  Sometimes you need to reset a mock to ensure previous tests don't interfere with your results
  Calling myMock.mockClear() will delete any previous calls of a mock object
    - i.e. the number of calls and expect.toHaveBeenCalledWith will be reset
  Calling myMock.mockReset() does the same as mockClear but also clears any mocked implementations/return values
    - i.e. it resets back to the default () => undefined
*/

jest.mock('../src/functions.js', () => ({
  foo: num => `${num} mocked foo`,
  bar: jest.fn(),
  foobar: jest.fn(),
}));

describe('Using mock clear and reset', () => {

  it('Sets bar mock implementation in function', () => {
    bar.mockImplementation(num => `${num} mock bar in function`);
    expect(main()).toBe('In main function: 2 mocked foo 3 mock bar in function undefined');
  });

  it('Show use of mockClear aswell for number of calls', () => {
    main();

    // In this case the first test case has already called foobar so our test result depends on the order of tests
    expect(foobar).toHaveBeenCalledTimes(2);

    // Instead we can call mockClear to be sure we start at the same point every time
    foobar.mockClear();
    main();
    expect(foobar).toHaveBeenCalledTimes(1);
  });

  it('Tests a different mocked version mockReset', () => {
    bar.mockReset();
    expect(main()).toBe('In main function: 2 mocked foo undefined undefined');    
    bar.mockImplementation(num => `${num} fail case version of bar`);
    expect(main()).toBe('In main function: 2 mocked foo 3 fail case version of bar undefined');
  });
});
