import { useState } from 'react';
import { useCreateUser, useUpdateUser, useDeleteUser } from './useUserApi';
import type { CreateUserRequest, UpdateUserRequest, User } from '../types';

// Hook để quản lý mutations cho User
export const useUserMutations = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewEditDialogOpen, setIsViewEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // API mutations
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  // Create user
  const handleCreateUser = (data: CreateUserRequest) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        setIsCreateDialogOpen(false);
        setSelectedUser(null);
      },
    });
  };

  // Update user
  const handleUpdateUser = (data: UpdateUserRequest) => {
    if (!selectedUser) return;

    updateUserMutation.mutate(
      { id: selectedUser.id, data },
      {
        onSuccess: () => {
          setIsViewEditDialogOpen(false);
          setSelectedUser(null);
        },
      }
    );
  };

  // Delete user
  const handleDeleteUser = () => {
    if (!selectedUser) return;

    deleteUserMutation.mutate(selectedUser.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        setSelectedUser(null);
      },
    });
  };

  // Dialog handlers
  const openCreateDialog = () => {
    setSelectedUser(null);
    setIsCreateDialogOpen(true);
  };

  const openViewEditDialog = (user: User) => {
    setSelectedUser(user);
    setIsViewEditDialogOpen(true);
  };

  const openDeleteDialog = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const closeAllDialogs = () => {
    setIsCreateDialogOpen(false);
    setIsViewEditDialogOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  return {
    // State
    selectedUser,
    isCreateDialogOpen,
    isViewEditDialogOpen,
    isDeleteDialogOpen,

    // Mutations
    createUserMutation,
    updateUserMutation,
    deleteUserMutation,

    // Handlers
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    openCreateDialog,
    openViewEditDialog,
    openDeleteDialog,
    closeAllDialogs,
  } as const;
};
