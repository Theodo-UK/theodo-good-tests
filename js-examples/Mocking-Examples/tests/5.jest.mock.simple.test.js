// @flow
import main from '../src/main';
import { foo } from '../src/functions';

/*
  jest.mock is different to jest.fn
  It takes a module as an argument
  Any function in that module will then automatically be set as a jest.fn() mock object
    - Therefore if you mock functions.js, any call to one of those functions will return undefined by default
  If you want to check if the mocked function has been called etc you can simply import it from the functions.js file
    - ⚠️ Since functions.js has been mocked, when you import from it, you are actually importing the mock objects
*/

jest.mock('../src/functions.js');

describe('Using jest.mock', () => {
  it('Tests without caring about undefined return values', () => {
    expect(main()).toBe('In main function: undefined undefined undefined');
  });

  it('Tests foo to have been called by usinf the imported mock object from functions', () => {
    main();
    expect(foo).toHaveBeenCalled();
  });
});
