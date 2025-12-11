import { apiCaller } from '@capillarytech/vulcan-react-sdk/utils';
import endpoints from '../config/endpoints';
import { loginPageUrl } from '../config/path';
import * as requestConstructor from './requestConstructor';
import { i18n, appType, appName } from '../../app-config';
import { IS_PROD } from '../config/constants';

const { getVulcanAPICallObject, getAryaAPICallObject } = requestConstructor;

function redirectIfUnauthenticated(response) {
  const { removeAuthenticationDetais } = require('../utils/authWrapper');
  const isUnauthorized = response.status === 401;
  const isLoginPage = window.location.pathname.indexOf('/login') !== -1;
  const isAryaAuthUserCall =
    response.url.split('auth')[1] &&
    response.url.split('auth')[1].split('?')[0] === '/user';
  const isAuthUserCall =
    response.url.split('/api/v1')[1] &&
    response.url.split('/api/v1')[1].split('?')[0] === '/authenticate';
  if (isUnauthorized) {
    if (IS_PROD) {
      removeAuthenticationDetais();
      const isEmbedded = 
        appType !== 'external' && 
        localStorage.getItem(`${appName}__isStandalone`) !== 'true';
      if (isEmbedded) {
        window.location.href = loginPageUrl();
      }
    } else {
      if (isLoginPage && (isAuthUserCall || isAryaAuthUserCall)) return;
      removeAuthenticationDetais();
    }
  }
}

// dummy for prepareVulcanSuccessResponseStructure function

const httpRequest = apiCaller.initializeApiCaller({
  redirectIfUnauthenticated,
  sendVulcanMetricHeaders: true, // config to capture metrics for all calls made, always send this as true
  // skipTimestampQuery: false, // config to skip timestamp query for all, do for individual api calls where required
  // skipRedirectIfUnauthenticated: false, // config to skip the redirection on 401
  // timeout: 60000, // config to set timeout for all api calls, default 1 min, increase if required
  // hideAllErrors: false, // config to hide all errors from api calls, do for individual api calls where required
  // skipParsingJson: false, // config to skip parsing json for all api calls, do for individual api calls where required
  // useResponseCompression: false, // config to use response compression for all api calls, do for individual api calls where required
  // overriddenShowError: function(error, singleErrorOption) {
  //   // return false to suppress error.
  //   // return true to let apiCaller.js handle the notification.
  //   // return an object with message and severity to display a custom message and severity.
  //   // return an object with errorToProcess(Error object) to process the error object.
  //   // Assign singleErrorOption.message to the message property of the object to display a custom message, this will override the default message.
  // sample Error object:
  //    // {
  //    //  status: 404,
  //    //  message: 'Not Found',
  //    //  result: {
  //    //    errorMessage: 'Not Found',
  //    //  },
  //    // }
  //   return true;
  // },
});

export const getLocizeMessage = async locale => {
  const url = `${endpoints.vulcan_endpoint}/translations/${locale}?skipCommonTranslations=false`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

export const getSupportedLocales = () => {
  const url = `${endpoints.arya_endpoint}/translations/supportedLocales`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

export const logout = () => {
  const url = `${endpoints.arya_endpoint}/auth/logout`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

export const changeProxyOrg = orgId => {
  const url = `${endpoints.arya_endpoint}/auth/setProxy/${orgId}`;
  return httpRequest(url, getAryaAPICallObject('Post'));
};

export const getUserData = async () => {
  const url = `${endpoints.vulcan_endpoint}/authenticate`;
  return httpRequest(url, getVulcanAPICallObject('GET'));
};

// Sample request for calling intouch apis, same can be followed for xaja, extension apis
export const getCustomerData = (customerId) => {
  const url = `${endpoints.vulcan_endpoint}/intouch/v2/customers/${customerId}`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

// Product Categories v2 API endpoints
// Check if we should use mock API (development mode)
const USE_MOCK_API = process.env.REACT_APP_USE_MOCK_API === 'true';
const MOCK_API_BASE = 'http://localhost:3001/api/v1';

/**
 * Get all product categories (v2 API)
 * @param {object} params - Query parameters { q, limit, offset, root, entityCodes, entityIds, sortBy, sortOrder }
 * @returns {Promise} API response with structure { data: [...], pagination: {...} }
 */
export const getCategories = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Search parameter (q) - case-insensitive search by code/name
  if (params.q) {
    queryParams.append('q', params.q);
  }
  
  // Pagination
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit);
  }
  if (params.offset !== undefined) {
    queryParams.append('offset', params.offset);
  }
  
  // Filters
  if (params.root !== undefined) {
    queryParams.append('root', params.root);
  }
  if (params.entityCodes) {
    queryParams.append('entityCodes', params.entityCodes);
  }
  if (params.entityIds) {
    queryParams.append('entityIds', params.entityIds);
  }
  
  // Sorting
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }
  
  // Add time parameter for cache-busting (timestamp in milliseconds)
  if (!USE_MOCK_API) {
    queryParams.append('time', Date.now());
  }
  
  const queryString = queryParams.toString();
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_categories_api_endpoint;
  const url = `${baseUrl}/categories${queryString ? `?${queryString}` : ''}`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

/**
 * Get single category by ID (v2 API)
 * @param {string|number} categoryId
 * @param {object} params - Optional parameters { includeChildren, childrenLimit, childrenOffset }
 * @returns {Promise}
 */
export const getCategoryById = (categoryId, params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.includeChildren !== undefined) {
    queryParams.append('includeChildren', params.includeChildren);
  }
  if (params.childrenLimit !== undefined) {
    queryParams.append('childrenLimit', params.childrenLimit);
  }
  if (params.childrenOffset !== undefined) {
    queryParams.append('childrenOffset', params.childrenOffset);
  }
  
  const queryString = queryParams.toString();
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_categories_api_endpoint;
  const url = `${baseUrl}/categories/${categoryId}${queryString ? `?${queryString}` : ''}`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

/**
 * Create new category (v2 API)
 * Note: v2 API may have different structure - update when API contract is available
 * @param {object} categoryData - { code, name, parentId, description }
 * @returns {Promise}
 */
export const createCategory = (categoryData) => {
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_categories_api_endpoint;
  const url = `${baseUrl}/categories`;
  return httpRequest(url, getAryaAPICallObject('POST', categoryData));
};

/**
 * Update category (v2 API)
 * Note: v2 API may have different structure - update when API contract is available
 * @param {string|number} categoryId
 * @param {object} categoryData
 * @returns {Promise}
 */
export const updateCategory = (categoryId, categoryData) => {
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_categories_api_endpoint;
  const url = `${baseUrl}/categories/${categoryId}`;
  return httpRequest(url, getAryaAPICallObject('PUT', categoryData));
};

/**
 * Delete category (v2 API)
 * Note: v2 API may have different structure - update when API contract is available
 * @param {string|number} categoryId
 * @returns {Promise}
 */
export const deleteCategory = (categoryId) => {
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_categories_api_endpoint;
  const url = `${baseUrl}/categories/${categoryId}`;
  return httpRequest(url, getAryaAPICallObject('DELETE'));
};

// Product Brands v2 API endpoints

/**
 * Get all product brands (v2 API)
 * @param {object} params - Query parameters { q, limit, offset, root, entityCodes, entityIds, sortBy, sortOrder, includeChildren, childrenLimit, childrenOffset, ouCode, fetchType }
 * @returns {Promise} API response with structure { data: [...], pagination: {...}, warnings: [...] }
 */
export const getBrands = (params = {}) => {
  const queryParams = new URLSearchParams();
  
  // Search parameter (q) - case-insensitive search by code/name
  if (params.q) {
    queryParams.append('q', params.q);
  }
  
  // Pagination
  if (params.limit !== undefined) {
    queryParams.append('limit', params.limit);
  }
  if (params.offset !== undefined) {
    queryParams.append('offset', params.offset);
  }
  
  // Filters
  if (params.root !== undefined) {
    queryParams.append('root', params.root);
  }
  if (params.entityCodes) {
    queryParams.append('entityCodes', params.entityCodes);
  }
  if (params.entityIds) {
    queryParams.append('entityIds', params.entityIds);
  }
  
  // Sorting
  if (params.sortBy) {
    queryParams.append('sortBy', params.sortBy);
  }
  if (params.sortOrder) {
    queryParams.append('sortOrder', params.sortOrder);
  }
  
  // Hierarchy
  if (params.includeChildren !== undefined) {
    queryParams.append('includeChildren', params.includeChildren);
  }
  if (params.childrenLimit !== undefined) {
    queryParams.append('childrenLimit', params.childrenLimit);
  }
  if (params.childrenOffset !== undefined) {
    queryParams.append('childrenOffset', params.childrenOffset);
  }
  
  // OU and fetch type
  if (params.ouCode) {
    queryParams.append('ouCode', params.ouCode);
  }
  if (params.fetchType) {
    queryParams.append('fetchType', params.fetchType);
  }
  
  // Add time parameter for cache-busting (timestamp in milliseconds)
  if (!USE_MOCK_API) {
    queryParams.append('time', Date.now());
  }
  
  const queryString = queryParams.toString();
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_brands_api_endpoint;
  const url = `${baseUrl}/brands${queryString ? `?${queryString}` : ''}`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

/**
 * Get single brand by ID (v2 API)
 * @param {string|number} brandId
 * @param {object} params - Optional parameters { includeChildren, childrenLimit, childrenOffset }
 * @returns {Promise}
 */
export const getBrandById = (brandId, params = {}) => {
  const queryParams = new URLSearchParams();
  if (params.includeChildren !== undefined) {
    queryParams.append('includeChildren', params.includeChildren);
  }
  if (params.childrenLimit !== undefined) {
    queryParams.append('childrenLimit', params.childrenLimit);
  }
  if (params.childrenOffset !== undefined) {
    queryParams.append('childrenOffset', params.childrenOffset);
  }
  
  const queryString = queryParams.toString();
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_brands_api_endpoint;
  const url = `${baseUrl}/brands/${brandId}${queryString ? `?${queryString}` : ''}`;
  return httpRequest(url, getAryaAPICallObject('GET'));
};

/**
 * Create new brand (v2 API)
 * @param {object} brandData - { code, name, parentId, description }
 * @returns {Promise}
 */
export const createBrand = (brandData) => {
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_brands_api_endpoint;
  const url = `${baseUrl}/brands`;
  return httpRequest(url, getAryaAPICallObject('POST', brandData));
};

/**
 * Update brand (v2 API)
 * @param {string|number} brandId
 * @param {object} brandData
 * @returns {Promise}
 */
export const updateBrand = (brandId, brandData) => {
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_brands_api_endpoint;
  const url = `${baseUrl}/brands/${brandId}`;
  return httpRequest(url, getAryaAPICallObject('PUT', brandData));
};

/**
 * Delete brand (v2 API)
 * @param {string|number} brandId
 * @returns {Promise}
 */
export const deleteBrand = (brandId) => {
  const baseUrl = USE_MOCK_API ? MOCK_API_BASE : endpoints.product_brands_api_endpoint;
  const url = `${baseUrl}/brands/${brandId}`;
  return httpRequest(url, getAryaAPICallObject('DELETE'));
};
