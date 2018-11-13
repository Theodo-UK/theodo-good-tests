# Router

Available [Snippets](../../snippets/docs/contents.md): 
- `>re-enzyme-router`

### Code

```js
import React from 'react';
import { Switch, Route } from 'react-router-dom';

import MainPage from '@pages/MainPage';
import ExtraPage from '@pages/ExtraPage';

import App from './App';

const Router = () => (
  <App>
    <Switch>
      <Route path="/main-page" component={MainPage} />
      <Route path="/extra-page" component={ExtraPage} />
      <Route path="/" component={MainPage} />
    </Switch>
  </App>
);

export default Router;
```

### Test

```js
import React from 'react';
import { shallow } from 'enzyme';
import { Route } from 'react-router';

import Router from '@src/router.jsx';
import MainPage from '@pages/MainPage';
import ExtraPage from '@pages/ExtraPage';


it('renders correct routes', () => {
  const wrapper = shallow(<Router />);
  const pathMap = wrapper.find(Route).reduce((pathMap, route) => {
    const routeProps = route.props();
    pathMap[routeProps.path] = routeProps.component;
    return pathMap;
  }, {});

  const expectedPaths = {
    '/': MainPage,
    '/main-page': MainPage,
    '/extra-page': ExtraPage,
  };
  expect(pathMap).toEqual(expectedPaths);
});
```