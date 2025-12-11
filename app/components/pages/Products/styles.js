import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

export default css`
  .products-page {
    padding: 24px;
    min-height: 100vh;
    background-color: ${styledVars.CAP_WHITE || '#ffffff'};
  }

  .products-header {
    margin-bottom: 24px;
  }

  .products-summary {
    margin-bottom: 16px;
    color: ${styledVars.CAP_G04 || '#666'};
  }
`;
