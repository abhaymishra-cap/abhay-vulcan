/*
 * Products Messages
 *
 * This contains all the text for the Products container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'abhayTest2.components.pages.Products';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Products',
  },
  totalProducts: {
    id: `${scope}.totalProducts`,
    defaultMessage: 'Total Products',
  },
  returnable: {
    id: `${scope}.returnable`,
    defaultMessage: 'Returnable',
  },
  searchPlaceholder: {
    id: `${scope}.searchPlaceholder`,
    defaultMessage: 'Search (Enter at least 3 characters)',
  },
  searchMinLengthError: {
    id: `${scope}.searchMinLengthError`,
    defaultMessage: 'Please enter at least 3 characters',
  },
  addNewProduct: {
    id: `${scope}.addNewProduct`,
    defaultMessage: 'Add new product',
  },
  productName: {
    id: `${scope}.productName`,
    defaultMessage: 'Name',
  },
  brand: {
    id: `${scope}.brand`,
    defaultMessage: 'Brand',
  },
  category: {
    id: `${scope}.category`,
    defaultMessage: 'Category',
  },
  attributes: {
    id: `${scope}.attributes`,
    defaultMessage: 'Attributes',
  },
  lastUpdated: {
    id: `${scope}.lastUpdated`,
    defaultMessage: 'Last Updated',
  },
  returnableStatus: {
    id: `${scope}.returnableStatus`,
    defaultMessage: 'Returnable',
  },
  standardStatus: {
    id: `${scope}.standardStatus`,
    defaultMessage: 'Standard',
  },
  brandFilter: {
    id: `${scope}.brandFilter`,
    defaultMessage: 'Brand',
  },
  categoryFilter: {
    id: `${scope}.categoryFilter`,
    defaultMessage: 'Category',
  },
  allBrands: {
    id: `${scope}.allBrands`,
    defaultMessage: 'All Brands',
  },
  allCategories: {
    id: `${scope}.allCategories`,
    defaultMessage: 'All Categories',
  },
  attributesCount: {
    id: `${scope}.attributesCount`,
    defaultMessage: '{count} attributes',
  },
  previousPage: {
    id: `${scope}.previousPage`,
    defaultMessage: 'Previous',
  },
  nextPage: {
    id: `${scope}.nextPage`,
    defaultMessage: 'Next',
  },
  pageInfo: {
    id: `${scope}.pageInfo`,
    defaultMessage: 'Showing {start}-{end} of {total}',
  },
});
