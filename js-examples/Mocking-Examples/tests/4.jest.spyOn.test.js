// @flow
import * as functions from '../src/functions';
import main from '../src/main';

/*
  The mock object that jest.fn creates is very useful for checking how/if functions are called
  If we were to try these on non mocked functions it wouldn't work
  
  However if you wish to check a function was called without mocking its behaviour you can use jest.spyOn
  It creates a mock object like jest.fn but sets the default implementation as the real function
  
  Note: You can use mockImplementation etc to overwrite the real function like normal mock objects

  Note: the syntax is a bit strange/annoying, afaik you have to import the whole module and then spyon parts of it
*/

describe('spies', () => {
  it('checks a function was called without mocking', () => {
    main();

    // expect(functions.foo).toHaveBeenCalled(); // WON'T WORK
  });

  it('it calls all the functions with the right arguments using spyOn', () => {
    const fooSpy = jest.spyOn(functions, 'foo');
    const barSpy = jest.spyOn(functions, 'bar');
    const foobarSpy = jest.spyOn(functions, 'foobar');

    main();

    expect(fooSpy).toHaveBeenCalledWith(2);
    expect(barSpy).toHaveBeenCalledWith(3);
    expect(foobarSpy).toHaveBeenCalledWith(fooSpy);
  });

  it('it uses spies to switch between the real function and a mocked versions', () => {
    const fooSpy = jest.spyOn(functions, 'foo');

    expect(main()).toBe('In main function: 2 foo 3 bar 10 foo foobar');

    fooSpy.mockImplementationOnce(num => `${num} mocked foo`);
    expect(main()).toBe('In main function: 2 mocked foo 3 bar 10 foo foobar');

    // then back to real value
    expect(main()).toBe('In main function: 2 foo 3 bar 10 foo foobar');

  });
});
