import React from 'react';
import { CommonSearchAndFilter } from '@/components/common';
import type { StationSearchParams } from '../types';

interface StationSearchAndFilterProps {
  searchParams: StationSearchParams;
  onSearchChange: (params: StationSearchParams) => void;
  onRefresh: () => void;
  loading: boolean;
}

export const StationSearchAndFilter: React.FC<StationSearchAndFilterProps> = ({
  onSearchChange,
  onRefresh,
  loading,
}) => {
  const handleSearch = (query: string) => {
    onSearchChange({ searchKey: query });
  };

  const handleSort = (sortBy: string) => {
    onSearchChange({ sortBy });
  };

  const handleFilter = (filters: Record<string, string>) => {
    onSearchChange(filters);
  };

  return (
    <CommonSearchAndFilter
      config={{
        searchPlaceholder: 'Tìm kiếm theo tên, mã, địa chỉ, số điện thoại...',
        sortOptions: [
          { value: 'name', label: 'Tên trạm' },
          { value: 'code', label: 'Mã trạm' },
          { value: 'address', label: 'Địa chỉ' },
          { value: 'phone_number', label: 'Số điện thoại' },
          { value: 'created_at', label: 'Ngày tạo' },
        ],
        filterOptions: [
          {
            key: 'sortOrder',
            label: 'Thứ tự',
            options: [
              { value: 'asc', label: 'Tăng dần' },
              { value: 'desc', label: 'Giảm dần' },
            ],
          },
        ],
      }}
      onSearch={handleSearch}
      onSort={handleSort}
      onFilter={handleFilter}
      onRefresh={onRefresh}
      loading={loading}
    />
  );
};
