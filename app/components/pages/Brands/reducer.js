import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

export const initialState = fromJS({
  brands: [],
  filteredBrands: [],
  searchFilter: '',
  pagination: {
    limit: 10,
    offset: 0,
    total: 0,
  },
  loading: false,
  error: null,
});

const brandsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_BRANDS_REQUEST:
      return state.set('loading', true).set('error', null);
      
    case actionTypes.FETCH_BRANDS_SUCCESS:
      const brands = action.data || [];
      // Store pagination info if provided
      const pagination = action.pagination || {};
      return state
        .set('brands', fromJS(brands))
        .set('filteredBrands', fromJS(brands))
        .set('pagination', fromJS(pagination))
        .set('loading', false)
        .set('error', null);
        
    case actionTypes.FETCH_BRANDS_FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error);
        
    case actionTypes.CREATE_BRAND_REQUEST:
    case actionTypes.UPDATE_BRAND_REQUEST:
    case actionTypes.DELETE_BRAND_REQUEST:
      return state.set('loading', true).set('error', null);
      
    case actionTypes.CREATE_BRAND_SUCCESS:
    case actionTypes.UPDATE_BRAND_SUCCESS:
      // Brands list will be refreshed by saga, so just clear loading
      return state.set('loading', false).set('error', null);
      
    case actionTypes.DELETE_BRAND_SUCCESS:
      // Remove deleted brand from state immediately
      const currentBrands = state.get('brands').toJS();
      const updatedBrands = currentBrands.filter(
        brand => brand.id !== action.brandId
      );
      return state
        .set('brands', fromJS(updatedBrands))
        .set('filteredBrands', fromJS(updatedBrands))
        .set('loading', false)
        .set('error', null);
        
    case actionTypes.CREATE_BRAND_FAILURE:
    case actionTypes.UPDATE_BRAND_FAILURE:
    case actionTypes.DELETE_BRAND_FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error);
        
    case actionTypes.SET_SEARCH_FILTER:
      // Just update the search filter state
      // Actual filtering is done server-side via API
      return state.set('searchFilter', action.searchText);
        
    case actionTypes.CLEAR_DATA:
      return initialState;
      
    default:
      return state;
  }
};

export default brandsReducer;
