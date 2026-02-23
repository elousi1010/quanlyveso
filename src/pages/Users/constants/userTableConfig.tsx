import React from 'react';
import type { SimpleTableColumn, SimpleTableAction } from '../../../components/common/SimpleTable';
import type { User } from '../types';
import { USER_ROLES } from './userConstants';
import { formatDate } from '../../../utils/format';
import { EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tag } from 'antd';

export const USER_TABLE_COLUMNS: SimpleTableColumn[] = [
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
      const getRoleColor = (role: string) => {
        switch (role) {
          case 'admin': return 'blue';
          case 'user': return 'cyan';
          case 'owner': return 'green';
          case 'employee': return 'orange';
          case 'seller': return 'default';
          default: return 'default';
        }
      };

      return (
        <Tag color={getRoleColor(role)} bordered={false}>
          {roleOption?.label || role}
        </Tag>
      );
    },
  },
  {
    key: 'organization',
    label: 'Tổ chức',
    minWidth: 200,
    render: (organization: any) => organization?.name || 'N/A',
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    minWidth: 120,
    render: (isActive: boolean) => {
      return (
        <Tag color={isActive ? 'success' : 'error'} bordered={false}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
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

export const USER_TABLE_ACTIONS: SimpleTableAction[] = [
  {
    key: 'view',
    label: 'Xem/Chỉnh sửa',
    icon: <EyeOutlined />,
    color: 'primary',
    onClick: (user: User) => {
      // Handled by parent
    },
  },
  {
    key: 'delete',
    label: 'Xóa',
    icon: <DeleteOutlined />,
    color: 'error',
    onClick: (user: User) => {
      // Handled by parent
    },
  },
];
