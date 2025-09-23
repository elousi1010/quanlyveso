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
    amount: parseFloat(partnerDebt.amount) || 0, // Convert string to number
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
    amount: parseFloat(partnerDebt.amount) || 0, // Convert string to number
    description: partnerDebt.description || '',
  };
};

// Convert PartnerDebt to detail data format
export const convertToDetailData = (partnerDebt: PartnerDebt): PartnerDebtDetailData => {
  return {
    id: partnerDebt.id,
    partner_id: partnerDebt.partner_id,
    partner_name: partnerDebt.partner.name,
    payment_method: partnerDebt.payment_method,
    payment_type: partnerDebt.payment_type,
    amount: parseFloat(partnerDebt.amount), // Convert string to number
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
  
  if (!data.debt_amount || data.debt_amount <= 0) {
    errors.push('Số tiền phải lớn hơn 0');
  }
  
  if (!data.debt_type) {
    errors.push('Vui lòng chọn loại công nợ');
  }
  
  if (!data.due_date) {
    errors.push('Vui lòng chọn ngày đến hạn');
  }
  
  if (data.description && data.description.length > 500) {
    errors.push('Mô tả không được quá 500 ký tự');
  }
  
  return errors;
};

// Get status color
export const getStatusColor = (status: 'pending' | 'paid' | 'partial' | 'overdue'): string => {
  const colorMap = {
    pending: '#ff9800',
    paid: '#4caf50',
    partial: '#2196f3',
    overdue: '#f44336',
  };
  return colorMap[status] || '#757575';
};

// Get debt type color
export const getDebtTypeColor = (debtType: 'credit' | 'debit'): string => {
  return debtType === 'credit' ? '#4caf50' : '#f44336';
};
