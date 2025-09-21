import type { DialogFieldConfig } from '@/components/common/types';
import type { CreatePermissionDto, UpdatePermissionDto } from '../types';

export const permissionCreateFields: DialogFieldConfig<CreatePermissionDto>[] = [
  {
    key: 'name',
    label: 'Tên quyền',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên quyền (VD: Permission 1)',
  },
  {
    key: 'code',
    label: 'Mã quyền',
    type: 'text',
    required: true,
    placeholder: 'Nhập mã quyền (VD: permission_1)',
  },
  {
    key: 'user_read',
    label: 'Quyền đọc User',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'user_create',
    label: 'Quyền tạo User',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'user_update',
    label: 'Quyền cập nhật User',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'user_delete',
    label: 'Quyền xóa User',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'organization_read',
    label: 'Quyền đọc Organization',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'organization_create',
    label: 'Quyền tạo Organization',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'organization_update',
    label: 'Quyền cập nhật Organization',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'organization_delete',
    label: 'Quyền xóa Organization',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
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
    key: 'user_read',
    label: 'Quyền đọc User',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'user_create',
    label: 'Quyền tạo User',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'user_update',
    label: 'Quyền cập nhật User',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'user_delete',
    label: 'Quyền xóa User',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'organization_read',
    label: 'Quyền đọc Organization',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'organization_create',
    label: 'Quyền tạo Organization',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'organization_update',
    label: 'Quyền cập nhật Organization',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
  },
  {
    key: 'organization_delete',
    label: 'Quyền xóa Organization',
    type: 'select',
    required: false,
    options: [
      { value: true, label: 'Có' },
      { value: false, label: 'Không' },
    ],
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
    key: 'user_permissions',
    label: 'Quyền User',
    type: 'text',
    readonly: true,
  },
  {
    key: 'organization_permissions',
    label: 'Quyền Organization',
    type: 'text',
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
