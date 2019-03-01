# Formik

## General advice

Make the From part of your page a Component (even if in the same file) that can be easily tested.
This can be done using the `render` prop of the `Formik` component.

## <a id="jsx-rendered"></a>JSX rendered
### Code
```js
const CreateUserSchema = Yup.object().shape({
  company: Yup.string().required("This field is Required"),
  firstName: Yup.string().required("This field is Required"),
  email: Yup.string()
    .email("Invalid email")
    .required("This field is Required"),
})
export const FormikForm = ({ values, errors, isSubmitting, createUser }) => (
  <>
    <Field title="First Name" type="text" name="firstName" id="firstName" />
    <Field title="Last Name" type="text" name="lastName" id="lastName" />
    <Field title="Email" type="email" name="email" id="email" />
    <FormikSelect
      title="Company"
      name="company"
      options={options.company}
      id="companySelect"
      onChange={() => {}}
      placeholder=""
    />
    <FormikSelect
      title="Title"
      name="title"
      options={options.title}
      id="titleSelect"
      onChange={() => {}}
      placeholder=""
    />
    <Button
      onClick={createUser}
      disabled={isSubmitting || !isEmptyObject(errors) || isEmptyObject(values)}
    >
      Create
    </Button>
  </>
)
export default class CreateUserPage extends React.PureComponent {
  render() {
    return (
      <>
        <h1>
          Create User
        </h1>
        <div>
          <Formik
            validationSchema={CreateUserSchema}
            render={fomikProps => <FormikForm createUser={this.props.createUser} {...fomikProps} />}
          />
        </div>
      </>
    )
  }
}
```

### Test
```js
import { shallow } from "enzyme"
import { Button } from "Button"

const mockFormikValues = {
  email: "test@theodo.co.uk",
  firstName: "John",
  language: { label: "French", value: 'fr' },
  lastName: "Tester",
  company: { label: "BAM", value: 'BAM' },
  title: { label: "Mr", value: 'mr' },
}


describe("FormikForm", () => {
  it("should have a disabled next button if errors present", () => {
    const renderedComponent = shallow(
      <FormikForm
        values={mockFormikValues}
        isSubmitting={false}
        errors={{ mockError: "some error" }}
      />,
    )
    expect(
      renderedComponent
        .find(Button)
        .first()
        .props().disabled,
    ).toEqual(true)
  })
  it("should have a disabled next button if no values present", () => {
    const renderedComponent = shallow(<FormikForm values={{}} isSubmitting={false} errors={{}} />)
    expect(
      renderedComponent
        .find(Button)
        .first()
        .props().disabled,
    ).toEqual(true)
  })
  it("should have a disabled next button if submitting in progress", () => {
    const renderedComponent = shallow(
      <FormikForm values={mockFormikValues} isSubmitting errors={{}} />,
    )
    expect(
      renderedComponent
        .find(Button)
        .first()
        .props().disabled,
    ).toEqual(true)
  })
  it("should have an enabled next button with all values complete and no errors", () => {
    const renderedComponent = shallow(
      <FormikForm values={mockFormikValues} isSubmitting={false} errors={{}} />,
    )
    expect(
      renderedComponent
        .find(Button)
        .first()
        .props().disabled,
    ).toEqual(false)
  })
  it("should call createUser on create press", () => {
    const createUser = jest.fn()
    const renderedComponent = shallow(
      <FormikForm
        createUser={createUser}
        values={mockFormikValues}
        isSubmitting={false}
        errors={{}}
      />,
    )
    renderedComponent
      .find(Button)
      .first()
      .simulate("click")
    expect(createUser).toHaveBeenCalledTimes(1)
  })
  ```
