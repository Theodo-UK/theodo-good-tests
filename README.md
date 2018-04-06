# Theodo test samples

You are about to write a test in record time.

Follow the tree down to the example that's relevant to you!

⚠️ After writing your test, ensure that breaking the code actually breaks the test! ⚠️

The framework you are using is:

- [Django](documentation-tree/django.md)
- [React](documentation-tree/react.md)
- [React Native](documentation-tree/react-native.md)
- [Loopback](documentation-tree/loopback.md)

Should I test this function ?

List of no brainers:
    * A bug occured because of this function
    * The function is used by a critical process of the application. Example: it is part of the payment
    * The function is used on a page with heavy traffic. Example: it is used on the home page
    * The code of the function will either change or be used regularly. Example: a date management service
    * The function is not easy to understand
        * Testing it may allow us to find a refacto
        * Apart from preventing bugs, the test will make it easier to understand 
    * The function is used in the security process of the application. Example: I need to filter users' emails for the authorization
