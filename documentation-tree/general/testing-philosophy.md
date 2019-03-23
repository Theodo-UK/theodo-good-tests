# Testing Philosophy

## Why do we write tests?

- To catch bugs locally and prevent them reaching production
- To provide confidence in the code we write or refactor
- To point us in the right direction to fix a bug
  - Tests don't bring the user value, bug fixes do
  - A good test therefore doesn't just inform of a bug but shows where to fix it
- To document the use cases of a function
- To improve the quality of our code
- To implement complex functions by enforcing business logic with tests

## What is a good test?

A good test:

- breaks when the logic of the code is broken
- has an explicit name (refers to the tested function and the use case)
- tests all relevant use cases
- takes less than 20 minutes to write

A good test suite is:

- **Fast**: gives a quick feedback loop allowing quick rerunning
- **Reliable**: is deterministic providing confidence in its results
- **Isolating**: pinpoints the faulty code

## When should we write tests?

- Testing is a trade-off of time spent writing the test vs time spent fixing bugs a test could prevent
- Different teams/projects have different requirements and need to understand and define their own strategy
- 3 potential options (which are discussed [here](./when-to-test.md)) are:
  - Code Coverage
  - Code Review
  - Technical Strategy

## What type of tests do we write?

- Ideally a project would have a linter and type checker enforced
- The ratio of Unit/Integration/E2E is hotly debated but is often proposed as a pyramid
  - As a starter Google proposes 70/20/10 ([Source](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html))
- The pros/cons of each are discussed [here](./types-of-testing.md)

## Good practices

- You should ensure any test you create/update can fail if the code is broken. This ensures the test actually runs and that it tests the right thing
- When developing you should know how to run just your specific test to reduce feedback time while debugging your test
