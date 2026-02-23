import React, { useState, useCallback, useMemo } from 'react';
import { theme as antdTheme, Alert } from 'antd';
import {
  CommonFormDrawer,
  CommonViewEditDrawer,
  CommonSnackbar,
  CommonHeader,
  type DetailField,
  type FormField
} from '@/components/common';
import {
  PartnerDebtDataGrid,
  PartnerDebtSearchAndFilter,
} from './components';
import { usePartnerDebts, usePartnerDebtMutations } from './hooks';
import { usePartners } from '../Partners/hooks/usePartners';
import {
  partnerDebtViewEditConfig,
} from './constants';
import type {
  PartnerDebtSearchParams,
  PartnerDebtFormData,
} from './types';
import { convertToTableRow, convertToDetailData } from './utils';

/**
 * PartnerDebtManagement Component
 * 
 * Manages partner debts and financial transactions with a unified UI pattern.
 */
const PartnerDebtManagement: React.FC = () => {
  const { token } = antdTheme.useToken();

  // State management
  const [searchParams, setSearchParams] = useState<PartnerDebtSearchParams>({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  /**
   * Unified view state for dialogs and drawers.
   */
  const [activeView, setActiveView] = useState<{
    type: 'create' | 'view' | 'delete' | null;
    id: string | null;
  }>({ type: null, id: null });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: partnerDebtsData, isLoading, error, refetch } = usePartnerDebts(searchParams);
  const { data: partnersData } = usePartners({ page: 1, limit: 1000 });
  const { createMutation } = usePartnerDebtMutations();

  // Data processing
  const partnerDebts = useMemo(() => {
    if (!partnerDebtsData?.data?.data) return [];
    return Array.isArray(partnerDebtsData.data.data) ? partnerDebtsData.data.data : [];
  }, [partnerDebtsData]);

  // View control handlers
  const openView = useCallback((type: typeof activeView['type'], id: string | null = null) => {
    setActiveView({ type, id });
  }, []);

  const closeView = useCallback(() => {
    setActiveView({ type: null, id: null });
  }, []);

  const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Event handlers
  const handleSearchChange = useCallback((params: PartnerDebtSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 10 });
    setFilters({});
  }, []);

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setSearchParams(prev => ({ ...prev, ...newFilters, page: 1 }));
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  /**
   * Mutation Handlers
   */

  const handleCreateSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      const formData = {
        ...data,
        amount: Number(data.amount),
      } as unknown as PartnerDebtFormData;

      await createMutation.mutateAsync(formData);
      showSnackbar('Tạo công nợ đối tác thành công');
      closeView();
      refetch();
    } catch {
      showSnackbar('Có lỗi xảy ra khi tạo công nợ đối tác', 'error');
    }
  }, [createMutation, refetch, closeView, showSnackbar]);

  // Get selected item for viewing
  const selectedItem = useMemo(() =>
    partnerDebts.find(item => item.id === activeView.id),
    [partnerDebts, activeView.id]
  );

  const selectedDetailData = useMemo(() =>
    selectedItem ? convertToDetailData(selectedItem) as unknown as Record<string, unknown> : undefined,
    [selectedItem]
  );

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải danh sách công nợ: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  const partners = partnersData?.data?.data?.data || [];

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title="Quản lý công nợ đối tác"
        subtitle="Theo dõi và quản lý các giao dịch công nợ với đối tác"
        onRefresh={handleRefresh}
        onCreate={() => openView('create')}
        createButtonText="Thêm công nợ"
        loading={isLoading}
      />

      <div style={{ marginTop: '16px' }}>
        <PartnerDebtSearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
          filters={filters}
          onReset={handleReset}
        />
      </div>

      <div style={{
        marginTop: '16px',
        background: token.colorBgContainer,
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <PartnerDebtDataGrid
          data={partnerDebts.map(convertToTableRow)}
          loading={isLoading}
          error={null}
          onView={(item) => openView('view', item.id)}
        />
      </div>

      {/* Drawers */}
      <CommonFormDrawer
        open={activeView.type === 'create'}
        onClose={closeView}
        onSave={handleCreateSubmit}
        fields={[
          {
            key: 'partner_id',
            label: 'Đối tác',
            type: 'select',
            required: true,
            options: partners.map(partner => ({
              value: partner.id,
              label: partner.name
            })),
          },
          {
            key: 'payment_method',
            label: 'Phương thức thanh toán',
            type: 'select',
            required: true,
            options: [
              { value: 'cash', label: 'Tiền mặt' },
              { value: 'bank_transfer', label: 'Chuyển khoản' },
              { value: 'credit_card', label: 'Thẻ tín dụng' },
              { value: 'other', label: 'Khác' },
            ],
          },
          {
            key: 'payment_type',
            label: 'Loại giao dịch',
            type: 'select',
            required: true,
            options: [
              { value: 'income', label: 'Thu nhập' },
              { value: 'expense', label: 'Chi phí' },
            ],
          },
          {
            key: 'amount',
            label: 'Số tiền',
            type: 'number',
            required: true,
            placeholder: 'Nhập số tiền',
          },
          {
            key: 'description',
            label: 'Mô tả',
            type: 'textarea',
            required: false,
            placeholder: 'Nhập mô tả (tùy chọn)',
          },
        ]}
        title="Thêm Công Nợ Đối Tác"
        loading={createMutation.isPending}
        width={500}
      />

      {selectedDetailData && (
        <CommonViewEditDrawer
          open={activeView.type === 'view'}
          onClose={closeView}
          viewFields={partnerDebtViewEditConfig.fields as DetailField[]}
          editFields={partnerDebtViewEditConfig.fields as FormField[]}
          data={selectedDetailData}
          title="Chi Tiết Công Nợ Đối Tác"
          mode="view"
        />
      )}

      {/* Snackbar */}
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default PartnerDebtManagement;
