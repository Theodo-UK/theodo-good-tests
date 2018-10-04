# Mocking a Third Party

Suppose we have a view that makes a request to `sample-url.com` which responds differently depending on the third party response

### Code


```python
# <my_project>/<app_name>/views/sampleview.py
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


class SampleView(APIView):
    """
    Sample View
    """
    def post(self, request):
        third_party_resp = requests.post('sample-url.com', request.data['age'])

        if third_party_resp.status_code != 200:
            return Response(
                'Bad Request',
                status=status.HTTP_400_BAD_REQUEST,
            )

        if 'msg' not in third_party_resp.data or third_party_resp.data['msg'] != 'Accept':
            return Response(
                'Incorrect Info sent',
                status=status.HTTP_400_BAD_REQUEST,
                
            )

        return Response('A-ok')
```

### Test

#### Mock Responses

We can mock the different types of responses we expect to deal with from the third party:
  - We can choose the `status_code`
  - And any other values we might access from response in our view (e.g. `data` in this case)

```python
# <my_project>/<app_name>/tests/mock_responses.py
class MockGoodResponse():
    status_code = 200
    data = {
        'msg': 'Accept',
    }

class MockBadResponse():
    status_code = 200
    data = {
        'msg': 'Reject',
    }

class Mock400Response():
    status_code = 400
```

#### Test Cases

Here we test posting to the endpoint and the different outcomes depending on the third party response

  - We mock the `post` part of the `requests` library in the `app.views.sampleview` file and we specify the return value as one of our mock responses
  - When using a mock you must add an extra argument to the test function to reference the mock within the test
    - In the first test we can `assert` it was called with the right values
    - We don't need to test this again in the following cases but we still need to put `mock_post` as an argument. We can add an underscore to the argument name (`_mock_post`) to stop pylint complaining
  - After that we can test we return the right responses based on the logic in the view acting on the third party response

```python
from unittest import mock
from django.test import TestCase, Client
from .mock_responses import MockGoodResponse, MockBadResponse, Mock400Response

class SampleViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()

        self.post_body = {
            'age': 1,
        }

    @mock.patch('app.views.sampleview.requests.post', return_value=MockGoodResponse())
    def test_good_post(self, mock_post):
        response = self.client.post('/api/app/testview/', self.post_body)
    
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, 'A-ok')

        mock_post.assert_called_with('sample-url.com', '1')


    @mock.patch('app.views.sampleview.requests.post', return_value=MockBadResponse())
    def test_bad_data_post(self, _mock_post):
        response = self.client.post('/api/app/testview/', self.post_body)
    
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, 'Incorrect Info sent')

    @mock.patch('app.views.sampleview.requests.post', return_value=Mock400Response())
    def test_bad_resp_post(self, _mock_post):
        response = self.client.post('/api/app/testview/', self.post_body)
    
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data, 'Bad Request')
```

### Gotchas

- If you need to mock multiple `requests.get`s or multiple `requests.post`s then one of the mocks will overwrite the other
    - To overcome this you can specify multiple return values to the `requests.get` function using a `side_effect`
    - If `side_effect` is an array then each call returns the next result
    - So you could do `@mock.patch('requests.get', side_effect=[MockGoodResponse(), MockBadResponse()])`
    - See an [example in General Mocking](./general-mocking.md#side-effects)