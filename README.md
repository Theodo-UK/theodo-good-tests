# Theodo Good Tests

## Quick Links

- [Testing Examples](#examples) - examples of code and relevant tests
  - [Django](documentation-tree/django.md)
  - [React](documentation-tree/react.md)
  - [Real JS Runnable Examples (WIP)](documentation-tree/js-examples.md)
- [Snippets](#snippets) - templates for common tests
- [Sources](#sources)



# Why do we write tests?

- To catch bugs locally and prevent them reaching production
- To provide confidence in the code we write or refactor
- To point us in the right direction to fix a bug
  - Tests don't bring the user value, bug fixes do
  - A good test therefore doesn't just inform of a bug but shows where to fix it
- To document the use cases of a function
- To improve the quality of our code
- To implement complex functions by enforcing business logic with tests 



# What is a good test?

A good test:

- breaks when the logic of the code is broken
- has an explicit name (refers to the tested function and the use case)
- tests all relevant use cases
- takes less than 20 minutes to write

A good test suite is:

- **Fast**: gives a quick feedback loop allowing quick rerunning
- **Reliable**: is deterministic providing confidence in its results
- **Isolating**: pinpoints the faulty code




# When should we write tests?

- Testing is a trade-off of time spent writing the test vs time spent fixing bugs a test could prevent
- Different teams/projects have different requirements and need to understand and define their own strategy
- 3 potential options (which are discussed [here](documentation-tree/general/when-to-test.md)) are:
  - Code Coverage
  - Code Review
  - Techinal Strategy



# What type of tests do we write?

- Ideally a project would have a linter and type checker enforced
- The ratio of Unit/Integration/E2E is hotly debated but is often proposed as a pyramid
  - As a starter Google proposes 70/20/10 ([Source](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html))
- The pros/cons of each are discussed [here](documentation-tree/general/types-of-testing.md)



# <a id="examples"></a> How to write a good test? 

Find the relevant sample in this repo and start from there.

Choose your framework:

- [Django](documentation-tree/django.md)
- [React](documentation-tree/react.md)
- React Native (Not yet added - [help wanted](https://github.com/Theodo-UK/theodo-good-tests/issues/24))



# Snippets

A collection of snippets for all devs to use within VSCode.

Given this is a testing repo, these can be templates for different forms of tests, but all form of templates/snippets can/should be added here

- [Setting Up](./snippets/docs/setup.md)
- [Contents](./snippets/docs/contents.md)
- [Create Your Own](./snippets/docs/create.md)



# Sources

- [Write tests. Not too many. Mostly integration.](https://blog.kentcdodds.com/write-tests-not-too-many-mostly-integration-5e8c7fff591c) - Kent C. Dodds
- [Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html) - Mike Wacker
- [TestPyramid](https://martinfowler.com/bliki/TestPyramid.html) - Martin Fowler
