import React from 'react';
import { SimpleTable } from '@/components/common';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Visibility as ViewIcon
} from '@mui/icons-material';
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
}

const UserDataGrid: React.FC<UserDataGridProps> = ({
  data,
  isLoading,
  error,
  onRefresh,
  onViewDetail,
  onEdit,
  onDelete,
  onSave,
}) => {
  const getRoleLabel = (role: string): string => {
    const roleOption = USER_ROLES.find(r => r.value === role);
    return roleOption ? roleOption.label : role;
  };


  const getStatusLabel = (isActive: boolean): string => {
    return isActive ? 'Hoạt động' : 'Không hoạt động';
  };

  const users = data?.data?.data || [];

  const columns = [
    {
      key: 'name',
      label: 'Tên người dùng',
      minWidth: 200,
      render: (value: unknown, row: User) => (
        <div>
          <div style={{ fontWeight: 'medium' }}>
            {row.name}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#666' }}>
            {String((row as unknown as Record<string, unknown>).email || (row as unknown as Record<string, unknown>).username || '')}
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
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          backgroundColor: '#f5f5f5',
          color: '#333',
        }}>
          {getRoleLabel(value as string)}
        </span>
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
        <span style={{
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '0.75rem',
          backgroundColor: value ? '#e8f5e8' : '#ffeaea',
          color: value ? '#2e7d32' : '#d32f2f',
        }}>
          {getStatusLabel(value as boolean)}
        </span>
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
      icon: <ViewIcon />,
      color: 'primary' as const,
      onClick: (user: unknown) => onViewDetail(user as User),
    },
    {
      key: 'delete',
      label: 'Xóa',
      icon: <DeleteIcon />,
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
    />
  );
};

export { UserDataGrid };