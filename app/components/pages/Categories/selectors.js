import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { initialState } from './reducer';

/**
 * Direct selector to the Categories state domain
 */

const selectCategoriesDomain = (state = fromJS({})) =>
  state.get(`${CURRENT_APP_NAME}-categories`, initialState);

/**
 * Default selector used by Categories
 */

const makeSelectCategories = () =>
  createSelector(selectCategoriesDomain, (substate = fromJS({})) =>
    substate.toJS(),
  );

const makeSelectFilteredCategories = () =>
  createSelector(selectCategoriesDomain, (substate = fromJS({})) =>
    substate.get('filteredCategories', fromJS([])).toJS(),
  );

const makeSelectCategoriesCount = () =>
  createSelector(selectCategoriesDomain, (substate = fromJS({})) => {
    // Use pagination.total if available, otherwise fall back to filteredCategories size
    const pagination = substate.get('pagination', fromJS({}));
    const total = pagination.get('total');
    if (total !== undefined && total !== null) {
      return total;
    }
    const categories = substate.get('filteredCategories', fromJS([]));
    return categories.size;
  });

const makeSelectSearchFilter = () =>
  createSelector(selectCategoriesDomain, (substate = fromJS({})) =>
    substate.get('searchFilter', ''),
  );

const makeSelectLoading = () =>
  createSelector(selectCategoriesDomain, (substate = fromJS({})) =>
    substate.get('loading', false),
  );

const makeSelectPagination = () =>
  createSelector(selectCategoriesDomain, (substate = fromJS({})) =>
    substate.get('pagination', fromJS({})).toJS(),
  );

export {
  selectCategoriesDomain,
  makeSelectCategories,
  makeSelectFilteredCategories,
  makeSelectCategoriesCount,
  makeSelectSearchFilter,
  makeSelectLoading,
  makeSelectPagination,
};

