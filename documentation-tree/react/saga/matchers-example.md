## Using partial matchers

Imagine we wish to test this [code](./sample-src.md)

See further explanation for the various methods called [here](./saga.md)

```js
import { combineReducers } from 'redux';
import { push } from 'react-router-redux';
import { expectSaga, matchers } from 'redux-saga-test-plan';

import dataSaga from '../saga';
import { fetchDataRequest } from '../actions';
import { myReducer, initialState as initialMyReducerState } from '../reducer';

describe('dataSaga', () => {
  const initialState = {
    myReducer: initialMyReducerState,
  };

  it('should retrieve data from the server and send a SUCCESS action', () => {
    const mockFetchReturn = {
      json: () => ({
        data: ['wow some api'],
      }),
    };

    return (
      expectSaga(dataSaga)
        .provide([
          // using matchers.call will only match against the call with the correct arguments
          // [matchers.call(fetch, 'https://api/endpoint'), mockFetchReturn],

          // using matchers.call.fn will match against all calls to the function
          [matchers.call.fn(fetch), mockFetchReturn],
        ])
        .withReducer(combineReducers({ myReducer }), initialState)
        .dispatch(fetchDataRequest())

        // likewise checking put was called requires it to be with the correct argument
        // .put(fetchDataSuccess(['wow some api']))

        // using put.actionType can check just the actionType
        .put.actionType('FETCH_DATA_SUCCESS')

        // if you wanted to check a call here you could also use call.fn instead of the whole call

        .put(push('/data-page'))
        .silentRun()
        .then(result =>
          expect(result.storeState.myReducer.data).toEqual(['wow some api']),
        )
    );
  });
});
```
