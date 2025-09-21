import type { DialogFieldConfig } from '@/components/common/types';
import type { CreateInventoryDto, UpdateInventoryDto } from '../types';

// Note: Since Swagger shows empty properties for inventory DTOs,
// we'll create basic fields that can be extended later
export const inventoryCreateFields: DialogFieldConfig<CreateInventoryDto>[] = [
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'text',
    required: false,
    placeholder: 'Nhập ghi chú cho kho',
  },
];

export const inventoryUpdateFields: DialogFieldConfig<UpdateInventoryDto>[] = [
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'text',
    required: false,
    placeholder: 'Nhập ghi chú cho kho',
  },
];

export const inventoryDetailFields: DialogFieldConfig[] = [
  {
    key: 'id',
    label: 'ID',
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
