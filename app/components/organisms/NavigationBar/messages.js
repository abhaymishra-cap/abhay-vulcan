/*
 * NavigationBar Messages
 *
 * This contains all the text for the NavigationBar component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'abhayTest2.components.organisms.NavigationBar';

export default defineMessages({
  selectedProductDefault: {
    id: `${scope}.selectedProductDefault`,
    defaultMessage: 'abhay-test2',
  },
  orgSettings: {
    id: `${scope}.orgSettings`,
    defaultMessage: 'Organisation settings',
  },
  logout: {
    id: `${scope}.logout`,
    defaultMessage: 'Logout',
  },
  noProductSetting: {
    id: `${scope}.noProductSetting`,
    defaultMessage:
      'There are no product settings. Organisation settings are available under profile on the right.',
  },
});
