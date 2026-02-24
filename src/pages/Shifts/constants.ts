import type { Shift } from './types';

export const SHIFT_CONSTANTS = {
    MODULE_TITLE: 'Bàn Giao Ca',
    ACTIONS: {
        OPEN_SHIFT: 'MỞ CA LÀM VIỆC',
        CLOSE_SHIFT: 'CHỐT CA GIAO TIỀN'
    },
    STATUS: {
        open: { label: 'Đang mở (Đang làm)', color: 'processing' },
        closed: { label: 'Đã chốt', color: 'success' },
    }
};

export const MOCK_SHIFTS: Shift[] = [
    {
        id: 'sh-001',
        shiftCode: 'CA-20260224-01',
        stationId: 'stn-tp',
        stationName: 'Trạm Tổng TP.HCM',
        employeeId: 'emp-101',
        employeeName: 'Nguyễn Văn Thu Ngân',
        openedAt: '2026-02-24T06:30:00Z',
        closedAt: '2026-02-24T14:30:00Z',
        status: 'closed',
        systemCash: 153000000,
        actualCash: 153000000,
        cashDifference: 0,
        note: 'Bàn giao ca sáng đủ tiền',
    },
    {
        id: 'sh-002',
        shiftCode: 'CA-20260224-02',
        stationId: 'stn-bd',
        stationName: 'Trạm Cấp 2 Bình Dương',
        employeeId: 'emp-102',
        employeeName: 'Trần Thị Thu Tiền',
        openedAt: '2026-02-24T07:00:00Z',
        closedAt: '2026-02-24T15:00:00Z',
        status: 'closed',
        systemCash: 85500000,
        actualCash: 85400000,
        cashDifference: -100000,
        note: 'Đếm lại thiếu 100k do thối tiền nhầm',
    },
    {
        id: 'sh-003',
        shiftCode: 'CA-20260224-03',
        stationId: 'stn-tp',
        stationName: 'Trạm Tổng TP.HCM',
        employeeId: 'emp-103',
        employeeName: 'Lê Kế Toán',
        openedAt: '2026-02-24T14:30:00Z',
        status: 'open',
        systemCash: 56000000,
        actualCash: 0,
        cashDifference: 0,
    },
];
