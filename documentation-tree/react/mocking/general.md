# Mocking with Jest

- See [real mock test examples you can run](https://github.com/Theodo-UK/theodo-good-tests-runnable-examples#mocking-examples)
- They will go through the info in this file with real examples

## Contents


- [jest.fn() object](#jestfn-object)
- [Using Expect](#using-expect)
- [Mocking implementation/return value](#mocking-implementationreturn-value)
- [Clear/Reset mocks](#clearreset-mocks)
- [jest.spyOn](#jestspyon)
- [jest.mock](#jestmock)
- [requireActual](#requireactual)
- [Mocking Default Export](#mocking-default-export)
- [jest.doMock](#jestdomock)
- [Mocking Fetch](./fetch.md)
- [Sources](#sources)



## jest.fn() object

`jest.fn()` returns a mock object that can take the place of a real function

- By default, if the object is used in the place of a real function, it will be a function that returns undefined

    - i.e. it is the same as passing `() => undefined` in place of the real function

## Using Expect

However, if you first define it as 

```js
const myMock = jest.fn()
```

and then pass `myMock` in place of a real function, you can use `expect`([docs](https://jestjs.io/docs/en/expect)) on the mock object.

If you simulate somthing that would call the passed function, you could expect the function toHaveBeenCalled, toHaveBeenCalledWith etc:

```js
expect(myMock).toHaveBeenCalled();
expect(myMock).toHaveBeenCalledWith(2, 'abc');
```

The mock object also has a mock attribute which stores all the calls and results of the mock:
- `myMock.mock.calls` stores the arguments of each call 

    - `myMock.mock.calls[1][2]` is the 3rd argument of the 2nd call to the function

- `myMock.mock.results` stores the value and whether the mock threw an exception for each call

    - `myMock.mock.results[1].value` is the returned value of then 2nd call

    - `myMock.mock.results[1].isThrow` is a boolean representing whether the 2nd call to the function threw an exception

## Mocking implementation/return value

The mock object also provides some functions useful for testing:
- `mockImplementation` takes a function as an argument which will replace the default `() => undefined` behaviour
```js
myMock.mockImplementation(() => 'mocked function')
```
- `mockReturnValue` takes an argument that just replaces the return value
```js
myMock.mockReturnValue('mocked function')
```
- Both of these have a `Once` option: `mockImplementationOnce` and `mockReturnValueOnce`

    - These will replace the existing behaviour for one call only and then revert back

    - They can be stacked i.e. if you use two `mockImplementationOnce`'s they will define the next two calls before reverting to the existing behaviour

    - The existing behaviour will be the last call of the main `mockImplementation` or `mockReturnValue` functions or else will be the default `() => undefined`

## Clear/Reset mocks

Sometimes you need to reset a mock to ensure previous tests don't interfere with your results

- Calling `myMock.mockClear()` will delete any previous calls of a mock object
    - i.e. the number of calls and previous arguments that would cause `expect(myMock).toHaveBeenCalledWith('abc')` to pass will be reset

- Calling `myMock.mockReset()` does the same as mockClear but also clears any mocked implementations/return values
    - i.e. it resets back to the default `() => undefined`

## jest.spyOn

The mock object that jest.fn creates is very useful for checking how/if functions are called

If we were to try these on non mocked functions it wouldn't work
  
However, if you wish to check a function was called without mocking its behaviour you can use `jest.spyOn`

```js
const mySpy = jest.spyOn(myModule, 'foo');
```

It creates a mock object just like `jest.fn()` but instead sets the default implementation as the real implementation

- You can still use `mockImplementation` etc. on `mySpy` to overwrite the real function like normal mock objects

- The syntax is a bit strange/annoying, afaik you have to import the whole module and then spyOn parts of it

## jest.mock

`jest.mock` is different to `jest.fn`
```js
jest.mock('../src/functions.js')
```
- It takes a module as an argument

- Any function in that module will then automatically be set as a `jest.fn()` mock object

- Therefore if you mock `functions.js`, any call to one of those functions will return `undefined` by default

If you want to check if the mocked function has been called etc you can simply import it from the `functions.js file`
- ⚠️ Since `functions.js` has been mocked, when you import from it, you are actually importing the mock objects

As an optional second argument, `jest.mock` can take a factory
- The factory can define the individual functions, either with new implementations or as mock objects
```js
    jest.mock('../src/functions.js', () => ({
        foo: num => `${num} mocked foo`,
        bar: jest.fn(),
        foobar: jest.fn(),
    }));
```
- If you define the implementation here it won't be a mock object, just a different real function

- If you use `jest.mock` the factory will replace the actual module, so you will have to define everything you intend to use (i.e. doesn't default to `jest.fn()` anymore) or use `requireActual`

## requireActual

If you specify a second argument (factory) then you have to define everything you intend to call

- If you only want to mock part of a module you can use `requireActual` to spread the actual module first before mocking the functions you want to

```js
jest.mock('../src/functions.js', () => ({
  ...require.requireActual('../src/functions.js'),
  bar: num => `${num} mocked bar`,
}));
```

## Mocking Default Export

If you wish to mock the default export of a module you have use the following syntax

```js
jest.mock('../src/main.js', () => ({
  __esModule: true,
  default: () => 'mocked main',
}));
```

## jest.doMock

Sometimes you only want to mock a module in one test block of a file

It's a bit messy but can be done

In this case you can use a `doMock` which overrides the hoisting jest does by default
- You will need to reset the cache of required modules with `jest.resetModules()`
```js
const mainTemp = require('../src/main');
```

- You will then need to reimport your functions using require notation

All following tests will go back to using the real module again

Similarly you can use a `jest.dontMock` to use the actual implementation for specific tests if it has already been mocked



## Sources

- [jest's mocking docs](https://jestjs.io/docs/en/mock-functions)

- Good [article](https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c) on understanding jest's mocks
