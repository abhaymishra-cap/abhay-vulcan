import React from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { injectSaga, injectReducer, clearDataOnUnmount, withStyles, getHostApplicationContext } from '@capillarytech/vulcan-react-sdk/utils';
import PageTemplate from '../../templates/PageTemplate';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';
import { makeSelectDashboard } from './selectors'
import { CapRow, CapColumn } from '@capillarytech/cap-ui-library'

function Dashboard(props) {
  const { className, actions, history, appContext } = props;
  // appContext is the prop that needs to be passed from the host application where this component is embedded
  // prepare the final context using SDK and use it in your app
  const finalContext = getHostApplicationContext(appContext);
  return (
    <div className={className}>
      <PageTemplate>
        <h1>Start editing your files. <br/>You have few routes available to you in routes.js for your reference.</h1>
        <h2>This is your Dashboard page</h2>
        <br/>
        <br/>
        <br/>
        <CapRow>
          <CapColumn span={4}><Link to="/home">Go to Home</Link></CapColumn>
        </CapRow>
      </PageTemplate>
    </div>
  );
};

Dashboard.propTypes = {
  history: PropTypes.object,
  appContext: PropTypes.object,
  actions: PropTypes.object,
  className: PropTypes.string,
};

const mapStateToProps = createStructuredSelector({
  dashboard: makeSelectDashboard()
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

//Do not remove your appName hash from here.
const withSaga = injectSaga({ key: `${CURRENT_APP_NAME}-dashboard`, saga });
//Do not remove your appName hash from here.
const withReducer = injectReducer({ key: `${CURRENT_APP_NAME}-dashboard`, reducer });

export default compose(
  withRouter,
  withSaga,
  withReducer,
  withConnect,
)(clearDataOnUnmount(withStyles(Dashboard, styles), "clearData"));
