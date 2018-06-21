# Saga

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
    const cars = yield resp.json();
    yield put(fetchDataSuccess(cars.availableCars));
  } 
  catch error {
    yield put(fetchDataFailure(error.data))
  }
}

export default function* carSagas(): Saga<void> {
  yield takeEvery(actionTypes.LOOKUP.FETCH, fetchDataSaga);
}
```

### Test

```js
import SagaTester from 'redux-saga-tester';

import mySaga from '@redux/module/sagas';
import * as actionTypes from '@redux/modules/cars/actionTypes';
import { fetchData, fetchDatsSuccess } from '@redux/modules/cars/actions';
import myReducer from '@redux/module/reducer';

describe('fetchCarsSaga test', () => {
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

    // Wait for the saga to finish (it emits the SUCCESS action when its done)
    await sagaTester.waitFor(actionTypes.LOOKUP.SUCCESS);

    // Check that the success action is what we expect it to be
    expect(sagaTester.getLatestCalledAction()).toEqual(fetchDataSuccess([{ model: 'test', make: 'testy' }]));
    expect(sagaTester.getState().myReducer.data).toEqual(['wow some api']);
  });
});

```