import React from 'react';
import { CommonHeader } from '@/components/common';

interface UserHeaderProps {
  onAddUser: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  onAddUser,
  onRefresh,
  loading,
}) => {
  return (
    <CommonHeader
      title="Quản lý người dùng"
      subtitle="Quản lý thông tin và quyền hạn của các người dùng trong hệ thống"
      onCreate={onAddUser}
      onRefresh={onRefresh}
      loading={loading}
      createButtonText="Thêm người dùng"
    />
  );
};

export default UserHeader;
