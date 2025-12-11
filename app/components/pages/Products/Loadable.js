/**
 *
 * Asynchronously loads the component for Products
 *
 */

import React, { Suspense } from 'react';
import { loadable } from '@capillarytech/cap-ui-utils';
import CapSpin from '@capillarytech/cap-ui-library/CapSpin';
const LoadableComponent = loadable(() => import('./Products'));

export default () => (
  <Suspense fallback={<CapSpin />}>
    <LoadableComponent />
  </Suspense>
);
