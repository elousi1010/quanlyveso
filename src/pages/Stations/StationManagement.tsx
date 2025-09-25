import React, { useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { 
  CommonFormDrawer
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
  stationCreateFields
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
    limit: 5,
  });
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
  
  // Extract data from response
  const stations = stationsData?.stations || [];
  const total = stationsData?.total || 0;

  // Event handlers
  const handleSearchChange = useCallback((params: StationSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
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
    } catch {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi tạo trạm',
        severity: 'error',
      });
    }
  }, [createMutation, handleCloseDialog]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Station) => {
    const stationToUpdate = selectedRow || selectedStation;
    if (!stationToUpdate) return;
    
    try {
      await updateMutation.mutateAsync({ id: stationToUpdate.id, data: data as unknown as UpdateStationDto });
      setSnackbar({
        open: true,
        message: 'Cập nhật trạm thành công',
        severity: 'success',
      });
      handleCloseDialog('edit');
    } catch {
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
    } catch {
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

  return (
    <Box sx={{ p: 2 }}>
      <StationHeader
        onCreate={handleCreate}
        onRefresh={handleRefresh}
      />

      <Box sx={{ mt: 2 }}>
        <StationSearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onRefresh={handleRefresh}
          loading={isLoading}
        />
      </Box>

      <Box sx={{ mt: 2 }}>
        <StationDataGrid
          data={stations}
          loading={isLoading}
          onEdit={handleEdit as (station: Station) => void}
          onDelete={handleDelete as (station: Station) => void}
          onView={handleView}
          onSave={handleUpdateSubmit}
          page={(searchParams.page || 1) - 1}
          rowsPerPage={searchParams.limit || 10}
          total={total}
          onPageChange={(page) => setSearchParams(prev => ({ ...prev, page: page + 1 }))}
          onRowsPerPageChange={(limit) => setSearchParams(prev => ({ ...prev, limit, page: 1 }))}
        />
      </Box>

      {/* Create Drawer */}
      <CommonFormDrawer
        open={dialogState.create}
        onClose={() => handleCloseDialog('create')}
        onSave={handleCreateSubmit}
        title="Tạo Trạm Mới"
        fields={stationCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
        width={500}
      />


      {/* Delete Dialog */}
      <StationDeleteDialog
        open={dialogState.delete}
        onClose={() => handleCloseDialog('delete')}
        onConfirm={handleDeleteConfirm}
        station={selectedStation as unknown as Station}
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
