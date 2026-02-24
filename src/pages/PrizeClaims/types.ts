export interface PrizeClaim {
    id: string;
    claimCode: string; // Mã phiếu đổi
    customerName: string; // Tên khách hàng
    customerPhone?: string; // SĐT khách hàng
    customerIdentify?: string; // CCCD (nếu trúng giải lớn)
    ticketCode: string; // Mã tờ vé trúng
    stationId: string; // Mã đài
    stationName: string; // Tên đài
    drawDate: string; // Ngày xổ
    prizeType: string; // Loại giải (Đặc biệt, Nhất, Nhì...)
    prizeAmount: number; // Tiền trúng thưởng
    taxAmount: number; // Thuế TNCN phải nộp (nếu có)
    commissionRate: number; // % Hoa hồng đại lý giữ lại
    commissionAmount: number; // Tiền hoa hồng
    netAmount: number; // Tiền thực nhận của khách
    status: 'pending' | 'paid' | 'verified_with_company'; // Chờ chi / Đã chi / Đã đối soát với nhà đài
    created_at: string;
    created_by: string;
}

export interface PrizeClaimSearchParams {
    searchKey?: string;
    page?: number;
    limit?: number;
    status?: string;
    fromDate?: string;
    toDate?: string;
}
