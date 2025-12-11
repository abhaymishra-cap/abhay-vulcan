import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { initialState } from './reducer';

/**
 * Direct selector to the Brands state domain
 */

const selectBrandsDomain = (state = fromJS({})) =>
  state.get(`${CURRENT_APP_NAME}-brands`, initialState);

/**
 * Default selector used by Brands
 */

const makeSelectBrands = () =>
  createSelector(selectBrandsDomain, (substate = fromJS({})) =>
    substate.toJS(),
  );

const makeSelectFilteredBrands = () =>
  createSelector(selectBrandsDomain, (substate = fromJS({})) =>
    substate.get('filteredBrands', fromJS([])).toJS(),
  );

const makeSelectBrandsCount = () =>
  createSelector(selectBrandsDomain, (substate = fromJS({})) => {
    // Use pagination.total if available, otherwise fall back to filteredBrands size
    const pagination = substate.get('pagination', fromJS({}));
    const total = pagination.get('total');
    if (total !== undefined && total !== null) {
      return total;
    }
    const brands = substate.get('filteredBrands', fromJS([]));
    return brands.size;
  });

const makeSelectSearchFilter = () =>
  createSelector(selectBrandsDomain, (substate = fromJS({})) =>
    substate.get('searchFilter', ''),
  );

const makeSelectLoading = () =>
  createSelector(selectBrandsDomain, (substate = fromJS({})) =>
    substate.get('loading', false),
  );

export {
  selectBrandsDomain,
  makeSelectBrands,
  makeSelectFilteredBrands,
  makeSelectBrandsCount,
  makeSelectSearchFilter,
  makeSelectLoading,
};
