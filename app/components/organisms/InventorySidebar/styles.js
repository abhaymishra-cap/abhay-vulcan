import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

export default css`
  .inventory-sidebar {
    height: 100vh;
    background-color: ${styledVars.CAP_G01 || '#2d3748'}; /* variable is absent - using dark grey */
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    box-sizing: border-box;
  }

  .inventory-sidebar-header {
    margin-bottom: 32px;
  }

  .inventory-sidebar-branding {
    font-size: ${styledVars.CAP_FONT_SIZE_20 || '1.43rem'}; /* variable is absent - using rem with base 14 */
    font-weight: 600;
    line-height: 1.2;
  }

  .inventory-sidebar-branding-inventory {
    color: ${styledVars.CAP_B01 || '#1e40af'}; /* variable is absent - using dark blue */
  }

  .inventory-sidebar-branding-os {
    color: ${styledVars.CAP_B02 || '#3b82f6'}; /* variable is absent - using lighter blue */
  }

  .inventory-sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .inventory-sidebar-nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
    color: ${styledVars.CAP_G05 || '#e2e8f0'}; /* variable is absent - using light grey */
    font-size: ${styledVars.CAP_FONT_SIZE_14 || '1rem'}; /* variable is absent - using rem with base 14 */
  }

  .inventory-sidebar-nav-item:hover {
    background-color: ${styledVars.CAP_G02 || '#4a5568'}; /* variable is absent - using medium grey */
  }

  .inventory-sidebar-nav-item.active {
    background-color: ${styledVars.CAP_G02 || '#4a5568'}; /* variable is absent - using medium grey */
    font-weight: 600;
    color: ${styledVars.CAP_WHITE || '#ffffff'};
  }

  .inventory-sidebar-nav-item-icon {
    font-size: ${styledVars.CAP_FONT_SIZE_18 || '1.29rem'}; /* variable is absent - using rem with base 14 */
  }

  .inventory-sidebar-user {
    margin-top: auto;
    padding-top: 24px;
    border-top: 1px solid ${styledVars.CAP_G03 || '#718096'}; /* variable is absent - using grey */
  }

  .inventory-sidebar-user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }

  .inventory-sidebar-user-name {
    color: ${styledVars.CAP_WHITE || '#ffffff'};
    font-size: ${styledVars.CAP_FONT_SIZE_14 || '1rem'}; /* variable is absent - using rem with base 14 */
    font-weight: 500;
  }

  .inventory-sidebar-user-email {
    color: ${styledVars.CAP_G05 || '#e2e8f0'}; /* variable is absent - using light grey */
    font-size: ${styledVars.CAP_FONT_SIZE_12 || '0.86rem'}; /* variable is absent - using rem with base 14 */
  }

  .inventory-sidebar-user-logout {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    color: ${styledVars.CAP_G05 || '#e2e8f0'}; /* variable is absent - using light grey */
    transition: color 0.2s;
  }

  .inventory-sidebar-user-logout:hover {
    color: ${styledVars.CAP_WHITE || '#ffffff'};
  }
`;
