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
  makeSelectFilteredProducts,
  makeSelectProductsCount,
  makeSelectReturnableCount,
  makeSelectSearchFilter,
  makeSelectBrandFilter,
  makeSelectCategoryFilter,
  makeSelectBrandsForFilter,
  makeSelectCategoriesForFilter,
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
  CapSelect,
} from '@capillarytech/cap-ui-library';

function Products(props) {
  const {
    className,
    actions,
    history,
    appContext,
    intl: { formatMessage },
    filteredProducts,
    productsCount,
    returnableCount,
    searchFilter,
    brandFilter,
    categoryFilter,
    brandsForFilter,
    categoriesForFilter,
    loading,
  } = props;

  const currentRoute = history?.location?.pathname || '/products';

  // appContext is the prop that needs to be passed from the host application where this component is embedded
  // prepare the final context using SDK and use it in your app
  const finalContext = getHostApplicationContext(appContext);

  // Local state for search input (for immediate UI update)
  const [localSearchValue, setLocalSearchValue] = useState(searchFilter || '');
  const [searchError, setSearchError] = useState('');
  const debounceTimerRef = useRef(null);
  const isInitialMount = useRef(true);

  // Initial load - fetch all products and filter options (only on mount)
  useEffect(() => {
    actions.fetchProducts({ limit: 10, offset: 0 });
    actions.fetchBrandsForFilter();
    actions.fetchCategoriesForFilter();
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

    // Validate minimum 3 characters
    const currentSearchValue = localSearchValue;
    if (currentSearchValue && currentSearchValue.trim().length > 0 && currentSearchValue.trim().length < 3) {
      setSearchError(formatMessage(messages.searchMinLengthError));
      return;
    } else {
      setSearchError('');
    }

    // Set new timer for debounced API call
    debounceTimerRef.current = setTimeout(() => {
      // Update Redux search filter state
      actions.setSearchFilter(currentSearchValue);
      
      // Trigger API call with search query (only if 3+ characters or empty)
      const searchParams = {
        limit: 10,
        offset: 0,
      };
      
      // Add filters
      if (brandFilter) {
        searchParams.brandId = brandFilter;
      }
      if (categoryFilter) {
        searchParams.categoryId = categoryFilter;
      }
      
      // Only add q parameter if there's a search value with 3+ characters
      if (currentSearchValue && currentSearchValue.trim().length >= 3) {
        searchParams.q = currentSearchValue.trim();
      }
      
      // Always trigger API call, even if search is empty (to show all products)
      actions.fetchProducts(searchParams);
    }, 400); // 400ms debounce delay

    // Cleanup function
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearchValue, brandFilter, categoryFilter]);

  // Sync local search value with Redux state when it changes externally
  useEffect(() => {
    if (searchFilter !== localSearchValue) {
      setLocalSearchValue(searchFilter || '');
    }
  }, [searchFilter]);

  const handleSearchChange = e => {
    const value = e.target.value;
    setLocalSearchValue(value); // Update local state immediately for responsive UI
    
    // Clear error if user is typing
    if (value.length >= 3 || value.length === 0) {
      setSearchError('');
    }
    
    // API call will be triggered by the debounced useEffect above
  };

  const handleBrandFilterChange = value => {
    const brandId = value && value !== '' ? value : null;
    actions.setBrandFilter(brandId);
    // Trigger API call immediately with new filter
    const searchParams = {
      limit: 10,
      offset: 0,
    };
    if (brandId) {
      searchParams.brandId = brandId;
    }
    if (categoryFilter) {
      searchParams.categoryId = categoryFilter;
    }
    if (localSearchValue && localSearchValue.trim().length >= 3) {
      searchParams.q = localSearchValue.trim();
    }
    actions.fetchProducts(searchParams);
  };

  const handleCategoryFilterChange = value => {
    const categoryId = value && value !== '' ? value : null;
    actions.setCategoryFilter(categoryId);
    // Trigger API call immediately with new filter
    const searchParams = {
      limit: 10,
      offset: 0,
    };
    if (brandFilter) {
      searchParams.brandId = brandFilter;
    }
    if (categoryId) {
      searchParams.categoryId = categoryId;
    }
    if (localSearchValue && localSearchValue.trim().length >= 3) {
      searchParams.q = localSearchValue.trim();
    }
    actions.fetchProducts(searchParams);
  };

  const handleAddProduct = () => {
    // TODO: Implement add product functionality
    console.log('Add new product clicked');
  };

  const handleMoreActions = () => {
    // TODO: Implement more actions menu
    console.log('More actions clicked');
  };

  // Prepare filter options with "All" option
  const brandOptions = [
    { value: '', label: formatMessage(messages.allBrands) },
    ...brandsForFilter,
  ];

  const categoryOptions = [
    { value: '', label: formatMessage(messages.allCategories) },
    ...categoriesForFilter,
  ];

  const columns = [
    {
      title: '',
      dataIndex: 'checkbox',
      key: 'checkbox',
      width: 50,
      render: () => <input type="checkbox" />,
    },
    {
      title: formatMessage(messages.productName),
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="product-name-container">
          {record.image && (
            <img
              src={record.image}
              alt={text}
              className="product-image"
              onError={e => {
                e.target.style.display = 'none';
              }}
            />
          )}
          <div>
            <div className="product-name">{text}</div>
            <div className="product-sku">{record.sku}</div>
          </div>
        </div>
      ),
    },
    {
      title: formatMessage(messages.brand),
      dataIndex: 'brand',
      key: 'brand',
      render: brand =>
        brand ? (
          <CapTag>{brand}</CapTag>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: formatMessage(messages.category),
      dataIndex: 'category',
      key: 'category',
      render: category =>
        category ? (
          <CapTag>{category}</CapTag>
        ) : (
          <span>-</span>
        ),
    },
    {
      title: formatMessage(messages.attributes),
      dataIndex: 'attributesCount',
      key: 'attributesCount',
      render: count => (
        <span className="attributes-count">
          {formatMessage(messages.attributesCount, { count })}
        </span>
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
            <span
              className={
                record.status === 'Returnable'
                  ? 'status-dot-returnable'
                  : 'status-dot-standard'
              }
            />
            <span>{formatMessage(record.status === 'Returnable' ? messages.returnableStatus : messages.standardStatus)}</span>
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
            <div className="products-page">
              <div className="products-header">
                <CapHeading type="h1" level={1}>
                  {formatMessage(messages.header)}
                </CapHeading>
                <div className="products-summary">
                  <div className="products-summary-stat">
                    <span className="products-summary-dot-green" />
                    {formatMessage(messages.totalProducts)}: {productsCount}
                  </div>
                  <div className="products-summary-stat">
                    <span className="products-summary-dot-orange" />
                    {formatMessage(messages.returnable)}: {returnableCount}
                  </div>
                </div>
              </div>

              <div className="products-actions">
                <div className="search-container">
                  <CapInput.Search
                    placeholder={formatMessage(messages.searchPlaceholder)}
                    value={localSearchValue}
                    onChange={handleSearchChange}
                    size="large"
                    allowClear
                  />
                  {searchError && (
                    <div className="search-error-message">{searchError}</div>
                  )}
                </div>
                <div className="filters-container">
                  <CapSelect
                    className="filter-dropdown"
                    placeholder={formatMessage(messages.brandFilter)}
                    value={brandFilter || ''}
                    onChange={handleBrandFilterChange}
                    options={brandOptions}
                    allowClear
                  />
                  <CapSelect
                    className="filter-dropdown"
                    placeholder={formatMessage(messages.categoryFilter)}
                    value={categoryFilter || ''}
                    onChange={handleCategoryFilterChange}
                    options={categoryOptions}
                    allowClear
                  />
                </div>
                <div className="action-buttons">
                  <CapButton
                    type="primary"
                    isAddBtn
                    onClick={handleAddProduct}
                  >
                    {formatMessage(messages.addNewProduct)}
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
                  dataSource={filteredProducts}
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

Products.propTypes = {
  history: PropTypes.object,
  appContext: PropTypes.object,
  actions: PropTypes.object,
  className: PropTypes.string,
  intl: intlShape.isRequired,
  filteredProducts: PropTypes.array,
  productsCount: PropTypes.number,
  returnableCount: PropTypes.number,
  searchFilter: PropTypes.string,
  brandFilter: PropTypes.any,
  categoryFilter: PropTypes.any,
  brandsForFilter: PropTypes.array,
  categoriesForFilter: PropTypes.array,
  loading: PropTypes.bool,
};

const mapStateToProps = createStructuredSelector({
  filteredProducts: makeSelectFilteredProducts(),
  productsCount: makeSelectProductsCount(),
  returnableCount: makeSelectReturnableCount(),
  searchFilter: makeSelectSearchFilter(),
  brandFilter: makeSelectBrandFilter(),
  categoryFilter: makeSelectCategoryFilter(),
  brandsForFilter: makeSelectBrandsForFilter(),
  categoriesForFilter: makeSelectCategoriesForFilter(),
  loading: makeSelectLoading(),
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);

// Do not remove your appName hash from here.
const withSaga = injectSaga({ key: `${CURRENT_APP_NAME}-products`, saga });
// Do not remove your appName hash from here.
const withReducer = injectReducer({ key: `${CURRENT_APP_NAME}-products`, reducer });

export default compose(
  withRouter,
  withSaga,
  withReducer,
  withConnect,
  injectIntl,
)(clearDataOnUnmount(withStyles(Products, styles), 'clearData'));
