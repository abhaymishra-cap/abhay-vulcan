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
  placeholderText: {
    id: `${scope}.placeholderText`,
    defaultMessage: 'This is a placeholder page. Detailed content will be added in upcoming iterations.',
  },
});
