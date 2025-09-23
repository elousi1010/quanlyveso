import type { PartnerDebtDialogConfig } from '../types';

// Create dialog configuration
export const createPartnerDebtDialogConfig: PartnerDebtDialogConfig = {
  title: 'Thêm Công Nợ Đối Tác',
  fields: [
    {
      key: 'partner_id',
      label: 'Đối tác',
      type: 'select',
      required: true,
      placeholder: 'Chọn đối tác',
      options: [], // Will be populated dynamically
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
  ],
};

// Edit dialog configuration
export const editPartnerDebtDialogConfig: PartnerDebtDialogConfig = {
  title: 'Chỉnh Sửa Công Nợ Đối Tác',
  fields: [
    {
      key: 'partner_id',
      label: 'Đối tác',
      type: 'select',
      required: true,
      placeholder: 'Chọn đối tác',
      options: [], // Will be populated dynamically
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
  ],
};
