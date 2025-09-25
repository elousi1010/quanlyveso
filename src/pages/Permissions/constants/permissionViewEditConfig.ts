import type { FormField, DetailField } from '@/components/common/types';

export const permissionFormFields: FormField[] = [
  {
    key: 'name',
    label: 'Tên Quyền',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên quyền',
  },
  {
    key: 'description',
    label: 'Mô Tả',
    type: 'textarea',
    required: false,
    placeholder: 'Nhập mô tả quyền',
    rows: 3,
  },
  {
    key: 'resource',
    label: 'Tài Nguyên',
    type: 'text',
    required: true,
    placeholder: 'Nhập tài nguyên',
  },
  {
    key: 'action',
    label: 'Hành Động',
    type: 'text',
    required: true,
    placeholder: 'Nhập hành động',
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
  },
];

export const permissionDetailFields: DetailField[] = [
  {
    key: 'name',
    label: 'Tên Quyền',
    type: 'text',
  },
  {
    key: 'code',
    label: 'Mã Quyền',
    type: 'text',
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'custom',
    render: (isActive: unknown) => isActive ? 'Hoạt động' : 'Không hoạt động',
    chip: {
      color: 'success',
      variant: 'filled',
    },
  },
  // Users count
  {
    key: 'users',
    label: 'Số Lượng User',
    type: 'custom',
    render: (data: unknown) => {
      const permission = data as Record<string, unknown>;
      const users = permission.users as unknown[] || [];
      return `${users.length} user(s)`;
    },
  },
  {
    key: 'created_at',
    label: 'Ngày Tạo',
    type: 'date',
  },
  {
    key: 'created_by',
    label: 'Người Tạo',
    type: 'text',
  },
  {
    key: 'updated_at',
    label: 'Ngày Cập Nhật',
    type: 'date',
  },
  {
    key: 'updated_by',
    label: 'Người Cập Nhật',
    type: 'text',
  },
];
