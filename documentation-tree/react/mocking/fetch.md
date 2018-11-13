# Mocking Fetch

Mocking fetch is needed for some test cases, particularly in [saga tests](../saga.md)

It generally needs to be mocked as a Promise with a `json()` function that can be called

Available [Snippets](../../../snippets/docs/contents.md): 
- `>re-jest-fetch`
- `>re-jest-fetch-fail`
- `>re-jest-fetch-multiple`

## Basic Success Response

```js
const mockSuccessFetch = jest
  .fn()
  .mockImplementation(() =>
    Promise.resolve({
      json: () => ({}),
    }),
  )
```

You then need to use this mock in your test either near the top of your file or within specific tests like so
```js
window.fetch = mockSuccessFetch;
```
**Gotcha**: depending on your jest setup you may need to overwrite `global.fetch` instead of `window.fetch`

## Success Response with data

```js
const mockSuccessFetch = jest
  .fn()
  .mockImplementation(() =>
    Promise.resolve({
      status: 200,
      json: () => ({
        data1: 'abc',
        data2: 123,
      }),
    }),
  )
```

## Basic Failure Response

```js
const mockFailureFetch = jest
    .fn()
    .mockImplementation(() => 
        Promise.reject()
    );
```

## Multiple Return Values

If fetch gets called more than once you can chain `mockImplementationOnce` for each subsequent call like so

```js
const mockSuccessFetch = jest
  .fn()
  .mockImplementationOnce(() =>
    Promise.resolve({
      json: () => ({}),
    }),
  )
  .mockImplementationOnce(() =>
    Promise.resolve({
      json: () => mockData,
    }),
  );
```

If you have multiple tests in a file (e.g. success and failure) you can define a `mockSuccessFetch`, `mockFailureFetch`, ... and then specify which one to use within each test case by overwriting `window.fetch` (or `global.fetch`)
