# Saga

Available [Snippets](../../snippets/docs/contents.md): 
- `>re-enzyme-saga`

For any issues with mocking fetch see [here](./mocking/fetch.md)

## General advice

~~If there is logic in your saga, this logic should be isolated in a pure function that is tested. Do not test the saga itself.~~

## redux-saga-test-plan vs redux-saga-tester

2 libraries have been tried to test sagas

Both are shown here but the recommended library is `redux-saga-test-plan` due to:

Pros of both
- Don’t need to call .next on everything
- Can easily test what is in the store
- Can test whole flow of a dispatched action

Pros of `redux-saga-test-plan`
- Can check everything (puts, calls, takes, etc) if needed, not required to
- Can test what a non mocked function is called with
- Don’t have to explicitly mock everything with jest.mock, can specify return values in .provide
- Can copy-paste the call lines straight from the actual saga
- Can drop in new calls, puts anywhere without worrying about order
- Don’t need async, await
- Better readability

Pros of `redux-saga-tester`
- Can test exact order *if you want to*
- Can test just what you want in the store (rather than whole state)

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

### Test redux-saga-tester

```js
import SagaTester from 'redux-saga-tester';
import { push } from 'react-router-redux';

import mySaga from '@redux/module/sagas';
import { fetchData, fetchDataSuccess } from '@redux/modules/data/actions';
import myReducer from '@redux/module/reducer';

describe('fetchDataSaga test', () => {
  let sagaTester;

  beforeEach(() => {
    const initialState = {
      data: [],
    };

    sagaTester = new SagaTester({
      initialState,
      reducers: { myReducer },
    });
    // This attaches the saga to the store
    sagaTester.start(mySaga);
  });

  it('should retrieve data from the server and send a SUCCESS action', async () => {
    // Here we mock the api call by mocking fetch
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () => Promise.resolve({ data: [{ result: 'wow some api' }] }),
      }),
    );

    // Start the integration test by dispatching the first action
    sagaTester.dispatch(fetchData());

    // Check that the actions that have been emitted by the saga are what we expect
    const calledActions = sagaTester.getCalledActions();

    expect(calledActions[0]).toEqual(fetchData);
    expect(calledActions[1]).toEqual(fetchDataSuccess([{ result: 'wow some api' }]));
    expect(calledActions[2]).toEqual(push('/data-page'));
  });
});

```
