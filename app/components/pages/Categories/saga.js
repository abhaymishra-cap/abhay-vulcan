import { all, call, put, takeLatest } from 'redux-saga/effects';
import * as Api from '../../../services/api';
import { actionTypes } from './constants';

// Mock data - in real app, this would come from API
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

export function* fetchCategories() {
  try {
    // In a real app, this would be an API call:
    // const response = yield call(Api.getCategories);
    // yield put({ type: actionTypes.FETCH_CATEGORIES_SUCCESS, data: response.data });
    
    // For now, using mock data
    yield put({
      type: actionTypes.FETCH_CATEGORIES_SUCCESS,
      data: mockCategories,
    });
  } catch (error) {
    yield put({
      type: actionTypes.FETCH_CATEGORIES_FAILURE,
      error: error.message,
    });
  }
}

export function* watchForFetchCategories() {
  yield takeLatest(actionTypes.FETCH_CATEGORIES_REQUEST, fetchCategories);
}

export default function*() {
  yield all([watchForFetchCategories()]);
}

