import React, { useState } from 'react';
import { Input, Select, Button, Space, Flex, theme as antdTheme, Card, Grid } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';

const { Search } = Input;

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchAndFilterConfig {
  searchPlaceholder?: string;
  sortOptions?: FilterOption[];
  filterOptions?: Array<{
    key: string;
    label: string;
    options: FilterOption[];
  }>;
}

interface CommonSearchAndFilterProps {
  config: SearchAndFilterConfig;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onClearFilters?: () => void;
  filters?: Record<string, unknown>;
  loading?: boolean;
}

const CommonSearchAndFilter: React.FC<CommonSearchAndFilterProps> = ({
  config,
  onSearch,
  onSort,
  onFilter,
  onClearFilters,
  filters: externalFilters = {},
  loading = false,
}) => {
  const { token } = antdTheme.useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.xs || (screens.sm && !screens.md);

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(config?.sortOptions?.[0]?.value || '');
  const [filters, setFilters] = useState<Record<string, string>>(externalFilters as Record<string, string>);

  const handleSearch = (value: string) => {
    onSearch(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
    onSearch('');
    onFilter({});
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <Card
      size="small"
      style={{
        marginBottom: '16px',
        borderRadius: '12px',
        border: `1px solid ${token.colorBorderSecondary}`,
        background: token.colorBgContainer,
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}
      styles={{ body: { padding: isMobile ? '12px' : '16px' } }}
    >
      <Flex
        wrap="wrap"
        gap={isMobile ? 12 : 16}
        align={isMobile ? 'stretch' : 'center'}
        vertical={isMobile}
      >
        {/* Search Input */}
        <Search
          placeholder={config?.searchPlaceholder || 'Tìm kiếm...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          loading={loading}
          style={{ width: isMobile ? '100%' : 300 }}
          allowClear
        />

        {/* Sort By */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
          <span style={{ fontSize: '13px', color: token.colorTextSecondary, whiteSpace: 'nowrap' }}>Sắp xếp:</span>
          <Select
            value={sortBy}
            onChange={(val) => {
              setSortBy(val);
              onSort(val);
            }}
            style={{ width: isMobile ? '100%' : 160 }}
            options={config?.sortOptions}
          />
        </div>

        {/* Dynamic Filters */}
        {config?.filterOptions?.map((filter) => (
          <div key={filter.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
            <span style={{ fontSize: '13px', color: token.colorTextSecondary, whiteSpace: 'nowrap', minWidth: isMobile ? '60px' : 'auto' }}>{filter.label}:</span>
            <Select
              value={filters[filter.key] || ''}
              onChange={(val) => handleFilterChange(filter.key, val)}
              style={{ width: isMobile ? '100%' : 140, minWidth: isMobile ? 0 : 140 }}
              placeholder={filter.label}
              options={[
                { value: '', label: 'Tất cả' },
                ...filter.options
              ]}
            />
          </div>
        ))}

        {/* Action Buttons */}
        <Flex
          gap={12}
          style={{
            marginLeft: isMobile ? 0 : 'auto',
            width: isMobile ? '100%' : 'auto'
          }}
        >
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => handleSearch(searchQuery)}
            loading={loading}
            style={{ flexGrow: isMobile ? 1 : 0 }}
          >
            Tìm kiếm
          </Button>

          <Button
            icon={<CloseOutlined />}
            onClick={handleClearFilters}
            disabled={loading}
            style={{ flexGrow: isMobile ? 1 : 0 }}
          >
            {isMobile ? 'Xóa' : 'Xóa bộ lọc'}
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
};

export default CommonSearchAndFilter;
