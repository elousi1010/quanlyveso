import React, { lazy, Suspense } from 'react';
import { Spin, Flex } from 'antd';

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
        <Flex justify="center" align="center" style={{ padding: '48px' }}>
          <Spin size="large" tip="Đang tải..." />
        </Flex>
      }
    >
      <BulkPermissionAssignment {...props} />
    </Suspense>
  );
};

export default BulkPermissionAssignmentWrapper;
