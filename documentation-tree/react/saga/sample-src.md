### Action Creators

```js
export const actionTypes = {
  FETCH_DATA: {
    REQUEST: 'FETCH_DATA_REQUEST',
    SUCCESS: 'FETCH_DATA_SUCCESS',
    FAILURE: 'FETCH_DATA_FAILURE',
  },
};

export const fetchDataRequest = () => ({
  type: actionTypes.FETCH_DATA.REQUEST,
});

export const fetchDataSuccess = data => ({
  type: actionTypes.FETCH_DATA.SUCCESS,
  data,
});

export const fetchDataFailure = error => ({
  type: actionTypes.FETCH_DATA.FAILURE,
  error,
});
```

### Reducer

```js
import { actionTypes } from './actions';

export const initialState = {
  loading: false,
  error: null,
  data: [],
};

export const myReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_DATA.REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FETCH_DATA.SUCCESS:
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    case actionTypes.FETCH_DATA.FAILURE:
      return {
        ...state,
        error: action.error,
        loading: false,
      };
    default:
      return state;
  }
};
```

### Saga

```js
import { takeEvery, put, call } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import { fetchDataSuccess, fetchDataFailure, actionTypes } from './actions';

export function* fetchDataSaga() {
  try {
    const resp = yield call(fetch, 'https://api/endpoint');
    const result = yield resp.json();
    yield put(fetchDataSuccess(result.data));
    yield put(push('/data-page'));
  } catch (error) {
    yield put(fetchDataFailure(error));
  }
}

export default function* dataSaga() {
  yield takeEvery(actionTypes.FETCH_DATA.REQUEST, fetchDataSaga);
}
```
