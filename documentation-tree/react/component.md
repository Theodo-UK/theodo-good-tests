# Component

- [General advice](#general-advice)
- [Passes props to children](#passes-props-to-children)
- [JSX rendered](#jsx-rendered)
- [Styled component](#styled-component)
- [User interaction](#user-interaction)
- [Function triggered in a child](#function-triggered-child)

## <a id="general-advice"></a>General advice
*Always* use enzyme's `shallow` to test unconnected ("dumb") components. If you're using `mount`, you're testing more than just this component (and it becomes way more complex to test). *Only exception*: if you have a render prop or a function-as-child-component (eg using react-virtualized).
There is *zero* valid use case for `react-test-renderer` directly: Enzyme is higher level.

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

  const component = shallow(<InputField {...props} />);
  component.instance().onChange('mocked_value_2');

  expect(props.input.onChange).toHaveBeenCalledWith('mocked_value_2');
  expect(props.customOnChange).toHaveBeenCalledWith('mocked_value_2');
});
```

## <a id="jsx-rendered"></a>JSX rendered
### Code
```js
  class Button {
    render() {
      return <div><button/></div>;
    }
  }
```

### Test
```js
import { shallow } from 'enzyme';
import toJson from 'enzyme-to-json';

it('renders the correct jsx', () => {
  const component = shallow(<Button />);
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
});
```

## <a id="styled-component"></a>Styled component
### Code
```js
import styled from 'styled-components';

const Button = styled.button`
  margin: 0;
`
```

### Test
```js
import { render } from 'enzyme';
import 'jest-styled-components';

it('renders the correct style', () => {
  const component = render(<Button />).toJson();
  expect(component).toMatchSnapshot();
});
```

More info on https://github.com/styled-components/jest-styled-components#snapshot-testing

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

## <a id="function-triggered-child"></a>Function triggered in a child
### Code
```js
class Parent {
  state = {value: 'value'}

  render() {
    const customOnChange = value => this.setState({ value })
    
    const firstChildValue = 'firstChildValue';
  
    return(
      <div>
        <Child onChange={customOnChange} value={firstChildValue} />
        <Child value={this.state.value} />
      </div>
    )        
  }
}

class Child {
  render() {
    const onChange = this.props.customOnChange && value => this.props.customOnChange(value);
    return(
      <p>{`This is the ${this.props.id} I want to display.}`}</p>
      <Input onChange={onChange} />
    )
  }
}
```

### Test
```js
const component = mount(<Parent />);
const expectedValue = 'myValue';
component.find('Input').get(0).props.onChange(expectedValue);
component.update();
expect(component.find('Child').get(1).props.value).toBe(expectedValue);
```


