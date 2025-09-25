import type { DialogFieldConfig } from '@/components/common/types';
import React from 'react';
import { StationSelector, PartnerSelector } from '@/components/common';

export const inventoryCreateFields: DialogFieldConfig[] = [
  {
    key: 'code',
    label: 'Mã Kho',
    type: 'text',
    required: true,
    placeholder: 'Nhập mã kho',
  },
  {
    key: 'ticket_id',
    label: 'Mã Vé',
    type: 'text',
    required: true,
    placeholder: 'Nhập mã vé',
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
    required: true,
    placeholder: 'Nhập số lượng',
  },
  {
    key: 'avg_cost',
    label: 'Giá Trung Bình',
    type: 'number',
    required: true,
    placeholder: 'Nhập giá trung bình',
  },
  {
    key: 'draw_date',
    label: 'Ngày Quay',
    type: 'date',
    required: true,
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'select',
    required: true,
    options: [
      { value: 'buy_from_agent', label: 'Mua từ đại lý' },
      { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
      { value: 'transfer', label: 'Chuyển kho' },
      { value: 'return', label: 'Trả về' },
    ],
  },
  {
    key: 'partner_id',
    label: 'Đối Tác',
    type: 'custom',
    required: true,
    render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
      return React.createElement(PartnerSelector, {
        value: value as string | null,
        onChange: (id: string | null) => handleFieldChange('partner_id', id),
        placeholder: 'Chọn đối tác...',
      });
    },
  },
  {
    key: 'organization_id',
    label: 'Tổ Chức',
    type: 'custom',
    required: true,
    render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
      return React.createElement(StationSelector, {
        value: value as string | null,
        onChange: (id: string | null) => handleFieldChange('organization_id', id),
        placeholder: 'Chọn tổ chức/trạm...',
      });
    },
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
    required: false,
  },
];

export const inventoryUpdateFields: DialogFieldConfig[] = [
  {
    key: 'code',
    label: 'Mã Kho',
    type: 'text',
    required: false,
    placeholder: 'Nhập mã kho',
  },
  {
    key: 'ticket_id',
    label: 'Mã Vé',
    type: 'text',
    required: false,
    placeholder: 'Nhập mã vé',
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
    required: false,
    placeholder: 'Nhập số lượng',
  },
  {
    key: 'avg_cost',
    label: 'Giá Trung Bình',
    type: 'number',
    required: false,
    placeholder: 'Nhập giá trung bình',
  },
  {
    key: 'draw_date',
    label: 'Ngày Quay',
    type: 'date',
    required: false,
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'select',
    required: false,
    options: [
      { value: 'buy_from_agent', label: 'Mua từ đại lý' },
      { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
      { value: 'transfer', label: 'Chuyển kho' },
      { value: 'return', label: 'Trả về' },
    ],
  },
  {
    key: 'partner_id',
    label: 'Đối Tác',
    type: 'custom',
    required: false,
    render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
      return React.createElement(PartnerSelector, {
        value: value as string | null,
        onChange: (id: string | null) => handleFieldChange('partner_id', id),
        placeholder: 'Chọn đối tác...',
      });
    },
  },
  {
    key: 'organization_id',
    label: 'Tổ Chức',
    type: 'custom',
    required: false,
    render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
      return React.createElement(PartnerSelector, {
        value: value as string | null,
        onChange: (id: string | null) => handleFieldChange('organization_id', id),
        placeholder: 'Chọn tổ chức/trạm...',
      });
    },
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
    required: false,
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
    key: 'code',
    label: 'Mã Kho',
    type: 'text',
    readonly: true,
  },
  {
    key: 'ticket_id',
    label: 'Mã Vé',
    type: 'text',
    readonly: true,
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
    readonly: true,
  },
  {
    key: 'avg_cost',
    label: 'Giá Trung Bình',
    type: 'number',
    readonly: true,
  },
  {
    key: 'draw_date',
    label: 'Ngày Quay',
    type: 'date',
    readonly: true,
  },
  {
    key: 'sub_type',
    label: 'Loại Phụ',
    type: 'text',
    readonly: true,
  },
  {
    key: 'partner_id',
    label: 'Đối Tác',
    type: 'text',
    readonly: true,
  },
  {
    key: 'organization_id',
    label: 'Tổ Chức',
    type: 'text',
    readonly: true,
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
    readonly: true,
  },
  {
    key: 'created_at',
    label: 'Ngày Tạo',
    type: 'text',
    readonly: true,
  },
  {
    key: 'created_by',
    label: 'Người Tạo',
    type: 'text',
    readonly: true,
  },
  {
    key: 'updated_at',
    label: 'Ngày Cập Nhật',
    type: 'text',
    readonly: true,
  },
  {
    key: 'updated_by',
    label: 'Người Cập Nhật',
    type: 'text',
    readonly: true,
  },
];
