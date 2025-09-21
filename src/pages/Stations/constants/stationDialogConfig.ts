import type { DialogFieldConfig } from '@/components/common/types';
import type { CreateStationDto, UpdateStationDto } from '../types';

export const stationCreateFields: DialogFieldConfig<CreateStationDto>[] = [
  {
    key: 'name',
    label: 'Tên trạm',
    type: 'text',
    required: true,
    placeholder: 'Nhập tên trạm',
  },
  {
    key: 'code',
    label: 'Mã trạm',
    type: 'text',
    required: false,
    placeholder: 'Nhập mã trạm',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    type: 'text',
    required: false,
    placeholder: 'Nhập địa chỉ',
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    type: 'text',
    required: false,
    placeholder: 'Nhập số điện thoại',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    required: false,
    placeholder: 'Nhập email',
  },
  {
    key: 'website',
    label: 'Website',
    type: 'text',
    required: false,
    placeholder: 'Nhập website',
  },
];

export const stationUpdateFields: DialogFieldConfig<UpdateStationDto>[] = [
  {
    key: 'name',
    label: 'Tên trạm',
    type: 'text',
    required: false,
    placeholder: 'Nhập tên trạm',
  },
  {
    key: 'code',
    label: 'Mã trạm',
    type: 'text',
    required: false,
    placeholder: 'Nhập mã trạm',
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    type: 'text',
    required: false,
    placeholder: 'Nhập địa chỉ',
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    type: 'text',
    required: false,
    placeholder: 'Nhập số điện thoại',
  },
  {
    key: 'email',
    label: 'Email',
    type: 'email',
    required: false,
    placeholder: 'Nhập email',
  },
  {
    key: 'website',
    label: 'Website',
    type: 'text',
    required: false,
    placeholder: 'Nhập website',
  },
];

export const stationDetailFields: DialogFieldConfig[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'text',
    readonly: true,
  },
  {
    key: 'name',
    label: 'Tên trạm',
    type: 'text',
    readonly: true,
  },
  {
    key: 'code',
    label: 'Mã trạm',
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
    key: 'phone_number',
    label: 'Số điện thoại',
    type: 'text',
    readonly: true,
  },
  {
    key: 'email',
    label: 'Email',
    type: 'text',
    readonly: true,
  },
  {
    key: 'website',
    label: 'Website',
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
