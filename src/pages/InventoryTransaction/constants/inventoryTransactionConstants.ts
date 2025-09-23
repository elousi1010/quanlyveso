export const INVENTORY_TRANSACTION_TYPES = [
  { value: 'import', label: 'Nhập' },
  { value: 'export', label: 'Xuất' },
] as const;

export const INVENTORY_TRANSACTION_SUB_TYPES = [
  { value: 'return_from_seller', label: 'Trả từ người bán' },
  { value: 'buy_from_partner', label: 'Mua từ đối tác' },
  { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
  { value: 'transfer', label: 'Chuyển kho' },
  { value: 'return', label: 'Trả hàng' },
] as const;

export const INVENTORY_TRANSACTION_SORT_OPTIONS = [
  { value: 'created_at', label: 'Ngày tạo' },
  { value: 'updated_at', label: 'Ngày cập nhật' },
  { value: 'quantity', label: 'Số lượng' },
  { value: 'avg_cost', label: 'Giá trung bình' },
  { value: 'draw_date', label: 'Ngày quay' },
] as const;

export const INVENTORY_TRANSACTION_STATUS_OPTIONS = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Không hoạt động' },
] as const;
