import { actionTypes } from './constants';

export const fetchCategories = () => ({
  type: actionTypes.FETCH_CATEGORIES_REQUEST,
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

