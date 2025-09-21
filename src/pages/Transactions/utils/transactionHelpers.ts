import type { Transaction } from '../types';

export const formatTransactionData = (transaction: Transaction) => {
  return {
    ...transaction,
    amount: new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(transaction.amount),
    created_at: transaction.created_at 
      ? new Date(transaction.created_at).toLocaleDateString('vi-VN')
      : '',
    updated_at: transaction.updated_at 
      ? new Date(transaction.updated_at).toLocaleDateString('vi-VN')
      : '',
  };
};

export const validateTransactionData = (data: Partial<Transaction>) => {
  const errors: Record<string, string> = {};

  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Số tiền phải lớn hơn 0';
  }

  if (!data.type?.trim()) {
    errors.type = 'Loại giao dịch là bắt buộc';
  }

  if (!data.subType?.trim()) {
    errors.subType = 'Loại phụ là bắt buộc';
  }

  if (!data.partner_id?.trim()) {
    errors.partner_id = 'ID đối tác là bắt buộc';
  }

  if (!data.tickets || !Array.isArray(data.tickets) || data.tickets.length === 0) {
    errors.tickets = 'Vé số là bắt buộc';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const getTransactionTypeLabel = (type: string) => {
  const typeMap: Record<string, string> = {
    'income': 'Thu nhập',
    'expense': 'Chi phí',
  };
  return typeMap[type] || type;
};

export const getSubTypeLabel = (subType: string) => {
  const subTypeMap: Record<string, string> = {
    'buy_from_agent': 'Mua từ đại lý',
    'sell_to_customer': 'Bán cho khách hàng',
    'commission': 'Hoa hồng',
    'refund': 'Hoàn tiền',
  };
  return subTypeMap[subType] || subType;
};
