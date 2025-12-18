import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import {
  CapModal,
  CapInput,
  CapButton,
  CapRow,
  CapColumn,
} from '@capillarytech/cap-ui-library';
import messages from './messages';

function AddBrandModal({
  visible,
  onCancel,
  onSubmit,
  loading,
  intl: { formatMessage },
}) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!visible) {
      setFormData({ code: '', name: '', description: '' });
      setErrors({});
    }
  }, [visible]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.code || !formData.code.trim()) {
      newErrors.code = formatMessage(messages.codeRequired);
    }
    
    if (!formData.name || !formData.name.trim()) {
      newErrors.name = formatMessage(messages.nameRequired);
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const brandData = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        ...(formData.description.trim() && { description: formData.description.trim() }),
      };
      onSubmit(brandData);
    }
  };

  const handleCancel = () => {
    setFormData({ code: '', name: '', description: '' });
    setErrors({});
    onCancel();
  };

  return (
    <CapModal
      title={formatMessage(messages.addBrandModalTitle)}
      visible={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText={formatMessage(messages.submit)}
      cancelText={formatMessage(messages.cancel)}
      confirmLoading={loading}
      centered
      maskClosable={false}
    >
      <CapRow gutter={[16, 16]}>
        <CapColumn span={24}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {formatMessage(messages.brandCode)} <span style={{ color: 'red' }}>*</span>
            </label>
            <CapInput
              value={formData.code}
              onChange={e => handleInputChange('code', e.target.value)}
              placeholder={formatMessage(messages.brandCodePlaceholder)}
              size="large"
              status={errors.code ? 'error' : ''}
            />
            {errors.code && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errors.code}
              </div>
            )}
          </div>
        </CapColumn>

        <CapColumn span={24}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {formatMessage(messages.brandName)} <span style={{ color: 'red' }}>*</span>
            </label>
            <CapInput
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder={formatMessage(messages.brandNamePlaceholder)}
              size="large"
              status={errors.name ? 'error' : ''}
            />
            {errors.name && (
              <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>
                {errors.name}
              </div>
            )}
          </div>
        </CapColumn>

        <CapColumn span={24}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
              {formatMessage(messages.description)}
            </label>
            <CapInput.TextArea
              value={formData.description}
              onChange={e => handleInputChange('description', e.target.value)}
              placeholder={formatMessage(messages.descriptionPlaceholder)}
              rows={4}
              maxLength={500}
            />
          </div>
        </CapColumn>
      </CapRow>
    </CapModal>
  );
}

AddBrandModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  intl: intlShape.isRequired,
};

AddBrandModal.defaultProps = {
  loading: false,
};

export default injectIntl(AddBrandModal);

