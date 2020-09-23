# React Hook Form

## Testing with vanilla React

React Hook Form can be used across both React and React Native, with multiple libraries including `react-dom/test-utils`, `react-test-renderer` and `react-testing-library`.


### React Test Renderer and Test Utilities

Here's an example form:

```ts

import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

type CarDetails = {
  brand: string;
  engineCapacity: number;
  numberPlate: string;
};

type Props = {
  onSubmit?: (data: Partial<CarDetails>) => void;
};

export const TestForm: FunctionComponent<Props> = ({ onSubmit }: Props) => {
  const onDefaultSubmit = (data: Partial<CarDetails>) => {
    console.log('onDefaultSubmit', data);
  };

  const defaultValues: CarDetails = {
    brand: 'Ferrari',
    engineCapacity: 12,
    numberPlate: 'G00D T35T',
  };
  const { register, setValue, handleSubmit, errors, watch, reset } = useForm();

  useEffect(() => {
    register({ name: 'brand' }, { required: true });
    register({ name: 'engineCapacity' }, { required: true });
    register({ name: 'numberPlate' }, { required: true });
  }, [register]);

  const watchValues = watch();
  useMemo(() => {
    reset(defaultValues);
  }, []);

  return (
    <div>
      <input
        value={watchValues.brand}
        onChange={event => setValue('brand', event.target.value)}
      ></input>
      <br></br>
      {errors.brand && <span className="errorText">This is required!</span>}
      <br></br>
      <input
        value={watchValues.engineCapacity}
        onChange={event => setValue('engineCapacity', event.target.value)}
      ></input>
      <br></br>
      {errors.engineCapacity && <span className="errorText">This is required!</span>}
      <br></br>
      <input
        value={watchValues.numberPlate}
        onChange={event => {
          setValue('numberPlate', event.target.value);
        }}
      ></input>
      <br></br>
      {errors.numberPlate && <span className="errorText">This is required!</span>}
      <br></br>
      <button
        type="submit"
        onClick={onSubmit ? handleSubmit(onSubmit) : handleSubmit(onDefaultSubmit)}
      >
        Submit Form
      </button>
      <br></br>
    </div>
  );
};

```

Example basic component test with `react-test-renderer`

```ts

describe('[TestForm] TestForm', () => {
  it('should have a submit button', () => {
    const testRendererForm = TestRenderer.create(<TestForm />);
    const testForm = testRendererForm.root;
    const submitButton = testForm.findByType('button');
    expect(testForm.findAllByProps({ className: 'errorText' }).length).toEqual(0);
    expect(submitButton.children).toEqual(['Submit Form']);
  });

    // https://reactjs.org/docs/test-utils.html > how to define 'document'?
    
  it('should show error messages', () => {
    let testForm;

    act(() => {
      ReactDOM.render(<TestForm />);
    });
    const submitButton = testForm.getElementByType('button');
    console.warn(submitButton);
  });
});

```