import type { FormField, DetailField } from '@/components/common/types';

export const inventoryTransactionFormFields: FormField[] = [
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
    required: true,
    placeholder: 'Nhập số lượng',
    min: 0,
  },
  {
    key: 'price',
    label: 'Giá',
    type: 'number',
    required: true,
    placeholder: 'Nhập giá',
    min: 0,
  },
  {
    key: 'transaction.type',
    label: 'Loại Giao Dịch',
    type: 'select',
    required: true,
    options: [
      { value: 'import', label: 'Nhập' },
      { value: 'export', label: 'Xuất' },
    ],
  },
  {
    key: 'transaction.sub_type',
    label: 'Loại Phụ',
    type: 'select',
    required: true,
    options: [
      { value: 'return_from_seller', label: 'Trả từ người bán' },
      { value: 'buy_from_partner', label: 'Mua từ đối tác' },
      { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
      { value: 'transfer', label: 'Chuyển kho' },
      { value: 'return', label: 'Trả hàng' },
    ],
  },
  {
    key: 'transaction.partner_id',
    label: 'Đối tác',
    type: 'custom',
    required: true,
    // render: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => {
    //   const { UserSelector } = require('@/components/common'); // eslint-disable-line @typescript-eslint/no-require-imports
    //   return UserSelector({
    //     value: value as string | null,
    //     onChange: (id: string | null, item: any) => handleFieldChange('transaction.partner_id', id),
    //     type: 'partner',
    //     label: 'Chọn đối tác',
    //     placeholder: 'Tìm kiếm đối tác...',
    //     required: true,
    //   });
    // },
  },
  {
    key: 'transaction.note',
    label: 'Ghi Chú',
    type: 'textarea',
    required: false,
    placeholder: 'Nhập ghi chú',
    rows: 3,
  },
  {
    key: 'is_active',
    label: 'Trạng Thái',
    type: 'boolean',
  },
];

export const inventoryTransactionDetailFields: DetailField[] = [
  {
    key: 'inventory',
    label: 'Mã Kho',
    type: 'custom',
    render: (inventory: unknown) => {
      if (typeof inventory === 'object' && inventory !== null) {
        return (inventory as { code?: string }).code || 'N/A';
      }
      return String(inventory);
    },
  },
  {
    key: 'inventory',
    label: 'Mã Vé',
    type: 'custom',
    render: (inventory: unknown) => {
      if (typeof inventory === 'object' && inventory !== null) {
        return (inventory as { ticket_id?: string }).ticket_id || 'N/A';
      }
      return String(inventory);
    },
  },
  {
    key: 'quantity',
    label: 'Số Lượng',
    type: 'number',
  },
  {
    key: 'price',
    label: 'Giá',
    type: 'currency',
  },
  {
    key: 'total',
    label: 'Tổng Tiền',
    type: 'currency',
  },
  {
    key: 'inventory',
    label: 'Ngày Quay',
    type: 'custom',
    render: (inventory: unknown) => {
      if (typeof inventory === 'object' && inventory !== null) {
        const drawDate = (inventory as { draw_date?: string }).draw_date;
        return drawDate ? new Date(drawDate).toLocaleDateString('vi-VN') : 'N/A';
      }
      return 'N/A';
    },
  },
  {
    key: 'transaction',
    label: 'Loại Giao Dịch',
    type: 'custom',
    render: (transaction: unknown) => {
      if (typeof transaction === 'object' && transaction !== null) {
        const type = (transaction as { type?: string }).type;
        const typeMap: Record<string, string> = {
          'import': 'Nhập',
          'export': 'Xuất',
        };
        return typeMap[type as string] || String(type);
      }
      return 'N/A';
    },
    chip: {
      color: 'primary',
      variant: 'outlined',
    },
  },
  {
    key: 'transaction',
    label: 'Loại Phụ',
    type: 'custom',
    render: (transaction: unknown) => {
      if (typeof transaction === 'object' && transaction !== null) {
        const subType = (transaction as { sub_type?: string }).sub_type;
        const subTypeMap: Record<string, string> = {
          'return_from_seller': 'Trả từ người bán',
          'buy_from_partner': 'Mua từ đối tác',
          'sell_to_customer': 'Bán cho khách hàng',
          'transfer': 'Chuyển kho',
          'return': 'Trả hàng',
        };
        return subTypeMap[subType as string] || String(subType);
      }
      return 'N/A';
    },
    chip: {
      color: 'secondary',
      variant: 'outlined',
    },
  },
  {
    key: 'transaction',
    label: 'Partner ID',
    type: 'custom',
    render: (transaction: unknown) => {
      if (typeof transaction === 'object' && transaction !== null) {
        return (transaction as { partner_id?: string }).partner_id || 'N/A';
      }
      return 'N/A';
    },
  },
  {
    key: 'transaction',
    label: 'Ghi Chú',
    type: 'custom',
    render: (transaction: unknown) => {
      if (typeof transaction === 'object' && transaction !== null) {
        return (transaction as { note?: string }).note || 'N/A';
      }
      return 'N/A';
    },
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
  {
    key: 'created_at',
    label: 'Ngày Tạo',
    type: 'datetime',
  },
  {
    key: 'updated_at',
    label: 'Ngày Cập Nhật',
    type: 'datetime',
  },
];
