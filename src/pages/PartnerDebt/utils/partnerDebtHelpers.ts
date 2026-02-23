import type {
  PartnerDebt,
  PartnerDebtTableRow,
  PartnerDebtFormData,
  PartnerDebtDetailData
} from '../types';

// Convert PartnerDebt to table row format
export const convertToTableRow = (partnerDebt: PartnerDebt): PartnerDebtTableRow => {
  return {
    id: partnerDebt.id,
    partner_name: partnerDebt.partner?.name || 'N/A',
    payment_method: partnerDebt.payment_method,
    payment_type: partnerDebt.payment_type,
    transaction_sub_type: partnerDebt.transaction_sub_type,
    amount: parseFloat(partnerDebt.amount) || 0,
    tax_amount: partnerDebt.tax_amount ? parseFloat(partnerDebt.tax_amount) : 0,
    description: partnerDebt.description || '',
    created_at: partnerDebt.created_at,
    is_active: partnerDebt.is_active,
  };
};

// Convert PartnerDebt to form data format
export const convertToFormData = (partnerDebt: PartnerDebt): PartnerDebtFormData => {
  return {
    partner_id: partnerDebt.partner_id,
    payment_method: partnerDebt.payment_method || 'cash',
    payment_type: partnerDebt.payment_type || 'income',
    transaction_sub_type: partnerDebt.transaction_sub_type,
    amount: parseFloat(partnerDebt.amount) || 0,
    tax_amount: partnerDebt.tax_amount ? parseFloat(partnerDebt.tax_amount) : 0,
    commission_amount: partnerDebt.commission_amount ? parseFloat(partnerDebt.commission_amount) : 0,
    description: partnerDebt.description || '',
  };
};

// Convert PartnerDebt to detail data format
export const convertToDetailData = (partnerDebt: PartnerDebt): PartnerDebtDetailData => {
  return {
    id: partnerDebt.id,
    partner_id: partnerDebt.partner_id,
    partner_name: partnerDebt.partner?.name || 'N/A',
    payment_method: partnerDebt.payment_method,
    payment_type: partnerDebt.payment_type,
    transaction_sub_type: partnerDebt.transaction_sub_type,
    amount: parseFloat(partnerDebt.amount) || 0,
    tax_amount: partnerDebt.tax_amount ? parseFloat(partnerDebt.tax_amount) : 0,
    commission_amount: partnerDebt.commission_amount ? parseFloat(partnerDebt.commission_amount) : 0,
    description: partnerDebt.description || '',
    created_at: partnerDebt.created_at,
    updated_at: partnerDebt.updated_at,
    is_active: partnerDebt.is_active,
  };
};

// Calculate remaining amount
export const calculateRemainingAmount = (debtAmount: number, paidAmount: number): number => {
  return Math.max(0, debtAmount - paidAmount);
};

// Determine status based on amounts and due date
export const determineStatus = (
  debtAmount: number,
  paidAmount: number,
  dueDate: string
): 'pending' | 'paid' | 'partial' | 'overdue' => {
  const remaining = calculateRemainingAmount(debtAmount, paidAmount);
  const isOverdue = new Date(dueDate) < new Date();

  if (remaining === 0) {
    return 'paid';
  } else if (remaining === debtAmount) {
    return isOverdue ? 'overdue' : 'pending';
  } else {
    return isOverdue ? 'overdue' : 'partial';
  }
};

// Format debt type for display
export const formatDebtType = (debtType: 'credit' | 'debit'): string => {
  return debtType === 'credit' ? 'Công nợ' : 'Nợ';
};

// Format status for display
export const formatStatus = (status: 'pending' | 'paid' | 'partial' | 'overdue'): string => {
  const statusMap = {
    pending: 'Chờ xử lý',
    paid: 'Đã thanh toán',
    partial: 'Thanh toán một phần',
    overdue: 'Quá hạn',
  };
  return statusMap[status] || status;
};

// Validate form data
export const validateFormData = (data: PartnerDebtFormData): string[] => {
  const errors: string[] = [];

  if (!data.partner_id) {
    errors.push('Vui lòng chọn đối tác');
  }

  if (!data.amount || data.amount <= 0) {
    errors.push('Số tiền phải lớn hơn 0');
  }

  if (!data.payment_type) {
    errors.push('Vui lòng chọn loại giao dịch');
  }

  // Business Logic: Nếu là cấn trừ vé trúng > 10 triệu thì bắt buộc có số thuế
  if (data.transaction_sub_type === 'winning_settlement' && data.amount > 10000000) {
    const expectedTax = calculateWinningTax(data.amount);
    if (!data.tax_amount || data.tax_amount < expectedTax) {
      errors.push(`Số tiền trúng trên 10tr bắt buộc phải có thuế thu nhập (Min: ${expectedTax.toLocaleString()} VNĐ)`);
    }
  }

  if (data.description && data.description.length > 500) {
    errors.push('Mô tả không được quá 500 ký tự');
  }

  return errors;
};

// Calculate Personal Income Tax (PIT) for winnings > 10M (10% on the excess)
export const calculateWinningTax = (amount: number): number => {
  const TAX_THRESHOLD = 10000000; // 10,000,000 VNĐ
  const TAX_RATE = 0.1; // 10%
  if (amount <= TAX_THRESHOLD) return 0;
  return (amount - TAX_THRESHOLD) * TAX_RATE;
};

// Calculate Commission based on rate
export const calculateCommission = (amount: number, ratePercent: number): number => {
  return amount * (ratePercent / 100);
};

// Get Debt Aging Status and Label
export const getDebtAgingStatus = (overdueDays: number): { label: string; color: string } => {
  if (overdueDays <= 0) return { label: 'Trong hạn', color: '#4caf50' };
  if (overdueDays <= 7) return { label: 'Nợ ngắn hạn', color: '#ff9800' };
  if (overdueDays <= 30) return { label: 'Nợ trung hạn', color: '#f44336' };
  return { label: 'Nợ xấu/Khó đòi', color: '#212121' };
};

// Get Risk Status Label
export const getRiskStatusInfo = (status: 'normal' | 'warning' | 'high_risk' | 'blacklisted'): { label: string; color: string } => {
  const map = {
    normal: { label: 'Bình thường', color: '#4caf50' },
    warning: { label: 'Cần chú ý', color: '#ff9800' },
    high_risk: { label: 'Rủi ro cao', color: '#f44336' },
    blacklisted: { label: 'Danh sách đen', color: '#212121' },
  };
  return map[status] || map.normal;
};

// Format transaction sub-type for display
export const formatTransactionSubType = (type?: string): string => {
  const map: Record<string, string> = {
    return: 'Trả vé ế',
    winning_settlement: 'Cấn trừ vé trúng',
    swap: 'Hoán đổi kho',
    lost_ticket_loss: 'Hao hụt/Mất vé',
    commission_reward: 'Thưởng hoa hồng',
    price_override: 'Điều chỉnh giá',
  };
  return map[type || ''] || 'Giao dịch thường';
};

// Get status color (updated)
export const getStatusColor = (status: string): string => {
  const colorMap: Record<string, string> = {
    pending: '#ff9800',
    paid: '#4caf50',
    partial: '#2196f3',
    overdue: '#f44336',
    income: '#4caf50',
    expense: '#f44336',
    adjustment: '#7b1fa2',
    tax_withholding: '#e64a19',
  };
  return colorMap[status] || '#757575';
};
