import React, { useState, useEffect, useRef } from 'react';
import { Select, Space, Typography, theme as antdTheme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { stationApi } from '@/pages/Stations/api';
import type { Station } from '@/pages/Stations/types';

const { Text } = Typography;

export interface StationSelectorProps {
  value: string | null;
  onChange: (value: string | null, item: Station | null) => void;
  placeholder?: string;
  disabled?: boolean;
  status?: '' | 'error' | 'warning';
  helperText?: string;
  width?: number | string;
}

const StationSelector: React.FC<StationSelectorProps> = React.memo(({
  value,
  onChange,
  placeholder = 'Chọn trạm',
  disabled = false,
  status = '',
  helperText,
  width = '100%',
}) => {
  const { token } = antdTheme.useToken();
  const [options, setOptions] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const hasLoadedRef = useRef(false);

  // Load stations data on mount or when searchKey changes
  const fetchStations = async (key: string = '') => {
    setLoading(true);
    try {
      const response = await stationApi.getAll({
        page: 1,
        limit: 20, // Increased limit for better selection
        searchKey: key
      });
      setOptions(response.data?.data || []);
    } catch (error) {
      console.error('Error loading stations:', error);
      setOptions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasLoadedRef.current) {
      fetchStations();
      hasLoadedRef.current = true;
    }
  }, []);

  const handleSearch = (val: string) => {
    setSearchKey(val);
    // Use timeout for debounce if needed, but antd Select has its own optimization
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchKey) {
        fetchStations(searchKey);
      } else {
        fetchStations();
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
        filterOption={false} // Since we do server-side search
        options={selectOptions}
        style={{ width: '100%' }}
        suffixIcon={<SearchOutlined />}
        optionRender={(option) => (
          <Space>
            <Text>{option.label}</Text>
          </Space>
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

StationSelector.displayName = 'StationSelector';

export default StationSelector;