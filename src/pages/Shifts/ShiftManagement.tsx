import React, { useState, useCallback } from 'react';
import { theme as antdTheme } from 'antd';
import { CommonSnackbar } from '@/components/common';
import { ShiftHeader, ShiftDataGrid } from './components';
import { MOCK_SHIFTS } from './constants';
import type { Shift } from './types';

export const ShiftManagement: React.FC = () => {
    const { token } = antdTheme.useToken();

    // State management (Mock)
    const [data, setData] = useState<Shift[]>(MOCK_SHIFTS);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(false);

    // Snackbar
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'warning' | 'info',
    });

    const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
        setSnackbar({ open: true, message, severity });
    }, []);

    const handleRefresh = useCallback(() => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            showSnackbar('Đã làm mới dữ liệu Bàn Giao Ca');
        }, 800);
    }, [showSnackbar]);

    const handleOpenShift = useCallback(() => {
        showSnackbar('Đang mở màn hình tạo ca làm việc mới...', 'info');
    }, [showSnackbar]);

    const handleCloseShift = useCallback(() => {
        showSnackbar('Đang mở màn hình tổng kết và nhập tiền thực tế...', 'warning');
    }, [showSnackbar]);

    const handleViewDetail = useCallback((record: Shift) => {
        showSnackbar(`Đang xem chi tiết ca: ${record.shiftCode}`, 'info');
    }, [showSnackbar]);

    const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
            <ShiftHeader
                onRefresh={handleRefresh}
                onOpenShift={handleOpenShift}
                onCloseShift={handleCloseShift}
            />

            <div style={{
                marginTop: '16px',
                background: token.colorBgContainer,
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <ShiftDataGrid
                    data={paginatedData}
                    loading={isLoading}
                    onView={handleViewDetail}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    total={data.length}
                    onPageChange={setPage}
                    onRowsPerPageChange={(size) => {
                        setRowsPerPage(size);
                        setPage(0);
                    }}
                />
            </div>

            <CommonSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            />
        </div>
    );
};
