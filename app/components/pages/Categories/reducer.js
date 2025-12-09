import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

// Mock data matching the image
const mockCategories = [
  {
    id: 'C001',
    name: 'Electronics',
    initials: 'EL',
    parentCategory: null,
    lastUpdated: 'Nov 25, 2025 9:38 AM',
    status: 'Active',
  },
  {
    id: 'C002',
    name: 'Laptops',
    initials: 'LA',
    parentCategory: 'Electronics',
    lastUpdated: 'Nov 25, 2025 9:38 AM',
    status: 'Active',
  },
  {
    id: 'C003',
    name: 'Smartphones',
    initials: 'SM',
    parentCategory: 'Electronics',
    lastUpdated: 'Nov 25, 2025 9:38 AM',
    status: 'Active',
  },
  {
    id: 'C004',
    name: 'Home & Garden',
    initials: 'HO',
    parentCategory: null,
    lastUpdated: 'Nov 25, 2025 9:38 AM',
    status: 'Active',
  },
];

export const initialState = fromJS({
  categories: [],
  filteredCategories: [],
  searchFilter: '',
  pagination: {
    limit: 10,
    offset: 0,
    total: 0,
  },
  loading: false,
  error: null,
});

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CATEGORIES_REQUEST:
      return state.set('loading', true).set('error', null);
      
    case actionTypes.FETCH_CATEGORIES_SUCCESS:
      const categories = action.data || [];
      // Store pagination info if provided
      const pagination = action.pagination || {};
      return state
        .set('categories', fromJS(categories))
        .set('filteredCategories', fromJS(categories))
        .set('pagination', fromJS(pagination))
        .set('loading', false)
        .set('error', null);
        
    case actionTypes.FETCH_CATEGORIES_FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error);
        
    case actionTypes.CREATE_CATEGORY_REQUEST:
    case actionTypes.UPDATE_CATEGORY_REQUEST:
    case actionTypes.DELETE_CATEGORY_REQUEST:
      return state.set('loading', true).set('error', null);
      
    case actionTypes.CREATE_CATEGORY_SUCCESS:
    case actionTypes.UPDATE_CATEGORY_SUCCESS:
      // Categories list will be refreshed by saga, so just clear loading
      return state.set('loading', false).set('error', null);
      
    case actionTypes.DELETE_CATEGORY_SUCCESS:
      // Remove deleted category from state immediately
      const currentCategories = state.get('categories').toJS();
      const updatedCategories = currentCategories.filter(
        cat => cat.id !== action.categoryId
      );
      return state
        .set('categories', fromJS(updatedCategories))
        .set('filteredCategories', fromJS(updatedCategories))
        .set('loading', false)
        .set('error', null);
        
    case actionTypes.CREATE_CATEGORY_FAILURE:
    case actionTypes.UPDATE_CATEGORY_FAILURE:
    case actionTypes.DELETE_CATEGORY_FAILURE:
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

export default categoriesReducer;

