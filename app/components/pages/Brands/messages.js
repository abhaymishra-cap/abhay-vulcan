/*
 * Brands Messages
 *
 * This contains all the text for the Brands container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'abhayTest2.components.pages.Brands';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Brands',
  },
  totalBrands: {
    id: `${scope}.totalBrands`,
    defaultMessage: 'Total Brands',
  },
  searchPlaceholder: {
    id: `${scope}.searchPlaceholder`,
    defaultMessage: 'Search brands...',
  },
  addNewBrand: {
    id: `${scope}.addNewBrand`,
    defaultMessage: 'Add new brand',
  },
  brandName: {
    id: `${scope}.brandName`,
    defaultMessage: 'Brand Name',
  },
  parentBrand: {
    id: `${scope}.parentBrand`,
    defaultMessage: 'Parent Brand',
  },
  lastUpdated: {
    id: `${scope}.lastUpdated`,
    defaultMessage: 'Last Updated',
  },
  active: {
    id: `${scope}.active`,
    defaultMessage: 'Active',
  },
  noParent: {
    id: `${scope}.noParent`,
    defaultMessage: '-',
  },
});
