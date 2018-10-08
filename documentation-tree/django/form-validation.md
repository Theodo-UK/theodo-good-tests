# Form Validation

When using a Django form, you may need to add custom validation.


## Use Case

Suppose you had a form that required a user Date of Birth, and the date they graduated from university. After testing that both dates are correctly entered and valid dates, we need to check that the graduation is after the person was born.

```python
def clean(self):
    cleaned_data = super().clean()

    date_of_birth = cleaned_data["date_of_birth"]
    date_of_graduation = cleaned_data["date_of_graduation"]

    test_graduation_date_after_birth_date(date_of_birth, date_of_graduation)

    return cleaned_data

def test_graduation_date_after_birth_date(date_of_birth, date_of_graduation):
    if date_of_birth > date_of_graduation:	
        raise forms.ValidationError("Birth date must be before graduation date")
```

(Note: super().clean() applies the django form's built in validation, and we apply our own validaiton afterwards)

## Test case

```python
class ValidationTests(TestCase):
     def test_graduation_date_after_birth_date(self):
        date_of_birth = "2018-01-02"
        date_of_graduation = "2018-01-01"
         with self.assertRaises(forms.ValidationError) as err:
            test_graduation_date_after_birth_date(
                date_of_birth, date_of_graduation
            )
        self.assertEqual(
            str(err.__dict__["exception"]),
            str(forms.ValidationError(["Birth date must be before graduation date"])),
        )
```
