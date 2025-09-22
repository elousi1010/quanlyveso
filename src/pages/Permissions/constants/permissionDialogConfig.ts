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
  // User permissions
  {
    key: 'user_read',
    label: 'Quyền đọc User',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'user_create',
    label: 'Quyền tạo User',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'user_update',
    label: 'Quyền cập nhật User',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'user_delete',
    label: 'Quyền xóa User',
    type: 'checkbox',
    required: false,
  },
  // Ticket permissions
  {
    key: 'ticket_read',
    label: 'Quyền đọc Ticket',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'ticket_create',
    label: 'Quyền tạo Ticket',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'ticket_update',
    label: 'Quyền cập nhật Ticket',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'ticket_delete',
    label: 'Quyền xóa Ticket',
    type: 'checkbox',
    required: false,
  },
  // Partner permissions
  {
    key: 'partner_read',
    label: 'Quyền đọc Partner',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'partner_create',
    label: 'Quyền tạo Partner',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'partner_update',
    label: 'Quyền cập nhật Partner',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'partner_delete',
    label: 'Quyền xóa Partner',
    type: 'checkbox',
    required: false,
  },
  // Permission permissions
  {
    key: 'permission_read',
    label: 'Quyền đọc Permission',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'permission_create',
    label: 'Quyền tạo Permission',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'permission_update',
    label: 'Quyền cập nhật Permission',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'permission_delete',
    label: 'Quyền xóa Permission',
    type: 'checkbox',
    required: false,
  },
  // Transaction permissions
  {
    key: 'transaction_read',
    label: 'Quyền đọc Transaction',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'transaction_create',
    label: 'Quyền tạo Transaction',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'transaction_update',
    label: 'Quyền cập nhật Transaction',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'transaction_delete',
    label: 'Quyền xóa Transaction',
    type: 'checkbox',
    required: false,
  },
  // Organization permissions
  {
    key: 'organization_read',
    label: 'Quyền đọc Organization',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'organization_create',
    label: 'Quyền tạo Organization',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'organization_update',
    label: 'Quyền cập nhật Organization',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'organization_delete',
    label: 'Quyền xóa Organization',
    type: 'checkbox',
    required: false,
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
  // User permissions
  {
    key: 'user_read',
    label: 'Quyền đọc User',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'user_create',
    label: 'Quyền tạo User',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'user_update',
    label: 'Quyền cập nhật User',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'user_delete',
    label: 'Quyền xóa User',
    type: 'checkbox',
    required: false,
  },
  // Ticket permissions
  {
    key: 'ticket_read',
    label: 'Quyền đọc Ticket',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'ticket_create',
    label: 'Quyền tạo Ticket',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'ticket_update',
    label: 'Quyền cập nhật Ticket',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'ticket_delete',
    label: 'Quyền xóa Ticket',
    type: 'checkbox',
    required: false,
  },
  // Partner permissions
  {
    key: 'partner_read',
    label: 'Quyền đọc Partner',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'partner_create',
    label: 'Quyền tạo Partner',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'partner_update',
    label: 'Quyền cập nhật Partner',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'partner_delete',
    label: 'Quyền xóa Partner',
    type: 'checkbox',
    required: false,
  },
  // Permission permissions
  {
    key: 'permission_read',
    label: 'Quyền đọc Permission',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'permission_create',
    label: 'Quyền tạo Permission',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'permission_update',
    label: 'Quyền cập nhật Permission',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'permission_delete',
    label: 'Quyền xóa Permission',
    type: 'checkbox',
    required: false,
  },
  // Transaction permissions
  {
    key: 'transaction_read',
    label: 'Quyền đọc Transaction',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'transaction_create',
    label: 'Quyền tạo Transaction',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'transaction_update',
    label: 'Quyền cập nhật Transaction',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'transaction_delete',
    label: 'Quyền xóa Transaction',
    type: 'checkbox',
    required: false,
  },
  // Organization permissions
  {
    key: 'organization_read',
    label: 'Quyền đọc Organization',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'organization_create',
    label: 'Quyền tạo Organization',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'organization_update',
    label: 'Quyền cập nhật Organization',
    type: 'checkbox',
    required: false,
  },
  {
    key: 'organization_delete',
    label: 'Quyền xóa Organization',
    type: 'checkbox',
    required: false,
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
    key: 'is_active',
    label: 'Trạng thái',
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
    key: 'ticket_permissions',
    label: 'Quyền Ticket',
    type: 'text',
    readonly: true,
  },
  {
    key: 'partner_permissions',
    label: 'Quyền Partner',
    type: 'text',
    readonly: true,
  },
  {
    key: 'permission_permissions',
    label: 'Quyền Permission',
    type: 'text',
    readonly: true,
  },
  {
    key: 'transaction_permissions',
    label: 'Quyền Transaction',
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
    key: 'created_by',
    label: 'Người tạo',
    type: 'text',
    readonly: true,
  },
  {
    key: 'updated_at',
    label: 'Ngày cập nhật',
    type: 'text',
    readonly: true,
  },
  {
    key: 'updated_by',
    label: 'Người cập nhật',
    type: 'text',
    readonly: true,
  },
  {
    key: 'organization_id',
    label: 'ID Tổ chức',
    type: 'text',
    readonly: true,
  },
];
