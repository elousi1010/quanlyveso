import React from 'react';
import { SimpleTable } from '@/components/common';
import {
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';
import { Tag } from 'antd';
import type { User, UserListResponse } from '../types';
import { USER_ROLES } from '../constants';

interface UserDataGridProps {
  data: UserListResponse | undefined;
  isLoading: boolean;
  error: unknown;
  onRefresh: () => void;
  onViewDetail: (user: User) => void;
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onSave?: (data: Record<string, unknown>, selectedRow?: User) => Promise<void>;
  // Pagination props
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
}

const UserDataGrid: React.FC<UserDataGridProps> = ({
  data,
  isLoading,
  error,
  onRefresh,
  onViewDetail,
  onDelete,
  page = 0,
  rowsPerPage = 5,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const getRoleLabel = (role: string): string => {
    const roleOption = USER_ROLES.find(r => r.value === role);
    return roleOption ? roleOption.label : role;
  };

  const users = data?.data?.data || [];
  const totalCount = data?.data?.total || 0;

  const columns = [
    {
      key: 'name',
      label: 'Tên người dùng',
      minWidth: 200,
      render: (value: unknown, row: User) => (
        <div>
          <div style={{ fontWeight: 600 }}>
            {row.name}
          </div>
          <div style={{ fontSize: '11px', color: '#888' }}>
            {String((row as any).email || (row as any).username || '')}
          </div>
        </div>
      ),
    },
    {
      key: 'phone_number',
      label: 'Số điện thoại',
      minWidth: 150,
      render: (value: unknown) => (value as string) || '-',
    },
    {
      key: 'role',
      label: 'Vai trò',
      minWidth: 120,
      render: (value: unknown) => (
        <Tag color="blue">
          {getRoleLabel(value as string)}
        </Tag>
      ),
    },
    {
      key: 'organization',
      label: 'Tổ chức',
      minWidth: 200,
      render: (value: unknown, row: User) => row.organization?.name || 'N/A',
    },
    {
      key: 'is_active',
      label: 'Trạng thái',
      minWidth: 120,
      render: (value: unknown) => (
        <Tag color={value ? 'success' : 'error'}>
          {value ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
    {
      key: 'created_at',
      label: 'Ngày tạo',
      minWidth: 150,
      render: (value: unknown) => {
        const date = new Date(value as string);
        return date.toLocaleDateString('vi-VN');
      },
    },
  ];

  const actions = [
    {
      key: 'view',
      label: 'Xem chi tiết',
      icon: <EyeOutlined />,
      color: 'primary' as const,
      onClick: (user: unknown) => onViewDetail(user as User),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteOutlined />,
      color: 'error' as const,
      onClick: (user: unknown) => onDelete(user as User),
    },
  ];

  return (
    <SimpleTable
      data={users}
      columns={columns}
      actions={actions}
      loading={isLoading}
      error={error}
      onRefresh={onRefresh}
      emptyMessage="Không có dữ liệu"
      total={totalCount}
      page={page}
      rowsPerPage={rowsPerPage}
      onPageChange={onPageChange}
      onRowsPerPageChange={onRowsPerPageChange}
    />
  );
};

export default UserDataGrid;