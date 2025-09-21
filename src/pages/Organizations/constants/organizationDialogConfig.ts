import type { DialogFieldConfig } from '@/components/common/types';
import type { CreateOrganizationDto, UpdateMyOrganizationDto } from '../types';

export const organizationCreateFields: DialogFieldConfig<CreateOrganizationDto>[] = [
  {
    key: 'name',
    label: 'Tên tổ chức',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên tổ chức',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    type: 'text',
    required: true,
    placeholder: 'Nhập địa chỉ',
  },
  {
    key: 'owner_id',
    label: 'ID Chủ sở hữu',
    type: 'text',
    required: true,
    placeholder: 'Nhập ID chủ sở hữu',
  },
];

export const organizationUpdateFields: DialogFieldConfig<UpdateMyOrganizationDto>[] = [
  {
    key: 'name',
    label: 'Tên tổ chức',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên tổ chức',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    type: 'text',
    required: false,
    placeholder: 'Nhập địa chỉ',
  },
];

export const organizationDetailFields: DialogFieldConfig[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'text',
    readonly: true,
  },
  {
    key: 'name',
    label: 'Tên tổ chức',
    type: 'text',
    readonly: true,
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    type: 'text',
    readonly: true,
  },
  {
    key: 'owner_id',
    label: 'ID Chủ sở hữu',
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
