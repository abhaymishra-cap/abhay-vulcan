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
  makeSelectFilteredCategories,
  makeSelectCategoriesCount,
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

function Categories(props) {
  const {
    className,
    actions,
    history,
    appContext,
    intl: { formatMessage },
    filteredCategories,
    categoriesCount,
    searchFilter,
    loading,
  } = props;

  const currentRoute = history?.location?.pathname || '/categories';

  // appContext is the prop that needs to be passed from the host application where this component is embedded
  // prepare the final context using SDK and use it in your app
  const finalContext = getHostApplicationContext(appContext);

  // Local state for search input (for immediate UI update)
  const [localSearchValue, setLocalSearchValue] = useState(searchFilter || '');
  const debounceTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Initial load - fetch all categories (only on mount)
  useEffect(() => {
    actions.fetchCategories({ limit: 10, offset: 0 });
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
    debounceTimerRef.current = setTimeout(() => {
      // Update Redux search filter state
      actions.setSearchFilter(localSearchValue);
      
      // Trigger API call with search query
      const searchParams = {
        limit: 10,
        offset: 0,
      };
      
      // Only add q parameter if there's a search value
      if (localSearchValue && localSearchValue.trim()) {
        searchParams.q = localSearchValue.trim();
      }
      
      actions.fetchCategories(searchParams);
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

  const handleAddCategory = () => {
    // TODO: Implement add category functionality
    console.log('Add new category clicked');
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
      title: formatMessage(messages.categoryName),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="category-name-container">
          <div className="category-badge">{record.initials || getInitials(text)}</div>
          <div>
            <div>{text}</div>
            <span className="category-id">{record.id}</span>
          </div>
        </div>
      ),
    },
    {
      title: formatMessage(messages.parentCategory),
      dataIndex: 'parentCategory',
      key: 'parentCategory',
      render: parentCategory =>
        parentCategory ? (
          <CapTag>{parentCategory}</CapTag>
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
        <div className="categories-page">
          <div className="categories-header">
            <CapHeading type="h1" level={1}>
              {formatMessage(messages.header)}
            </CapHeading>
            <div className="categories-summary">
              {formatMessage(messages.totalCategories)}: {categoriesCount}
            </div>
          </div>

          <div className="categories-actions">
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
                onClick={handleAddCategory}
              >
                {formatMessage(messages.addNewCategory)}
              </CapButton>
            </div>
          </div>

          <CapSpin spinning={loading}>
            <CapTable
              columns={columns}
              dataSource={filteredCategories}
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

Categories.propTypes = {
  history: PropTypes.object,
  appContext: PropTypes.object,
  actions: PropTypes.object,
  className: PropTypes.string,
  intl: intlShape.isRequired,
  filteredCategories: PropTypes.array,
  categoriesCount: PropTypes.number,
  searchFilter: PropTypes.string,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  filteredCategories: makeSelectFilteredCategories(),
  categoriesCount: makeSelectCategoriesCount(),
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
const withSaga = injectSaga({ key: `${CURRENT_APP_NAME}-categories`, saga });
// Do not remove your appName hash from here.
const withReducer = injectReducer({ key: `${CURRENT_APP_NAME}-categories`, reducer });

export default compose(
  withRouter,
  withSaga,
  withReducer,
  withConnect,
  injectIntl,
)(clearDataOnUnmount(withStyles(Categories, styles), 'clearData'));

