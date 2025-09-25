import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../Auth/ProtectedRoute';
import Unauthorized from '../../pages/Unauthorized';
import DashboardLayout from '../Layout/DashboardLayout';

// Import Dashboard
import DashboardOverview from '../../pages/Dashboard/DashboardOverview';

// Import pages with real APIs
import PartnerManagement from '../../pages/Partners/PartnerManagement';
import UserManagement from '../../pages/Users/UserManagement';
import { PermissionManagement } from '../../pages/Permissions';
import { AssignPermissionManagement } from '../../pages/Permissions/AssignPermissionManagement';
import { StationManagement } from '../../pages/Stations';
import { TicketManagement } from '../../pages/Tickets';
import { TransactionManagement } from '../../pages/Transactions';
import { InventoryManagement } from '../../pages/Inventory';
import { InventoryTransactionPage } from '../../pages/InventoryTransaction';
import { PartnerDebtManagement } from '../../pages/PartnerDebt';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/unauthorized" element={<Unauthorized />} />
      
      {/* Protected routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Routes>
                {/* Default route - Dashboard */}
                <Route path="/" element={<DashboardOverview />} />
                
                {/* Dashboard */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner', 'employee', 'seller']}>
                      <DashboardOverview />
                    </ProtectedRoute>
                  }
                />
                
                {/* Pages with real APIs */}
                <Route
                  path="/users"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <UserManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partners"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <PartnerManagement />
                    </ProtectedRoute>
                  }
                />
                {/* <Route
                  path="/organizations"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <OrganizationManagement />
                    </ProtectedRoute>
                  }
                /> */}
                <Route
                  path="/permissions"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <PermissionManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/assign-permissions"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <AssignPermissionManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/stations"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <StationManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tickets"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <TicketManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <TransactionManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <InventoryManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory-transactions"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <InventoryTransactionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory-transactions/import"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <InventoryTransactionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/inventory-transactions/export"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <InventoryTransactionPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/partner-debt"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <PartnerDebtManagement />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;