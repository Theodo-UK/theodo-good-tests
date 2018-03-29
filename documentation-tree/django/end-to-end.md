Code

```python
# <my_project>/<my_project>/urls.py
from django.conf.urls import url
from django.contrib import admin
from <app_name>.views import HelloWorldView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^my-url/', TestView.as_view())
]
```

```python
# <my_project>/<app_name>/views/<my_view>.py
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

Test

```python
# <my_project>/<app_name>/tests/views/test_<my_view>.py

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
