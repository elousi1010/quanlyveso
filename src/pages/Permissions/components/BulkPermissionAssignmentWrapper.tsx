import React, { lazy, Suspense } from 'react';
import { CircularProgress, Box } from '@mui/material';

const BulkPermissionAssignment = lazy(() => import('./BulkPermissionAssignment'));

interface BulkPermissionAssignmentWrapperProps {
  open: boolean;
  onClose: () => void;
  selectedUsers: any[];
  onSuccess?: () => void;
}

const BulkPermissionAssignmentWrapper: React.FC<BulkPermissionAssignmentWrapperProps> = (props) => {
  return (
    <Suspense
      fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      }
    >
      <BulkPermissionAssignment {...props} />
    </Suspense>
  );
};

export default BulkPermissionAssignmentWrapper;
