import { css } from 'styled-components';
import * as styledVars from '@capillarytech/cap-ui-library/styled/variables';

export default css`
  .inventory-sidebar {
    position: fixed;
    top: 64px; /* Start below the Capillary Technologies navbar */
    left: 0;
    width: 280px; /* Fixed width for sidebar (approximately 16.67% of viewport) */
    height: calc(100vh - 64px); /* Fill remaining viewport height below navbar */
    background-color: ${styledVars.CAP_WHITE || '#ffffff'}; /* White background to match cap-ui-library */
    display: flex;
    flex-direction: column;
    padding: 24px 16px;
    box-sizing: border-box;
    z-index: 100; /* Ensure sidebar stays above content */
    overflow: hidden; /* Prevent sidebar from scrolling */
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
    color: ${styledVars.CAP_G01 || '#000000'}; /* Black color for Inventory */
  }

  .inventory-sidebar-branding-os {
    color: ${styledVars.CAP_G01 || '#000000'}; /* Black color for OS */
  }

  .inventory-sidebar-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  /* CapMenu component styles */
  .inventory-sidebar-menu {
    background: transparent;
    border: none;
  }

  .inventory-sidebar-menu .ant-menu-item {
    margin: 0 0 8px 0;
    padding: 12px 16px !important;
    border-radius: 8px;
    height: auto;
    line-height: 1.5;
    color: ${styledVars.CAP_G04 || '#666666'};
    font-size: ${styledVars.CAP_FONT_SIZE_14 || '1rem'};
    transition: background-color 0.2s;
    text-align: left;
  }

  .inventory-sidebar-menu .ant-menu-item:hover {
    background-color: ${styledVars.CAP_G06 || '#f7fafc'};
    color: ${styledVars.CAP_G04 || '#666666'};
  }

  .inventory-sidebar-menu .ant-menu-item-selected {
    background-color: #fafafa !important; /* Very subtle off-white background for active state */
    font-weight: 600;
    color: ${styledVars.CAP_G01 || '#2d3748'} !important;
  }

  .inventory-sidebar-menu .ant-menu-item-selected::after {
    display: none; /* Remove default Ant Design selected indicator */
  }

  .inventory-sidebar-menu .ant-menu-item-icon {
    font-size: ${styledVars.CAP_FONT_SIZE_18 || '1.29rem'};
    margin-right: 12px;
  }

  .inventory-sidebar-user {
    margin-top: auto;
    padding-top: 24px;
    border-top: 1px solid ${styledVars.CAP_G06 || '#f7fafc'}; /* Light border for separation */
  }

  .inventory-sidebar-user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-bottom: 12px;
  }

  .inventory-sidebar-user-name {
    color: ${styledVars.CAP_G01 || '#2d3748'}; /* Dark text for light background */
    font-size: ${styledVars.CAP_FONT_SIZE_14 || '1rem'}; /* variable is absent - using rem with base 14 */
    font-weight: 500;
  }

  .inventory-sidebar-user-email {
    color: ${styledVars.CAP_G04 || '#666666'}; /* Medium grey text for light background */
    font-size: ${styledVars.CAP_FONT_SIZE_12 || '0.86rem'}; /* variable is absent - using rem with base 14 */
  }

  .inventory-sidebar-user-logout {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    color: ${styledVars.CAP_G04 || '#666666'}; /* Medium grey for light background */
    transition: color 0.2s;
  }

  .inventory-sidebar-user-logout:hover {
    color: ${styledVars.CAP_B01 || '#1e40af'}; /* Dark blue on hover */
  }
`;
