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
import AddBrandModal from './AddBrandModal';
import * as actions from './actions';
import saga from './saga';
import reducer from './reducer';
import styles from './styles';
import {
  makeSelectFilteredBrands,
  makeSelectBrandsCount,
  makeSelectSearchFilter,
  makeSelectLoading,
  makeSelectPagination,
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
    pagination,
  } = props;

  const currentRoute = history?.location?.pathname || '/brands';

  // appContext is the prop that needs to be passed from the host application where this component is embedded
  // prepare the final context using SDK and use it in your app
  const finalContext = getHostApplicationContext(appContext);

  // Local state for search input (for immediate UI update)
  const [localSearchValue, setLocalSearchValue] = useState(searchFilter || '');
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);
  const debounceTimerRef = useRef(null);
  const isInitialMount = useRef(true);
  const createBrandInProgressRef = useRef(false);

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

  // Handle brand creation completion - close modal after successful creation
  // The saga will refresh the brands list automatically
  useEffect(() => {
    if (createBrandInProgressRef.current && !loading && showAddBrandModal) {
      // Create operation completed (loading went from true to false)
      // Close modal - if there was an error, it's stored in Redux state
      // and can be displayed if needed
      setShowAddBrandModal(false);
      createBrandInProgressRef.current = false;
    }
  }, [loading, showAddBrandModal]);

  const handleSearchChange = e => {
    const value = e.target.value;
    setLocalSearchValue(value); // Update local state immediately for responsive UI
    // API call will be triggered by the debounced useEffect above
  };

  const handleAddBrand = () => {
    setShowAddBrandModal(true);
  };

  const handleModalCancel = () => {
    setShowAddBrandModal(false);
  };

  const handleModalSubmit = (brandData) => {
    createBrandInProgressRef.current = true;
    actions.createBrand(brandData);
  };

  const handleMoreActions = () => {
    // TODO: Implement more actions menu
    console.log('More actions clicked');
  };

  // Pagination handlers
  const handlePreviousPage = () => {
    const currentOffset = pagination?.offset || 0;
    const limit = pagination?.limit || 10;
    const newOffset = Math.max(0, currentOffset - limit);
    
    const searchParams = {
      limit,
      offset: newOffset,
    };
    
    if (localSearchValue && localSearchValue.trim()) {
      searchParams.q = localSearchValue.trim();
    }
    
    actions.fetchBrands(searchParams);
  };

  const handleNextPage = () => {
    const currentOffset = pagination?.offset || 0;
    const limit = pagination?.limit || 10;
    const total = pagination?.total || 0;
    const newOffset = currentOffset + limit;
    
    if (newOffset < total) {
      const searchParams = {
        limit,
        offset: newOffset,
      };
      
      if (localSearchValue && localSearchValue.trim()) {
        searchParams.q = localSearchValue.trim();
      }
      
      actions.fetchBrands(searchParams);
    }
  };

  // Calculate pagination display values
  const limit = pagination?.limit || 10;
  const offset = pagination?.offset || 0;
  const total = pagination?.total || 0;
  const start = total > 0 ? offset + 1 : 0;
  const end = Math.min(offset + limit, total);
  const isPreviousDisabled = offset === 0;
  const isNextDisabled = offset + limit >= total;
  const showPagination = total > limit;

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
              {showPagination && (
                <CapRow justify="space-between" align="middle" style={{ marginTop: 16 }}>
                  <CapColumn>
                    <span>
                      {formatMessage(messages.pageInfo, {
                        start,
                        end,
                        total,
                      })}
                    </span>
                  </CapColumn>
                  <CapColumn>
                    <CapButton
                      disabled={isPreviousDisabled}
                      onClick={handlePreviousPage}
                      icon={<CapIcon type="arrow-left" />}
                      style={{ marginRight: 8, width: 100 }}
                    >
                      {formatMessage(messages.previousPage)}
                    </CapButton>
                    <CapButton
                      disabled={isNextDisabled}
                      onClick={handleNextPage}
                      icon={<CapIcon type="arrow-right" />}
                      style={{ width: 100 }}
                    >
                      {formatMessage(messages.nextPage)}
                    </CapButton>
                  </CapColumn>
                </CapRow>
              )}
            </div>
          </CapColumn>
        </CapRow>
      </PageTemplate>
      <AddBrandModal
        visible={showAddBrandModal}
        onCancel={handleModalCancel}
        onSubmit={handleModalSubmit}
        loading={loading}
      />
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
  pagination: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  filteredBrands: makeSelectFilteredBrands(),
  brandsCount: makeSelectBrandsCount(),
  searchFilter: makeSelectSearchFilter(),
  loading: makeSelectLoading(),
  pagination: makeSelectPagination(),
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
