import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';

/**
 * Transform API brand data (v2 format) to match frontend structure
 */
function transformBrandData(apiBrand) {
  return {
    id: String(apiBrand.id || apiBrand.brandId), // Convert numeric ID to string for frontend
    code: apiBrand.code || `B${String(apiBrand.id || apiBrand.brandId).padStart(3, '0')}`, // Generate code like B001, B002
    name: apiBrand.name || apiBrand.brandName || '',
    initials: getInitials(apiBrand.name || apiBrand.brandName || ''),
    parentBrand: apiBrand.parent?.name || apiBrand.parentBrand || apiBrand.parentBrandName || null,
    parentBrandId: apiBrand.parent?.id ? String(apiBrand.parent.id) : (apiBrand.parentBrandId || apiBrand.parentId || null),
    lastUpdated: formatDate(apiBrand.attribution?.modifiedDate || apiBrand.attribution?.updatedDate || apiBrand.updatedAt || apiBrand.lastUpdated || apiBrand.modifiedAt),
    status: 'Active', // Default to Active since v2 API doesn't provide status
    description: apiBrand.description || '',
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
 * Get initials from brand name
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
 * Fetch brands from API (v2 API structure)
 */
export function* fetchBrands({ params = {} }) {
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
      includeChildren: params.includeChildren,
      childrenLimit: params.childrenLimit,
      childrenOffset: params.childrenOffset,
      ouCode: params.ouCode,
      fetchType: params.fetchType,
    };
    
    const response = yield call(Api.getBrands, apiParams);
    
    // v2 API response structure: { data: [...], pagination: {...}, warnings: [...] }
    if (response && response.data) {
      const brands = Array.isArray(response.data) ? response.data : [];
      
      // Transform API data to match frontend structure
      const transformedBrands = brands.map(transformBrandData);
      
      yield put({
        type: actionTypes.FETCH_BRANDS_SUCCESS,
        data: transformedBrands,
        pagination: response.pagination || {},
      });
    } else {
      yield put({
        type: actionTypes.FETCH_BRANDS_FAILURE,
        error: response?.message || response?.error || 'Failed to fetch brands',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_BRANDS_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Create a new brand (v2 API structure)
 */
export function* createBrand({ brandData }) {
  try {
    const response = yield call(Api.createBrand, brandData);
    
    // v2 API response: { data: {...} } (no success field)
    if (response && response.data) {
      // Refresh brands list
      yield put({ type: actionTypes.FETCH_BRANDS_REQUEST });
      
      yield put({
        type: actionTypes.CREATE_BRAND_SUCCESS,
        data: response.data,
      });
    } else {
      yield put({
        type: actionTypes.CREATE_BRAND_FAILURE,
        error: response?.message || response?.error || 'Failed to create brand',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.CREATE_BRAND_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Update an existing brand (v2 API structure)
 */
export function* updateBrand({ brandId, brandData }) {
  try {
    const response = yield call(Api.updateBrand, brandId, brandData);
    
    // v2 API response: { data: {...} } (no success field)
    if (response && response.data) {
      // Refresh brands list
      yield put({ type: actionTypes.FETCH_BRANDS_REQUEST });
      
      yield put({
        type: actionTypes.UPDATE_BRAND_SUCCESS,
        data: response.data,
      });
    } else {
      yield put({
        type: actionTypes.UPDATE_BRAND_FAILURE,
        error: response?.message || response?.error || 'Failed to update brand',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.UPDATE_BRAND_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Delete a brand (v2 API structure)
 */
export function* deleteBrand({ brandId }) {
  try {
    const response = yield call(Api.deleteBrand, brandId);
    
    // v2 API may return 200 status or { message: "..." } (no success field)
    // Consider it successful if no error is thrown
    if (!response || response.message || response.status === 200) {
      yield put({
        type: actionTypes.DELETE_BRAND_SUCCESS,
        brandId,
      });
      
      // Refresh brands list
      yield put({ type: actionTypes.FETCH_BRANDS_REQUEST });
    } else {
      yield put({
        type: actionTypes.DELETE_BRAND_FAILURE,
        error: response?.message || response?.error || 'Failed to delete brand',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.DELETE_BRAND_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

// Watchers
export function* watchForFetchBrands() {
  yield takeLatest(actionTypes.FETCH_BRANDS_REQUEST, fetchBrands);
}

export function* watchForCreateBrand() {
  yield takeLatest(actionTypes.CREATE_BRAND_REQUEST, createBrand);
}

export function* watchForUpdateBrand() {
  yield takeLatest(actionTypes.UPDATE_BRAND_REQUEST, updateBrand);
}

export function* watchForDeleteBrand() {
  yield takeLatest(actionTypes.DELETE_BRAND_REQUEST, deleteBrand);
}

export default function*() {
  yield all([
    watchForFetchBrands(),
    watchForCreateBrand(),
    watchForUpdateBrand(),
    watchForDeleteBrand(),
  ]);
}
