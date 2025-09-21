/**
 * Map role từ API sang role trong hệ thống
 */
export const mapApiRoleToSystemRole = (apiRole: string): 'admin' | 'owner' | 'employee' | 'seller' | 'user' => {
  // Mapping từ API role sang system role
  const roleMapping: Record<string, 'admin' | 'owner' | 'employee' | 'seller' | 'user'> = {
    'admin': 'admin',
    'owner': 'owner', 
    'employee': 'employee',
    'seller': 'seller',
    'user': 'user',
    // Có thể thêm mapping khác nếu cần
    'manager': 'owner',
    'staff': 'employee',
    'agent': 'seller',
  };

  return roleMapping[apiRole] || 'user';
};

/**
 * Check if API role is valid
 */
export const isValidApiRole = (apiRole: string): boolean => {
  const validRoles = ['admin', 'owner', 'employee', 'seller', 'user', 'manager', 'staff', 'agent'];
  return validRoles.includes(apiRole);
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role: string): string => {
  const roleNames: Record<string, string> = {
    'admin': 'Quản trị viên',
    'user': 'Người dùng (Toàn quyền)',
    'owner': 'Chủ cửa hàng',
    'employee': 'Nhân viên',
    'seller': 'Người bán',
    'manager': 'Quản lý',
    'staff': 'Nhân viên',
    'agent': 'Đại lý',
  };

  return roleNames[role] || 'Người dùng';
};
