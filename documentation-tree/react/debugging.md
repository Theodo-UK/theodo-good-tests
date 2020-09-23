# Debugging your tests

## Getting debug output with react-testing-library

Tired of your tests failing and not knowing why?

You can use the debug function to print HTML page content to your console when the test runs.

## <a id="jsx-rendered"></a>JSX rendered

```js
import "@testing-library/jest-dom/extend-expect";
import { render } from "testing/reactTestingLibraryIntl";

describe("MyComponent", () => {
  it("should show me amazing content", () => {
    const { debug } = render(<MyComponent />);
    debug();
  });
});
```

## My debug output keeps getting cropped 😥

The output from the debug function is limited by the DEBUG_PRINT_LIMIT env variable (the value of this represents the character limit, not the line limit).

A quick way of changing this is to run

```
DEBUG_PRINT_LIMIT=20000 {your test command}
```

e.g.

```
DEBUG_PRINT_LIMIT=20000 yarn test
```
