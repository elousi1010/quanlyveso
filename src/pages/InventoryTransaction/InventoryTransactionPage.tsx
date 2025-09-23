import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { InventoryTransactionManagement } from './InventoryTransactionManagement';
import type { InventoryTransactionType } from './types';

export const InventoryTransactionPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState<InventoryTransactionType>('import');

  // Determine active type based on URL
  useEffect(() => {
    const path = location.pathname;
    if (path.includes('/export')) {
      setActiveType('export');
    } else if (path.includes('/import')) {
      setActiveType('import');
    } else if (path === '/inventory-transactions') {
      // Default redirect to import
      navigate('/inventory-transactions/import', { replace: true });
    }
  }, [location.pathname, navigate]);

  return <InventoryTransactionManagement type={activeType} />;
};
