import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import { CapIcon, CapMenu, CapHeading } from '@capillarytech/cap-ui-library';
import messages from './messages';
import styles from './styles';

function InventorySidebar({ className, history, activeRoute, intl: { formatMessage } }) {
  // Map activeRoute to selectedMenuItem key
  const routeToKeyMap = {
    '/products': 'products',
    '/brands': 'brands',
    '/categories': 'categories',
  };

  const selectedMenuItem = routeToKeyMap[activeRoute] || '';

  // Map menu keys to routes
  const keyToRouteMap = {
    products: '/products',
    brands: '/brands',
    categories: '/categories',
  };

  // Handle menu item click
  const handleMenuClick = ({ key }) => {
    const route = keyToRouteMap[key];
    if (history && route) {
      history.push(route);
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  return (
    <div className={className}>
      <div className="inventory-sidebar">
        <div className="inventory-sidebar-header">
          <CapHeading type="h2" className="inventory-sidebar-branding">
            <span className="inventory-sidebar-branding-inventory">Inventory</span>
            <span className="inventory-sidebar-branding-os">OS</span>
          </CapHeading>
        </div>

        <div className="inventory-sidebar-nav">
          <CapMenu
            selectedKeys={selectedMenuItem ? [selectedMenuItem] : []}
            onClick={handleMenuClick}
            mode="vertical"
            className="inventory-sidebar-menu"
          >
            <CapMenu.Item key="products" icon={<CapIcon type="box" />}>
              {formatMessage(messages.products)}
            </CapMenu.Item>
            <CapMenu.Item key="brands" icon={<CapIcon type="tag" />}>
              {formatMessage(messages.brands)}
            </CapMenu.Item>
            <CapMenu.Item key="categories" icon={<CapIcon type="appstore" />}>
              {formatMessage(messages.categories)}
            </CapMenu.Item>
          </CapMenu>
        </div>

        <div className="inventory-sidebar-user">
          <div className="inventory-sidebar-user-info">
            <CapHeading type="h5" className="inventory-sidebar-user-name">
              {formatMessage(messages.adminUser)}
            </CapHeading>
            <CapHeading type="h6" className="inventory-sidebar-user-email">
              {formatMessage(messages.adminEmail)}
            </CapHeading>
          </div>
          <div
            className="inventory-sidebar-user-logout"
            onClick={handleLogout}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleLogout();
              }
            }}
          >
            <CapIcon type="arrow-right" />
          </div>
        </div>
      </div>
    </div>
  );
}

InventorySidebar.propTypes = {
  className: PropTypes.string,
  history: PropTypes.object,
  activeRoute: PropTypes.string,
  intl: intlShape.isRequired,
};

export default injectIntl(withStyles(InventorySidebar, styles));
