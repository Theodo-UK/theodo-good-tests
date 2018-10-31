# Saga

Available [Snippets](../../snippets/docs/contents.md): 
- `>re-enzyme-saga`

For any issues with mocking fetch see [here](./mocking/fetch.md)

## General advice

~~If there is logic in your saga, this logic should be isolated in a pure function that is tested. Do not test the saga itself.~~

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
    yield put(push('/data-page'))
  } 
  catch error {
    yield put(fetchDataFailure(error.body))
  }
}

export default function* dataSaga(): Saga<void> {
  yield takeEvery(actionTypes.LOOKUP.FETCH, fetchDataSaga);
}
```

### Test

```js
import SagaTester from 'redux-saga-tester';

import mySaga from '@redux/module/sagas';
import * as actionTypes from '@redux/modules/data/actionTypes';
import { fetchData, fetchDataSuccess } from '@redux/modules/data/actions';
import myReducer from '@redux/module/reducer';

describe('fetchDataSaga test', () => {
  let sagaTester;

  beforeEach(() => {
    const initialState = {
      data: []
    };

    sagaTester = new SagaTester({
      initialState: { data: [] },
      reducers: { myReducer },
    });
    // This attaches the saga to the store
    sagaTester.start(mySaga);
  });

  it('should retrieve data from the server and send a SUCCESS action', async () => {
    // Here we mock the api call by mocking fetch
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      status: 200,
      json: () => Promise.resolve({ data: ['wow some api'] }),
    }));

    // Start the integration test by dispatching the first action
    sagaTester.dispatch(fetchData());

    // Check that the actions that have been emitted by the saga are what we expect
    const calledActions = sagaTester.getCalledActions();

    expect(calledActions[0]).toEqual(fetchData);
    expect(calledActions[1]).toEqual(fetchDataSuccess([{ model: 'test', make: 'testy' }]));
    expect(calledActions[2]).toEqual(push('/data-page'))
  });
});

```