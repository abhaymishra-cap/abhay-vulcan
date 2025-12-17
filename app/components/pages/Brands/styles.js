import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

export default css`
  .brands-page {
    margin-left: 60px; /* Account for fixed sidebar width */
    padding: 24px;
    min-height: 100vh;
    background-color: ${styledVars.CAP_WHITE || '#ffffff'};
  }

  .brands-header {
    margin-bottom: 24px;
  }

  .brands-summary {
    margin-bottom: 16px;
    color: ${styledVars.CAP_G04 || '#666'};
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .brands-summary-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #10b981; /* variable is absent - using green */
  }

  .brands-actions {
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

  .brand-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #f97316; /* variable is absent - using light orange/peach */
    color: white;
    font-weight: 600;
    font-size: 12px;
    margin-right: 12px;
  }

  .brand-name-container {
    display: flex;
    align-items: center;
  }

  .brand-id {
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
    background-color: #10b981; /* variable is absent - using green */
  }
`;
