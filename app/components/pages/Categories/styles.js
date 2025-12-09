import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

export default css`
  .categories-page {
    padding: 24px;
  }

  .categories-header {
    margin-bottom: 24px;
  }

  .categories-summary {
    margin-bottom: 16px;
    color: ${styledVars.CAP_G04 || '#666'};
  }

  .categories-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
  }

  .search-container {
    flex: 1;
    max-width: 400px;
  }

  .action-buttons {
    display: flex;
    gap: 0px;
    align-items: center;
  }

  .category-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #7c3aed;
    color: white;
    font-weight: 600;
    font-size: 12px;
    margin-right: 12px;
  }

  .category-name-container {
    display: flex;
    align-items: center;
  }

  .category-id {
    color: ${styledVars.CAP_G04 || '#666'};
    font-size: 12px;
    margin-left: 8px;
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .status-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #10b981;
  }
`;

