import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { withStyles } from '@capillarytech/vulcan-react-sdk/utils';
import { CapIcon } from '@capillarytech/cap-ui-library';
import messages from './messages';
import styles from './styles';

function InventorySidebar({ className, history, activeRoute, intl: { formatMessage } }) {
  const handleNavClick = route => {
    if (history && route) {
      history.push(route);
    }
  };

  const handleLogout = () => {
    // TODO: Implement logout functionality
    console.log('Logout clicked');
  };

  const navItems = [
    {
      key: 'products',
      route: '/products',
      icon: 'box', // Using box icon for Products
      label: formatMessage(messages.products),
    },
    {
      key: 'brands',
      route: '/brands',
      icon: 'tag', // Using tag icon for Brands
      label: formatMessage(messages.brands),
    },
    {
      key: 'categories',
      route: '/categories',
      icon: 'appstore', // Using appstore icon for Categories (stacked boxes)
      label: formatMessage(messages.categories),
    },
  ];

  return (
    <div className={className}>
      <div className="inventory-sidebar">
        <div className="inventory-sidebar-header">
          <div className="inventory-sidebar-branding">
            <span className="inventory-sidebar-branding-inventory">Inventory</span>
            <span className="inventory-sidebar-branding-os">OS</span>
          </div>
        </div>

        <nav className="inventory-sidebar-nav">
          {navItems.map(item => (
            <div
              key={item.key}
              className={`inventory-sidebar-nav-item ${activeRoute === item.route ? 'active' : ''}`}
              onClick={() => handleNavClick(item.route)}
              role="button"
              tabIndex={0}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleNavClick(item.route);
                }
              }}
            >
              <CapIcon type={item.icon} className="inventory-sidebar-nav-item-icon" />
              <span>{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="inventory-sidebar-user">
          <div className="inventory-sidebar-user-info">
            <div className="inventory-sidebar-user-name">{formatMessage(messages.adminUser)}</div>
            <div className="inventory-sidebar-user-email">{formatMessage(messages.adminEmail)}</div>
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
