# End to end

## GET Example

### Code

```python
# <my_project>/<app_name>/urls.py
from django.conf.urls import url
from django.contrib import admin
from <app_name>.views import HelloWorldView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^my-url/', HelloWorldView.as_view())
    url(r'^edit-customer/', CustomerView.as_view())
]
```

```python
# <my_project>/<app_name>/views/<my_view>.py
"""
A View which returns hardcoded data
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class HelloWorldView(APIView):
    def get(self, request, format=None):
        data = {
            'foo': 'bar',
        }
        return Response(data, status.HTTP_200_OK)
```

### Test

```python
# <my_project>/<app_name>/tests/views/test_<my_view>.py
"""
Tests the GET response returns the right data
"""

from django.test import TestCase, Client
from <app_name>.models.<my_model> import <MyModel>

class HelloWorldViewTestCase(TestCase):
  def setUp(self):
    self.client = Client()

  def test_get(self):
    response = self.client.get('/my-url/')
    self.assertEqual(response.status_code, 200)
    self.assertEqual(response.data, {'foo': 'bar'})
```


## POST Example

### Code

```python
# <my_project>/<app_name>/views/<my_view>.py
"""
A Customer View which sets a hardcoded location for a given customer
    - Includes error handling
"""
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status, views, response

from customer.models import Customer
from customer.serializers import CustomerSerializer

class CustomerView(views.APIView):

    def post(self, request):

        serializers = CustomerSerializer(data=request.data)
        serializers.is_valid(raise_exception=True)

        try:
            customer = Customer.objects.get(uuid=serializers.validated_data['uuid'])
        except ObjectDoesNotExist as err:
            return response.Response({
                    'msg': str(err),
                    'error': 'CUSTOMER_DOES_NOT_EXIST',
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        customer.hometown = 'Dublin'
        customer.save()

        return response.Response({
                'msg': 'Successfully Changed',
            },
            status=status.HTTP_200_OK
        )
```

### Test

Uses a customer fixture. See [fixtures](./fixtures.md)

```python
# <my_project>/<app_name>/tests/views/test_<my_view>.py
"""
Test both success and failure of View
"""
from django.test import TestCase, Client
from customer.models import Customer

class TestViewTestCase(TestCase):

    fixtures = ['customers']

    def setUp(self):

        self.client = Client()

    def test_post(self):
        """
        Test a post where the customer's location is edited
        """
        response = self.client.post('/edit-customer/', {
            'uuid': 'd1662340-401c-4af7-abf3-50d5cfd91e2f',
        })


        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, {'msg': 'Successfully Changed'})

        customer = Customer.objects.get(uuid='d1662340-401c-4af7-abf3-50d5cfd91e2f')
        self.assertEqual(customer.location, 'Dublin')

    def test_bad_post(self):
        """
        Tests a POST request where customer doesn't exist
        """

        response = self.client.post('/edit-customer/', {
            'uuid': '01234567-89ab-cdef-0123-456789abcdef',
        })


        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, {
            'msg': 'Customer matching query does not exist.',
            'error': 'CUSTOMER_DOES_NOT_EXIST',
        })
```
