# Component Rendering

Available [Snippets](../../../snippets/docs/contents.md): 
- `>re-snap`
- `>re-snap-styled`

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