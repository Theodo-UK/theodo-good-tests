# Component

- [Passes props to children](#passes-props-to-children)
- [Render](#render)
- [User interaction](./component/user-interaction.md)

## <a id="passes-props-to-children"></a>Passes props to children

### Code

```js
class InputField {
  onChange = value => {
    if (this.props.customOnChange)
      this.props.customOnChange(value);
    this.props.input.onChange(value);
  }
  
  render() {
    return (
      <div className={this.props.className}>
        <Input
          cluae={value}
          {...this.props.input}
          onChange={this.onChange}
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
  component.instance().onChange(value);
  expect(onChange).toHaveBeenCalledWith(value);
  expect(customOnChange).toHaveBeenCalledWith(value);
});
```

## <a id="render"></a>Render
