import { actionTypes } from './constants';

export const fetchBrands = (params = {}) => ({
  type: actionTypes.FETCH_BRANDS_REQUEST,
  params, // { q, limit, offset, root, entityCodes, entityIds, sortBy, sortOrder, includeChildren, childrenLimit, childrenOffset, ouCode, fetchType }
});

export const fetchBrandsSuccess = data => ({
  type: actionTypes.FETCH_BRANDS_SUCCESS,
  data,
});

export const fetchBrandsFailure = error => ({
  type: actionTypes.FETCH_BRANDS_FAILURE,
  error,
});

export const setSearchFilter = searchText => ({
  type: actionTypes.SET_SEARCH_FILTER,
  searchText,
});

export const clearData = () => ({
  type: actionTypes.CLEAR_DATA,
});

export const createBrand = (brandData) => ({
  type: actionTypes.CREATE_BRAND_REQUEST,
  brandData,
});

export const createBrandSuccess = (data) => ({
  type: actionTypes.CREATE_BRAND_SUCCESS,
  data,
});

export const createBrandFailure = (error) => ({
  type: actionTypes.CREATE_BRAND_FAILURE,
  error,
});

export const updateBrand = (brandId, brandData) => ({
  type: actionTypes.UPDATE_BRAND_REQUEST,
  brandId,
  brandData,
});

export const updateBrandSuccess = (data) => ({
  type: actionTypes.UPDATE_BRAND_SUCCESS,
  data,
});

export const updateBrandFailure = (error) => ({
  type: actionTypes.UPDATE_BRAND_FAILURE,
  error,
});

export const deleteBrand = (brandId) => ({
  type: actionTypes.DELETE_BRAND_REQUEST,
  brandId,
});

export const deleteBrandSuccess = (brandId) => ({
  type: actionTypes.DELETE_BRAND_SUCCESS,
  brandId,
});

export const deleteBrandFailure = (error) => ({
  type: actionTypes.DELETE_BRAND_FAILURE,
  error,
});
