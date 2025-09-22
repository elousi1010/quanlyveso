import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  ConfirmationNumber as TicketIcon,
  Receipt as TransactionIcon,
  Person as PersonIcon,
  Business as PartnerIcon,
  BusinessCenter as OrganizationIcon,
  Security as PermissionIcon,
  Assignment as AssignmentIcon,
  LocationOn as StationIcon,
  Inventory as InventoryIcon,
  Assessment as AssessmentIcon,
  MenuOpen as MenuOpenIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import { PERMISSIONS } from '../../types/auth';
import { getRoleDisplayName } from '../../utils/roleMapping';

const drawerWidth = 320;

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
  const { user, logout } = useAuthState();
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

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuGroups = [
    {
      id: 'management',
      title: 'Quản lý hệ thống',
      items: [
        {
          text: 'Quản lý người dùng',
          icon: <PersonIcon />,
          path: '/users',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Đối tác',
          icon: <PartnerIcon />,
          path: '/partners',
          permission: PERMISSIONS.MANAGE_PARTNERS,
        },
        {
          text: 'Tổ chức',
          icon: <OrganizationIcon />,
          path: '/organizations',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Quyền hạn',
          icon: <PermissionIcon />,
          path: '/permissions',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Gán quyền',
          icon: <AssignmentIcon />,
          path: '/assign-permissions',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Trạm',
          icon: <StationIcon />,
          path: '/stations',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
        {
          text: 'Vé số',
          icon: <TicketIcon />,
          path: '/tickets',
          permission: PERMISSIONS.MANAGE_TICKETS,
        },
        {
          text: 'Giao dịch',
          icon: <TransactionIcon />,
          path: '/transactions',
          permission: PERMISSIONS.MANAGE_TRANSACTIONS,
        },
        {
          text: 'Kho',
          icon: <InventoryIcon />,
          path: '/inventory',
          permission: PERMISSIONS.MANAGE_EMPLOYEES,
        },
      ]
    },
    {
      id: 'testing',
      title: 'Testing & Debug',
      items: [
        {
          text: 'Token Refresh Test',
          icon: <SettingsIcon />,
          path: '/token-test',
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

  const drawer = (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <DashboardIcon className="text-white text-lg" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-gray-900 truncate">OHNA12 Lottery Tickets</h1>
              <p className="text-xs text-gray-500 truncate">Quản lý vé số</p>
            </div>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500">
            <span className="text-white text-sm font-semibold">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || 'Người dùng'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {getRoleDisplayName(user?.role || 'user')}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto sidebar-scroll">
        <List className="space-y-0.5">
          {filteredMenuGroups.map((group) => {
            const isGroupOpen = openGroups[group.id];
            const hasActiveItem = group.items.some(item => location.pathname === item.path);
            
            return (
              <div key={group.id} className="mb-1">
                {/* Group Header */}
                <ListItemButton
                  onClick={() => handleGroupToggle(group.id)}
                  className={`px-2 py-1.5 rounded-lg transition-all duration-200 ${
                    hasActiveItem
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  sx={{ minHeight: 36 }}
                >
                  <ListItemIcon className="min-w-0 mr-2 w-6 h-6" sx={{ minWidth: 24 }}>
                    <div className={`${hasActiveItem ? 'text-blue-600' : 'text-gray-400'} flex-shrink-0`}>
                      {group.id === 'dashboard' && <DashboardIcon fontSize="small" />}
                      {group.id === 'tickets' && <TicketIcon fontSize="small" />}
                      {group.id === 'management' && <SettingsIcon fontSize="small" />}
                      {group.id === 'masterdata' && <SettingsIcon fontSize="small" />}
                      {group.id === 'reports' && <AssessmentIcon fontSize="small" />}
                      {group.id === 'transactions' && <TransactionIcon fontSize="small" />}
                    </div>
                  </ListItemIcon>
                  <ListItemText 
                    primary={group.title}
                    primaryTypographyProps={{
                      className: "font-semibold text-sm"
                    }}
                  />
                      {isGroupOpen ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                </ListItemButton>

                {/* Group Items */}
                <Collapse in={isGroupOpen} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <ListItemButton
                key={item.text}
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                          className={`ml-3 px-2 py-1.5 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
                          sx={{ 
                            minHeight: 32,
                            pl: 2.5,
                            ml: 1.5
                          }}
              >
                          <ListItemIcon className="min-w-0 mr-2" sx={{ minWidth: 24 }}>
                            <div className={`${isActive ? 'text-blue-600' : 'text-gray-400'} flex-shrink-0`}>
                  {item.icon}
                </div>
                          </ListItemIcon>
                          <ListItemText 
                            primary={item.text}
                            primaryTypographyProps={{
                              className: "font-medium text-sm"
                            }}
                          />
                {isActive && (
                            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full ml-auto flex-shrink-0" />
                          )}
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </div>
            );
          })}
        </List>
      </nav>

      {/* Footer */}
      <div className="p-2 sm:p-4 border-t border-gray-200 flex-shrink-0">
        <div className="text-xs text-gray-500 text-center">
          <p className="hidden sm:block">Phiên bản 1.0.0</p>
          <p>© 2024 Vé Số Pro</p>
        </div>
      </div>
    </div>
  );

  return (
    <Box className="flex h-screen bg-gray-50">
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { sm: sidebarOpen ? `${drawerWidth}px` : 0 },
          transition: 'all 0.3s ease-in-out',
          bgcolor: 'white',
          color: 'text.primary',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Toolbar className="justify-between px-2 sm:px-4" sx={{ paddingBottom: '10px', paddingTop: '10px' }}>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleSidebarToggle}
              size="small"
              sx={{ mr: 1 }}
            >
              {sidebarOpen ? <MenuOpenIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
            </IconButton>
            <div className="min-w-0">
              <Typography variant="h6" noWrap component="div" className="text-gray-900 text-sm sm:text-base">
                {(() => {
                  // Find current page title from menu groups
                  for (const group of filteredMenuGroups) {
                    const item = group.items.find(item => item.path === location.pathname);
                    if (item) return item.text;
                  }
                  return 'Dashboard';
                })()}
              </Typography>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-4">
            {/* Notifications */}
            <IconButton color="inherit" className="text-gray-600 p-1 sm:p-2">
              <Badge badgeContent={3} color="error">
                <NotificationIcon className="text-lg sm:text-xl" />
              </Badge>
            </IconButton>

            {/* Settings */}
            <IconButton color="inherit" className="text-gray-600 p-1 sm:p-2">
              <SettingsIcon className="text-lg sm:text-xl" />
            </IconButton>

            {/* Profile Menu */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-gray-900 truncate max-w-24">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {getRoleDisplayName(user?.role || 'user')}
                </p>
              </div>
              <IconButton
                onClick={handleProfileMenuOpen}
                className="p-1"
              >
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500">
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
              </IconButton>
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
          className: 'min-w-48 shadow-lg border border-gray-200',
        }}
      >
        <MenuItem onClick={handleProfileMenuClose} className="py-3">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500">
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.phone_number}</p>
            </div>
          </div>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} className="py-3 text-red-600">
          <LogoutIcon className="mr-3" />
          Đăng xuất
        </MenuItem>
      </Menu>

      {/* Drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: sidebarOpen ? drawerWidth : 0 }, flexShrink: { sm: 0 } }}
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
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: sidebarOpen ? drawerWidth : 0, 
              transition: 'width 0.3s ease-in-out',
              overflow: 'hidden'
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          transition: 'width 0.3s ease-in-out',
          minHeight: '100vh',
          bgcolor: '#fafafa',
        }}
      >
        <Toolbar />
        <Box sx={{ mt: 2 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;