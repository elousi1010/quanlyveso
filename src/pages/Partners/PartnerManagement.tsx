import React, { useState, useCallback, useMemo } from 'react';
import { Alert, theme as antdTheme } from 'antd';
import {
  CommonHeader,
  CommonSnackbar,
  CommonDeleteDialog,
  CommonFormDrawer,
  CommonViewEditDrawer,
} from '@/components/common';
import { useTablePagination } from '@/hooks';
import {
  PartnerDataGrid,
  PartnerSearchAndFilter,
} from './components';
import { usePartners, usePartnerMutations } from './hooks';
import {
  PARTNER_FORM_FIELDS,
  PARTNER_DETAIL_FIELDS,
  PARTNER_CONSTANTS
} from './constants';
import {
  formDataToUpdateDto,
  partnerToDisplayData,
} from './utils/partnerHelpers';
import type {
  Partner,
  CreatePartnerRequest,
  PartnerSearchParams,
} from './types';

/**
 * PartnerManagement Component
 * 
 * Manages partners and agents with a unified UI pattern.
 */
export const PartnerManagement: React.FC = () => {
  const { token } = antdTheme.useToken();

  // Pagination state
  const {
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    apiParams,
    reset: resetPagination,
  } = useTablePagination({
    initialLimit: 5,
  });

  // Search and filter state
  const [searchParams, setSearchParams] = useState<PartnerSearchParams>({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  /**
   * Unified view state for dialogs and drawers.
   */
  const [activeView, setActiveView] = useState<{
    type: 'create' | 'edit' | 'view' | 'delete' | null;
    partner: Partner | null;
  }>({ type: null, partner: null });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const combinedParams = useMemo(() => ({
    ...searchParams,
    ...apiParams,
  }), [searchParams, apiParams]);

  const { data: partnersData, isLoading, refetch, error } = usePartners(combinedParams);
  const { createMutation, updateMutation, deleteMutation } = usePartnerMutations();

  // View control handlers
  const openView = useCallback((type: typeof activeView['type'], partner: Partner | null = null) => {
    setActiveView({ type, partner });
  }, []);

  const closeView = useCallback(() => {
    setActiveView({ type: null, partner: null });
  }, []);

  const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Event handlers
  const handleSearchChange = useCallback((params: PartnerSearchParams) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { page, limit, ...searchOnlyParams } = params;
    setSearchParams(searchOnlyParams);
    resetPagination();
  }, [resetPagination]);

  const handleReset = useCallback(() => {
    setSearchParams({});
    setFilters({});
    resetPagination();
  }, [resetPagination]);

  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    setSearchParams(prev => ({ ...prev, ...newFilters }));
    resetPagination();
  }, [resetPagination]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  /**
   * Mutation Handlers
   */

  const handleCreateSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      await createMutation.mutateAsync(data as unknown as CreatePartnerRequest);
      showSnackbar('Tạo đối tác thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi tạo đối tác', 'error');
    }
  }, [createMutation, closeView, showSnackbar]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Partner) => {
    const target = selectedRow || activeView.partner;
    if (!target) return;

    try {
      const updateData = formDataToUpdateDto(data);
      await updateMutation.mutateAsync({ id: target.id, data: updateData });
      showSnackbar('Cập nhật đối tác thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi cập nhật đối tác', 'error');
    }
  }, [activeView.partner, updateMutation, closeView, showSnackbar]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeView.partner) return;

    try {
      await deleteMutation.mutateAsync(activeView.partner.id);
      showSnackbar('Xóa đối tác thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi xóa đối tác', 'error');
    }
  }, [activeView.partner, deleteMutation, closeView, showSnackbar]);

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải danh sách đối tác: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title={PARTNER_CONSTANTS.MODULE_TITLE}
        subtitle="Quản lý và theo dõi thông tin các đối tác kinh doanh"
        onRefresh={handleRefresh}
        onCreate={() => openView('create')}
        loading={isLoading}
      />

      <div style={{ marginTop: '16px' }}>
        <PartnerSearchAndFilter
          searchParams={combinedParams}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
          onFilterChange={handleFilterChange}
          filters={filters}
        />
      </div>

      <div style={{
        marginTop: '16px',
        background: token.colorBgContainer,
        borderRadius: '12px',
        overflow: 'hidden'
      }}>
        <PartnerDataGrid
          data={partnersData!}
          loading={isLoading}
          onEdit={(p) => openView('edit', p)}
          onDelete={(p) => openView('delete', p)}
          onView={(p) => openView('view', p)}
          onSave={handleUpdateSubmit}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(p) => handleChangePage(null, p)}
          onRowsPerPageChange={(l) => handleChangeRowsPerPage({ target: { value: l.toString() } } as any)}
        />
      </div>

      {/* Forms & Dialogs */}
      <CommonFormDrawer
        open={activeView.type === 'create'}
        onClose={closeView}
        onSave={handleCreateSubmit}
        title="Tạo Đối tác Mới"
        fields={PARTNER_FORM_FIELDS}
        submitText="Tạo"
        loading={createMutation.isPending}
        width={500}
      />

      {activeView.partner && (activeView.type === 'view' || activeView.type === 'edit') && (
        <CommonViewEditDrawer
          open={true}
          onClose={closeView}
          onSave={handleUpdateSubmit}
          title={activeView.type === 'view' ? 'Chi Tiết Đối tác' : 'Chỉnh Sửa Đối tác'}
          viewFields={PARTNER_DETAIL_FIELDS}
          editFields={PARTNER_FORM_FIELDS}
          data={partnerToDisplayData(activeView.partner)}
          mode={activeView.type === 'view' ? 'view' : 'edit'}
          loading={updateMutation.isPending}
          width={500}
        />
      )}

      <CommonDeleteDialog
        open={activeView.type === 'delete'}
        onClose={closeView}
        onConfirm={handleDeleteConfirm}
        title="Xóa Đối Tác"
        itemName={activeView.partner?.name}
        itemType="đối tác"
        isDeleting={deleteMutation.isPending}
      />

      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      />
    </div>
  );
};

export default PartnerManagement;