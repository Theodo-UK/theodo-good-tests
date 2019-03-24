# Saga Testing Library Comparison

## redux-saga-test-plan vs redux-saga-tester

2 libraries have been tried to test sagas

- [redux-saga-test-plan](./saga.md)
- [redux-saga-tester](./old-redux-saga-tester.md)

The recommended library is `redux-saga-test-plan` due to:

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

- Can test exact order _if you want to_
- Can test just what you want in the store (rather than whole state)
