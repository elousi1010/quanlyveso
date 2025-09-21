import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../Auth/ProtectedRoute';
import Unauthorized from '../../pages/Unauthorized';
import DashboardLayout from '../Layout/DashboardLayout';

// Import pages with real APIs
import PartnerManagement from '../../pages/Partners/PartnerManagement';
import UserManagement from '../../pages/Users/UserManagement';
import { OrganizationManagement } from '../../pages/Organizations';
import { PermissionManagement } from '../../pages/Permissions';
import { StationManagement } from '../../pages/Stations';
import { TicketManagement } from '../../pages/Tickets';
import { TransactionManagement } from '../../pages/Transactions';
import { InventoryManagement } from '../../pages/Inventory';
import TokenTest from '../../pages/TokenTest';

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
                {/* Default route - redirect to users */}
                <Route path="/" element={<UserManagement />} />
                
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
                <Route
                  path="/organizations"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <OrganizationManagement />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/permissions"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <PermissionManagement />
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
                  path="/token-test"
                  element={
                    <ProtectedRoute requiredRoles={['admin', 'user', 'owner']}>
                      <TokenTest />
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