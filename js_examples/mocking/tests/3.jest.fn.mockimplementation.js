// @flow
import { foo, foobar } from '../src/functions';

/*
  Uses the jest.fn mock object
  jest.fn() returns a mock object that can take the place of a real function
    - By default if the object is used in the place of a real function, it will be a function that returns undefined
      - i.e. it is the same as passing () => undefined in place of the real function

  The mock object also provides some functions useful for testing
    - mockImplementation takes a function as an argument which will replace the default () => undefined behaviour
    - mockReturnValue takes an argument that just replaces the return value
    - Both of these have a "Once" option: mockImplementationOnce and mockReturnValueOnce
      - These will replace the existing behaviour for one call only and then revert back
      - They can be stacked i.e. if you use two mockImplementationOnce's they will define the next two calls before reverting to the existing behaviour
      - The existing behaviour will be the last call of the main mockImplementation or mockReturnValue functions or else will be the default undefined 
*/

describe('Using jest.fn', () => {
  it('Tests foo WITHOUT jest.fn (as before)', () => {
    expect(foobar(foo)).toBe('10 foo foobar');
  });

  it('Tests WITH jest.fn and mocks implementation', () => {
    const fooMock = jest.fn();

    fooMock.mockImplementation(num => `${num} mocked foo`);

    expect(foobar(fooMock)).toBe('10 mocked foo foobar');
  });

  it('mockImplentation multiple calls -> returns same everytime', () => {
    const fooMock = jest.fn();

    fooMock.mockImplementation(num => `${num} mocked foo`);

    expect(foobar(fooMock)).toBe('10 mocked foo foobar');
    expect(foobar(fooMock)).toBe('10 mocked foo foobar');
    expect(foobar(fooMock)).toBe('10 mocked foo foobar');
  });

  it('mockImplentationOnce multiple calls and then a default', () => {
    const fooMock = jest.fn();

    fooMock
      .mockImplementationOnce(num => `${num} mocked foo`)
      .mockImplementationOnce(num => `${num} mocked again foo`)
      .mockImplementation(num => `${num} mocked infinitely foo`);

    expect(foobar(fooMock)).toBe('10 mocked foo foobar');
    expect(foobar(fooMock)).toBe('10 mocked again foo foobar');
    expect(foobar(fooMock)).toBe('10 mocked infinitely foo foobar');
    expect(foobar(fooMock)).toBe('10 mocked infinitely foo foobar');
  });
});
