# Form Validation

When using a Django form, you may need to add custom validation.


## Use Case

Suppose you had a form that required a user Date of Birth, and the date they graduated from university. After testing that both dates are correctly entered and valid dates, we need to check that the graduation is after the person was born.

```python
def clean(self):
    cleaned_data = super().clean()

    date_of_birth = cleaned_data["date_of_birth"]
    date_of_graduation = cleaned_data["date_of_graduation"]

    check_graduation_date_after_birth_date(date_of_birth, date_of_graduation)

    return cleaned_data

def check_graduation_date_after_birth_date(date_of_birth, date_of_graduation):
    if date_of_birth > date_of_graduation:	
        raise forms.ValidationError("Birth date must be before graduation date")
```

`check_graduation_date_after_birth_date` is written as a function so that it can be called  in the form validation code as well as the test code.

(Note: super().clean() applies the django form's built in validation, and we apply our own validaiton afterwards)

## Test case

To check if an incorrect combination of dates gives the correct error message, define the two dates and use them to call  `check_graduation_date_after_birth_date` inside a 'with, as' block. This then allows us to check whether the error raised was what we expected. 

```python
class ValidationTests(TestCase):
    def test_graduation_date_after_birth_date(self):
        date_of_birth = "2018-01-02"
        date_of_graduation = "2018-01-01"
        with self.assertRaises(forms.ValidationError) as err:
            check_graduation_date_after_birth_date(
                date_of_birth, date_of_graduation
            )
        self.assertEqual(
            str(err.__dict__["exception"]),
            str(forms.ValidationError(["Birth date must be before graduation date"])),
        )
```
`err.__dict__["exception"]` retrieves the validation error from the object `err`, and this should be equal to a new error we create: `forms.ValidationError(["Birth date must be before graduation date"])`. As the two errors are not the same object, we can convert them to a string to test their equality.
