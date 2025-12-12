import { actionTypes } from './constants';

export const fetchProducts = (params = {}) => ({
  type: actionTypes.FETCH_PRODUCTS_REQUEST,
  params, // { q, limit, offset, brandId, categoryId, sortBy, sortOrder, status }
});

export const fetchProductsSuccess = data => ({
  type: actionTypes.FETCH_PRODUCTS_SUCCESS,
  data,
});

export const fetchProductsFailure = error => ({
  type: actionTypes.FETCH_PRODUCTS_FAILURE,
  error,
});

export const setSearchFilter = searchText => ({
  type: actionTypes.SET_SEARCH_FILTER,
  searchText,
});

export const setBrandFilter = brandId => ({
  type: actionTypes.SET_BRAND_FILTER,
  brandId,
});

export const setCategoryFilter = categoryId => ({
  type: actionTypes.SET_CATEGORY_FILTER,
  categoryId,
});

export const setStatusFilter = status => ({
  type: actionTypes.SET_STATUS_FILTER,
  status,
});

export const fetchBrandsForFilter = () => ({
  type: actionTypes.FETCH_BRANDS_FOR_FILTER_REQUEST,
});

export const fetchBrandsForFilterSuccess = data => ({
  type: actionTypes.FETCH_BRANDS_FOR_FILTER_SUCCESS,
  data,
});

export const fetchCategoriesForFilter = () => ({
  type: actionTypes.FETCH_CATEGORIES_FOR_FILTER_REQUEST,
});

export const fetchCategoriesForFilterSuccess = data => ({
  type: actionTypes.FETCH_CATEGORIES_FOR_FILTER_SUCCESS,
  data,
});

export const clearData = () => ({
  type: actionTypes.CLEAR_DATA,
});

export const createProduct = (productData) => ({
  type: actionTypes.CREATE_PRODUCT_REQUEST,
  productData,
});

export const createProductSuccess = (data) => ({
  type: actionTypes.CREATE_PRODUCT_SUCCESS,
  data,
});

export const createProductFailure = (error) => ({
  type: actionTypes.CREATE_PRODUCT_FAILURE,
  error,
});

export const updateProduct = (productId, productData) => ({
  type: actionTypes.UPDATE_PRODUCT_REQUEST,
  productId,
  productData,
});

export const updateProductSuccess = (data) => ({
  type: actionTypes.UPDATE_PRODUCT_SUCCESS,
  data,
});

export const updateProductFailure = (error) => ({
  type: actionTypes.UPDATE_PRODUCT_FAILURE,
  error,
});

export const deleteProduct = (productId) => ({
  type: actionTypes.DELETE_PRODUCT_REQUEST,
  productId,
});

export const deleteProductSuccess = (productId) => ({
  type: actionTypes.DELETE_PRODUCT_SUCCESS,
  productId,
});

export const deleteProductFailure = (error) => ({
  type: actionTypes.DELETE_PRODUCT_FAILURE,
  error,
});
