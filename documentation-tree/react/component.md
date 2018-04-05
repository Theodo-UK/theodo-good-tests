# Component

- [Passes props to children](#passes-props-to-children)
- [Render](#render)
- [User interaction](./component/user-interaction.md)

## <a id="passes-props-to-children"></a>Passes props to children

### Code

```js
class InputField {
  render() {
    if (this.props.customOnChange) {
      const inputOnChange = this.props.input.onChange;
      this.props.input.onChange = value => {
        inputOnChange(value);
        this.props.customOnChange(value);
      };
    }

    return (
      <div className={this.props.className}>
        <Input
          cluae={value}
          {...this.props.input}
          disabled={this.props.disabled}
          label={this.props.label}
          style={this.props.style}
          type={this.props.type}
        />
      </div>
    )
  }
}
```

### Test

```js
it('calls customOnChange on onChange when it is present', () => {
  const customOnChange = jest.fn();
  const onChange = jest.fn();
  const input = {
    onChange,
  };
  const value = 30;
  const component = mount(
    <InputField
      customOnChange={customOnChange}
      input={input}
      test="test"
      type="text"
    />,
  );
  component.props().input.onChange(value);
  expect(onChange).toHaveBeenCalledWith(value);
  expect(customOnChange).toHaveBeenCalledWith(value);
});
```

## <a id="render"></a>Render
