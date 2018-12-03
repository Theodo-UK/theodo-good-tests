# Component

Link to Elias training on Jest [here](https://slides.com/eliastounzal-1/how-to-test-all-of-your-frontend-features-in-less-than-15-minutes-2)

- [General advice](#general-advice)
- [Passes props to children](./component/passes-props-to-children.md#passes-props-to-children)
- [Component rendering](./component/component-rendering.md)
  - [JSX rendered](./component/component-rendering.md#jsx-rendered)
  - [Styled component](./component/component-rendering.md#styled-component)
  - [Conditionally-rendered component](./component/component-rendering.md#conditionally-rendered-component)
- [User interaction](./component/user-interaction.md)
  - [User interaction](./component/user-interaction.md#user-interaction)
  - [User interaction / onChange with 2 arguments](./component/user-interaction.md#user-interaction-onchange-2-arguments)
  - [User interaction style change](./component/user-interaction.md#user-interaction-style-change)
  - [User interaction with an external library](./component/user-interaction.md#user-interaction-external-library)
- [Re-render of a component](./component/re-render-of-component.md)
  - [Function triggered in a child](./component/re-render-of-component.md#function-triggered-child)
  - [Component behaviour when props change](./component/re-render-of-component.md#props-change)
- [Component wrapping](./component/component-wrapping.md)
  - [Component that connects to the store to dispatch actions](./component/component-wrapping.md#map-dispatch-to-props)
  - [Component connected to the store with redux selectors](./component/component-wrapping.md#map-state-to-props)

## <a id="general-advice"></a>General advice
*Always* use enzyme's `shallow` to test unconnected ("dumb") components. If you're using `mount`, you're testing more than just this component (and it becomes way more complex to test).

*Only exceptions*: if you have a render prop or a function-as-child-component (eg using react-virtualized) or if you need to test a styled component.

There is *zero* valid use case for `react-test-renderer` directly: Enzyme is higher level.











