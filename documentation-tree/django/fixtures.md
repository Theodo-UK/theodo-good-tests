# Fixtures

When testing in django you often need to test how entries in your database are affected


To ensure the test data is the same for everyone you need to populate the test database with the same data each run:

- You could create an entry inside the test
- You can create a fixture which will populate the test database which can be used by any test

If the data is likely to be used in multiple tests you should opt for the second option

## Creating a fixture

If you have data in your local database you can quickly create a fixture with

`./manage.py dumpdata customer --format=json --indent=4 > customer/fixtures/customers.json`

which will create something like

```python
[
    {
        "model": "customer.customer",
        "pk": "d1662340-401c-4af7-abf3-50d5cfd91e2f",
        "fields": {
            "location": "London"
        }
    }
]
```

otherwise you can add some data in the format above to `app/fixtures/<fixture_name>`

## Using a fixture in a test

Inside a test class you can state which fixtures should be used and access the entires like you would anywhere

```python
# <my_project>/<app_name>/tests/views/test_<my_view>.py
from django.test import TestCase
from customer.models import Customer

class TestViewTestCase(TestCase):

    fixtures = ['customers', 'another_fixture']

    def test_something(self):
        customer = Customer.objects.get(uuid='d1662340-401c-4af7-abf3-50d5cfd91e2f')
        ...
```

## Using a fixture for local environment

Another common use for fixtures is to generate some local data quickly

If you had the above fixture in your repo, any new dev could run `./manage loaddata customers` to have some sample data straight away