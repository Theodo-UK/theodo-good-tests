# Saga

For any issues with mocking fetch see [here](./mocking/fetch.md)

See [analysis](./saga-library-comparison.md) of different saga testing libraries

## Example

### Action Creators

```js
export const fetchData = () => ({
  type: actionTypes.LOOKUP.FETCH,
});

export const fetchDataSuccess = (data: MyData) => ({
  type: actionTypes.LOOKUP.SUCCESS,
  data,
});

export const fetchDataFailure = (error: ErrorType) => ({
  type: actionTypes.LOOKUP.SUCCESS,
  error,
});
```

### Saga

```js
import type { Saga } from 'redux-saga';

import { takeEvery, put, call } from 'redux-saga/effects';
import { fetchDataSuccess } from '@redux/module/actions';
import * as actionTypes from './actionTypes';

export function* fetchDataSaga(): Saga<void> {
  try {
    const resp = yield call(fetch, '/api/endpoint');
    const result = yield resp.json();
    yield put(fetchDataSuccess(result.data));
    yield put(push('/data-page'));
  }
  catch error {
    yield put(fetchDataFailure(error.body));
  }
}

export default function* dataSaga(): Saga<void> {
  yield takeEvery(actionTypes.LOOKUP.FETCH, fetchDataSaga);
}
```

### Test redux-saga-test-plan

```js
import { combineReducers } from 'redux';
import { push } from 'react-router-redux';
import { call } from 'redux-saga/effects';
import { expectSaga } from 'redux-saga-test-plan';

import mySaga from '@redux/module/sagas';
import { fetchData, fetchDataSuccess } from '@redux/modules/data/actions';
import myReducer from '@redux/module/reducer';

describe('fetchDataSaga test', () => {
  const initialState = {
    myReducer: { data: [] },
  };
  it('should retrieve data from the server and send a SUCCESS action', () => {
    const finalState = {
      ...initialState,
      myReducer: {
        ...initialState.myReducer,
        data: ['wow some api'],
      },
    };

    expectSaga(mySaga)
      // Setup mocks
      .provide([
        [
          call(fetch, '/api/endpoint', {
            json: () => ({
              result: 'wow some api',
            }),
          }),
        ],
      ])
      // Setup reducer with initial state
      .withReducer(combineReducers({ myReducer }), initialState)
      // Dispatch initial action
      .dispatch(fetchData())
      // Check that expected stuff has happened (order doesn't matter)
      .put(
        fetchDataSuccess([{ result: 'wow some api' }])
          .put(push('/data-page'))
          // Check final state
          .hasFinalState(finalState)
          .silentRun(),
      );
  });
});
```

To mock a request function that is not `fetch` and does not have any parameter, you can use `matchers` instead:

```
import * as matchers from "redux-saga-test-plan/matchers"

...
describe('fetchDataSaga test', () => {
  it('...', () => {
    ...
    expectSaga(mySaga)
      // Setup mocks
      .provide([
        [
          matchers.call.fn(getDataFromBackend), dataFromBackendMockObject
        ],
      ])
      // Setup reducer with initial state
      .withReducer(combineReducers({ myReducer }), initialState)
      // Dispatch initial action
      .dispatch(fetchData())
      // Check that expected stuff has happened (order doesn't matter)
      .put(
        fetchDataSuccess([{ result: 'wow some api' }])
          .put(push('/data-page'))
          // Check final state
          .hasFinalState(finalState)
          .silentRun(),
      );
  })
})



```
