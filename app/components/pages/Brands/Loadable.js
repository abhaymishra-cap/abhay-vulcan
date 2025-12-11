/**
 *
 * Asynchronously loads the component for Brands
 *
 */

import React, { Suspense } from 'react';
import { loadable } from '@capillarytech/cap-ui-utils';
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
const LoadableComponent = loadable(() => import('./Brands'));

export default () => (
  <Suspense fallback={<CapSpin />}>
    <LoadableComponent />
  </Suspense>
);
