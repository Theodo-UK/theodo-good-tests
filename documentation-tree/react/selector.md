# Selector

## General advice

Only test your selector if it has logic.
Do not waste time testing a selector that accesses a key deep down in your state for instance.

## Example

### Code

```js
// <my_project>/frontend/src/redux/selectors/prospects.js
import { createSelector } from 'reselect'

export const rawProspectsSelector = state => state.prospects

export const selectProspectOptions = createSelector(
  rawProspectsSelector,
  prospects => prospects.prospectOptions
)

const rawMatchedProspectSelector = state => state.prospects.matchedProspect
export const rawMatchedProspectIdSelector = state => state.prospects.matchedProspect.id
export const rawProspectsCompanyNameSelector = state => state.prospects.companyName
export const rawProspectsCountryCodeSelector = state => state.prospects.countryCode

export const selectMatchedProspect = createSelector(
  selectProspectOptions,
  rawMatchedProspectSelector,
  (prospects, { id }) => prospects.find(p => p.id === id)
)
```

### Test

```js
// <my_project>/frontend/src/redux/selectors/prospects.test.js
import {
  selectMatchedProspect,
  selectAssessedProspect,
  selectCanAssess
} from './prospects'
import prospects from '@fixtures/store/prospects'

describe('Prospects selectors', () => {
  const initialState = { prospects }

  const expectedMatchedProspect = initialState.prospects.prospectOptions[0]
  const state = {
    ...initialState,
    prospects: {
      ...initialState.prospects,
      matchedProspect: {
        id: expectedMatchedProspect.id,
        grade: null
      }
    }
  }

  describe('selectMatchedProspect()', () => {
    it('should return prospect with the stored matched ID.', () => {
      expect(selectMatchedProspect(state)).toBe(expectedMatchedProspect)
    })
  })
```
