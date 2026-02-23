export const MOCK_DASHBOARD_DATA = {
    overview: {
        debt: { this: '150000000', prev: '120000000' },
        ticketImport: { this: '45000', prev: '40000' },
        ticketExport: { this: '38000', prev: '35000' },
        transaction: { this: '125', prev: '110' }
    },
    revenue: [
        { label: '01/02', import: 5000000, export: 4500000, total: 9500000 },
        { label: '02/02', import: 6200000, export: 5100000, total: 11300000 },
        { label: '03/02', import: 4800000, export: 5500000, total: 10300000 },
        { label: '04/02', import: 7100000, export: 6800000, total: 13900000 },
        { label: '05/02', import: 5500000, export: 4900000, total: 10400000 },
    ],
    activity: [
        {
            id: 'act1',
            activity: { id: 'act1', total: '5000000', created_at: new Date().toISOString() },
            transaction: { type: 'import', sub_type: 'Mua từ đại lý' },
            partner: { name: 'Đại lý Kim Anh' },
            inventory: { code: 'KHO-HCM' }
        },
        {
            id: 'act2',
            activity: { id: 'act2', total: '2500000', created_at: new Date().toISOString() },
            transaction: { type: 'export', sub_type: 'Bán cho khách' },
            partner: { name: 'Người bán Minh Ngọc' },
            inventory: { code: 'KHO-HCM' }
        }
    ]
};

export const MOCK_AGENT_DASHBOARD_DATA = {
    overview: {
        activeSellers: { count: 86, change: '+4' },
        todaySales: { count: 12500, amount: '125000000' },
        pendingCollection: { amount: '45000000', count: 12 },
        unreturnedTickets: { count: 450 }
    },
    areaPerformance: [
        { area: 'Quận 1', sales: 4500, color: '#f43f5e' },
        { area: 'Bình Thạnh', sales: 3200, color: '#0ea5e9' },
        { area: 'Quận 3', sales: 2800, color: '#10b981' },
        { area: 'Phú Nhuận', sales: 2000, color: '#f59e0b' },
    ],
    pendingSellers: [
        { name: 'Chú Tư Bán Dạo', amount: 2500000, tickets: 250, area: 'Quận 1', lastSeen: '2 giờ trước' },
        { name: 'Cô Ba Xổ Số', amount: 3800000, tickets: 380, area: 'Bình Thạnh', lastSeen: '30 phút trước' },
        { name: 'Anh Năm Vé Số', amount: 1500000, tickets: 150, area: 'Quận 3', lastSeen: '5 giờ trước' },
    ]
};
