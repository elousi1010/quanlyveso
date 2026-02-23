import { api } from '@/utils/api';
import type { ProvinceResult } from '../utils/winningChecker';

export const scraperApi = {
    /**
     * Lấy kết quả xổ số theo ngày (YYYY-MM-DD)
     */
    getResultsByDate: async (date: string): Promise<ProvinceResult[]> => {
        // API endpoint giả định kết nối với backend có tích hợp module scraper
        const response = await api.get(`/api/v1/lottery/results`, { params: { date } });
        return (response as any).data;
    },

    /**
     * Kích hoạt scraper lấy kết quả mới nhất
     */
    triggerScrape: async (): Promise<ProvinceResult[]> => {
        const response = await api.post(`/api/v1/lottery/scrape`);
        return (response as any).data;
    },
};
