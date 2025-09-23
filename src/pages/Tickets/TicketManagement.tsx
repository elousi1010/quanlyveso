import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonFormDialog, 
  CommonViewEditDialog, 
  CommonDetailDialog 
} from '@/components/common';
import {
  TicketHeader,
  TicketDataGrid,
  TicketSearchAndFilter,
  TicketDeleteDialog,
  TicketSnackbar,
} from './components';
import { useTickets, useTicketMutations } from './hooks';
import { 
  ticketCreateFields, 
  ticketUpdateFields, 
  ticketDetailFields 
} from './constants';
import type { 
  Ticket, 
  CreateTicketDto, 
  UpdateTicketDto, 
  TicketSearchParams 
} from './types';

export const TicketManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<TicketSearchParams>({
    page: 1,
    limit: 5,
  });
  const [selectedRows, setSelectedRows] = useState<Ticket[]>([]);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: ticketsData, isLoading, refetch } = useTickets(searchParams);
  const { createMutation, updateMutation, deleteMutation } = useTicketMutations();

  // Event handlers
  const handleSearchChange = useCallback((params: TicketSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 5 });
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedTicket(null);
    setDialogState(prev => ({ ...prev, create: true }));
  }, []);

  const handleEdit = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogState(prev => ({ ...prev, edit: true }));
  }, []);

  const handleView = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogState(prev => ({ ...prev, view: true }));
  }, []);

  const handleDelete = useCallback((ticket: Ticket) => {
    setSelectedTicket(ticket);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedRows.length > 0) {
      // Implement bulk delete logic here
      setSnackbar({
        open: true,
        message: `Đã xóa ${selectedRows.length} vé số`,
        severity: 'success',
      });
      setSelectedRows([]);
    }
  }, [selectedRows]);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCloseDialog = useCallback((dialogType: keyof typeof dialogState) => {
    setDialogState(prev => ({ ...prev, [dialogType]: false }));
    setSelectedTicket(null);
  }, []);

  const handleCreateSubmit = useCallback(async (data: CreateTicketDto) => {
    try {
      await createMutation.mutateAsync(data);
      setSnackbar({
        open: true,
        message: 'Tạo vé số thành công',
        severity: 'success',
      });
      handleCloseDialog('create');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo vé số',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  const handleUpdateSubmit = useCallback(async (data: UpdateTicketDto) => {
    if (!selectedTicket) return;
    
    try {
      await updateMutation.mutateAsync({ id: selectedTicket.id, data });
      setSnackbar({
        open: true,
        message: 'Cập nhật vé số thành công',
        severity: 'success',
      });
      handleCloseDialog('edit');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật vé số',
        severity: 'error',
      });
    }
  }, [selectedTicket, updateMutation, handleCloseDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedTicket) return;
    
    try {
      await deleteMutation.mutateAsync(selectedTicket.id);
      setSnackbar({
        open: true,
        message: 'Xóa vé số thành công',
        severity: 'success',
      });
      handleCloseDialog('delete');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa vé số',
        severity: 'error',
      });
    }
  }, [selectedTicket, deleteMutation, handleCloseDialog]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const tickets = ticketsData?.data || [];

  return (
    <Box sx={{ p: 2 }}>
      <TicketHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
      />

      <Box sx={{ mt: 2 }}>
        <TicketSearchAndFilter
          searchParams={searchParams as Record<string, unknown>}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <TicketDataGrid
          data={tickets}
          loading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
        />
      </Box>

      {/* Create Dialog */}
      <CommonFormDialog
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSave={(data) => handleCreateSubmit(data as unknown as CreateTicketDto)}
        title="Tạo Vé số Mới"
        fields={ticketCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <CommonViewEditDialog
        open={dialogState.edit}
        onClose={() => handleCloseDialog('edit')}
        onSave={(data) => handleUpdateSubmit(data as unknown as UpdateTicketDto)}
        title="Chỉnh sửa Vé số"
        formFields={ticketUpdateFields}
        item={selectedTicket as unknown as Record<string, unknown>}
        detailFields={ticketDetailFields}
        loading={updateMutation.isPending}
      />

      {/* View Dialog */}
      <CommonDetailDialog
        open={dialogState.view}
        onClose={() => handleCloseDialog('view')}
        onEdit={() => handleCloseDialog('view')}
        title="Chi tiết Vé số"
        fields={ticketDetailFields}
        item={selectedTicket as unknown as Record<string, unknown>}
      />

      {/* Delete Dialog */}
      <TicketDeleteDialog
        open={dialogState.delete}
        onClose={() => handleCloseDialog('delete')}
        onConfirm={handleDeleteConfirm}
        ticket={selectedTicket as unknown as Ticket}
        loading={deleteMutation.isPending}
      />

      {/* Snackbar */}
      <TicketSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};
