## Assert specific parts of final state

Imagine we wish to test this [code](./sample-src.md)

See further explanation for the various methods called [here](./saga.md)

```js
import { combineReducers } from 'redux';
import { push } from 'react-router-redux';
import { expectSaga, matchers } from 'redux-saga-test-plan';

import dataSaga from '../saga';
import { fetchDataRequest, fetchDataSuccess } from '../actions';
import { myReducer, initialState as initialMyReducerState } from '../reducer';

describe('dataSaga', () => {
  const initialState = {
    myReducer: initialMyReducerState,
  };

  it('should retrieve data from the server and send a SUCCESS action', () => {
    return (
      expectSaga(dataSaga)
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
        .withReducer(combineReducers({ myReducer }), initialState)
        .dispatch(fetchDataRequest())
        .put(fetchDataSuccess(['wow some api']))
        .put(push('/data-page'))

        // Instead of checking whole final state with the below line
        // .hasFinalState(finalState)

        .silentRun()

        // check part of the state from the resolved promise
        .then(result =>
          expect(result.storeState.myReducer.data).toEqual(['wow some api']),
        )
    );
  });
});
```
