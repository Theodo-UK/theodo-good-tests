# Component

- [General advice](#general-advice)
- [Passes props to children](#passes-props-to-children)
- Component rendering
  - [JSX rendered](#jsx-rendered)
  - [Conditionally-rendered component](#conditionally-rendered-component)
  - [Styled component](#styled-component)
- User interaction 
  - [User interaction](#user-interaction)
  - [User interaction / onChange with 2 arguments](#user-interaction-onchange-2-arguments)
  - [User interaction style change](#user-interaction-style-change)
  - [User interaction with an external library](#user-interaction-external-library)
- Re-render of a component
  - [Function triggered in a child](#function-triggered-child)
  - [Component behaviour when props change](#props-change)
- Component wrapping
  - [Component that connects to the store to dispatch actions](#map-dispatch-to-props)
  - [Component connected to the store with redux selectors](#map-state-to-props)

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

## <a id="user-interaction-onchange-2-arguments"></a>User interaction / onChange with 2 arguments
### Code
```js
class Dropdown {
  render() {
    return <ClientDropdown
      onChange={(event, data) => this.props.selectClient(this.props.clientId, data.value)}
    />
  }
}
```

### Test
```js
it('calls onChange with 2 arguemnts', () => {
  const props = {
    clientId: 'aClientId',
    selectClient: jest.fn()
  }
  const wrapper = shallow(<Dropown {...props} />)
  const value = 'aValue'
  wrapper.find(ClientDropdown).simulate('change', null, {value})
  expect(props.selectClient).toHaveBeenCalledWith(props.clientId, value)
})
```
## <a id="user-interaction-style-change"></a>User interaction style change
### Code
```js
export const Label = styled.span`
  color: ${props => (props.on ? 'black' : 'red')};
`;
class ClickableLabel {
  constructor(props: Props) {
    super(props);
    this.state = { on: false };
  }
  render() {
    return <Lable
      onClick={() => this.setState({ on: !this.state.on })}
      on={this.state.on}
    />
  }
}
```

### Test
```js
import 'jest-styled-components';
it('changes label style to react to click', () => {
  const component = shallow(<ClickableLabel />);

  expect(component.find(Label).first()).toHaveStyleRule('color', 'black');

  component.find(Lable).simulate('click');

  expect(component.find(Label).first()).toHaveStyleRule('color', 'red');
});
```

## <a id="user-interaction-external-library"></a>Component calls an external library function
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

## <a id="function-triggered-child"></a>Function triggered in a child
### Code
```js
class Parent {
  state = {value: 'value'}

  render() {
    const onChange = value => this.setState({ value })
    
    const firstChildValue = 'firstChildValue';
  
    return(
      <div>
        <Child onChange={onChange} value={firstChildValue} />
        <Child value={this.state.value} />
      </div>
    )        
  }
}

class Child {
  render() {
    const onChange = this.props.onChange && value => this.props.onChange(value);
    return(
      <p>{`This is the ${this.props.value} I want to display.}`}</p>
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

## <a id="props-change"></a>Component behaviour when props change

### Code
```js
class Component {
  render() {
    return(
      <p>This is my {this.props.name}</p>
    )        
  }
}
```

### Test
```js
const name = 'Jean-Pierre';
const newName = 'Robert';
const component = shallow(<Component name={name} />);
const tree = toJson(component);
expect(component).toMatchSnapshot();
component.setProps({name: newName});
const newTree = toJson(component);
expect(component).toMatchSnapshot();
```

### Goal
Would fail if you modify the way the component rerenders, for example by modifying the `shouldComponentUpdate` method :
```js
shouldComponentUpdate() { return false }
```

## <a id="conditionally-rendered-component"></a>Conditionally-rendered component

### Code
```js
const limitBooks = books => {
  if (books.length > 3) {
    return (
      <div>
        <p>Too many books in the library!</p>
      </div>
    );
  } else if (books.length == 0) {
    return (
      <div>
        <p>This library is empty...</p>
      </div>
    );
  } else {
    return (
      <div>
        <p>There are lots of books here:</p>
        <ul>{books.map((book, index) => <li key={index}>{book.name}</li>)}</ul>
      </div>
    );
  }
};
```

### Test
```js
describe('limitBooks', () => {
  it('should display the books if under 3 books', () => {
    const books = [
      {
        name: '5 Disfunctions of a Team',
      },
      {
        name: 'Harry Potter and the Chamber of Secrets',
      },
      {
        name: 'The Jungle Book',
      },
    ];
    expect(limitBooks(books)).toMatchSnapshot();
  });

  it('should return an info message if too many books', () => {
    const books = [
      {
        name: '5 Disfunctions of a Team',
      },
      {
        name: 'Harry Potter and the Chamber of Secrets',
      },
      {
        name: 'The Jungle Book',
      },
      {
        name: 'Les Fourmis',
      },
    ];
    expect(limitBooks(books)).toMatchSnapshot();
  });

  it('should return an warning message if no books', () => {
    const books = [];
    expect(limitBooks(books)).toMatchSnapshot();
  });
});
```

## <a id="map-dispatch-to-props"></a>Component that connects to the store to dispatch actions

### Code
```js
import { connect } from 'react-redux';
import Component from './Component';
import { action } from 'redux/actions';

const mapDispatchToProps = dispatch => ({
  action: () => dispatch(action())
}) 

export connect(null, mapDispatchToProps)(Component) 
```


### Test
```js
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Container from '../Container';

const middlewares = [];
const mockStore = configureStore(middlewares);
const store = { 
  ...mockStore({}),
  injectedReducers: {},
};

it('dispatches the right action when triggered', () => {
  const component = mount(
    <Provider store={store}>
      <Container />
    </Provider>
  ).find('Component');
  expect(component.props(action)).toBeDefined();
  expect(store.getActions()).not.toContainEqual(action());
  component.props().action();
  expect(store.getActions()).toContainEqual(action());
})
```

## <a id="map-state-to-props"></a>Component is connected to store with redux selectors
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

jest.mock('../Button', () => {
  const Button = () => null;
  Button.displayName = 'Button';
  return Button;
});

jest.mock('@myselectors', () => ({
  getLabel: () => 'mocked_label',
}));

it('should retrieve the label from the state', () => {
  const store = mockStore({});
  const wrapper = mount(<Provider store={store}><ButtonWrapper /></Provider>);
  const component = wrapper.find('Button');

  expect(component.prop('label')).toEqual('mocked_label');
});
```
