export interface Shift {
    id: string;
    shiftCode: string; // Mã ca
    stationId: string; // Mã trạm vé
    stationName: string; // Tên trạm vé
    employeeId: string; // Mã nhân viên thụ ca
    employeeName: string; // Tên nhân viên
    openedAt: string; // Thời gian mở ca
    closedAt?: string; // Thời gian chốt ca
    status: 'open' | 'closed'; // Trạng thái ca

    // Dữ liệu khi đóng ca
    systemCash: number; // Tiền mặt theo hệ thống
    actualCash: number; // Tiền mặt kiểm kê thực tế
    cashDifference: number; // Tiền mặt chênh lệch (Thực tế - Hệ thống)
    note?: string; // Ghi chú
}

export interface ShiftSearchParams {
    searchKey?: string;
    page?: number;
    limit?: number;
    status?: string;
    stationId?: string;
    fromDate?: string;
    toDate?: string;
}
