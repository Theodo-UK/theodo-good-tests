# Mocking

Mocking is very useful when running tests
- If you want to write a unit test for a small part of your code you mightn't want to worry about what the rest of your code does or expects to receives
- If you make calls to [third parties](./mock-third-party.md) you most likely do not want to make calls to this third party from within your test suite

You can use [unittest.mock.patch](https://docs.python.org/3/library/unittest.mock.html) to mock from within django

You specify the path to the function/class you wish to mock:
- You can then mock its return value
- Check it has been called and optionally check if called with the right arguments
- You can mock a side effect

There are some [gotchas in relation to specifying the right path](./mock-path-gotchas.md)

### Code

Suppose you have the following basic files you wish to test and mock

```python
# project/main.py
from project import fcns

def app(num_foo, num_bar):
    try:
        return fcns.foo(num_foo) + ' ' + fcns.bar(num_bar)
    except Exception:
        return 'Custom Exception thrown message'
```

```python
# project/fcns.py
def foo(num):
    return str(num) + ' foo'

def bar(num):
    return str(num) + ' bar'
```

### Test

#### Mock return values

```python
from django.test import TestCase
from project.main import app
from unittest import mock

class TestCase(TestCase):
    """
    Demonstrates how unittest.mock.patch works
    """

    def test_main_no_mock(self):
        """
        Does no mocking
        -> get normal result
        """
        self.assertEqual(app(2, 3), '2 foo 3 bar')

    @mock.patch('project.fcns.foo', return_value='fakefoo')
    def test_mock_foo(self, mock_foo):
        """
        Mocks the foo() function to return fake_foo instead of __num__ foo
            Note: we must add an extra parameter for foo (can be called anything)
        """
        self.assertEqual(app(2, 3), 'fakefoo 3 bar')

    @mock.patch('project.fcns.bar', return_value='fakebar')
    @mock.patch('project.fcns.foo', return_value='fakefoo')
    def test_multiple_mocks(self, mock_foo, mock_bar):
        """
        With multiple mocks the order of the parameters goes from bottom up
        """
        self.assertEqual(app(2, 3), 'fakefoo fakebar')
        mock_foo.assert_called_with(2)
        mock_bar.assert_called_with(3)

    @mock.patch('project.fcns.foo')
    def test_mock_foo_inside(self, mock_foo):
        """
        You can alternatively set the return_value inside the function
        """
        mock_foo.return_value='fakefoo'
        self.assertEqual(app(2, 3), 'fakefoo 3 bar')
```

#### Mock and check called / called with arguments

```python
@mock.patch('project.fcns.foo', return_value='fakefoo')
def test_mock_foo_check_called(self, mock_foo):
    """
    Can check your mock was called
    """
    self.assertEqual(app(2, 3), 'fakefoo 3 bar')
    mock_foo.assert_called()

@mock.patch('project.fcns.foo', return_value='fakefoo')
def test_mock_foo_check_args(self, mock_foo):
    """
    Or can also check it was called with the right arguments
    """
    self.assertEqual(app(2, 3), 'fakefoo 3 bar')
    mock_foo.assert_called_with(2)

@mock.patch('project.fcns.foo', return_value='fakefoo')
def test_mock_foo_check_args_with_any(self, mock_foo):
    """
    Sometimes your mock might take many arguments but you only care about some of them
    You can use ANY for the arguments you don't care about
    """
    self.assertEqual(app(2, 3), 'fakefoo 3 bar')
    mock_foo.assert_called_with(mock.ANY)
```

#### <a id="side-effects"></a>Side effects - Multiple return values

```python
@mock.patch('project.fcns.foo', side_effect=['fakefoo', 'reallyfakefoo'])
def test_multiple_returns(self, mock_foo):
    """
    Sometimes the function you are mocking may get called more than once
    For example if your view has multiple requests.get or requests.post
    If side_effect is an array then each call returns the next result
    """
    self.assertEqual(app(2, 3), 'fakefoo 3 bar')
    self.assertEqual(app(2, 3), 'reallyfakefoo 3 bar')
```

#### Side effects - Exceptions
```python
@mock.patch('project.fcns.foo', side_effect=Exception())
def test_side_effect(self, mock_foo):
    """
    You can also specify a side effect which can be any type of exception
    You can then test that the function acts correctly in this case
    """
    self.assertEqual(app(2, 3), 'Custom Exception thrown message')
```

#### Note on pylint

```python
@mock.patch('project.fcns.foo', return_value='fakefoo')
def test_ignore_pylint(self, _mock_foo):
    """
    If you don't need to test that mock_foo was called etc then the argument will be unused
        and pylint will be upset
    You still need to specify the argument but if you prepend it with an underscore
        pylint is happy again
    """
    self.assertEqual(app(2, 3), 'fakefoo 3 bar')
```