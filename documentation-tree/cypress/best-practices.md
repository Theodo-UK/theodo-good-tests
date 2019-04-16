# Cypress Best Practices

## <a id="selectors"></a>Selectors

### Stopping multiple matches

- As a general rule your selector should not assume there is only one matching element on the page, e.g. clicking the first button on a page will break when another ticket adds another button.

#### Cypress proposes the following:

| Selector                             | Recommended | Notes                                                           |
| ------------------------------------ | ----------- | --------------------------------------------------------------- |
| `cy.get('button').click()`           | Never       | Worst - too generic, no context.                                |
| `cy.get('.btn.btn-large').click()`   | Never       | Bad. Coupled to styling. Highly subject to change.              |
| `cy.get('#main').click()`            | Sparingly   | Better. But still coupled to styling or JS event listeners.     |
| `cy.contains('Submit').click()`      | Depends     | Much better. But still coupled to text content that may change. |
| `cy.get('[data-cy=submit]').click()` | Always      | Best. Insulated from all changes.                               |

#### But, taking the view that "users don't click classes, IDs or class attributes", then the order of the last two rows becomes:

| Selector                             | Recommended | Notes                                                           |
| ------------------------------------ | ----------- | --------------------------------------------------------------- |
| `cy.get('button').click()`           | Never       | Worst - too generic, no context.                                |
| `cy.get('.btn.btn-large').click()`   | Never       | Bad. Coupled to styling. Highly subject to change.              |
| `cy.get('#main').click()`            | Sparingly   | Better. But still coupled to styling or JS event listeners.     |
| `cy.get('[data-cy=submit]').click()` | Depends     | Better, will be unlikely to break with style or wording change. |
| `cy.contains('Submit').click()`      | Always      | Best as user focused.                                           |

## <a id="fixtures"></a>Fixtures

### <a id="fixtures:xhr"></a>Block XHR calls

In order to make sure that all of your calls are mocked when you run your tests, you can prevent Cypress from making XHR calls to your backend.

In your `cypress.json`, you can setup a `blacklistHosts` property, which enables you to blacklist any host you want from XHR calls. It can be a string, or an array of strings if there are several hosts you want to blacklist. It also allows the use of wildcard \* patterns.

For example on The Best Project, we kept all the XHR calls to our backend from being made by adding this line to the `cypress.json`:

```
"blacklistHosts": "*.thebestproject.com",
```

More information on this [here](https://docs.cypress.io/guides/references/configuration.html#blacklistHosts)

### Intercept Delay on Fixtures

Even when network requests are stubbed out using fixtures, there is still a delay between API request and response.

![fig](./networkDelay.png)

You should explicitly wait on **all** network requersts that you stub, and taking [the point above](#fixtures:xhr) - **all** network requests should be stubbed.

```js
cy.server();
cy.route('users/*', 'fixture:users').as('getUsers');
cy.route('lightsabers/*', 'fixture:lightsabers').as('getLightsabers');

// page reauires routes via HOCs
cy.visit('http://localhost:3333/users');

// wait on routes via aliases
cy.wait(['@getLightsabers', '@getUsers']);

// will only run after network requests
cy.get('h1').should('contain', 'Users');

cy.get('li').should('contain', 'Luke');
```

Further to this, it is important not to simply allow any network request that roughly matches the regext to get the required data and continue. If your request is missing a key parameter, it does not make sense for your test to pass. Cypress allows assertions to be made on the promise returned from a fixture mock.

```js
cy.server();
cy.route('search/*', [{ item: 'Luke' }, { item: 'Yoda' }]).as('getSearch');

cy.contains('placeholder text').type('Good');

// after the wait we can still make an assertion
cy.wait('@getSearch')
  .its('url')
  .should('include', '/search?query=Good');
```
