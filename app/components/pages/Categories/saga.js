import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';

/**
 * Transform API category data (v2 format) to match frontend structure
 */
function transformCategoryData(apiCategory) {
  return {
    id: String(apiCategory.id || apiCategory.categoryId), // Convert numeric ID to string for frontend
    name: apiCategory.name || apiCategory.categoryName || '',
    initials: getInitials(apiCategory.name || apiCategory.categoryName || ''),
    parentCategory: apiCategory.parent?.name || apiCategory.parentCategory || apiCategory.parentCategoryName || null,
    parentCategoryId: apiCategory.parent?.id ? String(apiCategory.parent.id) : (apiCategory.parentCategoryId || apiCategory.parentId || null),
    lastUpdated: formatDate(apiCategory.attribution?.modifiedDate || apiCategory.attribution?.updatedDate || apiCategory.updatedAt || apiCategory.lastUpdated || apiCategory.modifiedAt),
    status: 'Active', // Default to Active since v2 API doesn't provide status
    description: apiCategory.description || '',
  };
}

/**
 * Format date to match UI display format
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    return dateString;
  }
}

/**
 * Get initials from category name
 */
function getInitials(name) {
  if (!name) return '';
  const words = name.split(' ');
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

/**
 * Transform status from API format to frontend format
 */
function transformStatus(status) {
  if (!status) return 'Active';
  const statusLower = status.toLowerCase();
  if (statusLower === 'active') return 'Active';
  if (statusLower === 'inactive') return 'Inactive';
  return status; // Return as-is if already formatted
}

/**
 * Fetch categories from API (v2 API structure)
 */
export function* fetchCategories({ params = {} }) {
  try {
    // Build API params from action params
    const apiParams = {
      q: params.q,
      limit: params.limit || 10,
      offset: params.offset || 0,
      root: params.root,
      entityCodes: params.entityCodes,
      entityIds: params.entityIds,
      sortBy: params.sortBy || 'id',
      sortOrder: params.sortOrder || 'ASC',
    };
    
    const response = yield call(Api.getCategories, apiParams);
    
    // v2 API response structure: { data: [...], pagination: {...} } (no success field)
    if (response && response.data) {
      const categories = Array.isArray(response.data) ? response.data : [];
      
      // Transform API data to match frontend structure
      const transformedCategories = categories.map(transformCategoryData);
      
      yield put({
        type: actionTypes.FETCH_CATEGORIES_SUCCESS,
        data: transformedCategories,
        pagination: response.pagination || {},
      });
    } else {
      yield put({
        type: actionTypes.FETCH_CATEGORIES_FAILURE,
        error: response?.message || response?.error || 'Failed to fetch categories',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_CATEGORIES_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Create a new category (v2 API structure)
 */
export function* createCategory({ categoryData }) {
  try {
    const response = yield call(Api.createCategory, categoryData);
    
    // v2 API response: { data: {...} } (no success field)
    if (response && response.data) {
      // Refresh categories list
      yield put({ type: actionTypes.FETCH_CATEGORIES_REQUEST });
      
      yield put({
        type: actionTypes.CREATE_CATEGORY_SUCCESS,
        data: response.data,
      });
    } else {
      yield put({
        type: actionTypes.CREATE_CATEGORY_FAILURE,
        error: response?.message || response?.error || 'Failed to create category',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.CREATE_CATEGORY_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Update an existing category (v2 API structure)
 */
export function* updateCategory({ categoryId, categoryData }) {
  try {
    const response = yield call(Api.updateCategory, categoryId, categoryData);
    
    // v2 API response: { data: {...} } (no success field)
    if (response && response.data) {
      // Refresh categories list
      yield put({ type: actionTypes.FETCH_CATEGORIES_REQUEST });
      
      yield put({
        type: actionTypes.UPDATE_CATEGORY_SUCCESS,
        data: response.data,
      });
    } else {
      yield put({
        type: actionTypes.UPDATE_CATEGORY_FAILURE,
        error: response?.message || response?.error || 'Failed to update category',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.UPDATE_CATEGORY_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Delete a category (v2 API structure)
 */
export function* deleteCategory({ categoryId }) {
  try {
    const response = yield call(Api.deleteCategory, categoryId);
    
    // v2 API may return 200 status or { message: "..." } (no success field)
    // Consider it successful if no error is thrown
    if (!response || response.message || response.status === 200) {
      yield put({
        type: actionTypes.DELETE_CATEGORY_SUCCESS,
        categoryId,
      });
      
      // Refresh categories list
      yield put({ type: actionTypes.FETCH_CATEGORIES_REQUEST });
    } else {
      yield put({
        type: actionTypes.DELETE_CATEGORY_FAILURE,
        error: response?.message || response?.error || 'Failed to delete category',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.DELETE_CATEGORY_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

// Watchers
export function* watchForFetchCategories() {
  yield takeLatest(actionTypes.FETCH_CATEGORIES_REQUEST, fetchCategories);
}

export function* watchForCreateCategory() {
  yield takeLatest(actionTypes.CREATE_CATEGORY_REQUEST, createCategory);
}

export function* watchForUpdateCategory() {
  yield takeLatest(actionTypes.UPDATE_CATEGORY_REQUEST, updateCategory);
}

export function* watchForDeleteCategory() {
  yield takeLatest(actionTypes.DELETE_CATEGORY_REQUEST, deleteCategory);
}

export default function*() {
  yield all([
    watchForFetchCategories(),
    watchForCreateCategory(),
    watchForUpdateCategory(),
    watchForDeleteCategory(),
  ]);
}

