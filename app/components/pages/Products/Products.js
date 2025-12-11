import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { withRouter } from 'react-router';
import { injectIntl, intlShape } from 'react-intl';
import { clearDataOnUnmount, withStyles, getHostApplicationContext } from '@capillarytech/vulcan-react-sdk/utils';
import PageTemplate from '../../templates/PageTemplate';
import InventorySidebar from '../../organisms/InventorySidebar';
import styles from './styles';
import messages from './messages';
import {
  CapRow,
  CapColumn,
  CapHeading,
} from '@capillarytech/cap-ui-library';

function Products(props) {
  const {
    className,
    history,
    appContext,
    intl: { formatMessage },
  } = props;

  // appContext is the prop that needs to be passed from the host application where this component is embedded
  // prepare the final context using SDK and use it in your app
  const finalContext = getHostApplicationContext(appContext);

  const currentRoute = history?.location?.pathname || '/products';

  return (
    <div className={className}>
      <PageTemplate>
        <CapRow gutter={0}>
          <CapColumn span={4}>
            <InventorySidebar history={history} activeRoute={currentRoute} />
          </CapColumn>
          <CapColumn span={20}>
            <div className="products-page">
              <div className="products-header">
                <CapHeading type="h1" level={1}>
                  {formatMessage(messages.header)}
                </CapHeading>
                <div className="products-summary">
                  {formatMessage(messages.placeholderText)}
                </div>
              </div>
            </div>
          </CapColumn>
        </CapRow>
      </PageTemplate>
    </div>
  );
}

Products.propTypes = {
  history: PropTypes.object,
  appContext: PropTypes.object,
  className: PropTypes.string,
  intl: intlShape.isRequired,
};

export default compose(
  withRouter,
  injectIntl,
)(clearDataOnUnmount(withStyles(Products, styles), 'clearData'));
