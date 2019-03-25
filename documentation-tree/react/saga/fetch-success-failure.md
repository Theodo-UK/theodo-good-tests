## Basic fetch with success and failure

Imagine we wish to test this [code](./sample-src.md)

See further explanation for the various methods called [here](./saga.md)

```js
import { combineReducers } from 'redux';
import { push } from 'react-router-redux';
import { expectSaga, matchers, providers } from 'redux-saga-test-plan';

import dataSaga from '../saga';
import {
  fetchDataRequest,
  fetchDataSuccess,
  fetchDataFailure,
} from '../actions';
import { myReducer, initialState as initialMyReducerState } from '../reducer';

describe('dataSaga', () => {
  const initialState = {
    myReducer: initialMyReducerState,
  };

  it('should retrieve data from the server and send a SUCCESS action', () => {
    const finalState = {
      ...initialState,
      myReducer: {
        ...initialState.myReducer,
        data: ['wow some api'],
      },
    };

    // Make sure to return expectSaga as it is asynchronous (your test will automatically pass if you don't return this)
    return (
      expectSaga(dataSaga)
        // Setup mocks
        // .provide will intercept your saga and mock where required
        // It takes a array of tuples
        // Each tuple first takes a matcher of what effect it should catch (call, put, select, etc)
        // And optionally takes a second value of what it should return when it catches it
        // Note: provide doesn't care if these functions get called, it just steps in if they do get called
        .provide([
          [
            matchers.call(fetch, 'https://api/endpoint'),
            {
              json: () => ({
                data: ['wow some api'],
              }),
            },
          ],
        ])

        // Setup reducer with initial state
        .withReducer(combineReducers({ myReducer }), initialState)

        // Dispatch initial action to start your saga
        .dispatch(fetchDataRequest())

        // Check that expected stuff has happened (order doesn't matter)
        // You can check any effect here and your test will fail if these don't get called during the saga run
        .put(fetchDataSuccess(['wow some api']))
        .put(push('/data-page'))

        // You can optionally check the final state
        .hasFinalState(finalState)

        // silentRun actually starts the test (run works too)
        // silentRun prevents warning messages from the saga timing out (which it will do if you use takeEvery for example)
        .silentRun()
    );
  });

  it('should call FAILURE action if the fetch throws an error', () => {
    const finalState = {
      ...initialState,
      myReducer: {
        ...initialState.myReducer,
        error: '404 error',
      },
    };
    return (
      expectSaga(dataSaga)
        // Setup mock with a provided error this time
        .provide([
          [
            matchers.call(fetch, 'https://api/endpoint'),
            providers.throwError('404 error'),
          ],
        ])
        .withReducer(combineReducers({ myReducer }), initialState)
        .dispatch(fetchDataRequest())
        .put(fetchDataFailure('404 error'))

        // Check that some stuff does not happen, will fail if it does happen
        .not.put(push('/data-page'))

        .hasFinalState(finalState)
        .silentRun()
    );
  });
});
```
