import React, { useState, useCallback, useMemo } from 'react';
import { theme as antdTheme, Alert } from 'antd';
import {
  CommonHeader,
  CommonSnackbar,
  CommonDeleteDialog,
  CommonFormDrawer,
} from '@/components/common';
import {
  TicketDataGrid,
  TicketSearchAndFilter,
  WinningStats
} from './components';
import { useTickets, useTicketMutations, useLotteryResults } from './hooks';
import {
  ticketCreateFields,
  TICKET_CONSTANTS
} from './constants';
import type {
  Ticket,
  CreateTicketDto,
  UpdateTicketDto,
  TicketSearchParams
} from './types';
import { MOCK_LOTTERY_RESULTS } from '@/data/mockLotteryResults';

/**
 * TicketManagement Component
 * 
 * Handles the state and logic for managing lottery tickets.
 * Adopts a centralized state management pattern for UI views.
 */
export const TicketManagement: React.FC = () => {
  const { token } = antdTheme.useToken();

  // State management
  const [searchParams, setSearchParams] = useState<TicketSearchParams>({
    page: 1,
    limit: 5,
  });
  const [selectedRows, setSelectedRows] = useState<Ticket[]>([]);
  const [showSettlement, setShowSettlement] = useState(false);

  /**
   * Universal state to control which view or dialog is currently active.
   */
  const [activeView, setActiveView] = useState<{
    type: 'create' | 'edit' | 'view' | 'delete' | null;
    ticket: Ticket | null;
  }>({ type: null, ticket: null });

  // Snackbar state for user feedback
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: ticketsData, isLoading, error, refetch } = useTickets(searchParams);
  const { createMutation, updateMutation, deleteMutation } = useTicketMutations();
  const { data: lotteryResults, isLoading: isLotteryLoading } = useLotteryResults();

  // Memoized tickets list
  const tickets = useMemo(() => {
    if (Array.isArray(ticketsData?.data)) return ticketsData.data;
    if (Array.isArray((ticketsData as any)?.data?.data)) return (ticketsData as any).data.data;
    return [];
  }, [ticketsData]);

  const total = useMemo(() => {
    if (typeof ticketsData?.total === 'number') return ticketsData.total;
    if (typeof (ticketsData as any)?.data?.total === 'number') return (ticketsData as any).data.total;
    return 0;
  }, [ticketsData]);

  // Event handlers
  const handleSearchChange = useCallback((params: TicketSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 5 });
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // View control handlers
  const openView = useCallback((type: typeof activeView['type'], ticket: Ticket | null = null) => {
    setActiveView({ type, ticket });
  }, []);

  const closeView = useCallback(() => {
    setActiveView({ type: null, ticket: null });
  }, []);

  const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  /**
   * Data Mutation Handlers
   */

  const handleCreateSubmit = useCallback(async (data: CreateTicketDto) => {
    try {
      await createMutation.mutateAsync(data);
      showSnackbar('Tạo vé số thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi tạo vé số', 'error');
    }
  }, [createMutation, closeView, showSnackbar]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Ticket) => {
    const target = selectedRow || activeView.ticket;
    if (!target) return;

    try {
      await updateMutation.mutateAsync({
        id: target.id,
        data: data as unknown as UpdateTicketDto
      });
      showSnackbar('Cập nhật vé số thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi cập nhật vé số', 'error');
    }
  }, [activeView.ticket, updateMutation, closeView, showSnackbar]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeView.ticket) return;

    try {
      await deleteMutation.mutateAsync(activeView.ticket.id);
      showSnackbar('Xóa vé số thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi xóa vé số', 'error');
    }
  }, [activeView.ticket, deleteMutation, closeView, showSnackbar]);

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải danh sách vé: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title={TICKET_CONSTANTS.MODULE_TITLE}
        subtitle="Quản lý thông tin các loại vé số"
        onRefresh={handleRefresh}
        onCreate={() => openView('create')}
        onExtraClick={() => setShowSettlement(!showSettlement)}
        extraText={showSettlement ? 'Xem danh sách vé' : 'Quyết toán ngày'}
        loading={isLoading}
      />

      {showSettlement ? (
        <WinningStats
          tickets={tickets}
          results={lotteryResults || MOCK_LOTTERY_RESULTS}
          loading={isLoading || isLotteryLoading}
        />
      ) : (
        <>
          <div style={{ marginTop: '16px' }}>
            <TicketSearchAndFilter
              searchParams={searchParams as Record<string, unknown>}
              onSearchChange={handleSearchChange}
              onReset={handleReset}
            />
          </div>

          <div style={{
            marginTop: '16px',
            background: token.colorBgContainer,
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <TicketDataGrid
              data={tickets}
              loading={isLoading}
              onEdit={(t) => openView('edit', t)}
              onDelete={(t) => openView('delete', t)}
              onView={(t) => openView('view', t)}
              onSave={handleUpdateSubmit}
              selectedRows={selectedRows}
              onSelectionChange={setSelectedRows}
              page={searchParams.page ? searchParams.page - 1 : 0}
              rowsPerPage={searchParams.limit || 5}
              total={total}
              onPageChange={(p) => setSearchParams(prev => ({ ...prev, page: p + 1 }))}
              onRowsPerPageChange={(l) => setSearchParams(prev => ({ ...prev, limit: l, page: 1 }))}
            />
          </div>
        </>
      )}

      {/* Forms & Dialogs */}
      <CommonFormDrawer
        open={activeView.type === 'create'}
        onClose={closeView}
        onSave={(data) => handleCreateSubmit(data as unknown as CreateTicketDto)}
        title="Tạo Vé số Mới"
        fields={ticketCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
        width={500}
      />

      <CommonDeleteDialog
        open={activeView.type === 'delete'}
        onClose={closeView}
        onConfirm={handleDeleteConfirm}
        title="Xóa Vé Số"
        itemName={activeView.ticket?.ticket_code}
        itemType="vé số"
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
