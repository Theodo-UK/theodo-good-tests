# Navigation Testing in React Native (Typescript)

## Navigation based on Redux state

- The component structure for the original code (that this example has been taken from) is:

- ExistingPatientDetail (specific use case screen) > 
- PatientDetail (base screen) > 
- PatientDetailsComponent (component registering react-hook-form) >
- PatientDetailsForm (component with actual form elements, e.g. inputs)

- The above structure is wrapped by a StackNavigator, and ExistingPatientDetail, the highest level, takes in the 'navigation' prop. Therefore we test navigation at this level by mocking this navigation function and expecting it to be called with certain inputs.

## ExistingPatientDetail 
```ts
<!-- ExistingPatientDetail.tsx -->
import React, { FunctionComponent } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';

import { useSelector, useDispatch } from 'react-redux';
import { CaseDetails } from '../../../shared/types/cases';
import { ExistingCaseNavigatorParamList, ScreenNames } from '../../../mobile/navigation/types';
import { existingCaseDetailsSelector } from '../../../shared/redux/Cases/selectors';
import { setExistingCaseDetails } from '../../../shared/redux/Cases';
import { PatientDetails } from './PatientDetails';

type ExistingPatientDetailNavigationProp = StackNavigationProp<
  ExistingCaseNavigatorParamList,
  ScreenNames.EXISTING_PATIENT_DETAILS
>;

type Props = {
  navigation: ExistingPatientDetailNavigationProp;
};

export const ExistingPatientDetail: FunctionComponent<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const caseDetails = useSelector(existingCaseDetailsSelector);
  const setCaseDetails = (data: Partial<CaseDetails>) => dispatch(setExistingCaseDetails(data));

  return (
    <PatientDetails
      initialCaseDetails={caseDetails}
      caseDetailsFromState={caseDetails}
      newCase={false}
      setCaseDetails={setCaseDetails}
      navigation={navigation}
    />
  );
};

```

## ExistingPatientDetail Navigation Test


```ts
import React from 'react';
import { render, fireEvent, waitFor } from 'react-native-testing-library';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';

import { NavigationContainer } from '@react-navigation/native';


jest.mock('@react-navigation/stack');

const mockStore = configureStore([]);


describe('[Component] ExistingPatientDetail', () => {

    const navigation = {
    navigate: jest.fn(),
  } as any; // eslint-disable-line @typescript-eslint/no-explicit-any


    it('should navigate correctly for a radiology case', async () => {
        const patientProfilesMockState = {
        ...mockState,
        cases: {
            ...mockState.cases,
            existingCase: {
            ...mockState.cases.existingCase,
            caseType: 'Radiology',
            },
            patientProfiles: testPatientProfiles,
        },
        };
        const store = mockStore(patientProfilesMockState);

        const { getByText } = render(
        <NavigationContainer>
            <ApplicationProvider {...eva} theme={eva.light}>
            <IconRegistry icons={EvaIconsPack} />
            <Provider store={store}>
                <ExistingPatientDetail navigation={navigation} />
            </Provider>
            </ApplicationProvider>
        </NavigationContainer>
        );
        fireEvent.press(getByText('Next'));
        expect(navigation.navigate).toHaveBeenCalledWith(ScreenNames.IMAGING_DETAILS);
    });

    it.only('should navigate correctly for a telemedicine case', async () => {
    const patientProfilesMockState = {
      ...mockState,
      cases: {
        ...mockState.cases,
        existingCase: {
          ...mockState.cases.existingCase,
          caseType: 'Neurology',
        },
        patientProfiles: testPatientProfiles,
      },
    };
    const store = mockStore(patientProfilesMockState);

    const { getByText } = render(
      <NavigationContainer>
        <ApplicationProvider {...eva} theme={eva.light}>
          <IconRegistry icons={EvaIconsPack} />
          <Provider store={store}>
            <ExistingPatientDetail navigation={navigation} />
          </Provider>
        </ApplicationProvider>
      </NavigationContainer>
    );
    fireEvent.press(getByText('Next'));
    expect(navigation.navigate).toHaveBeenCalledWith(ScreenNames.EXISTING_CONSULT_SELECTION);
  });

});
```