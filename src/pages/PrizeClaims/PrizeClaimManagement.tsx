import React, { useState, useCallback } from 'react';
import { theme as antdTheme, Card } from 'antd';
import { CommonSnackbar } from '@/components/common';
import { PrizeClaimHeader, PrizeClaimDataGrid } from './components';
import { MOCK_PRIZE_CLAIMS, PRIZE_CLAIM_CONSTANTS } from './constants';
import type { PrizeClaim } from './types';

export const PrizeClaimManagement: React.FC = () => {
    const { token } = antdTheme.useToken();

    // State management (Dùng Mock dữ liệu)
    const [data, setData] = useState<PrizeClaim[]>(MOCK_PRIZE_CLAIMS);
    const [selectedRows, setSelectedRows] = useState<PrizeClaim[]>([]);
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
            showSnackbar('Đã làm mới danh sách đỏi vé trúng');
        }, 800);
    }, [showSnackbar]);

    const handleCreateNew = useCallback(() => {
        // Tương lai sẽ mở modal Create Form
        showSnackbar('Tính năng tạo vé trúng mới đang được cập nhật', 'info');
    }, [showSnackbar]);

    const handleVerify = useCallback(() => {
        if (selectedRows.length === 0) return;

        // Đánh dấu các record được chọn thành 'verified_with_company'
        const updatedData = data.map(item => {
            if (selectedRows.some(row => row.id === item.id)) {
                return { ...item, status: 'verified_with_company' as const };
            }
            return item;
        });

        setData(updatedData);
        setSelectedRows([]);
        showSnackbar(`Đã duyệt đối soát thành công ${selectedRows.length} vé`);
    }, [selectedRows, data, showSnackbar]);

    const handleViewDetail = useCallback((record: PrizeClaim) => {
        showSnackbar(`Đang xem chi tiết phiếu: ${record.claimCode}`, 'info');
    }, [showSnackbar]);

    // Phân trang Local (dựa trên Mock data)
    const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
            <PrizeClaimHeader
                onRefresh={handleRefresh}
                onCreate={handleCreateNew}
                onVerify={handleVerify}
                selectedCount={selectedRows.length}
            />

            <div style={{
                marginTop: '16px',
                background: token.colorBgContainer,
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <PrizeClaimDataGrid
                    data={paginatedData}
                    loading={isLoading}
                    onView={handleViewDetail}
                    selectedRows={selectedRows}
                    onSelectionChange={setSelectedRows}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    total={data.length}
                    onPageChange={setPage}
                    onRowsPerPageChange={(size) => {
                        setRowsPerPage(size);
                        setPage(0); // Reset về trang đầu
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
