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
| `cy.get('[data-cy=submit]').click()` | Depends      | Better, will be unlikely to break with style or wording change. |
| `cy.contains('Submit').click()`      | Always     | Best as user focused.                                           |

## <a id="fixtures"></a>Fixtures

### Block XHR calls

In order to make sure that all of your calls are mocked when you run your tests, you can prevent Cypress from making XHR calls to your backend.

In your `cypress.json`, you can setup a `blacklistHosts` property, which enables you to blacklist any host you want from XHR calls. It can be a string, or an array of strings if there are several hosts you want to blacklist. It also allows the use of wildcard \* patterns.

For example on The Best Project, we kept all the XHR calls to our backend from being made by adding this line to the `cypress.json`:

```
"blacklistHosts": "*.thebestproject.com",
```

More information on this [here](https://docs.cypress.io/guides/references/configuration.html#blacklistHosts)
