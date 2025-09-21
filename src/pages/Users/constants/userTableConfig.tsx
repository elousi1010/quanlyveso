import type { TableColumn, TableAction } from '../../../components/common';
import type { User } from '../types';
import { USER_ROLES } from './userConstants';
import { formatDate } from '../../../utils/format';
import { Visibility as ViewIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';

export const USER_TABLE_COLUMNS: TableColumn[] = [
  {
    key: 'name',
    label: 'Tên người dùng',
    minWidth: 200,
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    minWidth: 150,
  },
  {
    key: 'role',
    label: 'Vai trò',
    minWidth: 120,
    render: (role: string) => {
      const roleOption = USER_ROLES.find(r => r.value === role);
      const getRoleColor = (role: string): 'primary' | 'secondary' | 'success' | 'warning' | 'default' => {
        switch (role) {
          case 'admin': return 'primary';
          case 'user': return 'secondary';
          case 'owner': return 'success';
          case 'employee': return 'warning';
          case 'seller': return 'default';
          default: return 'default';
        }
      };
      
      return (
        <Chip
          label={roleOption?.label || role}
          color={getRoleColor(role)}
          size="small"
          variant="outlined"
        />
      );
    },
  },
  {
    key: 'organization',
    label: 'Tổ chức',
    minWidth: 200,
    render: (organization: unknown) => (organization as { key: string })?.key || 'N/A',
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    minWidth: 120,
    render: (isActive: boolean) => {
      const getStatusColor = (isActive: boolean): 'success' | 'error' => {
        return isActive ? 'success' : 'error';
      };
      
      return (
        <Chip
          label={isActive ? 'Hoạt động' : 'Không hoạt động'}
          color={getStatusColor(isActive)}
          size="small"
          variant="filled"
        />
      );
    },
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    minWidth: 150,
    render: (date: string) => formatDate(date),
  },
];

export const USER_TABLE_ACTIONS: TableAction[] = [
  {
    key: 'view',
    label: 'Xem/Chỉnh sửa',
    icon: <ViewIcon fontSize="small" />,
    color: 'primary.main',
    onClick: (user: User) => {
      // This will be handled by the parent component
      console.log('View/Edit user:', user);
    },
  },
  {
    key: 'delete',
    label: 'Xóa',
    icon: <DeleteIcon fontSize="small" />,
    color: 'error.main',
    onClick: (user: User) => {
      // This will be handled by the parent component
      console.log('Delete user:', user);
    },
  },
];
