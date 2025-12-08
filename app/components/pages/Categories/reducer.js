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
  loading: false,
  error: null,
});

const categoriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_CATEGORIES_REQUEST:
      return state.set('loading', true).set('error', null);
    case actionTypes.FETCH_CATEGORIES_SUCCESS:
      return state
        .set('categories', fromJS(action.data || mockCategories))
        .set('filteredCategories', fromJS(action.data || mockCategories))
        .set('loading', false);
    case actionTypes.FETCH_CATEGORIES_FAILURE:
      return state.set('loading', false).set('error', action.error);
    case actionTypes.SET_SEARCH_FILTER:
      const searchText = action.searchText.toLowerCase();
      const categories = state.get('categories').toJS();
      const filtered = searchText
        ? categories.filter(
            category =>
              category.name.toLowerCase().includes(searchText) ||
              category.id.toLowerCase().includes(searchText),
          )
        : categories;
      return state
        .set('searchFilter', action.searchText)
        .set('filteredCategories', fromJS(filtered));
    case actionTypes.CLEAR_DATA:
      return initialState;
    default:
      return state;
  }
};

export default categoriesReducer;

