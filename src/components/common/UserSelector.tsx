import React, { useState, useMemo, useEffect } from 'react';
import { Select, Space, Typography, Spin, theme as antdTheme } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useInfiniteUsers } from '@/hooks';
import type { User } from '@/pages/Users/types';

const { Text } = Typography;

export interface UserSelectorProps {
  value: string | null;
  onChange: (value: string | null, item: User | null) => void;
  placeholder?: string;
  disabled?: boolean;
  status?: '' | 'error' | 'warning';
  helperText?: string;
  width?: number | string;
}

const UserSelector: React.FC<UserSelectorProps> = React.memo(({
  value,
  onChange,
  placeholder = 'Chọn người dùng',
  disabled = false,
  status = '',
  helperText,
  width = '100%',
}) => {
  const { token } = antdTheme.useToken();
  const [searchKey, setSearchKey] = useState('');
  const { data = [], isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteUsers({ searchKey });

  const handleSearch = (query: string) => {
    setSearchKey(query);
  };

  const onPopupScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { target } = e;
    const element = target as HTMLDivElement;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map(item => ({
      value: item.id,
      label: item.name || item.id || '',
      item: item
    }));
  }, [data]);

  return (
    <Space direction="vertical" style={{ width: width }}>
      <Select
        showSearch
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        status={status}
        loading={isLoading}
        onSearch={handleSearch}
        onChange={(val, option: any) => {
          onChange(val, option?.item || null);
        }}
        onPopupScroll={onPopupScroll}
        filterOption={false}
        options={options}
        style={{ width: '100%' }}
        suffixIcon={<SearchOutlined />}
        notFoundContent={isLoading ? <Spin size="small" /> : 'Không có dữ liệu'}
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

UserSelector.displayName = 'UserSelector';

export default UserSelector;
