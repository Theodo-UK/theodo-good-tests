# Mock Path gotchas

Sometimes you create a mock and it doesn't appear to be used

There is a gotcha with `unittest.mock.patch` in relation to mocking the right *name*

From the [docs](https://docs.python.org/3/library/unittest.mock.html#where-to-patch):

>The basic principle is that you patch where an object is looked up, which is not necessarily the same place as where it is defined



### Code

Suppose we have a `main.py` file that imports some functions/classes from another file `fcns.py`
- Note for `foo` we import `fcns` and then use `fcns.foo()`
- For `bar` we import `bar` directly and use `bar()`

If we wish to mock these functions there is some gotchas to consider

```python
# project/main.py
from project import fcns
from project.fcns import bar

def app():
    return fcns.foo() + ' ' + bar()
```

```python
# project/fcns.py
def foo():
    return 'foo'

def bar():
    return 'bar'
```

### Test

The following file demonstrates the different way to declare `mock.patch` paths

All these tests pass and the docstrings explain why

```python

from django.test import TestCase
from project.main import app
from unittest import mock

class TestCase(TestCase):
    """
    Demonstrates the gotchas of unittest.mock.patch path
    """

    def test_main_no_mock(self):
        """
        Does no mocking
        -> get normal result
        """
        self.assertEqual(app(), 'foo bar')

    @mock.patch('project.fcns.foo', return_value='fakefoo')
    def test_main_mock_foo(self, mock_foo):
        """
        Mocks fcns' reference to foo
        At the top of this test file, we imported app from main.py
            - main.py then imported fcns
        In the process of calling app() it looks up fcn's reference to foo
        We have successfully mocked this reference
        -> fakefoo bar
        """
        self.assertEqual(app(), 'fakefoo bar')

    @mock.patch('project.fcns.bar', return_value='fakebar')
    def test_main_doesnt_mock_bar(self, mock_bar):
        """
        Mocks fcns' reference to bar
        At the top of this test file, we imported app from main.py
            - main.py then imports bar from the real fcns.py
            - It therefore has a reference to the real bar before this test runs
        When we try mock project.fcns.bar, it is too late,
            main already has the right reference
        -> foo bar
        """
        self.assertEqual(app(), 'foo bar')

    @mock.patch('project.main.bar', return_value='fakebar')
    def test_main_successfully_mock_bar(self, mock_bar):
        """
        Mocks MAIN'S reference to bar
        At the top of this test file, we imported app from main.py
            - main.py then imports bar from the real fcns.py
            - main.py therefore has a reference to the real bar before this test runs
        When we mock project.MAIN.bar, we are mocking main's reference to bar
            and so it mocks successfully
        -> foo fakebar
        """
        self.assertEqual(app(), 'foo fakebar')
```