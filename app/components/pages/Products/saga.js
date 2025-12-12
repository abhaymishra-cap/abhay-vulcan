import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';

/**
 * Transform API product data (v2 format) to match frontend structure
 */
function transformProductData(apiProduct) {
  return {
    id: String(apiProduct.id || apiProduct.productId),
    name: apiProduct.name || apiProduct.productName || '',
    sku: apiProduct.sku || apiProduct.code || `SKU-${String(apiProduct.id || apiProduct.productId).padStart(4, '0')}`,
    image: apiProduct.image || apiProduct.imageUrl || apiProduct.thumbnail || null,
    brand: apiProduct.brand?.name || apiProduct.brandName || null,
    brandId: apiProduct.brand?.id ? String(apiProduct.brand.id) : (apiProduct.brandId ? String(apiProduct.brandId) : null),
    category: apiProduct.category?.name || apiProduct.categoryName || null,
    categoryId: apiProduct.category?.id ? String(apiProduct.category.id) : (apiProduct.categoryId ? String(apiProduct.categoryId) : null),
    attributes: apiProduct.attributes || apiProduct.attributeList || [],
    attributesCount: Array.isArray(apiProduct.attributes) ? apiProduct.attributes.length : (apiProduct.attributesCount || apiProduct.attributeCount || 0),
    lastUpdated: formatDate(apiProduct.attribution?.modifiedDate || apiProduct.attribution?.updatedDate || apiProduct.updatedAt || apiProduct.lastUpdated || apiProduct.modifiedAt),
    status: determineStatus(apiProduct.status || apiProduct.productStatus || apiProduct.isReturnable),
    description: apiProduct.description || '',
  };
}

/**
 * Determine product status from API data
 */
function determineStatus(statusOrIsReturnable) {
  if (typeof statusOrIsReturnable === 'boolean') {
    return statusOrIsReturnable ? 'Returnable' : 'Standard';
  }
  if (typeof statusOrIsReturnable === 'string') {
    const statusLower = statusOrIsReturnable.toLowerCase();
    if (statusLower === 'returnable' || statusLower === 'return') {
      return 'Returnable';
    }
    return 'Standard';
  }
  return 'Standard'; // Default to Standard
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
 * Transform brand data for filter dropdown
 */
function transformBrandForFilter(apiBrand) {
  return {
    value: String(apiBrand.id),
    label: apiBrand.name || apiBrand.brandName || '',
  };
}

/**
 * Transform category data for filter dropdown
 */
function transformCategoryForFilter(apiCategory) {
  return {
    value: String(apiCategory.id),
    label: apiCategory.name || apiCategory.categoryName || '',
  };
}

/**
 * Fetch products from API (v2 API structure)
 */
export function* fetchProducts({ params = {} }) {
  try {
    // Build API params from action params
    const apiParams = {
      q: params.q,
      limit: params.limit || 10,
      offset: params.offset || 0,
      brandId: params.brandId,
      categoryId: params.categoryId,
      status: params.status,
      sortBy: params.sortBy || 'id',
      sortOrder: params.sortOrder || 'ASC',
    };
    
    const response = yield call(Api.getProducts, apiParams);
    
    // v2 API response structure: { data: [...], pagination: {...}, warnings: [...] }
    if (response && response.data) {
      const products = Array.isArray(response.data) ? response.data : [];
      
      // Transform API data to match frontend structure
      const transformedProducts = products.map(transformProductData);
      
      yield put({
        type: actionTypes.FETCH_PRODUCTS_SUCCESS,
        data: transformedProducts,
        pagination: response.pagination || {},
      });
    } else {
      yield put({
        type: actionTypes.FETCH_PRODUCTS_FAILURE,
        error: response?.message || response?.error || 'Failed to fetch products',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_PRODUCTS_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Fetch brands for filter dropdown
 */
export function* fetchBrandsForFilter() {
  try {
    const response = yield call(Api.getBrands, { limit: 100, offset: 0 });
    
    if (response && response.data) {
      const brands = Array.isArray(response.data) ? response.data : [];
      const transformedBrands = brands.map(transformBrandForFilter);
      
      yield put({
        type: actionTypes.FETCH_BRANDS_FOR_FILTER_SUCCESS,
        data: transformedBrands,
      });
    }
  } catch (error) {
    // Silently fail - filters are optional
    console.error('Failed to fetch brands for filter:', error);
  }
}

/**
 * Fetch categories for filter dropdown
 */
export function* fetchCategoriesForFilter() {
  try {
    const response = yield call(Api.getCategories, { limit: 100, offset: 0 });
    
    if (response && response.data) {
      const categories = Array.isArray(response.data) ? response.data : [];
      const transformedCategories = categories.map(transformCategoryForFilter);
      
      yield put({
        type: actionTypes.FETCH_CATEGORIES_FOR_FILTER_SUCCESS,
        data: transformedCategories,
      });
    }
  } catch (error) {
    // Silently fail - filters are optional
    console.error('Failed to fetch categories for filter:', error);
  }
}

/**
 * Create a new product (v2 API structure)
 */
export function* createProduct({ productData }) {
  try {
    const response = yield call(Api.createProduct, productData);
    
    if (response && response.data) {
      // Refresh products list
      yield put({ type: actionTypes.FETCH_PRODUCTS_REQUEST });
      
      yield put({
        type: actionTypes.CREATE_PRODUCT_SUCCESS,
        data: response.data,
      });
    } else {
      yield put({
        type: actionTypes.CREATE_PRODUCT_FAILURE,
        error: response?.message || response?.error || 'Failed to create product',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.CREATE_PRODUCT_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Update an existing product (v2 API structure)
 */
export function* updateProduct({ productId, productData }) {
  try {
    const response = yield call(Api.updateProduct, productId, productData);
    
    if (response && response.data) {
      // Refresh products list
      yield put({ type: actionTypes.FETCH_PRODUCTS_REQUEST });
      
      yield put({
        type: actionTypes.UPDATE_PRODUCT_SUCCESS,
        data: response.data,
      });
    } else {
      yield put({
        type: actionTypes.UPDATE_PRODUCT_FAILURE,
        error: response?.message || response?.error || 'Failed to update product',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.UPDATE_PRODUCT_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

/**
 * Delete a product (v2 API structure)
 */
export function* deleteProduct({ productId }) {
  try {
    const response = yield call(Api.deleteProduct, productId);
    
    if (!response || response.message || response.status === 200) {
      yield put({
        type: actionTypes.DELETE_PRODUCT_SUCCESS,
        productId,
      });
      
      // Refresh products list
      yield put({ type: actionTypes.FETCH_PRODUCTS_REQUEST });
    } else {
      yield put({
        type: actionTypes.DELETE_PRODUCT_FAILURE,
        error: response?.message || response?.error || 'Failed to delete product',
      });
    }
  } catch (error) {
    yield put({
      type: actionTypes.DELETE_PRODUCT_FAILURE,
      error: error.message || 'Network error occurred',
    });
  }
}

// Watchers
export function* watchForFetchProducts() {
  yield takeLatest(actionTypes.FETCH_PRODUCTS_REQUEST, fetchProducts);
}

export function* watchForFetchBrandsForFilter() {
  yield takeLatest(actionTypes.FETCH_BRANDS_FOR_FILTER_REQUEST, fetchBrandsForFilter);
}

export function* watchForFetchCategoriesForFilter() {
  yield takeLatest(actionTypes.FETCH_CATEGORIES_FOR_FILTER_REQUEST, fetchCategoriesForFilter);
}

export function* watchForCreateProduct() {
  yield takeLatest(actionTypes.CREATE_PRODUCT_REQUEST, createProduct);
}

export function* watchForUpdateProduct() {
  yield takeLatest(actionTypes.UPDATE_PRODUCT_REQUEST, updateProduct);
}

export function* watchForDeleteProduct() {
  yield takeLatest(actionTypes.DELETE_PRODUCT_REQUEST, deleteProduct);
}

export default function*() {
  yield all([
    watchForFetchProducts(),
    watchForFetchBrandsForFilter(),
    watchForFetchCategoriesForFilter(),
    watchForCreateProduct(),
    watchForUpdateProduct(),
    watchForDeleteProduct(),
  ]);
}
