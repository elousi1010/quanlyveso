import type { DialogFieldConfig } from '@/components/common/types';
import type { CreateTicketDto, UpdateTicketDto } from '../types';
import { StationSelector, UserSelector } from '@/components/common';
import React from 'react';

export const ticketCreateFields: DialogFieldConfig<CreateTicketDto>[] = [
  {
    key: 'ticket_code',
    label: 'Mã vé',
    type: 'text',
    required: true,
    placeholder: 'Nhập mã vé',
  },
  {
    key: 'ticket_type',
    label: 'Loại vé',
    type: 'select',
    required: true,
    options: [
      { value: 'traditional', label: 'Truyền thống' },
      { value: 'online', label: 'Trực tuyến' },
      { value: 'instant', label: 'Tức thời' },
    ],
  },
  {
    key: 'station_id',
    label: 'Trạm',
    type: 'custom',
    required: true,
    render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
      return React.createElement(StationSelector, {
        value: value as string | null,
        onChange: (id: string | null) => handleFieldChange('station_id', id),
        label: 'Chọn trạm',
        placeholder: 'Tìm kiếm trạm...',
        required: true,
      });
    },
  },
  {
    key: 'draw_date',
    label: 'Ngày quay',
    type: 'date',
    required: true,
  },
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'text',
    required: false,
    placeholder: 'Nhập ghi chú',
  },
  {
    key: 'created_by',
    label: 'Người tạo',
    type: 'custom',
    required: false,
    render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
      return React.createElement(UserSelector, {
        value: value as string | null,
        onChange: (id: string | null) => handleFieldChange('created_by', id),
        label: 'Chọn người tạo',
        placeholder: 'Tìm kiếm người dùng...',
        required: false,
      });
    },
  },
];

export const ticketUpdateFields: DialogFieldConfig<UpdateTicketDto>[] = [
  {
    key: 'ticket_code',
    label: 'Mã vé',
    type: 'text',
    required: false,
    placeholder: 'Nhập mã vé',
  },
  {
    key: 'ticket_type',
    label: 'Loại vé',
    type: 'select',
    required: false,
    options: [
      { value: 'traditional', label: 'Truyền thống' },
      { value: 'online', label: 'Trực tuyến' },
      { value: 'instant', label: 'Tức thời' },
    ],
  },
  {
    key: 'station_id',
    label: 'Trạm',
    type: 'custom',
    required: false,
    render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
      return React.createElement(StationSelector, {
        value: value as string | null,
        onChange: (id: string | null) => handleFieldChange('station_id', id),
        label: 'Chọn trạm',
        placeholder: 'Tìm kiếm trạm...',
        required: false,
      });
    },
  },
  {
    key: 'draw_date',
    label: 'Ngày quay',
    type: 'date',
    required: false,
  },
  {
    key: 'note',
    label: 'Ghi chú',
    type: 'text',
    required: false,
    placeholder: 'Nhập ghi chú',
  },
  {
    key: 'created_by',
    label: 'Người tạo',
    type: 'custom',
    required: false,
    render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
      return React.createElement(UserSelector, {
        value: value as string | null,
        onChange: (id: string | null) => handleFieldChange('created_by', id),
        label: 'Chọn người tạo',
        placeholder: 'Tìm kiếm người dùng...',
        required: false,
      });
    },
  },
];

export const ticketDetailFields: DialogFieldConfig[] = [
  {
    key: 'id',
    label: 'ID',
    type: 'text',
    readonly: true,
  },
  {
    key: 'ticket_code',
    label: 'Mã vé',
    type: 'text',
    readonly: true,
  },
  {
    key: 'ticket_type',
    label: 'Loại vé',
    type: 'text',
    readonly: true,
  },
  {
    key: 'station_id',
    label: 'ID Trạm',
    type: 'text',
    readonly: true,
  },
  {
    key: 'draw_date',
    label: 'Ngày quay',
    type: 'text',
    readonly: true,
  },
  {
    key: 'note',
    label: 'Ghi chú',
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
