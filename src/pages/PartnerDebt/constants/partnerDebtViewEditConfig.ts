import type { PartnerDebtViewEditConfig } from '../types';

// View/Edit configuration
export const partnerDebtViewEditConfig: PartnerDebtViewEditConfig = {
  title: 'Chi Tiết Công Nợ Đối Tác',
  fields: [
    {
      key: 'id',
      label: 'ID',
      type: 'text',
      required: false,
    },
    {
      key: 'partner_name',
      label: 'Đối tác',
      type: 'text',
      required: false,
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
      key: 'payment_method',
      label: 'Phương thức thanh toán',
      type: 'text',
      required: true,
    },
    {
      key: 'payment_type',
      label: 'Loại giao dịch',
      type: 'text',
      required: true,
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
      key: 'created_at',
      label: 'Ngày tạo',
      type: 'text',
      required: false,
    },
    {
      key: 'updated_at',
      label: 'Ngày cập nhật',
      type: 'text',
      required: false,
    },
  ],
};
