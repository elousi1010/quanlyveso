import type { PrizeClaim } from './types';

export const PRIZE_CLAIM_CONSTANTS = {
    MODULE_TITLE: 'Đổi Số Trúng Thưởng',
    ACTIONS: {
        CREATE: 'ĐỔI TRÚNG',
        VERIFY: 'ĐỐI SOÁT',
        DELETE: 'XÓA PHIẾU'
    },
    STATUS: {
        pending: { label: 'Chờ chi tiền', color: 'orange' },
        paid: { label: 'Đã chi tiền', color: 'green' },
        verified_with_company: { label: 'Đã đổi với Công ty', color: 'blue' },
    }
};

export const MOCK_PRIZE_CLAIMS: PrizeClaim[] = [
    {
        id: 'pc-101',
        claimCode: 'CLA-001',
        customerName: 'Nguyễn Văn A',
        customerPhone: '0901234567',
        customerIdentify: '079012345678',
        ticketCode: 'TG-123456',
        stationId: 'stn-tg',
        stationName: 'Đài Tiền Giang',
        drawDate: '2026-02-23',
        prizeType: 'Giải Đặc Biệt',
        prizeAmount: 2000000000,
        taxAmount: 199000000,
        commissionRate: 1, // 1%
        commissionAmount: 20000000, // 2 tỷ * 1%
        netAmount: 1781000000, // 2 tỷ - thuế - hoa hồng
        status: 'paid',
        created_at: '2026-02-24T08:00:00Z',
        created_by: 'nhanvien1',
    },
    {
        id: 'pc-102',
        claimCode: 'CLA-002',
        customerName: 'Trần Thị B',
        ticketCode: 'VL-5678',
        stationId: 'stn-vl',
        stationName: 'Đài Vĩnh Long',
        drawDate: '2026-02-24',
        prizeType: 'Giải Tư',
        prizeAmount: 3000000,
        taxAmount: 0,
        commissionRate: 2, // 2% cho giải phụ
        commissionAmount: 60000, // 3tr * 2%
        netAmount: 2940000, // 3tr - hoa hồng
        status: 'pending',
        created_at: '2026-02-24T10:15:00Z',
        created_by: 'nhanvien2',
    },
    {
        id: 'pc-103',
        claimCode: 'CLA-003',
        customerName: 'Lê Văn C',
        ticketCode: 'TP-11111',
        stationId: 'stn-tp',
        stationName: 'Đài TP.HCM',
        drawDate: '2026-02-22',
        prizeType: 'Giải Nhất',
        prizeAmount: 30000000,
        taxAmount: 2000000,
        commissionRate: 1.5,
        commissionAmount: 450000,
        netAmount: 27550000,
        status: 'verified_with_company',
        created_at: '2026-02-23T09:30:00Z',
        created_by: 'nhanvien1',
    }
];
