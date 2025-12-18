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
  addBrandModalTitle: {
    id: `${scope}.addBrandModalTitle`,
    defaultMessage: 'Add New Brand',
  },
  brandCode: {
    id: `${scope}.brandCode`,
    defaultMessage: 'Brand Code',
  },
  brandCodePlaceholder: {
    id: `${scope}.brandCodePlaceholder`,
    defaultMessage: 'Enter brand code',
  },
  brandNamePlaceholder: {
    id: `${scope}.brandNamePlaceholder`,
    defaultMessage: 'Enter brand name',
  },
  description: {
    id: `${scope}.description`,
    defaultMessage: 'Description',
  },
  descriptionPlaceholder: {
    id: `${scope}.descriptionPlaceholder`,
    defaultMessage: 'Enter brand description (optional)',
  },
  submit: {
    id: `${scope}.submit`,
    defaultMessage: 'Submit',
  },
  cancel: {
    id: `${scope}.cancel`,
    defaultMessage: 'Cancel',
  },
  codeRequired: {
    id: `${scope}.codeRequired`,
    defaultMessage: 'Brand code is required',
  },
  nameRequired: {
    id: `${scope}.nameRequired`,
    defaultMessage: 'Brand name is required',
  },
  createSuccess: {
    id: `${scope}.createSuccess`,
    defaultMessage: 'Brand created successfully',
  },
  createError: {
    id: `${scope}.createError`,
    defaultMessage: 'Failed to create brand',
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
