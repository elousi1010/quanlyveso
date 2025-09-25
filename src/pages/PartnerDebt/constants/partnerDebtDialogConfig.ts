import type { PartnerDebtDialogConfig } from '../types';
import { PartnerSelector, UserSelector } from '@/components/common';
import React from 'react';

// Create dialog configuration
export const createPartnerDebtDialogConfig: PartnerDebtDialogConfig = {
  title: 'Thêm Công Nợ Đối Tác',
  fields: [
    {
      key: 'partner_id',
      label: 'Đối tác',
      type: 'custom',
      required: true,
      render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
        return React.createElement(PartnerSelector, {
          value: value as string | null,
          onChange: (id: string | null) => handleFieldChange('partner_id', id),
          placeholder: 'Chọn đối tác...',
        });
      },
      validation: {
        message: 'Vui lòng chọn đối tác',
      },
    },
    {
      key: 'payment_method',
      label: 'Phương thức thanh toán',
      type: 'select',
      required: true,
      options: [
        { value: 'cash', label: 'Tiền mặt' },
        { value: 'bank_transfer', label: 'Chuyển khoản' },
        { value: 'credit_card', label: 'Thẻ tín dụng' },
        { value: 'other', label: 'Khác' },
      ],
      validation: {
        message: 'Vui lòng chọn phương thức thanh toán',
      },
    },
    {
      key: 'payment_type',
      label: 'Loại giao dịch',
      type: 'select',
      required: true,
      options: [
        { value: 'income', label: 'Thu nhập' },
        { value: 'expense', label: 'Chi phí' },
      ],
      validation: {
        message: 'Vui lòng chọn loại giao dịch',
      },
    },
    {
      key: 'amount',
      label: 'Số tiền',
      type: 'number',
      required: true,
      placeholder: 'Nhập số tiền',
      validation: {
        min: 0,
        max: 999999999,
        message: 'Số tiền phải từ 0 đến 999,999,999',
      },
    },
    {
      key: 'description',
      label: 'Mô tả',
      type: 'textarea',
      required: false,
      placeholder: 'Nhập mô tả (tùy chọn)',
      validation: {
        max: 500,
        message: 'Mô tả không được quá 500 ký tự',
      },
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
          placeholder: 'Chọn người tạo...',
        });
      },
    },
  ],
};

// Edit dialog configuration
export const editPartnerDebtDialogConfig: PartnerDebtDialogConfig = {
  title: 'Chỉnh Sửa Công Nợ Đối Tác',
  fields: [
    {
      key: 'partner_id',
      label: 'Đối tác',
      type: 'custom',
      required: true,
      render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
        return React.createElement(PartnerSelector, {
          value: value as string | null,
          onChange: (id: string | null) => handleFieldChange('partner_id', id),
          placeholder: 'Chọn đối tác...',
        });
      },
      validation: {
        message: 'Vui lòng chọn đối tác',
      },
    },
    {
      key: 'payment_method',
      label: 'Phương thức thanh toán',
      type: 'select',
      required: true,
      options: [
        { value: 'cash', label: 'Tiền mặt' },
        { value: 'bank_transfer', label: 'Chuyển khoản' },
        { value: 'credit_card', label: 'Thẻ tín dụng' },
        { value: 'other', label: 'Khác' },
      ],
      validation: {
        message: 'Vui lòng chọn phương thức thanh toán',
      },
    },
    {
      key: 'payment_type',
      label: 'Loại giao dịch',
      type: 'select',
      required: true,
      options: [
        { value: 'income', label: 'Thu nhập' },
        { value: 'expense', label: 'Chi phí' },
      ],
      validation: {
        message: 'Vui lòng chọn loại giao dịch',
      },
    },
    {
      key: 'amount',
      label: 'Số tiền',
      type: 'number',
      required: true,
      placeholder: 'Nhập số tiền',
      validation: {
        min: 0,
        max: 999999999,
        message: 'Số tiền phải từ 0 đến 999,999,999',
      },
    },
    {
      key: 'description',
      label: 'Mô tả',
      type: 'textarea',
      required: false,
      placeholder: 'Nhập mô tả (tùy chọn)',
      validation: {
        max: 500,
        message: 'Mô tả không được quá 500 ký tự',
      },
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
          placeholder: 'Chọn người tạo...',
        });
      },
    },
  ],
};
