import React, { useState, useCallback, useMemo } from 'react';
import { theme as antdTheme, Alert, ConfigProvider, Tabs } from 'antd';
import {
  CommonHeader,
  CommonSnackbar,
  CommonDeleteDialog,
  type SearchAndFilterConfig,
} from '@/components/common';
import {
  PermissionDataGrid,
  PermissionSearchAndFilter,
  PermissionFormDrawerSimple,
  PermissionMatrix,
} from './components';
import UserPermissionAssignment from './components/UserPermissionAssignment';
import BulkPermissionAssignmentWrapper from './components/BulkPermissionAssignmentWrapper';
import { usePermissions, usePermissionMutations } from './hooks';
import type {
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionSearchParams
} from './types';
import { permissionSearchFields, PERMISSION_CONSTANTS } from './constants';

/**
 * PermissionManagement Component
 * 
 * Manages system permissions, roles, and assignments with a unified UI pattern.
 */
export const PermissionManagement: React.FC = () => {
  const { token } = antdTheme.useToken();

  // State management
  const [searchParams, setSearchParams] = useState<PermissionSearchParams>({
    page: 1,
    limit: 5,
  });
  const [selectedRows, setSelectedRows] = useState<Permission[]>([]);

  /**
   * Unified view state for dialogs and drawers.
   */
  const [activeView, setActiveView] = useState<{
    type: 'create' | 'edit' | 'view' | 'delete' | 'userAssignment' | 'bulkAssignment' | null;
    permission: Permission | null;
  }>({ type: null, permission: null });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  // API hooks
  const { data: permissionsData, isLoading, error, refetch } = usePermissions(searchParams);
  const { createMutation, updateMutation, deleteMutation } = usePermissionMutations();

  // Data extraction
  const permissions = useMemo(() => {
    if (Array.isArray(permissionsData)) return permissionsData;
    if (Array.isArray((permissionsData as any)?.data)) return (permissionsData as any).data;
    return [];
  }, [permissionsData]);

  const total = useMemo(() => {
    if (typeof (permissionsData as any)?.total === 'number') return (permissionsData as any).total;
    return (permissionsData as any)?.data?.length || 0;
  }, [permissionsData]);

  // View control handlers
  const openView = useCallback((type: typeof activeView['type'], permission: Permission | null = null) => {
    setActiveView({ type, permission });
  }, []);

  const closeView = useCallback(() => {
    setActiveView({ type: null, permission: null });
  }, []);

  const showSnackbar = useCallback((message: string, severity: typeof snackbar['severity'] = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  // Event handlers
  const handleSearchChange = useCallback((query: string) => {
    setSearchParams(prev => ({ ...prev, query, page: 1 }));
  }, []);

  const handleSort = useCallback((sortBy: string) => {
    setSearchParams(prev => ({ ...prev, sortBy }));
  }, []);

  const handleFilter = useCallback((filters: Record<string, string>) => {
    setSearchParams(prev => ({ ...prev, ...filters }));
  }, []);

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  /**
   * Mutation Handlers
   */

  const handleCreateSubmit = useCallback(async (data: CreatePermissionDto) => {
    try {
      await createMutation.mutateAsync(data);
      showSnackbar('Tạo quyền hạn thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi tạo quyền hạn', 'error');
    }
  }, [createMutation, closeView, showSnackbar]);

  const handleUpdateSubmit = useCallback(async (data: Record<string, unknown>, selectedRow?: Permission) => {
    const target = selectedRow || activeView.permission;
    if (!target) return;

    try {
      await updateMutation.mutateAsync({
        id: target.id,
        data: data as unknown as UpdatePermissionDto
      });
      showSnackbar('Cập nhật quyền hạn thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi cập nhật quyền hạn', 'error');
    }
  }, [activeView.permission, updateMutation, closeView, showSnackbar]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeView.permission) return;

    try {
      await deleteMutation.mutateAsync(activeView.permission.id);
      showSnackbar('Xóa quyền hạn thành công');
      closeView();
    } catch {
      showSnackbar('Có lỗi xảy ra khi xóa quyền hạn', 'error');
    }
  }, [activeView.permission, deleteMutation, closeView, showSnackbar]);

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi"
          description={`Không thể tải danh sách quyền: ${(error as Error).message}`}
          type="error"
          showIcon
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '0 0 24px 0', minHeight: '100%' }}>
      <CommonHeader
        title={PERMISSION_CONSTANTS.MODULE_TITLE}
        subtitle="Quản lý các nhóm quyền và gán quyền cho người dùng trong hệ thống"
        onRefresh={handleRefresh}
        onCreate={() => openView('create')}
        loading={isLoading}
      />

      <div style={{ marginTop: '16px' }}>
        <PermissionSearchAndFilter
          searchParams={searchParams as Record<string, unknown>}
          onSearch={handleSearchChange}
          onSort={handleSort}
          onFilter={handleFilter}
          onSearchChange={handleSearchChange}
          loading={isLoading}
          config={permissionSearchFields as SearchAndFilterConfig}
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
                label: 'Danh sách Quyền',
                children: (
                  <div style={{
                    marginTop: '16px',
                    background: token.colorBgContainer,
                    borderRadius: '12px',
                    overflow: 'hidden'
                  }}>
                    <PermissionDataGrid
                      data={permissions}
                      loading={isLoading}
                      onEdit={(p) => openView('edit', p)}
                      onDelete={(p) => openView('delete', p)}
                      onView={(p) => openView('view', p)}
                      onSave={handleUpdateSubmit}
                      selectedRows={selectedRows}
                      onSelectionChange={setSelectedRows}
                    />
                  </div>
                )
              },
              {
                key: '2',
                label: 'Ma Trận Quyền (Role Matrix)',
                children: <PermissionMatrix />,
              }
            ]}
          />
        </ConfigProvider>
      </div>

      {/* Forms & Dialogs */}
      <PermissionFormDrawerSimple
        open={activeView.type === 'create'}
        onClose={closeView}
        onSave={(data) => handleCreateSubmit(data as unknown as CreatePermissionDto)}
        title="Tạo Quyền hạn Mới"
        loading={createMutation.isPending}
        mode="edit"
      />

      {activeView.permission && (activeView.type === 'view' || activeView.type === 'edit') && (
        <PermissionFormDrawerSimple
          open={true}
          onClose={closeView}
          onSave={(data: any) => handleUpdateSubmit(data, activeView.permission || undefined)}
          title={activeView.type === 'view' ? 'Chi tiết Quyền hạn' : 'Chỉnh sửa Quyền hạn'}
          permission={activeView.permission}
          loading={updateMutation.isPending}
          mode={activeView.type === 'view' ? 'view' : 'edit'}
          onEdit={() => openView('edit', activeView.permission)}
        />
      )}

      <CommonDeleteDialog
        open={activeView.type === 'delete'}
        onClose={closeView}
        onConfirm={handleDeleteConfirm}
        title="Xóa Quyền Hạn"
        itemName={activeView.permission?.name}
        itemType="quyền hạn"
        isDeleting={deleteMutation.isPending}
      />

      <UserPermissionAssignment
        open={activeView.type === 'userAssignment'}
        onClose={closeView}
        user={null} // Pass user if needed
        onSuccess={() => {
          showSnackbar('Gán quyền cho user thành công');
          closeView();
        }}
      />

      <BulkPermissionAssignmentWrapper
        open={activeView.type === 'bulkAssignment'}
        onClose={closeView}
        selectedUsers={selectedRows.map(p => ({
          id: p.id,
          name: p.name,
          phone_number: '',
          role: '',
          is_active: true,
          created_at: '',
          updated_at: ''
        }))}
        onSuccess={() => {
          showSnackbar('Gán quyền hàng loạt thành công');
          closeView();
          setSelectedRows([]);
        }}
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

export default PermissionManagement;
