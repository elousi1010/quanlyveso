// Authentication and authorization types

export type UserRole = 'admin' | 'owner' | 'employee' | 'seller' | 'user';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isLoading?: boolean;
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
}

export const PERMISSIONS = {
  VIEW_DASHBOARD: 'view_dashboard',
  VIEW_PROFIT: 'view_profit',
  MANAGE_TICKETS: 'manage_tickets',
  MANAGE_DEBTS: 'manage_debts',
  MANAGE_PROVINCES: 'manage_provinces',
  MANAGE_SELLERS: 'manage_sellers',
  MANAGE_EXCHANGES: 'manage_exchanges',
  MANAGE_TRANSACTIONS: 'manage_transactions',
  MANAGE_EMPLOYEES: 'manage_employees',
  MANAGE_PARTNERS: 'manage_partners',
  VIEW_REPORTS: 'view_reports',
  MANAGE_SHIFTS: 'manage_shifts',
} as const;

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: [
    // Admin có tất cả quyền
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFIT,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.MANAGE_DEBTS,
    PERMISSIONS.MANAGE_PROVINCES,
    PERMISSIONS.MANAGE_SELLERS,
    PERMISSIONS.MANAGE_EXCHANGES,
    PERMISSIONS.MANAGE_TRANSACTIONS,
    PERMISSIONS.MANAGE_EMPLOYEES,
    PERMISSIONS.MANAGE_PARTNERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_SHIFTS,
  ],
  owner: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFIT,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.MANAGE_DEBTS,
    PERMISSIONS.MANAGE_PROVINCES,
    PERMISSIONS.MANAGE_SELLERS,
    PERMISSIONS.MANAGE_EXCHANGES,
    PERMISSIONS.MANAGE_TRANSACTIONS,
    PERMISSIONS.MANAGE_EMPLOYEES,
    PERMISSIONS.MANAGE_PARTNERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_SHIFTS,
  ],
  employee: [
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.MANAGE_TRANSACTIONS,
    PERMISSIONS.VIEW_DASHBOARD,
  ],
  seller: [
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.VIEW_DASHBOARD,
  ],
  user: [
    // User có tất cả quyền như admin
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_PROFIT,
    PERMISSIONS.MANAGE_TICKETS,
    PERMISSIONS.MANAGE_DEBTS,
    PERMISSIONS.MANAGE_PROVINCES,
    PERMISSIONS.MANAGE_SELLERS,
    PERMISSIONS.MANAGE_EXCHANGES,
    PERMISSIONS.MANAGE_TRANSACTIONS,
    PERMISSIONS.MANAGE_EMPLOYEES,
    PERMISSIONS.MANAGE_PARTNERS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.MANAGE_SHIFTS,
  ],
};
