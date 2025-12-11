/*
 * InventorySidebar Messages
 *
 * This contains all the text for the InventorySidebar component.
 */
import { defineMessages } from 'react-intl';

export const scope = 'abhayTest2.components.organisms.InventorySidebar';

export default defineMessages({
  products: {
    id: `${scope}.products`,
    defaultMessage: 'Products',
  },
  brands: {
    id: `${scope}.brands`,
    defaultMessage: 'Brands',
  },
  categories: {
    id: `${scope}.categories`,
    defaultMessage: 'Categories',
  },
  adminUser: {
    id: `${scope}.adminUser`,
    defaultMessage: 'Admin User',
  },
  adminEmail: {
    id: `${scope}.adminEmail`,
    defaultMessage: 'admin@example.com',
  },
});
