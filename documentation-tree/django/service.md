Code

```python
# <my_project>/<app_name>/services/test_double.py

def get_double(number):
  return 2 * number
```

Test

```python
# <my_project>/<app_name>/tests/services/test_double.py

from django.test import TestCase
from myapp.services.double import get_double

class DoubleTestCase(TestCase):
  def test_get_double(self):
    data = (
        (1, 2),
        (2, 4),
        (5, 10),
        (0.5, 1.0),
    )

    for line in data:
      self.assertEqual(line[1], get_double(line[0]))
```
