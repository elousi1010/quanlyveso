import type { CashbookTransaction } from './types';

export const CASHBOOK_CONSTANTS = {
    MODULE_TITLE: 'Sổ Quỹ Tiền Mặt',
    ACTIONS: {
        CREATE_INCOME: 'TẠO PHIẾU THU',
        CREATE_EXPENSE: 'TẠO PHIẾU CHI',
    },
    TYPES: {
        income: { label: 'Thu', color: 'success' },
        expense: { label: 'Chi', color: 'error' },
    },
    SUB_TYPES: {
        sell_ticket: 'Bán vé lẻ',
        agent_payment: 'Đại lý trả nợ',
        prize_claim: 'Chi trả số trúng',
        return_company: 'Thanh toán nhà đài',
        salary: 'Trả lương NV',
        utilities: 'Chi phí cố định (Điện, nước, rác)',
        other: 'Thu/Chi khác'
    }
};

export const MOCK_CASHBOOK_TRANSACTIONS: CashbookTransaction[] = [
    {
        id: 'cb-001',
        transactionCode: 'PT-20260224-01',
        transactionDate: '2026-02-24T08:30:00Z',
        type: 'income',
        subType: 'agent_payment',
        amount: 150000000,
        partnerId: 'partner-a',
        partnerName: 'Đại lý Nguyễn Vĩnh',
        paymentMethod: 'bank_transfer',
        note: 'Thanh toán công nợ tuần 3',
        created_at: '2026-02-24T08:31:00Z',
        created_by: 'ketoan1',
    },
    {
        id: 'cb-002',
        transactionCode: 'PC-20260224-01',
        transactionDate: '2026-02-24T10:15:00Z',
        type: 'expense',
        subType: 'return_company',
        amount: 500000000,
        partnerName: 'Công ty XSKT TP.HCM',
        paymentMethod: 'bank_transfer',
        note: 'Quyết toán lô vé thứ 2',
        created_at: '2026-02-24T10:20:00Z',
        created_by: 'ketoan1',
    },
    {
        id: 'cb-003',
        transactionCode: 'PC-20260224-02',
        transactionDate: '2026-02-24T14:00:00Z',
        type: 'expense',
        subType: 'prize_claim',
        amount: 27550000,
        partnerName: 'Lê Văn C',
        paymentMethod: 'cash',
        note: 'Chi trả giải Nhất (Đã trừ hoa hồng & thuế)',
        created_at: '2026-02-24T14:05:00Z',
        created_by: 'nhanvien1',
    },
    {
        id: 'cb-004',
        transactionCode: 'PT-20260224-02',
        transactionDate: '2026-02-24T16:45:00Z',
        type: 'income',
        subType: 'sell_ticket',
        amount: 1500000,
        partnerName: 'Khách vãng lai',
        paymentMethod: 'cash',
        note: 'Bán lẻ vé đài Tây Ninh',
        created_at: '2026-02-24T16:46:00Z',
        created_by: 'nhanvien2',
    },
    {
        id: 'cb-005',
        transactionCode: 'PC-20260224-03',
        transactionDate: '2026-02-24T17:00:00Z',
        type: 'expense',
        subType: 'utilities',
        amount: 500000,
        partnerName: 'EVN',
        paymentMethod: 'bank_transfer',
        note: 'Đóng tiền điện trạm Quận 10',
        created_at: '2026-02-24T17:01:00Z',
        created_by: 'ketoan1',
    }
];
