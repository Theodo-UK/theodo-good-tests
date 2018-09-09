# Re Render of a component

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