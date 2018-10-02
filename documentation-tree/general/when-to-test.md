# When should we write tests?

3 potential options are outlined below

### Code Coverage

- Code coverage enforces a certain percentage of your project being covered by at least one test and blocks code that goes below these standards
- 👍 You can be confident a large part of your codebase 
is covered
- 🚫 It has diminishing returns - you end up testing implementation details or things which flow/eslint could pick up for you
- 🚫 Unless your coverage is 100% it still provides leeway for code that should be tested to get through without tests

### Technical Strategy

- Define what tests to write and how to write them in the technical strategy of a ticket
- 👍 The whole team can ensure the right things are being tested and are being tested in the right way
- 🚫 Extra time needed to refine/plan a ticket

### Code Review

- Rely on the dev to implement the right tests and the reviewer to enforce good practices
- 👍 No time wasted on useless tests or involving the team for every test case
- 🚫 No common strategy, laxness may allow code that should be tested to get through without tests