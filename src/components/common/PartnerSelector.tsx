import React, { useState, useEffect, useRef } from 'react';
import { Select, Space, Typography, theme as antdTheme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { partnerApi } from '@/pages/Partners/api';
import type { Partner } from '@/pages/Partners/types';

const { Text } = Typography;

export interface PartnerSelectorProps {
  value: string | null;
  onChange: (value: string | null, item: Partner | null) => void;
  placeholder?: string;
  disabled?: boolean;
  status?: '' | 'error' | 'warning';
  helperText?: string;
  width?: number | string;
}

const PartnerSelector: React.FC<PartnerSelectorProps> = React.memo(({
  value,
  onChange,
  placeholder = 'Chọn đối tác',
  disabled = false,
  status = '',
  helperText,
  width = '100%',
}) => {
  const { token } = antdTheme.useToken();
  const [options, setOptions] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const hasLoadedRef = useRef(false);

  // Load partners data
  const fetchPartners = async (key: string = '') => {
    setLoading(true);
    try {
      const response = await partnerApi.getPartners({
        page: 1,
        limit: 100,
        searchKey: key
      });
      setOptions(response.data?.data?.data || []);
    } catch (error) {
      console.error('Error loading partners:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoadedRef.current) {
      fetchPartners();
      hasLoadedRef.current = true;
    }
  }, []);

  const handleSearch = (val: string) => {
    setSearchKey(val);
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchKey) {
        fetchPartners(searchKey);
      } else {
        fetchPartners();
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchKey]);

  const selectOptions = options.map(item => ({
    value: item.id,
    label: item.name || item.id || '',
    item: item
  }));

  return (
    <Space direction="vertical" style={{ width: width }}>
      <Select
        showSearch
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        status={status}
        loading={loading}
        onSearch={handleSearch}
        onChange={(val, option: any) => {
          onChange(val, option?.item || null);
        }}
        filterOption={false}
        options={selectOptions}
        style={{ width: '100%' }}
        suffixIcon={<SearchOutlined />}
        optionRender={(option) => (
          <Flex vertical gap={0}>
            <Text strong>{option.label}</Text>
            <Text type="secondary" style={{ fontSize: '11px' }}>{option.item.type}</Text>
          </Flex>
        )}
      />
      {helperText && (
        <Text type={status === 'error' ? 'danger' : 'secondary'} style={{ fontSize: '12px' }}>
          {helperText}
        </Text>
      )}
    </Space>
  );
});

import { Flex } from 'antd';

PartnerSelector.displayName = 'PartnerSelector';

export default PartnerSelector;
