import { fromJS } from 'immutable';
import { actionTypes } from './constants';
import * as constants from '../App/constants';

const { REQUEST, SUCCESS, FAILURE } = constants;

export const initialState = fromJS({
  products: [],
  filteredProducts: [],
  searchFilter: '',
  brandFilter: null,
  categoryFilter: null,
  statusFilter: null,
  brandsForFilter: [],
  categoriesForFilter: [],
  returnableCount: 0,
  pagination: {
    limit: 10,
    offset: 0,
    total: 0,
  },
  loading: false,
  error: null,
});

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_PRODUCTS_REQUEST:
      return state.set('loading', true).set('error', null);
      
    case actionTypes.FETCH_PRODUCTS_SUCCESS:
      const products = action.data || [];
      const pagination = action.pagination || {};
      
      // Calculate returnable count
      const returnableCount = products.filter(p => p.status === 'Returnable').length;
      
      return state
        .set('products', fromJS(products))
        .set('filteredProducts', fromJS(products))
        .set('pagination', fromJS(pagination))
        .set('returnableCount', returnableCount)
        .set('loading', false)
        .set('error', null);
        
    case actionTypes.FETCH_PRODUCTS_FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error);
        
    case actionTypes.FETCH_BRANDS_FOR_FILTER_SUCCESS:
      return state.set('brandsForFilter', fromJS(action.data || []));
        
    case actionTypes.FETCH_CATEGORIES_FOR_FILTER_SUCCESS:
      return state.set('categoriesForFilter', fromJS(action.data || []));
        
    case actionTypes.CREATE_PRODUCT_REQUEST:
    case actionTypes.UPDATE_PRODUCT_REQUEST:
    case actionTypes.DELETE_PRODUCT_REQUEST:
      return state.set('loading', true).set('error', null);
      
    case actionTypes.CREATE_PRODUCT_SUCCESS:
    case actionTypes.UPDATE_PRODUCT_SUCCESS:
      // Products list will be refreshed by saga, so just clear loading
      return state.set('loading', false).set('error', null);
      
    case actionTypes.DELETE_PRODUCT_SUCCESS:
      // Remove deleted product from state immediately
      const currentProducts = state.get('products').toJS();
      const updatedProducts = currentProducts.filter(
        product => product.id !== action.productId
      );
      const updatedReturnableCount = updatedProducts.filter(p => p.status === 'Returnable').length;
      return state
        .set('products', fromJS(updatedProducts))
        .set('filteredProducts', fromJS(updatedProducts))
        .set('returnableCount', updatedReturnableCount)
        .set('loading', false)
        .set('error', null);
        
    case actionTypes.CREATE_PRODUCT_FAILURE:
    case actionTypes.UPDATE_PRODUCT_FAILURE:
    case actionTypes.DELETE_PRODUCT_FAILURE:
      return state
        .set('loading', false)
        .set('error', action.error);
        
    case actionTypes.SET_SEARCH_FILTER:
      return state.set('searchFilter', action.searchText);
      
    case actionTypes.SET_BRAND_FILTER:
      return state.set('brandFilter', action.brandId);
      
    case actionTypes.SET_CATEGORY_FILTER:
      return state.set('categoryFilter', action.categoryId);
      
    case actionTypes.SET_STATUS_FILTER:
      return state.set('statusFilter', action.status);
        
    case actionTypes.CLEAR_DATA:
      return initialState;
      
    default:
      return state;
  }
};

export default productsReducer;
