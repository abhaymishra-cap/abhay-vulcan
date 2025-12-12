import { createSelector } from 'reselect';
import { fromJS } from 'immutable';
import { initialState } from './reducer';

/**
 * Direct selector to the Products state domain
 */

const selectProductsDomain = (state = fromJS({})) =>
  state.get(`${CURRENT_APP_NAME}-products`, initialState);

/**
 * Default selector used by Products
 */

const makeSelectProducts = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.toJS(),
  );

const makeSelectFilteredProducts = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.get('filteredProducts', fromJS([])).toJS(),
  );

const makeSelectProductsCount = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) => {
    // Use pagination.total if available, otherwise fall back to filteredProducts size
    const pagination = substate.get('pagination', fromJS({}));
    const total = pagination.get('total');
    if (total !== undefined && total !== null) {
      return total;
    }
    const products = substate.get('filteredProducts', fromJS([]));
    return products.size;
  });

const makeSelectReturnableCount = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) => {
    const returnableCount = substate.get('returnableCount');
    if (returnableCount !== undefined && returnableCount !== null) {
      return returnableCount;
    }
    // Calculate from products if not stored
    const products = substate.get('filteredProducts', fromJS([])).toJS();
    return products.filter(p => p.status === 'Returnable').length;
  });

const makeSelectSearchFilter = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.get('searchFilter', ''),
  );

const makeSelectBrandFilter = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.get('brandFilter'),
  );

const makeSelectCategoryFilter = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.get('categoryFilter'),
  );

const makeSelectStatusFilter = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.get('statusFilter'),
  );

const makeSelectBrandsForFilter = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.get('brandsForFilter', fromJS([])).toJS(),
  );

const makeSelectCategoriesForFilter = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.get('categoriesForFilter', fromJS([])).toJS(),
  );

const makeSelectLoading = () =>
  createSelector(selectProductsDomain, (substate = fromJS({})) =>
    substate.get('loading', false),
  );

export {
  selectProductsDomain,
  makeSelectProducts,
  makeSelectFilteredProducts,
  makeSelectProductsCount,
  makeSelectReturnableCount,
  makeSelectSearchFilter,
  makeSelectBrandFilter,
  makeSelectCategoryFilter,
  makeSelectStatusFilter,
  makeSelectBrandsForFilter,
  makeSelectCategoriesForFilter,
  makeSelectLoading,
};
