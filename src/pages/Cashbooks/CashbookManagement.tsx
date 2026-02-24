import React, { useState, useCallback, useMemo } from 'react';
import { theme as antdTheme } from 'antd';
import { CommonSnackbar } from '@/components/common';
import { CashbookHeader, CashbookDataGrid } from './components';
import { MOCK_CASHBOOK_TRANSACTIONS } from './constants';
import type { CashbookTransaction } from './types';

export const CashbookManagement: React.FC = () => {
    const { token } = antdTheme.useToken();

    // State management (Mock)
    const [data, setData] = useState<CashbookTransaction[]>(MOCK_CASHBOOK_TRANSACTIONS);
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
            showSnackbar('Đã làm mới dữ liệu Sổ Quỹ');
        }, 800);
    }, [showSnackbar]);

    const handleCreateIncome = useCallback(() => {
        showSnackbar('Tính năng tạo phiếu THU đang được cập nhật', 'info');
    }, [showSnackbar]);

    const handleCreateExpense = useCallback(() => {
        showSnackbar('Tính năng tạo phiếu CHI đang được cập nhật', 'info');
    }, [showSnackbar]);

    const handleViewDetail = useCallback((record: CashbookTransaction) => {
        showSnackbar(`Đang xem chi tiết phiếu: ${record.transactionCode}`, 'info');
    }, [showSnackbar]);

    // Tính toán số dư
    const { totalIncome, totalExpense } = useMemo(() => {
        return data.reduce(
            (acc, curr) => {
                if (curr.type === 'income') acc.totalIncome += curr.amount;
                else acc.totalExpense += curr.amount;
                return acc;
            },
            { totalIncome: 0, totalExpense: 0 }
        );
    }, [data]);

    const paginatedData = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
            <CashbookHeader
                onRefresh={handleRefresh}
                onCreateIncome={handleCreateIncome}
                onCreateExpense={handleCreateExpense}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
            />

            <div style={{
                marginTop: '16px',
                background: token.colorBgContainer,
                borderRadius: '12px',
                overflow: 'hidden'
            }}>
                <CashbookDataGrid
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
