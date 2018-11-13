# Reducer

Available [Snippets](../../snippets/docs/contents.md): 
- `>re-enzyme-reducer`

### Code

Suppose we have a redux module set up like so and we wish to test the reducer

```js
// redux/modules/sample/actions
import * as actionTypes from './actionTypes';

export const fetchDataRequest = () => ({
  type: actionTypes.FETCH.REQUEST,
});

export const fetchDataSuccess = data => ({
  type: actionTypes.FETCH.SUCCESS,
  data,
});

export const fetchDataFailure = error => ({
  type: actionTypes.FETCH.FAILURE,
  error,
});
```

```js
// redux/modules/sample/actionTypes
export const FETCH = {
  REQUEST: 'sample/FETCH.REQUEST',
  SUCCESS: 'sample/FETCH.SUCCESS',
  FAILURE: 'sample/FETCH.FAILURE',
};

export default FETCH;
```

```js
// redux/modules/sample/reducer
import * as actionTypes from './actionTypes';

const initialState = {
  data: [],
  state: null,
  error: null,
};

const sampleReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH.REQUEST:
      return {
        ...state,
        state: 'loading',
      };
    case actionTypes.FETCH.SUCCESS:
      return {
        ...state,
        data: action.data,
        state: 'success',
      };
    case actionTypes.FETCH.FAILURE:
      return {
        ...state,
        error: action.error,
        state: 'failure',
      };
    default:
      return state;
  }
};

export default sampleReducer;
```

### Test

```js
import { sampleReducer } from '@redux/modules';
import { fetchDataRequest, fetchDataSuccess, fetchDataFailure } from '@redux/modules/sample/actions';

const initialState = {
  data: [],
  state: null,
  error: null,
};

describe('sample reducer', () => {
  it('should handle LOOKUP.REQUEST', () => {
    const action = fetchDataRequest();
    const newState = sampleReducer(initialState, action);
    expect(newState).toEqual({
      data: [],
      state: 'loading',
      error: null,
    });
  });

  it('should handle LOOKUP.SUCCESS', () => {
    const data = [
      {
        data1: 'one',
        data2: 'two',
      },
    ];

    const action = fetchDataSuccess(data);
    const newState = sampleReducer(initialState, action);

    expect(newState).toEqual({
      data: [
        {
          data1: 'one',
          data2: 'two',
        },
      ],
      state: 'success',
      error: null,
    });
  });

  it('should handle LOOKUP.FAILUREs', () => {
    const error = 'errrororor';

    const action = fetchDataFailure(error);
    const newState = sampleReducer(initialState, action);

    expect(newState).toEqual({
      data: [],
      state: 'failure',
      error: 'errrororor',
    });
  });
});
```