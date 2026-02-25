import React, { useState, useCallback, useMemo } from 'react';
import { theme as antdTheme, Alert, ConfigProvider, Tabs } from 'antd';
import {
  CommonHeader,
  CommonSnackbar,
  CommonDeleteDialog,
  CommonFormDrawer,
  CommonViewEditDrawer
} from '@/components/common';
import {
  StationDataGrid,
  StationSearchAndFilter,
  LotteryResultsViewer,
} from './components';
import { useStations, useStationMutations } from './hooks';
import {
  stationCreateFields,
  stationFormFields,
  stationDetailFields,
  STATION_CONSTANTS
} from './constants';
import type {
  Station,
  CreateStationDto,
  UpdateStationDto,
  StationSearchParams
} from './types';

/**
 * StationManagement Component
 * 
 * Manages lottery stations with a unified UI pattern.
 */
export const StationManagement: React.FC = () => {
  const { token } = antdTheme.useToken();

  // State management
  const [searchParams, setSearchParams] = useState<StationSearchParams>({
    page: 1,
    limit: 5,
  });

  /**
   * Unified view state for dialogs and drawers.
   */
  const [activeView, setActiveView] = useState<{
    type: 'create' | 'edit' | 'view' | 'delete' | null;
    station: Station | null;
  }>({ type: null, station: null });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: stationsData, isLoading, error, refetch } = useStations(searchParams);
  const { createMutation, updateMutation, deleteMutation } = useStationMutations();

  // Data extraction
  const stations = useMemo(() => stationsData?.stations || [], [stationsData]);
  const total = stationsData?.total || 0;

  // Event handlers
  const handleSearchChange = useCallback((params: StationSearchParams) => {
    setSearchParams(prev => ({ ...prev, ...params, page: 1 }));
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  // View control handlers
  const openView = useCallback((type: typeof activeView['type'], station: Station | null = null) => {
    setActiveView({ type, station });
  }, []);

  const closeView = useCallback(() => {
    setActiveView({ type: null, station: null });
  }, []);

  const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  /**
   * Mutation Handlers
   */

  const handleCreateSubmit = useCallback(async (data: Record<string, unknown>) => {
    try {
      await createMutation.mutateAsync(data as unknown as CreateStationDto);
      showSnackbar('Tạo trạm thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi tạo trạm', 'error');
    }
  }, [createMutation, closeView, showSnackbar]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Station) => {
    const target = selectedRow || activeView.station;
    if (!target) return;

    try {
      await updateMutation.mutateAsync({
        id: target.id,
        data: data as unknown as UpdateStationDto
      });
      showSnackbar('Cập nhật trạm thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi cập nhật trạm', 'error');
    }
  }, [activeView.station, updateMutation, closeView, showSnackbar]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeView.station) return;

    try {
      await deleteMutation.mutateAsync(activeView.station.id);
      showSnackbar('Xóa trạm thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi xóa trạm', 'error');
    }
  }, [activeView.station, deleteMutation, closeView, showSnackbar]);

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải danh sách trạm: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title={STATION_CONSTANTS.MODULE_TITLE}
        subtitle="Quản lý các trạm phát hành vé số"
        onRefresh={handleRefresh}
        onCreate={() => openView('create')}
        loading={isLoading}
      />

      <div style={{ marginTop: '16px' }}>
        <StationSearchAndFilter
          searchParams={searchParams}
          onSearchChange={handleSearchChange}
          onRefresh={handleRefresh}
          loading={isLoading}
        />
      </div>

      <div style={{ marginTop: '16px' }}>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                itemSelectedColor: token.colorPrimary,
                inkBarColor: token.colorPrimary,
              }
            }
          }}
        >
          <Tabs
            defaultActiveKey="1"
            type="card"
            style={{ marginTop: 16 }}
            items={[
              {
                key: '1',
                label: 'Danh Sách Trạm',
                children: (
                  <div style={{
                    marginTop: '16px',
                    background: token.colorBgContainer,
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <StationDataGrid
                      data={stations}
                      loading={isLoading}
                      onEdit={(s) => openView('edit', s)}
                      onDelete={(s) => openView('delete', s)}
                      onView={(s) => openView('view', s)}
                      onSave={handleUpdateSubmit}
                      page={(searchParams.page || 1) - 1}
                      rowsPerPage={searchParams.limit || 10}
                      total={total}
                      onPageChange={(page) => setSearchParams(prev => ({ ...prev, page: page + 1 }))}
                      onRowsPerPageChange={(limit) => setSearchParams(prev => ({ ...prev, limit, page: 1 }))}
                    />
                  </div>
                )
              },
              {
                key: '2',
                label: 'Kết Quả Xổ Số & Dò Số',
                children: <LotteryResultsViewer />,
              }
            ]}
          />
        </ConfigProvider>
      </div>

      {/* Forms & Dialogs */}
      <CommonFormDrawer
        open={activeView.type === 'create'}
        onClose={closeView}
        onSave={handleCreateSubmit}
        title="Tạo Trạm Mới"
        fields={stationCreateFields}
        submitText="Tạo"
        loading={createMutation.isPending}
        width={500}
      />

      {activeView.station && (activeView.type === 'view' || activeView.type === 'edit') && (
        <CommonViewEditDrawer
          open={true}
          onClose={closeView}
          onSave={handleUpdateSubmit}
          title={activeView.type === 'view' ? 'Chi Tiết Trạm' : 'Chỉnh Sửa Trạm'}
          viewFields={stationDetailFields}
          editFields={stationFormFields}
          data={activeView.station as unknown as Record<string, unknown>}
          mode={activeView.type === 'view' ? 'view' : 'edit'}
          loading={updateMutation.isPending}
          width={500}
        />
      )}

      <CommonDeleteDialog
        open={activeView.type === 'delete'}
        onClose={closeView}
        onConfirm={handleDeleteConfirm}
        title="Xóa Trạm"
        itemName={activeView.station?.name}
        itemType="trạm"
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
