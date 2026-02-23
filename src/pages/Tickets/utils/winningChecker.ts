import type { Ticket } from '../types/ticketTypes';

export interface LotteryPrize {
    name: string;
    numbers: string[];
}

export interface ProvinceResult {
    province: string;
    code: string;
    prizes: LotteryPrize[];
}

export interface WinningResult {
    isWinning: boolean;
    prizeName?: string;
    amount?: number;
}

// Giá trị giải thưởng mẫu (có thể cấu hình sau)
const PRIZE_VALUES: Record<string, number> = {
    'ĐB': 2000000000,
    'G1': 30000000,
    'G2': 15000000,
    'G3': 10000000,
    'G4': 3000000,
    'G5': 1000000,
    'G6': 400000,
    'G7': 200000,
    'G8': 100000,
    'Phụ ĐB': 50000000,
    'Khuyến khích': 6000000,
};

/**
 * Kiểm tra xem một vé có trúng thưởng không dựa trên kết quả xổ số
 */
export const checkWinning = (ticket: Ticket, results: ProvinceResult[]): WinningResult => {
    // Tìm kết quả của tỉnh tương ứng
    const provinceResult = results.find(r => r.code === ticket.station_id || r.province.includes(ticket.station_id));

    if (!provinceResult) {
        return { isWinning: false };
    }

    const ticketNumber = ticket.ticket_code;

    for (const prize of provinceResult.prizes) {
        for (const winningNumber of prize.numbers) {
            // Logic so khớp từ dưới lên (G8, G7...)
            // Hầu hết các giải là so khớp các số cuối (suffix)
            if (ticketNumber.endsWith(winningNumber)) {
                return {
                    isWinning: true,
                    prizeName: prize.name,
                    amount: PRIZE_VALUES[prize.name] || 0
                };
            }
        }
    }

    return { isWinning: false };
};

/**
 * Thống kê danh sách vé trúng
 */
export const getWinningStats = (tickets: Ticket[], results: ProvinceResult[]) => {
    const soldTickets = tickets.filter(t => t.status === 'sold');
    const winners = soldTickets.map(t => ({
        ticket: t,
        winning: checkWinning(t, results)
    })).filter(w => w.winning.isWinning);

    const totalPossibleWinning = winners.reduce((sum, w) => sum + (w.winning.amount || 0), 0);

    return {
        totalSold: soldTickets.length,
        winnerCount: winners.length,
        totalWinningAmount: totalPossibleWinning,
        winners
    };
};
