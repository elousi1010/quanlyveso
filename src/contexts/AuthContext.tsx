import React, { useState, useEffect } from 'react';
import type { User, AuthContextType } from '../types/auth';
import { ROLE_PERMISSIONS } from '../types/auth';
import { AuthContext } from './AuthContext';

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication - replace with real API call
    const mockUsers: User[] = [
      {
        id: '1',
        username: 'owner',
        email: 'owner@example.com',
        fullName: 'Chủ cửa hàng',
        role: 'owner',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '2',
        username: 'employee',
        email: 'employee@example.com',
        fullName: 'Nhân viên quầy',
        role: 'employee',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
      {
        id: '3',
        username: 'seller',
        email: 'seller@example.com',
        fullName: 'Người bán vé dạo',
        role: 'seller',
        isActive: true,
        createdAt: new Date('2024-01-01'),
      },
    ];

    const foundUser = mockUsers.find(u => u.username === username);
    
    if (foundUser && password === 'password') {
      const userWithLogin = { ...foundUser, lastLogin: new Date() };
      setUser(userWithLogin);
      localStorage.setItem('user', JSON.stringify(userWithLogin));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    const userPermissions = ROLE_PERMISSIONS[user.role] || [];
    return userPermissions.includes(permission);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
