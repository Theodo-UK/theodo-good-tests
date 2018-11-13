# User Interaction

Available [Snippets](../../../snippets/docs/contents.md): 
- `>re-enzyme-click`

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