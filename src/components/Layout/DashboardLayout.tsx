import React, { useState } from 'react';

// CSS Animation for rotating circles
const rotateKeyframes = `
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

// Inject CSS
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = rotateKeyframes;
  document.head.appendChild(style);
}
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@mui/material';
import { Link } from 'react-router-dom';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketIcon,
  Receipt as TransactionIcon,
  Person as PersonIcon,
  Business as PartnerIcon,
  Security as PermissionIcon,
  LocationOn as StationIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  MenuOpen as MenuOpenIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Inventory2 as InventoryTransactionIcon,
  AccountBalance as PartnerDebtIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import { useTheme } from '../../contexts/ThemeContext';
import { PERMISSIONS } from '../../types/auth';
import { getRoleDisplayName } from '../../utils/roleMapping';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({
    tickets: true,
    management: true,
    reports: true,
    system: false,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<Record<string, boolean>>({});
  const { user, logout } = useAuthState();
  const { mode, toggleMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();


  // Helper function to check permissions (for backward compatibility)
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;

    // Admin và User có tất cả quyền
    if (user.role === 'admin' || user.role === 'user') return true;

    // Map permissions to roles
    const rolePermissions: Record<string, string[]> = {
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
    };

    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleProfileMenuClose();
  };

  const handleGroupToggle = (group: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  const handleSubmenuToggle = (itemText: string) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [itemText]: !prev[itemText]
    }));
  };

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuGroups = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      items: [
        {
          text: 'Overview',
          icon: <DashboardIcon />,
          path: '/dashboard',
          permission: PERMISSIONS.VIEW_DASHBOARD,
        },
      ]
    },
    {
      id: 'management',
      title: 'Management',
      items: [
        {
          text: 'User',
          icon: <PersonIcon />,
          path: '/users',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Partner',
          icon: <PartnerIcon />,
          path: '/partners',
          permission: PERMISSIONS.MANAGE_PARTNERS,
        },
        {
          text: 'Permission',
          icon: <PermissionIcon />,
          path: '/permissions',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Station',
          icon: <StationIcon />,
          path: '/stations',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Ticket',
          icon: <TicketIcon />,
          path: '/tickets',
          permission: PERMISSIONS.MANAGE_TICKETS,
        },
        // {
        //   text: 'Transaction',
        //   icon: <TransactionIcon />,
        //   path: '/transactions',
        //   permission: PERMISSIONS.MANAGE_TRANSACTIONS,
        // },
        {
          text: 'Inventory',
          icon: <InventoryIcon />,
          path: '/inventory',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Partner Debt',
          icon: <PartnerDebtIcon />,
          path: '/partner-debt',
          permission: PERMISSIONS.MANAGE_PARTNERS,
        },
      ]
    },
    {
      id: 'inventory-transactions',
      title: 'Giao Dịch Kho',
      items: [
        {
          text: 'Nhập Kho',
          path: '/inventory-transactions/import',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Xuất Kho',
          path: '/inventory-transactions/export',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
      ]
    },
    
  ];

  // Filter menu groups based on permissions
  const filteredMenuGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item => hasPermission(item.permission))
  })).filter(group => group.items.length > 0);

  // Get current page title and subtitle
  const getCurrentPageInfo = () => {
    const currentPath = location.pathname;
    
    // Find current page title from menu groups
    for (const group of filteredMenuGroups) {
      const item = group.items.find(item => item.path === currentPath);
      if (item) {
        return {
          title: item.text,
          subtitle: (() => {
            if (currentPath.includes('/partners')) return 'Quản lý đối tác';
            if (currentPath.includes('/users')) return 'Quản lý người dùng';
            if (currentPath.includes('/permissions')) return 'Quản lý quyền hạn';
            if (currentPath.includes('/stations')) return 'Quản lý trạm';
            if (currentPath.includes('/tickets')) return 'Quản lý vé số';
            if (currentPath.includes('/transactions')) return 'Quản lý giao dịch';
            if (currentPath.includes('/inventory')) return 'Quản lý kho';
            if (currentPath.includes('/partner-debt')) return 'Quản lý công nợ đối tác';
            if (currentPath.includes('/organizations')) return 'Quản lý tổ chức';
            return 'Hệ thống quản lý';
          })()
        };
      }
    }
    return {
      title: 'MANAGEMENT',
      subtitle: 'Hệ thống quản lý'
    };
  };

  const { title, subtitle } = getCurrentPageInfo();

  const drawer = (
    <motion.div 
      className="h-full flex flex-col relative"
      style={{
        background: mode === 'light' ? '#ffffff' : '#1e1e1e',
        width: '280px',
        borderRadius: '0px',
        borderRight: `1px solid ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
        position: 'relative',
        boxShadow: 'none',
      }}
      initial={{ x: -280 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* Logo */}
      <motion.div 
        className="flex-shrink-0"
        style={{
          padding: '12px 20px',
          minHeight: '56px',
          display: 'flex',
          borderRadius: '0px',
          alignItems: 'center',
        }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <motion.div 
          className="rounded-lg flex items-center justify-center w-full"
          style={{
            background: mode === 'light' 
              ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            padding: '12px 20px',
            borderRadius: '16px',
            boxShadow: mode === 'light' 
              ? '0 6px 20px rgba(102, 126, 234, 0.3)'
              : '0 6px 20px rgba(79, 172, 254, 0.3)',
            width: '100%',
          }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', width: '100%', justifyContent: 'center' }}>
            {/* Logo Icon */}
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255, 255, 255, 0.3)',
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
                }}
              >
                <defs>
                  <linearGradient id="sidebarLotteryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="white" stopOpacity="1" />
                    <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="url(#sidebarLotteryGradient)"
                  strokeWidth="2.5"
                  fill="rgba(255, 255, 255, 0.1)"
                />
                <g transform="translate(12, 12)">
                  <circle
                    cx="-4"
                    cy="-4"
                    r="2.5"
                    fill="url(#sidebarLotteryGradient)"
                    style={{
                      animation: 'rotate 4s linear infinite',
                      transformOrigin: '0 0'
                    }}
                  />
                  <circle
                    cx="4"
                    cy="-4"
                    r="2.5"
                    fill="url(#sidebarLotteryGradient)"
                    style={{
                      animation: 'rotate 4s linear infinite',
                      transformOrigin: '0 0',
                      animationDelay: '1s'
                    }}
                  />
                  <circle
                    cx="-4"
                    cy="4"
                    r="2.5"
                    fill="url(#sidebarLotteryGradient)"
                    style={{
                      animation: 'rotate 4s linear infinite',
                      transformOrigin: '0 0',
                      animationDelay: '2s'
                    }}
                  />
                  <circle
                    cx="4"
                    cy="4"
                    r="2.5"
                    fill="url(#sidebarLotteryGradient)"
                    style={{
                      animation: 'rotate 4s linear infinite',
                      transformOrigin: '0 0',
                      animationDelay: '3s'
                    }}
                  />
                </g>
                <circle
                  cx="12"
                  cy="12"
                  r="3.5"
                  fill="rgba(255, 255, 255, 0.2)"
                  stroke="rgba(255, 255, 255, 0.5)"
                  strokeWidth="1"
                />
                <text
                  x="12"
                  y="15"
                  textAnchor="middle"
                  fontSize="8"
                  fill="white"
                  fontWeight="bold"
                  fontFamily="Arial, sans-serif"
                >
                  $
                </text>
              </svg>
            </div>
            
            {/* Logo Text */}
            <div>
              <div
                style={{
                  color: 'white',
                  fontWeight: '800',
                  fontSize: '18px',
                  lineHeight: 1,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  letterSpacing: '1px',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                }}
              >
                Hnoa
              </div>
              <div
                style={{
                  color: 'rgba(255, 255, 255, 0.95)',
                  fontWeight: '600',
                  fontSize: '10px',
                  lineHeight: 1,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)',
                }}
              >
                Lottery
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2 overflow-y-auto sidebar-scroll">
        <List className="space-y-1">
          {filteredMenuGroups.map((group, groupIndex) => {
            const isGroupOpen = openGroups[group.id];
            const hasActiveItem = group.items.some(item => location.pathname === item.path);

            return (
              <motion.div 
                key={group.id} 
                className="mb-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: groupIndex * 0.1 }}
              >
                {/* Group Header */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                <ListItemButton
                  onClick={() => handleGroupToggle(group.id)}
                    sx={{ 
                      minHeight: 48,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      mb: 0.5,
                      backgroundColor: hasActiveItem 
                        ? (mode === 'light' ? '#f3f4f6' : '#374151')
                        : 'transparent',
                      color: hasActiveItem 
                        ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                        : (mode === 'light' ? '#6b7280' : '#9ca3af'),
                      '&:hover': {
                        backgroundColor: mode === 'light' ? '#f9fafb' : '#374151',
                        color: mode === 'light' ? '#7c3aed' : '#a855f7',
                      },
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    <ListItemIcon className="min-w-0 mr-3 w-6 h-6" sx={{ minWidth: 24 }}>
                      <div 
                        className="flex-shrink-0"
                        style={{ 
                          color: hasActiveItem 
                            ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                            : (mode === 'light' ? '#9ca3af' : '#6b7280')
                        }}
                      >
                      {group.id === 'dashboard' && <DashboardIcon fontSize="small" />}
                      {group.id === 'tickets' && <TicketIcon fontSize="small" />}
                      {group.id === 'management' && <SettingsIcon fontSize="small" />}
                      {group.id === 'masterdata' && <SettingsIcon fontSize="small" />}
                      {group.id === 'reports' && <AssessmentIcon fontSize="small" />}
                      {group.id === 'transactions' && <TransactionIcon fontSize="small" />}
                      {group.id === 'inventory-transactions' && <InventoryTransactionIcon fontSize="small" />}
                    </div>
                  </ListItemIcon>
                  <ListItemText
                    primary={group.title}
                    primaryTypographyProps={{
                        className: "font-medium text-sm",
                        style: { 
                          color: hasActiveItem 
                            ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                            : (mode === 'light' ? '#6b7280' : '#9ca3af')
                        }
                      }}
                    />
                    <motion.div
                      animate={{ rotate: isGroupOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      style={{ 
                        color: hasActiveItem 
                          ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                          : (mode === 'light' ? '#9ca3af' : '#6b7280')
                      }}
                    >
                  {isGroupOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                    </motion.div>
                </ListItemButton>
                </motion.div>

                {/* Group Items */}
                <AnimatePresence>
                  {isGroupOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    >
                      <Box sx={{ ml: 2, position: 'relative' }}>
                        {/* Vertical line */}
                        <Box
                          sx={{
                            position: 'absolute',
                            left: 12,
                            top: 0,
                            bottom: 0,
                            width: '1px',
                            backgroundColor: mode === 'light' ? '#e5e7eb' : '#374151',
                          }}
                        />
                  <List component="div" disablePadding>
                          {group.items.map((item, itemIndex) => {
                      const subItems = (item as Record<string, unknown>).subItems as Record<string, unknown>[] | undefined;
                      const isActive = location.pathname === item.path || (subItems && subItems.some((subItem: Record<string, unknown>) => location.pathname === subItem.path));
                      const hasSubItems = subItems && subItems.length > 0;
                      
                      return (
                              <motion.div
                                key={item.text}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.2, delay: itemIndex * 0.05 }}
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                              >
                        <ListItemButton
                          onClick={() => {
                            if (hasSubItems) {
                              handleSubmenuToggle(item.text);
                            } else {
                              navigate(item.path);
                              setMobileOpen(false);
                            }
                          }}
                          sx={{
                                    minHeight: 40,
                                    pl: 4,
                                    px: 3,
                                    py: 1.5,
                                    borderRadius: 2,
                                    mb: 0.5,
                                    backgroundColor: isActive 
                                      ? (mode === 'light' ? '#f3f4f6' : '#374151')
                                      : 'transparent',
                                    color: isActive 
                                      ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                                      : (mode === 'light' ? '#6b7280' : '#9ca3af'),
                                    '&:hover': {
                                      backgroundColor: mode === 'light' ? '#f9fafb' : '#374151',
                                      color: mode === 'light' ? '#7c3aed' : '#a855f7',
                                    },
                                    transition: 'all 0.2s ease-in-out',
                                    position: 'relative',
                                  }}
                                >
                                  {/* Dot indicator */}
                                  <Box
                                    sx={{
                                      position: 'absolute',
                                      left: 8,
                                      top: '50%',
                                      transform: 'translateY(-50%)',
                                      width: 6,
                                      height: 6,
                                      borderRadius: '50%',
                                      backgroundColor: isActive 
                                        ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                                        : (mode === 'light' ? '#d1d5db' : '#4b5563'),
                                    }}
                                  />
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                                      className: "font-medium text-sm",
                                      style: { 
                                        color: isActive 
                                          ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                                          : (mode === 'light' ? '#6b7280' : '#9ca3af')
                                      }
                                    }}
                                  />
                                  {/* Submenu arrow */}
                                  {hasSubItems && (
                                    <Box sx={{ ml: 'auto' }}>
                                      {openSubmenus[item.text] ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                    </Box>
                                  )}
                        </ListItemButton>
                        
                        {/* Submenu items */}
                        {hasSubItems && (
                          <Collapse in={openSubmenus[item.text] || false} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                              {subItems.map((subItem: Record<string, unknown>, subIndex: number) => {
                                const isSubActive = location.pathname === subItem.path;
                                return (
                                  <motion.div
                                    key={subItem.text as string}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                  >
                                    <ListItemButton
                                      onClick={() => {
                                        navigate(subItem.path as string);
                                        setMobileOpen(false);
                                      }}
                                      className="submenu-item"
                                      style={{
                                        backgroundColor: 'transparent !important',
                                      }}
                                      sx={{
                                        minHeight: 36,
                                        pl: 6,
                                        px: 3,
                                        py: 1,
                                        borderRadius: 2,
                                        mb: 0.5,
                                        backgroundColor: 'transparent',
                                        color: isSubActive 
                                          ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                                          : (mode === 'light' ? '#6b7280' : '#9ca3af'),
                                        '&:hover': {
                                          backgroundColor: mode === 'light' ? '#f9fafb' : '#374151',
                                          color: mode === 'light' ? '#7c3aed' : '#a855f7',
                                        },
                                        '&.Mui-selected': {
                                          backgroundColor: 'transparent',
                                        },
                                        '&.Mui-active': {
                                          backgroundColor: 'transparent',
                                        },
                                        '&.Mui-focusVisible': {
                                          backgroundColor: 'transparent',
                                        },
                                        '&.Mui-disabled': {
                                          backgroundColor: 'transparent',
                                        },
                                        '&:focus': {
                                          backgroundColor: 'transparent',
                                        },
                                        '&:active': {
                                          backgroundColor: 'transparent',
                                        },
                                        '&:visited': {
                                          backgroundColor: 'transparent',
                                        },
                                        '&:link': {
                                          backgroundColor: 'transparent',
                                        },
                                        transition: 'all 0.2s ease-in-out',
                                        position: 'relative',
                                      }}
                                    >
                                      {/* Submenu dot indicator */}
                                      <Box
                                        sx={{
                                          position: 'absolute',
                                          left: 12,
                                          top: '50%',
                                          transform: 'translateY(-50%)',
                                          width: 4,
                                          height: 4,
                                          borderRadius: '50%',
                                          backgroundColor: isSubActive 
                                            ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                                            : (mode === 'light' ? '#d1d5db' : '#4b5563'),
                                        }}
                                      />
                                      <ListItemText
                                        primary={subItem.text as string}
                                        primaryTypographyProps={{
                                          className: "font-medium text-xs",
                                          style: { 
                                            color: isSubActive 
                                              ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                                              : (mode === 'light' ? '#6b7280' : '#9ca3af')
                                          }
                                        }}
                                      />
                                    </ListItemButton>
                                  </motion.div>
                                );
                              })}
                            </List>
                          </Collapse>
                        )}
                              </motion.div>
                      );
                    })}
                  </List>
                      </Box>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </List>
      </nav>

      {/* Footer */}
      <motion.div 
        className="p-4 flex-shrink-0"
        style={{
          borderTop: `1px solid ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="text-xs text-center" style={{ color: mode === 'light' ? '#9ca3af' : '#6b7280' }}>
          <p>© 2024 Management System</p>
        </div>
      </motion.div>


    </motion.div>
  );

  return (
    <Box 
      className="flex h-screen"
      sx={{
        backgroundColor: mode === 'light' ? '#f1f5f9' : '#0f172a',
        borderRadius: '0px',
        boxShadow: 'none',
        border: 'none',
      }}
    >
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          borderRadius: '0px',
          borderBottom: 'none',
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : `calc(100% - ${collapsedDrawerWidth}px)` },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : `${collapsedDrawerWidth}px` },
          bgcolor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          color: mode === 'light' ? '#212121' : '#ffffff',
          boxShadow: 'none',
          zIndex: 1200,
        }}
      >
        <Toolbar className="justify-between px-2 sm:px-4" sx={{ paddingBottom: '16px', paddingTop: '16px', minHeight: '72px', borderRadius: '0px' }}>
          <div className="flex items-center space-x-2 sm:space-x-4 border-radius-0">
            {/* Page Title */}
            <div className="min-w-0">
              <h1 
                className="text-lg font-bold truncate"
                style={{ color: mode === 'light' ? '#212121' : '#ffffff' }}
              >
                {title}
              </h1>
              <p 
                className="text-sm text-gray-500 truncate"
                style={{ color: mode === 'light' ? '#6b7280' : '#9ca3af' }}
              >
                {subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4 border-radius-0">
            {/* Dark Mode Toggle */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ borderRadius: '0px' }}
            >
              <IconButton 
                onClick={toggleMode}
                color="inherit" 
                className="p-1 sm:p-2"
                sx={{ 
                  color: mode === 'light' ? '#616161' : '#b0b0b0',
                  '&:hover': {
                    color: mode === 'light' ? '#1976d2' : '#90caf9',
                  }
                }}
              >
                {mode === 'light' ? <DarkModeIcon className="text-lg sm:text-xl" /> : <LightModeIcon className="text-lg sm:text-xl" />}
              </IconButton>
            </motion.div>

            {/* Notifications */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton 
                color="inherit" 
                className="p-1 sm:p-2"
                sx={{ 
                  color: mode === 'light' ? '#616161' : '#b0b0b0',
                  '&:hover': {
                    color: mode === 'light' ? '#1976d2' : '#90caf9',
                  }
                }}
              >
              <Badge badgeContent={3} color="error">
                <NotificationIcon className="text-lg sm:text-xl" />
              </Badge>
            </IconButton>
            </motion.div>

            {/* Settings */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <IconButton 
                color="inherit" 
                className="p-1 sm:p-2"
                sx={{ 
                  color: mode === 'light' ? '#616161' : '#b0b0b0',
                  '&:hover': {
                    color: mode === 'light' ? '#1976d2' : '#90caf9',
                  }
                }}
              >
              <SettingsIcon className="text-lg sm:text-xl" />
            </IconButton>
            </motion.div>

            {/* Profile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-right hidden lg:block">
                <p 
                  className="text-sm font-medium truncate max-w-24"
                  style={{ color: mode === 'light' ? '#212121' : '#ffffff' }}
                >
                  {user?.name}
                </p>
                <p 
                  className="text-xs truncate"
                  style={{ color: mode === 'light' ? '#757575' : '#b0b0b0' }}
                >
                  {getRoleDisplayName(user?.role || 'user')}
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
              <IconButton
                onClick={handleProfileMenuOpen}
                className="p-1"
              >
                  <Avatar 
                    className="w-7 h-7 sm:w-8 sm:h-8"
                    sx={{
                      background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                    }}
                  >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
              </motion.div>
            </div>
          </div>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        className="mt-2"
        PaperProps={{
          className: 'min-w-48 shadow-lg border-radius-0',
          style: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            border: `1px solid ${mode === 'light' ? '#e0e0e0' : '#424242'}`,
            borderRadius: 12,
          },
        }}
      >
        <MenuItem 
          onClick={handleProfileMenuClose} 
          className="py-3"
          sx={{
            borderRadius: '0px',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#f5f5f5' : '#2a2a2a',
            },
          }}
        >
          <div className="flex items-center space-x-3">
            <Avatar 
              className="w-8 h-8"
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <div>
              <p 
                className="font-medium"
                style={{ color: mode === 'light' ? '#212121' : '#ffffff' }}
              >
                {user?.name}
              </p>
              <p 
                className="text-sm"
                style={{ color: mode === 'light' ? '#757575' : '#b0b0b0' }}
              >
                {user?.phone_number}
              </p>
            </div>
          </div>
        </MenuItem>
        <Divider sx={{ backgroundColor: mode === 'light' ? '#e0e0e0' : '#424242' }} />
        <MenuItem 
          onClick={handleLogout} 
          className="py-3"
          sx={{
            color: '#f44336',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#ffebee' : '#2a1a1a',
            },
          }}
        >
          <LogoutIcon className="mr-3" />
          Đăng xuất
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: sidebarOpen ? drawerWidth : collapsedDrawerWidth }, flexShrink: { sm: 0 }, borderRadius: '0px' }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            borderRadius: '0px',
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            borderRadius: '0px',
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: sidebarOpen ? drawerWidth : collapsedDrawerWidth,
              transition: 'width 0.3s ease-in-out',
              overflow: 'hidden'
            },
          }}
          open
        >
          {sidebarOpen ? drawer : (
            <motion.div 
              className="h-full flex flex-col relative"
              style={{
                background: mode === 'light' ? '#ffffff' : '#1e1e1e',
                width: `${collapsedDrawerWidth}px`,
                borderRight: `1px solid ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
                position: 'relative',
                borderRadius: '0px',
              }}
              initial={{ x: -collapsedDrawerWidth }}
              animate={{ x: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              {/* Logo - Collapsed */}
              <motion.div 
                className="flex-shrink-0"
                style={{
                  padding: '16px 12px',
                  minHeight: '72px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '0px',
                }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <motion.div 
                  className="rounded-lg flex items-center justify-center"
                  style={{
                    background: mode === 'light' 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    padding: '6px 8px',
                    borderRadius: '10px',
                    boxShadow: mode === 'light' 
                      ? '0 3px 10px rgba(102, 126, 234, 0.3)'
                      : '0 3px 10px rgba(79, 172, 254, 0.3)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {/* Logo Icon */}
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '6px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        style={{
                          filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))'
                        }}
                      >
                        <defs>
                          <linearGradient id="collapsedLotteryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="white" stopOpacity="1" />
                            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.8)" stopOpacity="0.8" />
                          </linearGradient>
                        </defs>
                        <circle
                          cx="12"
                          cy="12"
                          r="6"
                          stroke="url(#collapsedLotteryGradient)"
                          strokeWidth="1.5"
                          fill="rgba(255, 255, 255, 0.1)"
                        />
                        <circle
                          cx="8"
                          cy="8"
                          r="1.5"
                          fill="url(#collapsedLotteryGradient)"
                        />
                        <circle
                          cx="16"
                          cy="8"
                          r="1.5"
                          fill="url(#collapsedLotteryGradient)"
                        />
                        <circle
                          cx="8"
                          cy="16"
                          r="1.5"
                          fill="url(#collapsedLotteryGradient)"
                        />
                        <circle
                          cx="16"
                          cy="16"
                          r="1.5"
                          fill="url(#collapsedLotteryGradient)"
                        />
                        <circle
                          cx="12"
                          cy="12"
                          r="2"
                          fill="rgba(255, 255, 255, 0.2)"
                          stroke="rgba(255, 255, 255, 0.5)"
                          strokeWidth="0.5"
                        />
                        <text
                          x="12"
                          y="13"
                          textAnchor="middle"
                          fontSize="4"
                          fill="white"
                          fontWeight="bold"
                          fontFamily="Arial, sans-serif"
                        >
                          $
                        </text>
                      </svg>
                    </div>
                    
                    {/* Logo Text - Only show "O" in collapsed mode */}
                    <div
                      style={{
                        color: 'white',
                        fontWeight: '800',
                        fontSize: '12px',
                        lineHeight: 1,
                        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)',
                        letterSpacing: '0.5px',
                        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
                      }}
                    >
                      O
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* Navigation Icons - Collapsed */}
              <nav className="flex-1 px-2 py-2 overflow-y-auto border-radius-0">
                <List className="space-y-1">
                  {filteredMenuGroups.map((group, groupIndex) => {
                    return group.items.map((item, itemIndex) => (
                      <motion.div
                        key={`${groupIndex}-${itemIndex}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + (itemIndex * 0.05) }}
                      >
                        <ListItem disablePadding>
                          <ListItemButton
                            component={Link}
                            to={item.path}
                            className="py-2 px-1 rounded-lg flex flex-col"
                            sx={{
                              minHeight: 60,
                              justifyContent: 'center',
                              alignItems: 'center',
                              backgroundColor: location.pathname === item.path 
                                ? (mode === 'light' ? '#f3f4f6' : '#374151')
                                : 'transparent',
                              color: location.pathname === item.path 
                                ? (mode === 'light' ? '#7c3aed' : '#a855f7')
                                : (mode === 'light' ? '#6b7280' : '#9ca3af'),
                              '&:hover': {
                                backgroundColor: mode === 'light' ? '#f8fafc' : '#2a2a2a',
                                color: mode === 'light' ? '#374151' : '#d1d5db',
                              },
                              transition: 'all 0.2s ease-in-out',
                            }}
                          >
                            <ListItemIcon 
                              sx={{ 
                                minWidth: 'auto',
                                color: 'inherit',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: '4px',
                              }}
                            >
                              {'icon' in item ? item.icon : <Box sx={{ width: 16, height: 16 }} />}
                            </ListItemIcon>
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '10px',
                                fontWeight: 500,
                                textAlign: 'center',
                                lineHeight: 1.2,
                                color: 'inherit',
                                opacity: 0.9,
                              }}
                            >
                              {item.text}
                            </Typography>
                          </ListItemButton>
                        </ListItem>
                      </motion.div>
                    ));
                  })}
                </List>
              </nav>

            </motion.div>
          )}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'hidden',
          backgroundColor: mode === 'light' ? '#f1f5f9' : '#0f172a',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '0px',
        }}
      >
        <Toolbar />
        <Box
          sx={{
            flex: 1,
            overflow: 'auto',
            padding: '24px',
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e293b',
            borderRadius: '0px',
          }}
        >
          {children}
        </Box>
      </Box>

      {/* Toggle Sidebar Button - Positioned relative to sidebar */}
      <Box
        sx={{
          position: 'absolute',
          left: sidebarOpen ? `${drawerWidth - 16}px` : `${collapsedDrawerWidth - 16}px`,
          top: '20px',
          zIndex: 1300, // Higher than AppBar but not too high
          transition: 'left 0.3s ease-in-out',
          borderRadius: '0px',
        }}
      >
        <IconButton
          onClick={handleSidebarToggle}
          className="border-radius-0"
          sx={{
            width: 32,
            height: 32,
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
            color: mode === 'light' ? '#6b7280' : '#9ca3af',
            border: `2px solid ${mode === 'light' ? '#e5e7eb' : '#374151'}`,
            boxShadow: mode === 'light' 
              ? '0 2px 4px rgba(0, 0, 0, 0.1)'
              : '0 2px 4px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              backgroundColor: mode === 'light' ? '#f8fafc' : '#2a2a2a',
              color: mode === 'light' ? '#374151' : '#d1d5db',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {sidebarOpen ? <MenuOpenIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
        </IconButton>
      </Box>

    </Box>
  );
};

export default DashboardLayout;