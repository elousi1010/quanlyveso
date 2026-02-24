export interface CashbookTransaction {
    id: string;
    transactionCode: string; // Mã phiếu thu/chi
    transactionDate: string; // Ngày giao dịch
    type: 'income' | 'expense'; // Loại giao dịch (Thu / Chi)
    subType: 'sell_ticket' | 'agent_payment' | 'prize_claim' | 'return_company' | 'salary' | 'utilities' | 'other'; // Lý do thu chi
    amount: number; // Số tiền
    partnerId?: string; // Mã khách hàng/Đại lý (nếu có)
    partnerName?: string; // Tên khách/Đại lý/Nhân viên
    paymentMethod: 'cash' | 'bank_transfer';
    note: string; // Diễn giải
    created_by: string;
    created_at: string;
}

export interface CashbookSearchParams {
    searchKey?: string;
    page?: number;
    limit?: number;
    type?: string;
    subType?: string;
    fromDate?: string;
    toDate?: string;
}
