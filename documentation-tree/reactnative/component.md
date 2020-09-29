# Component Rendering in React Native (Typescript)


## Simple Component with Icon
- The example component is a simple styled button component with an icon from an external library (in this instance, the [ui-kitten](https://akveo.github.io/react-native-ui-kitten/) library).


```
<!-- AddConsultButton.tsx -->

import React, { FunctionComponent } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { colourPalette } from '../shared/styles/colours';
import { Icon } from '@ui-kitten/components';

const Button = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const ButtonIcon = styled(Icon)`
  margin-right: 5px;
`;

type Props = {
  patientName: string | undefined;
  onButtonPress: () => void;
};

export const AddConsultButton: FunctionComponent<Props> = ({ patientName, onButtonPress }) => {
  return (
    <Button onPress={onButtonPress}>
      <ButtonIcon name="plus-circle-outline" fill={colourPalette.black} height={20} width={20} />
      <Text>Add consult {patientName && `for ${patientName}`}</Text>
    </Button>
  );
};
```

- Use a snapshot test to ensure all the components are correctly rendered. Ensure to include providers for the icon library!


```
<!-- AddConsultButton.test.tsx -->

import React from 'react';
import { render } from 'react-native-testing-library';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import { AddConsultButton } from '../AddConsultButton';

describe('[Component] AddConsultButton', () => {
  it('should render correctly', () => {
    const mockButtonPress = () => jest.mock;
    const addConsultButton = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <IconRegistry icons={EvaIconsPack} />
        <AddConsultButton patientName={'patientName'} onButtonPress={mockButtonPress} />
      </ApplicationProvider>
    );
    expect(addConsultButton).toMatchSnapshot();
  });
});

```

## Component with Form from Redux

- An example for a simple form (text only inputs) using react-hook-form

```
<!-- PatientDetailsComponent.tsx -->
import React, { FunctionComponent, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@ui-kitten/components';
import { CaseDetails } from '../shared/types/cases';
import { isCaseReadOnly } from '../shared/services/utils';
import {
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/stack';

type Props = {
  onSubmit: (data: CaseDetails) => void;
  caseDetails: CaseDetails | undefined;
  componentLevelReadonly?: boolean;
};

const PatientDetailsComponent: FunctionComponent<Props> = ({
  onSubmit,
  caseDetails,
  componentLevelReadonly,
}) => {
  const headerHeight = useHeaderHeight();
  const defaultValues = {
    patientName: caseDetails?.patientName,
    ownerName: caseDetails?.ownerName,
    patientId: caseDetails?.patientId,
  };

  const { register, setValue, handleSubmit, errors, watch, reset } = useForm<CaseDetails>({
    defaultValues,
  });

  const watchValues = watch();

  useEffect(() => {
    register({ name: 'patientName' }, { required: true });
    register({ name: 'ownerName' }, { required: true });
    register({ name: 'patientId' }, { required: true });
  }, [register]);

  useMemo(() => {
    reset(defaultValues);
  }, [caseDetails]);

  // Set fields as readonly if case is in progress or complete
  const readonly: boolean = componentLevelReadonly ?? isCaseReadOnly(caseDetails?.status);
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={headerHeight + (StatusBar.currentHeight || 0)}
    >
      <ScrollView keyboardShouldPersistTaps="always">
        <Input
          placeholder={'Enter Patient Name'}
          label={'patientname'}
          value={watchValues.patientName}
          onChangeText={nextValue => setValue('patientName', nextValue)}
          disabled={readonly}
        />
        {errors.patientName && <Text>{`This is required`}</Text>}
        <Input
          placeholder={`Enter Owner Name`}
          label={`patientId`}
          value={watchValues.ownerName}
          onChangeText={nextValue => setValue('ownerName', nextValue)}
          disabled={readonly}
        />
        {errors.ownerName && <Text>{`This is required`}</Text>}
        <Input
          placeholder={`Enter Patient ID`}
          label={`patientId`}
          value={watchValues.patientId}
          onChangeText={nextValue => setValue('patientId', nextValue)}
          disabled={readonly}
        />
        {errors.patientId && <Text>{`This is required`}</Text>}
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Text>{`Submit`}</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default PatientDetailsComponent;

```

- We can also snapshot test this component, and mock the onSubmit function using jest.mock(). We use the `react-redux` Provider as well  as ApplicationProvider + IconRegistry from the [`ui-kitten`](https://akveo.github.io/react-native-ui-kitten/) library as above.

```
<!-- PatientDetailsComponent.test.tsx -->
import React from 'react';
import { render } from 'react-native-testing-library';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

import PatientDetailsComponent from '../PatientDetailsComponent';

jest.mock('@react-navigation/stack');

const mockStore = configureStore([]);
const initialState = {
  cases: {
    caseList: {
      total: 0,
      start: 0,
      count: 0,
      cases: [],
    },
  },
  fieldValues: {
    speciesBreed: [],
    patientGender: [],
  },
};

describe('[Component] PatientDetailsComponent', () => {
  const onSubmit = jest.fn();
  it('should render correctly', () => {
    const store = mockStore(initialState);
    const caseDetail = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <IconRegistry icons={EvaIconsPack} />
        <Provider store={store}>
          <PatientDetailsComponent onSubmit={onSubmit} caseDetails={undefined} />
        </Provider>
      </ApplicationProvider>
    );
    expect(caseDetail).toMatchSnapshot();
  });
});

```

# 