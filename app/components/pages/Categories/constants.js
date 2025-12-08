import { defineActionTypes } from '@capillarytech/vulcan-react-sdk/utils';

const scope = '/Components/pages/Categories/';

export const actionTypes = defineActionTypes(
  {
    FETCH_CATEGORIES_REQUEST: 'FETCH_CATEGORIES_REQUEST',
    FETCH_CATEGORIES_SUCCESS: 'FETCH_CATEGORIES_SUCCESS',
    FETCH_CATEGORIES_FAILURE: 'FETCH_CATEGORIES_FAILURE',
    SET_SEARCH_FILTER: 'SET_SEARCH_FILTER',
    CLEAR_DATA: 'CLEAR_DATA',
  },
  { prefix: CURRENT_APP_NAME, scope: scope },
);

