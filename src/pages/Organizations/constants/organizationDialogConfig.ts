import type { DialogFieldConfig } from '@/components/common/types';
import type { CreateOrganizationDto, UpdateOrganizationDto } from '../types';

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
    required: false,
    placeholder: 'Nhập địa chỉ',
  },
];

export const organizationUpdateFields: DialogFieldConfig<UpdateOrganizationDto>[] = [
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
];
