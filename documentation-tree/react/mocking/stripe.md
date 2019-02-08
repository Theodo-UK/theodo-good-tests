# Mocking Stripe

## Component

We have this component, which roughly looks like this:

```js
import { CardElement, injectStripe } from 'react-stripe-elements';
import { payWithStripe } from './actions';

class StripePaymentForm extends Component {
    handleSubmit = () => {
        const tokenParams = {
            // some params here
        }
        this.props.stripe
            .createToken(tokenParams)
            .then(({ token }) => this.props.payWithStripe(token))
            .catch(() => console.error('There is an error'););
    }

    render() {
        return() {
            <form>
                <PlentyOfInputs />
                <CardElement />
                <button onClick={() => this.handleSubmit();}>
            <form>
        }
    }
}

const mapDispatchToProps = dispatch => ({
    payWithStripe: token => dispatch(payWithStripe(token));
})

export default injectStripe(StripePaymentForm);
```

We want to test that when we submit the form, the `payWithStripe` action is dispatched, with the right token.

## Test

You first have to mock the `Stripe` object: `window.Stripe = jest.fn();`

After doing that, we need to mock the `injectStripe` high order component:
```js
jest.mock('react-stripe-elements', () => ({
  ...require.requireActual('react-stripe-elements'),
  injectStripe: Component => {
    mockCreateToken = jest.fn().mockImplementation(() => Promise.resolve({ token: 'token' }));
    const stripe = { createToken: mockCreateToken }
    const NewComponent = props => {
      return(
        <Component {...props} stripe={stripe} />
      );
    }
    return NewComponent;
  },
}));
```

Then we mount our component wrapping with a redux `Provider`:

```js
mockStore = {
    getState: () => paymentState,
    dispatch: jest.fn(),
    subscribe: jest.fn(),
};

container = mount (
    <Provider store={mockStore}>
        <CardPaymentForm {...whateverPropsItNeeds} />
    </Provider>
);
```

What I expect to work then is:
```js
const expectedCreateTokenParams = { /* some token params here */ }
component.find(button).simulate('click');
expect(mockCreateToken).toHaveBeenCalledWith(expectedCreateTokenParams);
expect(mockStore.dispatch).toHaveBeenCalledWith(payWithStripe('token'));
```

But because the `payWithStripe` action is called in a promise, the test does not wait for the promise to be triggered to execute the `expect`.

You then need to make jest wait for the promise to trigger the action:
```js
it('should trigger the payWithStripe action', done => {
    const expectedCreateTokenParams = { /* some token params here */ }
    component.find(button).simulate('click');
    setImmediate(() => {
        expect(mockCreateToken).toHaveBeenCalledWith(expectedCreateTokenParams);
        expect(mockStore.dispatch).toHaveBeenCalledWith(payWithStripe('token'));
        done();
    });
})
```
