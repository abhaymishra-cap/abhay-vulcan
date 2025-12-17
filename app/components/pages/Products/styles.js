import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

export default css`
  .products-page {
    margin-left: 60px; /* Account for fixed sidebar width */
    padding: 24px;
    min-height: 100vh;
    background-color: ${styledVars.CAP_WHITE || '#ffffff'};
  }

  .products-header {
    margin-bottom: 24px;
  }

  .products-summary {
    display: flex;
    gap: 24px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .products-summary-stat {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${styledVars.CAP_G04 || '#666'};
  }

  .products-summary-dot-green {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #10b981; /* variable is absent - using green */
  }

  .products-summary-dot-orange {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #f97316; /* variable is absent - using orange */
  }

  .products-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    gap: 16px;
    flex-wrap: wrap;
  }

  .search-container {
    flex: 1;
    max-width: 400px;
    min-width: 200px;
  }

  .filters-container {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .filter-dropdown {
    min-width: 150px;
  }

  .action-buttons {
    display: flex;
    gap: 0px;
    align-items: center;
  }

  .product-image {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    object-fit: cover;
    margin-right: 12px;
    background-color: ${styledVars.CAP_G06 || '#f7fafc'}; /* variable is absent - using light grey */
  }

  .product-name-container {
    display: flex;
    align-items: center;
  }

  .product-name {
    font-weight: 600;
    margin-bottom: 4px;
  }

  .product-sku {
    color: ${styledVars.CAP_G04 || '#666'};
    font-size: ${styledVars.CAP_FONT_SIZE_12 || '0.86rem'}; /* variable is absent - using rem with base 14 */
  }

  .status-indicator {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  .status-dot-returnable {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #10b981; /* variable is absent - using green */
  }

  .status-dot-standard {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${styledVars.CAP_G04 || '#9ca3af'}; /* variable is absent - using gray */
  }

  .attributes-count {
    color: ${styledVars.CAP_G04 || '#666'};
  }

  .search-error-message {
    color: ${styledVars.CAP_R01 || '#ef4444'}; /* variable is absent - using red */
    font-size: ${styledVars.CAP_FONT_SIZE_12 || '0.86rem'}; /* variable is absent - using rem with base 14 */
    margin-top: 4px;
  }
`;
