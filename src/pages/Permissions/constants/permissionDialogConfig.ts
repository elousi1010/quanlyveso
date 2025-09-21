import type { DialogFieldConfig } from '@/components/common/types';
import type { CreatePermissionDto, UpdatePermissionDto } from '../types';

export const permissionCreateFields: DialogFieldConfig<CreatePermissionDto>[] = [
  {
    key: 'name',
    label: 'Tên quyền',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên quyền',
  },
  {
    key: 'code',
    label: 'Mã quyền',
    type: 'text',
    required: true,
    placeholder: 'Nhập mã quyền (VD: user_read)',
  },
  {
    key: 'actions',
    label: 'Hành động',
    type: 'json',
    required: true,
    placeholder: '{"user": ["read", "create"], "organization": ["read"]}',
  },
];

export const permissionUpdateFields: DialogFieldConfig<UpdatePermissionDto>[] = [
  {
    key: 'name',
    label: 'Tên quyền',
    type: 'text',
    required: false,
    placeholder: 'Nhập tên quyền',
  },
  {
    key: 'code',
    label: 'Mã quyền',
    type: 'text',
    required: false,
    placeholder: 'Nhập mã quyền',
  },
  {
    key: 'actions',
    label: 'Hành động',
    type: 'json',
    required: false,
    placeholder: '{"user": ["read", "create"], "organization": ["read"]}',
  },
];

export const permissionDetailFields: DialogFieldConfig[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'text',
    readonly: true,
  },
  {
    key: 'name',
    label: 'Tên quyền',
    type: 'text',
    readonly: true,
  },
  {
    key: 'code',
    label: 'Mã quyền',
    type: 'text',
    readonly: true,
  },
  {
    key: 'actions',
    label: 'Hành động',
    type: 'json',
    readonly: true,
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    type: 'text',
    readonly: true,
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    type: 'text',
    readonly: true,
  },
];
