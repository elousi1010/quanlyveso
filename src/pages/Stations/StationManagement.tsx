import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonFormDialog, 
  CommonViewEditDialog, 
  CommonDetailDialog 
} from '@/components/common';
import {
  StationHeader,
  StationDataGrid,
  StationSearchAndFilter,
  StationDeleteDialog,
  StationSnackbar,
} from './components';
import { useStations, useStationMutations } from './hooks';
import { 
  stationCreateFields, 
  stationUpdateFields, 
  stationDetailFields 
} from './constants';
import type { 
  Station, 
  CreateStationDto, 
  UpdateStationDto, 
  StationSearchParams 
} from './types';

export const StationManagement: React.FC = () => {
  // State management
  const [searchParams, setSearchParams] = useState<StationSearchParams>({
    page: 1,
    limit: 10,
  });
  const [selectedRows, setSelectedRows] = useState<Station[]>([]);
  const [dialogState, setDialogState] = useState({
    create: false,
    edit: false,
    view: false,
    delete: false,
  });
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: stationsData, isLoading, refetch } = useStations(searchParams);
  const { createMutation, updateMutation, deleteMutation } = useStationMutations();

  // Event handlers
  const handleSearchChange = useCallback((params: StationSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleReset = useCallback(() => {
    setSearchParams({ page: 1, limit: 10 });
  }, []);

  const handleCreate = useCallback(() => {
    setSelectedStation(null);
    setDialogState(prev => ({ ...prev, create: true }));
  }, []);

  const handleEdit = useCallback((station: Station) => {
    setSelectedStation(station);
    setDialogState(prev => ({ ...prev, edit: true }));
  }, []);

  const handleView = useCallback((station: Station) => {
    setSelectedStation(station);
    setDialogState(prev => ({ ...prev, view: true }));
  }, []);

  const handleDelete = useCallback((station: Station) => {
    setSelectedStation(station);
    setDialogState(prev => ({ ...prev, delete: true }));
  }, []);

  const handleDeleteSelected = useCallback(() => {
    if (selectedRows.length > 0) {
      // Implement bulk delete logic here
      setSnackbar({
        open: true,
        message: `Đã xóa ${selectedRows.length} trạm`,
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
    setSelectedStation(null);
  }, []);

  const handleCreateSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      await createMutation.mutateAsync(data as unknown as CreateStationDto);
      setSnackbar({
        open: true,
        message: 'Tạo trạm thành công',
        severity: 'success',
      });
      handleCloseDialog('create');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo trạm',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  const handleUpdateSubmit = useCallback(async (data: UpdateStationDto) => {
    if (!selectedStation) return;
    
    try {
      await updateMutation.mutateAsync({ id: selectedStation.id, data });
      setSnackbar({
        open: true,
        message: 'Cập nhật trạm thành công',
        severity: 'success',
      });
      handleCloseDialog('edit');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi cập nhật trạm',
        severity: 'error',
      });
    }
  }, [selectedStation, updateMutation, handleCloseDialog]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedStation) return;
    
    try {
      await deleteMutation.mutateAsync(selectedStation.id);
      setSnackbar({
        open: true,
        message: 'Xóa trạm thành công',
        severity: 'success',
      });
      handleCloseDialog('delete');
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa trạm',
        severity: 'error',
      });
    }
  }, [selectedStation, deleteMutation, handleCloseDialog]);

  const handleSnackbarClose = useCallback(() => {
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  const stations = stationsData?.data || [];

  return (
    <Box sx={{ p: 2 }}>
      <StationHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
        selectedCount={selectedRows.length}
        onDeleteSelected={handleDeleteSelected}
      />

      <Box sx={{ mt: 2 }}>
        <StationSearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onReset={handleReset}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <StationDataGrid
          data={stations}
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
        onSubmit={handleCreateSubmit}
        title="Tạo Trạm Mới"
        fields={stationCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
      />

      {/* Edit Dialog */}
      <CommonViewEditDialog
        open={dialogState.edit}
        onClose={() => handleCloseDialog('edit')}
        onSave={handleUpdateSubmit}
        onView={() => {
          handleCloseDialog('edit');
          setDialogState(prev => ({ ...prev, view: true }));
        }}
        title="Chỉnh sửa Trạm"
        formFields={stationUpdateFields}
        item={(selectedStation || {}) as Record<string, unknown>}
        submitText="Cập nhật"
        loading={updateMutation.isPending}
      />

      {/* View Dialog */}
      <CommonDetailDialog
        open={dialogState.view}
        onClose={() => handleCloseDialog('view')}
        onEdit={() => {
          handleCloseDialog('view');
          setDialogState(prev => ({ ...prev, edit: true }));
        }}
        title="Chi tiết Trạm"
        fields={stationDetailFields}
        item={(selectedStation || {}) as Record<string, unknown>}
      />

      {/* Delete Dialog */}
      <StationDeleteDialog
        open={dialogState.delete}
        onClose={() => handleCloseDialog('delete')}
        onConfirm={handleDeleteConfirm}
        station={selectedStation}
        loading={deleteMutation.isPending}
      />

      {/* Snackbar */}
      <StationSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};
