# Component Wrapping

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