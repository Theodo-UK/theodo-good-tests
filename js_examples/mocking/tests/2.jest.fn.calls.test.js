// @flow
import { foo, foobar } from '../src/functions';

/*
  Uses the jest.fn mock object
  jest.fn() returns a mock object that can take the place of a real function
    - By default if the object is used in the place of a real function, it will be a function that returns undefined
      - i.e. it is the same as passing () => undefined in place of the real function

  However you can use "expect" to expect the function toHaveBeenCalled, toHaveBeenCalledWith etc
    - expect(mock.toHaveBeenCalled)

  The mock object also has a mock attribute which stores all the calls and results of the mock
    - myMock.mock.calls stores the arguments of each call 
      -> myMock.mock.calls[1][2] is the 3rd argument of the 2nd call
    - myMock.mock.results stores the value and whether the mock threw an error for each call
      -> myMock.mock.results[1].value is the returned value of then 2nd call
*/

describe('Using jest.fn', () => {
  it('Tests foo WITHOUT jest.fn (as before)', () => {
    expect(foobar(foo)).toBe('10 foo foobar');
  });

  it('Tests foo WITH jest.fn fooMock -> BeenCalled, BeenCalledWith -> undefined returned', () => {
    const fooMock = jest.fn();
    foobar(fooMock);
    expect(fooMock).toHaveBeenCalled();
    expect(fooMock).toHaveBeenCalledWith(10);

    expect(foobar(fooMock)).toBe('undefined foobar');
  });

  it('Tests foo WITH jest.fn fooMock -> mock.calls, mock.results', () => {
    const fooMock = jest.fn();

    expect(fooMock.mock.calls[0][0]).toBe(10);
    expect(fooMock.mock.results[0].value).toBe(undefined);
    expect(fooMock.mock.results[0].isThrow).toBeFalsy();

  });
});
