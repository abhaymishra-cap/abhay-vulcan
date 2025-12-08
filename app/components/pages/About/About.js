/**
 *
 * About
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose, bindActionCreators } from 'redux';

import { injectSaga, injectReducer, clearDataOnUnmount, withStyles, getHostApplicationContext } from '@capillarytech/vulcan-react-sdk/utils';
import makeSelectAbout from './selectors';
import * as actions from './actions';
import reducer from './reducer';
import saga from './saga';
import messages from './messages';
import styles from './styles';

function About(props) {
  const { className, actions, history, appContext } = props;
  // appContext is the prop that needs to be passed from the host application where this component is embedded
  // prepare the final context using SDK and use it in your app
  const finalContext = getHostApplicationContext(appContext);

  return (
    <div className={className}>
      <Helmet>
        <title>Heading - About</title>
        <meta name="description" content="Description of About" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

About.propTypes = {
  history: PropTypes.object,
  appContext: PropTypes.object,
  actions: PropTypes.object,
  className: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  about: makeSelectAbout(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};
const withConnect = connect(mapStateToProps, mapDispatchToProps);

//Do not remove your appName hash from here.
const withReducer = injectReducer({ key: `${CURRENT_APP_NAME}-about`, reducer });
//Do not remove your appName hash from here.
const withSaga = injectSaga({ key: `${CURRENT_APP_NAME}-about`, saga });

export default compose(
  withRouter,
  withReducer,
  withSaga,
  withConnect,
)(clearDataOnUnmount(withStyles(About, styles), "clearData"));
