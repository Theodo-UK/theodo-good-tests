# Types of Testing

### Static Tests

- Tests your code is syntactically correct and takes/returns the right types (e.g. flow/eslint)
- 👍 Gives high confidence of no stupid bugs
- 🚫 Doesn't prevent logic errors

### Unit Tests

- Tests that test small "units" of the code in isolation
- 👍 Fast, Reliable and Isolating
- 🚫 Can lead to thousands of tests that require maintaining
- 🚫 Doesn't guarantee that working parts will work together

### Integration Tests

- Combines/integrates different parts of the code
- 👍 Good balance of confidence, speed and expense
- 👍 Less mocking
- 👍 Can prove two working units will interact correctly
- 👍 Can often spot the same bug an E2E test will spot in a cheaper and more isolating way

### End to End Tests (E2E)

- Last line of defence, often run on staging environment to test a user journey
- 👍 Provide confidence the whole site/app is working
- 👍 Focus on the user journey
- 👍 Can prove two working integrations will interact correctly
- 🚫 Not fast, not reliable, not isolating
- 🚫 Small bugs hidden by big bugs
