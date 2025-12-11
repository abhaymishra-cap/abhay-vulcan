import React, { useEffect, useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose, bindActionCreators } from 'redux';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { injectIntl, intlShape } from 'react-intl';
import { injectSaga, injectReducer, clearDataOnUnmount, withStyles, getHostApplicationContext } from '@capillarytech/vulcan-react-sdk/utils';
import PageTemplate from '../../templates/PageTemplate';
import InventorySidebar from '../../organisms/InventorySidebar';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';
import {
  makeSelectFilteredBrands,
  makeSelectBrandsCount,
  makeSelectSearchFilter,
  makeSelectLoading,
} from './selectors';
import messages from './messages';
import {
  CapRow,
  CapColumn,
  CapHeading,
  CapInput,
  CapButton,
  CapTable,
  CapTag,
  CapSpin,
  CapIcon,
} from '@capillarytech/cap-ui-library';

function Brands(props) {
  const {
    className,
    actions,
    history,
    appContext,
    intl: { formatMessage },
    filteredBrands,
    brandsCount,
    searchFilter,
    loading,
  } = props;

  const currentRoute = history?.location?.pathname || '/brands';

  // appContext is the prop that needs to be passed from the host application where this component is embedded
  // prepare the final context using SDK and use it in your app
  const finalContext = getHostApplicationContext(appContext);

  // Local state for search input (for immediate UI update)
  const [localSearchValue, setLocalSearchValue] = useState(searchFilter || '');
  const debounceTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Initial load - fetch all brands (only on mount)
  useEffect(() => {
    actions.fetchBrands({ limit: 10, offset: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search effect - triggers API call when search value changes
  useEffect(() => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced API call
    const currentSearchValue = localSearchValue;
    debounceTimerRef.current = setTimeout(() => {
      // Update Redux search filter state
      actions.setSearchFilter(currentSearchValue);
      
      // Trigger API call with search query
      const searchParams = {
        limit: 10,
        offset: 0,
      };
      
      // Only add q parameter if there's a search value
      if (currentSearchValue && currentSearchValue.trim()) {
        searchParams.q = currentSearchValue.trim();
      }
      
      // Always trigger API call, even if search is empty (to show all brands)
      actions.fetchBrands(searchParams);
    }, 400); // 400ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearchValue]);

  // Sync local search value with Redux state when it changes externally
  useEffect(() => {
    if (searchFilter !== localSearchValue) {
      setLocalSearchValue(searchFilter || '');
    }
  }, [searchFilter]);

  const handleSearchChange = e => {
    const value = e.target.value;
    setLocalSearchValue(value); // Update local state immediately for responsive UI
    // API call will be triggered by the debounced useEffect above
  };

  const handleAddBrand = () => {
    // TODO: Implement add brand functionality
    console.log('Add new brand clicked');
  };

  const handleMoreActions = () => {
    // TODO: Implement more actions menu
    console.log('More actions clicked');
  };

  const getInitials = name => {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const columns = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: () => <input type="checkbox" />,
    },
    {
      title: formatMessage(messages.brandName),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="brand-name-container">
          <div className="brand-badge">{record.initials || getInitials(text)}</div>
          <div>
            <div>{text}</div>
            <span className="brand-id">{record.code || record.id}</span>
          </div>
        </div>
      ),
    },
    {
      title: formatMessage(messages.parentBrand),
      dataIndex: 'parentBrand',
      key: 'parentBrand',
      render: parentBrand =>
        parentBrand ? (
          <CapTag>{parentBrand}</CapTag>
        ) : (
          <span>{formatMessage(messages.noParent)}</span>
        ),
    },
    {
      title: formatMessage(messages.lastUpdated),
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text, record) => (
        <div>
          <div>{text}</div>
          <div className="status-indicator">
            <span className="status-dot" />
            <span>{record.status}</span>
          </div>
        </div>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 50,
      render: () => (
        <CapButton
          type="flat"
          onClick={handleMoreActions}
          icon={<CapIcon type="ellipsis" />}
        />
      ),
    },
  ];

  return (
    <div className={className}>
      <PageTemplate>
        <CapRow gutter={0}>
          <CapColumn span={4}>
            <InventorySidebar history={history} activeRoute={currentRoute} />
          </CapColumn>
          <CapColumn span={20}>
            <div className="brands-page">
              <div className="brands-header">
                <CapHeading type="h1" level={1}>
                  {formatMessage(messages.header)}
                </CapHeading>
                <div className="brands-summary">
                  <span className="brands-summary-dot" />
                  {formatMessage(messages.totalBrands)}: {brandsCount}
                </div>
              </div>

              <div className="brands-actions">
                <div className="search-container">
                  <CapInput.Search
                    placeholder={formatMessage(messages.searchPlaceholder)}
                    value={localSearchValue}
                    onChange={handleSearchChange}
                    size="large"
                    allowClear
                  />
                </div>
                <div className="action-buttons">
                  <CapButton
                    type="primary"
                    isAddBtn
                    onClick={handleAddBrand}
                  >
                    {formatMessage(messages.addNewBrand)}
                  </CapButton>
                  <CapButton
                    type="secondary"
                    onClick={handleMoreActions}
                    icon={<CapIcon type="ellipsis" />}
                  />
                </div>
              </div>

              <CapSpin spinning={loading}>
                <CapTable
                  columns={columns}
                  dataSource={filteredBrands}
                  rowKey="id"
                  pagination={false}
                />
              </CapSpin>
            </div>
          </CapColumn>
        </CapRow>
      </PageTemplate>
    </div>
  );
}

Brands.propTypes = {
  history: PropTypes.object,
  appContext: PropTypes.object,
  actions: PropTypes.object,
  className: PropTypes.string,
  intl: intlShape.isRequired,
  filteredBrands: PropTypes.array,
  brandsCount: PropTypes.number,
  searchFilter: PropTypes.string,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  filteredBrands: makeSelectFilteredBrands(),
  brandsCount: makeSelectBrandsCount(),
  searchFilter: makeSelectSearchFilter(),
  loading: makeSelectLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

// Do not remove your appName hash from here.
const withSaga = injectSaga({ key: `${CURRENT_APP_NAME}-brands`, saga });
// Do not remove your appName hash from here.
const withReducer = injectReducer({ key: `${CURRENT_APP_NAME}-brands`, reducer });

export default compose(
  withRouter,
  withSaga,
  withReducer,
  withConnect,
  injectIntl,
)(clearDataOnUnmount(withStyles(Brands, styles), 'clearData'));
