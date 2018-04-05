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
          value={value}
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
  const props = {
    customOnChange: jest.fn(),
    input = {
      onChange: jest.fn(),
      value: 'mocked_value',
    },
    type: 'text',
    label: 'mocked_label',
  };

  const component = mount(<InputField {...props} />);
  component.instance().onChange('mocked_value_2');

  expect(props.input.onChange).toHaveBeenCalledWith('mocked_value_2');
  expect(props.customOnChange).toHaveBeenCalledWith('mocked_value_2');
});
```

## <a id="render"></a>Render
