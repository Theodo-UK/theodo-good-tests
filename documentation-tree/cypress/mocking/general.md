# Mocking with Cypress

## Contents

- [Block XHR calls](#block-xhr-calls)

## Block XHR calls

In order to make sure that all of your calls are mocked when you run your tests, you can prevent Cypress from making XHR calls to your backend.

In your `cypress.json`, you can setup a `blacklistHosts` property, which enables you to blacklist any host you want from XHR calls. It can be a string, or an array of strings if there are several hosts you want to blacklist. It also allows the use of wildcard * patterns.

For example on The Best Project, we kept all the XHR calls to our backend from being made by adding this line to the `cypress.json`:
```
"blacklistHosts": "*.thebestproject.com",
```

More information on this [here](https://docs.cypress.io/guides/references/configuration.html#blacklistHosts)
