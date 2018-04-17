# Component

- [General advice](#general-advice)
- [Passes props to children](#passes-props-to-children)
- [JSX rendered](#jsx-rendered)
- [Styled component](#styled-component)
- [User interaction](#user-interaction)
- [Component connected to state](#map-state-to-props)
- [Component can dispatch an action](#map-dispatch-to-props)
- [Component calls an external library function](#external-library)

## <a id="general-advice"></a>General advice
*Always* use enzyme's `shallow` to test unconnected ("dumb") components. If you're using `mount`, you're testing more than just this component (and it becomes way more complex to test). *Only exceptions*: if you have a render prop or a function-as-child-component (eg using react-virtualized) or if you need to test a styled component.
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
import toJson from 'enzyme-to-json';
import 'jest-styled-components';

it('renders the correct style', () => {
  const component = render(<Button />);
  const tree = toJson(component);
  expect(tree).toMatchSnapshot();
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

## <a id="external-library"></a>Component calls an external library function
### Code
```js
import { doSomething } from 'external-node-module';

class Button {
  render() {
    return <button onClick={doSomething} />;
  }
}
```

### Test
```js
import { doSomething } from 'external-node-module';

jest.mock('external-node-module', () => ({
  doSomething: jest.fn(),
}))

it('calls the doSomething from the external node module when clicking', () => {
  const component = shallow(<Button />);

  component.find('button').simulate('click');
  expect(doSomething).toHaveBeenCalledTimes(1);
});
```

## <a id="map-state-to-props"></a>Component is connected to state
### Code
```js
import { connect } from 'react-redux';
import { getLabel } from '@myselectors';

export class Button {
  render() {
    return <button label={this.props.label} />;
  }
}

const mapStateToProps = state => ({
  label: getLabel(state),
});

const ButtonWrapper = connect(mapStateToProps)(Button);

export default ButtonWrapper;
```

### Test
If you use a router, you may need to enhance your wrapper with a `ConnectedRouter` from `react-router-redux`.

```js
import configureStore from 'redux-mock-store';
const mockStore = configureStore();

// Mock the button to find it easily
jest.mock('../Button', () => {
  const Button = () => null;
  Button.displayName = 'Button';
  return Button;
});

// Mock the selector to test the value passed
jest.mock('@myselectors', () => ({
  getLabel: () => 'mocked_label',
}));

it('should retrieve the label from the state', () => {
  const store = mockStore({});
  const wrapper = mount(<Provider store={store}><ButtonWrapper /></Provider>);
  const component = wrapper.find('Button');
  
  expect(component.props().label).toEqual('mocked_label');
});
```

## <a id="map-dispatch-to-props"></a>Component can dispatch actions
### Code
```js
import { connect } from 'react-redux';
import { myAction } from '@myactions';

export class Button {
  render() {
    return <button />;
  }
}

const mapDispatchToProps = (dispatch, props) => ({
  doAction: () => dispatch(myAction(props.label)),
});

const ButtonWrapper = connect(null, mapDispatchToProps)(Button);

export default ButtonWrapper;
```

### Test
If you use a router, you may need to enhance your wrapper with a `ConnectedRouter` from `react-router-redux`.

```js
import configureStore from 'redux-mock-store';
const mockStore = configureStore();

// Mock the button to find it easily
jest.mock('../Button', () => {
  const Button = () => null;
  Button.displayName = 'Button';
  return Button;
});

it('should retrieve the label from the state', () => {
  const store = mockStore({});
  const wrapper = mount(<Provider store={store}><ButtonWrapper label="my_label" /></Provider>);
  const component = wrapper.find('Button');
  
  const doAction = component.props().doAction;
  expect(doAction).toBeInstanceOf(Function);
  doAction();
  expect(store.getActions()).toContainEqual(myAction('my_label'));
});
```
