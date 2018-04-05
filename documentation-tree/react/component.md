# Component

- [Passes props to children](#passes-props-to-children)
- [Render](#render)
- [User interaction](#user-interaction)

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
          {...this.props.input}
          onChange={this.onChange}
          disabled={this.props.disabled}
          label={this.props.label}
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

## <a id="user-interaction"></a>User interaction
### Code
```js
class Button {
  render() {
    return <button onClick={this.props.onClick} />;
  }
}
```

### Test
```js
it('calls the onClick prop when clicking', () => {
  const onClick = jest.fn();
  const component = shallow(<Button onClick={onClick} />);
  
  component.find('button').simulate('click');
  expect(onClick).toHaveBeenCalledTimes(1);
});
```
