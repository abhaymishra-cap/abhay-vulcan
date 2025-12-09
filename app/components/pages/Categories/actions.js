import { actionTypes } from './constants';

export const fetchCategories = (params = {}) => ({
  type: actionTypes.FETCH_CATEGORIES_REQUEST,
  params, // { q, limit, offset, root, entityCodes, entityIds, sortBy, sortOrder }
});

export const fetchCategoriesSuccess = data => ({
  type: actionTypes.FETCH_CATEGORIES_SUCCESS,
  data,
});

export const fetchCategoriesFailure = error => ({
  type: actionTypes.FETCH_CATEGORIES_FAILURE,
  error,
});

export const setSearchFilter = searchText => ({
  type: actionTypes.SET_SEARCH_FILTER,
  searchText,
});

export const clearData = () => ({
  type: actionTypes.CLEAR_DATA,
});

export const createCategory = (categoryData) => ({
  type: actionTypes.CREATE_CATEGORY_REQUEST,
  categoryData,
});

export const createCategorySuccess = (data) => ({
  type: actionTypes.CREATE_CATEGORY_SUCCESS,
  data,
});

export const createCategoryFailure = (error) => ({
  type: actionTypes.CREATE_CATEGORY_FAILURE,
  error,
});

export const updateCategory = (categoryId, categoryData) => ({
  type: actionTypes.UPDATE_CATEGORY_REQUEST,
  categoryId,
  categoryData,
});

export const updateCategorySuccess = (data) => ({
  type: actionTypes.UPDATE_CATEGORY_SUCCESS,
  data,
});

export const updateCategoryFailure = (error) => ({
  type: actionTypes.UPDATE_CATEGORY_FAILURE,
  error,
});

export const deleteCategory = (categoryId) => ({
  type: actionTypes.DELETE_CATEGORY_REQUEST,
  categoryId,
});

export const deleteCategorySuccess = (categoryId) => ({
  type: actionTypes.DELETE_CATEGORY_SUCCESS,
  categoryId,
});

export const deleteCategoryFailure = (error) => ({
  type: actionTypes.DELETE_CATEGORY_FAILURE,
  error,
});

