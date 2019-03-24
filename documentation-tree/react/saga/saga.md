# Saga

See real saga tests you can run yourself [here](https://github.com/Theodo-UK/theodo-good-tests-runnable-examples#redux-examples)

See [analysis](./saga-library-comparison.md) of different saga testing libraries

The syntax of the library requires some explanation as laid out on this page

If you're new to the library it is recommended to read the [first example](./sample-src.md) and then come back here for further explantion

## Contents

- [Sample code to test](./sample-src.md)
- [Test success and failure of a fetch](./fetch-success-failure.md)
- [Assert specific parts of final state](./specific-final-state.md)
- [Using partial matchers](./matchers-example.md)

## redux-saga-test-plan

- The documentation for `redux-saga-test-plan` can be found [here](http://redux-saga-test-plan.jeremyfairbank.com/)
- Imagine we wish to test the saga laid out [here](./sample-src.md)
- The main concepts to using this library are:

### `expectSaga`

- Will run your saga asynchronously just like `redux-saga`
- By calling the `run` or `silentRun` method it will return a Promise
- **NB**: You can make various assertions within `expectSaga` but ensure you return it's value so `jest` knows to wait for the Promise to resolve to decide if the test passes

### `.provide`

- The `.provide` method provides an easy way to mock in `redux-saga-test-plan`
- It will intercept your effect creators (`call`, `put`, `select` etc) and will handle them rather than allowing `redux-saga` to
- **NB**: It takes an array of tuples where:
  - the first value is the effect creator to intercept (see [matchers](#matchers) below)
  - the optional second value is what to return if intercepted (see [providers](#providers) below)
- You can therefore mock api calls and specify their return values or indeed mock action dispatches that would trigger a saga you have tested elsewhere
- **NB**: `.provide` doesn't care if these functions get called, it just intercepts them if they do get called

### `.withReducer`

- You can provide the reducers you expect to be called here along with an initial state
- If you don't provide an initial state it will use the initial state you defined in your actual reducer

### `.dispatch`

- This is where you trigger the start of your test
- You dispatch the action that your saga will be picking up
- You can provide the payload etc here

### <a id="assertions"></a> `.put`, `.call`, `.select`

- At this point you can begin your actual assertions to make your test pass/fail
- You can use any effect creator here and your test will only pass if that effect creator is called
- You can prefix it with `.not.call` for example to assert something is not called

### `.hasFinalState`

- Here you can assert what the final state should look like after the saga has run

### .`silentRun`

- As mentioned `silentRun` will start your test
- As most sagas will have a `takeEvery` it means they run indefinitely. Therefore `expectSaga` will timeout after 250ms of inactivity
  - If you use `run`, this timeout will produce a warning message in your console. Using `silentRun` suppresses this

## Additonal Utilities

### <a id="matchers"></a>Matchers

In `.provide` you can mock effect creators such as `call`, `put`, `select` etc

You can use `matchers.call` from `redux-saga-test-plan/matchers` to "match" an actual `call` in your saga (or `matchers.put` for `put` and so on)

#### Basic matchers

It will match any call to the that function with the specfied argument(s) and intercept it

- In this example any fetch made to 'https://endpoint' will be intercepted and do nothing (as no second value has been provided to the tuple)

  ```js
  .provide[
    [matchers.call(fetch, 'https://endpoint')]
  ]
  ```

- Now in this example, we have provided a second value in the tuple, so this value will be returned when the first value is matched

  ```js
  .provide[
    [matchers.call(fetch, 'https://endpoint'), { data: 'fake data' }]
  ]
  ```

#### Partial Matchers

In some cases however your call may pass a complicated object as the body and you don't want to duplicate that in your matcher and in your [assertion](#assertions) later in the test

Here you can use the partial matching provided by the library. In particular, `.fn`

- The following matcher will pick up any call to fetch, regardless of the arguments passed

```js
  .provide[
    [matchers.call.fn(fetch), { data: 'fake data' }]
  ]
```

#### `redux-saga/effects` vs `redux-saga-test-plan/matchers`

- In `.provide` you can use the effect creators from `redux-saga/effects` _but_ it is recommended to use `matchers` from `redux-saga-test-plan/matchers` for consistency as you will often use the `.fn` functionality

#### Matchers for assertions

- When [asserting](#assertions) effect creators have been called later in your test you can also use the partial matchers functionality like in `.provide`.
- A specific use case for this might be the `.actionType` partial matcher. The following would assert the `FETCH_DATA_SUCCESS` action type was dispatched but wouldn't care about its payload

```
.put.actionType('FETCH_DATA_SUCCESS'))
```

### <a id="providers"></a>Providers

The `redux-saga-test-plan/providers` gives some providers, the most useful of which is `throwError`

If you specify `providers.throwError('error')` as the second value in a provide tuple it will throw an error _if/when_ the first value of the tuple is matched

```js
 .provide[
    [matchers.call.fn(fetch), providers.throwError('404 error')]
  ]
```

## Gotchas

- You must return `expectSaga` to tell `jest` to wait for the promise resolution to determine if the test passes or fails
- Adding an effect creator to `.provide` only tells the test to intercept that effect _if_ it is called meaning the test won't fail if it doesn't get called
  - You only assert it gets called(and hence pass/fail the test) in the `.put`, `.call`, `.select` methods of `expectSaga` _outside_ of the `.provide` array
