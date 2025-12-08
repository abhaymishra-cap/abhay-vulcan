/*
 * Categories Messages
 *
 * This contains all the text for the Categories container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'abhayTest2.components.pages.Categories';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'Categories',
  },
  totalCategories: {
    id: `${scope}.totalCategories`,
    defaultMessage: 'Total Categories',
  },
  searchPlaceholder: {
    id: `${scope}.searchPlaceholder`,
    defaultMessage: 'Search categories...',
  },
  addNewCategory: {
    id: `${scope}.addNewCategory`,
    defaultMessage: 'Add new category',
  },
  categoryName: {
    id: `${scope}.categoryName`,
    defaultMessage: 'Category Name',
  },
  parentCategory: {
    id: `${scope}.parentCategory`,
    defaultMessage: 'Parent Category',
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

