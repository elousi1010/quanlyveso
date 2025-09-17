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
  TrendingUp as ProfitIcon,
  ConfirmationNumber as TicketIcon,
  AccountBalance as DebtIcon,
  LocationOn as ProvinceIcon,
  People as SellerIcon,
  SwapHoriz as ExchangeIcon,
  Receipt as TransactionIcon,
  Person as EmployeeIcon,
  Description as DescriptionIcon,
  AttachMoney as AttachMoneyIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  Business as PartnerIcon,
  Schedule as ShiftIcon,
  Assessment as AssessmentIcon,
  Inventory as InventoryIcon,
  AttachMoney as MoneyIcon,
  Casino as CasinoIcon,
  Radio as RadioIcon,
  Numbers as NumbersIcon,
  MenuOpen as MenuOpenIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Logout as LogoutIcon,
  Notifications as NotificationIcon,
  Settings as SettingsIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { PERMISSIONS } from '../../types/auth';

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
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      id: 'dashboard',
      title: 'Tổng quan',
      items: [
    {
      text: 'Dashboard',
      icon: <DashboardIcon />,
      path: '/',
      permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
      text: 'Tính lợi nhuận',
      icon: <ProfitIcon />,
      path: '/profit',
      permission: PERMISSIONS.VIEW_PROFIT,
    },
      ]
    },
        {
          id: 'tickets',
          title: 'Quản lý vé',
          items: [
    {
      text: 'Quản lý vé',
      icon: <TicketIcon />,
      path: '/tickets',
      permission: PERMISSIONS.MANAGE_TICKETS,
    },
    {
              text: 'Vé số cào',
              icon: <CasinoIcon />,
              path: '/scratch-tickets',
              permission: PERMISSIONS.MANAGE_TICKETS,
            },
            {
              text: 'Nhập vé vào kho',
              icon: <InventoryIcon />,
              path: '/ticket-import',
              permission: PERMISSIONS.MANAGE_TICKETS,
            },
            {
              text: 'Trao đổi vé',
              icon: <ExchangeIcon />,
              path: '/exchanges',
              permission: PERMISSIONS.MANAGE_EXCHANGES,
            },
          ]
        },
        {
          id: 'management',
          title: 'Quản lý hệ thống',
          items: [
    {
      text: 'Quản lý tỉnh',
      icon: <ProvinceIcon />,
      path: '/provinces',
      permission: PERMISSIONS.MANAGE_PROVINCES,
    },
    {
      text: 'Quản lý người bán',
      icon: <SellerIcon />,
      path: '/sellers',
      permission: PERMISSIONS.MANAGE_SELLERS,
    },
    {
      text: 'Quản lý nhân viên',
      icon: <EmployeeIcon />,
      path: '/employees',
      permission: PERMISSIONS.MANAGE_EMPLOYEES,
    },
    {
      text: 'Đối tác',
      icon: <PartnerIcon />,
      path: '/partners',
      permission: PERMISSIONS.MANAGE_PARTNERS,
    },
    {
      text: 'Ca làm việc',
      icon: <ShiftIcon />,
      path: '/shifts',
      permission: PERMISSIONS.MANAGE_SHIFTS,
            },
          ]
        },
        {
          id: 'masterdata',
          title: 'Master Data',
          items: [
            {
              text: 'Nhà đài',
              icon: <RadioIcon />,
              path: '/broadcasters',
              permission: PERMISSIONS.MANAGE_TICKETS,
            },
            {
              text: 'Đại lý',
              icon: <PartnerIcon />,
              path: '/agents',
              permission: PERMISSIONS.MANAGE_TICKETS,
            },
            {
              text: 'Giá vé',
              icon: <MoneyIcon />,
              path: '/prices',
              permission: PERMISSIONS.MANAGE_TICKETS,
            },
          ]
        },
        {
          id: 'agentmanagement',
          title: 'Quản lý đại lý nâng cao',
          items: [
            {
              text: 'Hợp đồng',
              icon: <DescriptionIcon />,
              path: '/contracts',
              permission: PERMISSIONS.MANAGE_PARTNERS,
            },
            {
              text: 'Tín dụng & Công nợ',
              icon: <DebtIcon />,
              path: '/credit-debt',
              permission: PERMISSIONS.MANAGE_DEBTS,
            },
            {
              text: 'Hiệu suất đại lý',
              icon: <AssessmentIcon />,
              path: '/agent-performance',
              permission: PERMISSIONS.VIEW_REPORTS,
            },
            {
              text: 'Quản lý khu vực',
              icon: <ProvinceIcon />,
              path: '/territories',
              permission: PERMISSIONS.MANAGE_PARTNERS,
            },
            {
              text: 'Hoa hồng',
              icon: <AttachMoneyIcon />,
              path: '/commissions',
              permission: PERMISSIONS.MANAGE_PARTNERS,
            },
            {
              text: 'Dashboard Đại lý',
              icon: <DashboardIcon />,
              path: '/agent-dashboard',
              permission: PERMISSIONS.MANAGE_PARTNERS,
            },
            {
              text: 'Phân phối vé',
              icon: <ShippingIcon />,
              path: '/ticket-distribution',
              permission: PERMISSIONS.MANAGE_TICKETS,
            },
            {
              text: 'Phân tích đại lý',
              icon: <AssessmentIcon />,
              path: '/agent-analytics',
              permission: PERMISSIONS.VIEW_REPORTS,
            },
            {
              text: 'Quản lý rủi ro',
              icon: <SecurityIcon />,
              path: '/risk-management',
              permission: PERMISSIONS.MANAGE_PARTNERS,
            },
            {
              text: 'Liên lạc & Hỗ trợ',
              icon: <MessageIcon />,
              path: '/agent-communication',
              permission: PERMISSIONS.MANAGE_PARTNERS,
            },
          ]
        },
        {
          id: 'reports',
          title: 'Báo cáo & Phân tích',
          items: [
            {
              text: 'Báo cáo bán vé',
              icon: <AssessmentIcon />,
              path: '/daily-sales',
              permission: PERMISSIONS.VIEW_PROFIT,
            },
            {
              text: 'Phân tích & Báo cáo',
              icon: <AssessmentIcon />,
              path: '/analytics',
              permission: PERMISSIONS.VIEW_PROFIT,
            },
            {
              text: 'Quản lý tài chính',
              icon: <MoneyIcon />,
              path: '/financial',
              permission: PERMISSIONS.VIEW_PROFIT,
            },
            {
              text: 'Phân tích cặp số',
              icon: <NumbersIcon />,
              path: '/number-analysis',
              permission: PERMISSIONS.VIEW_PROFIT,
            },
          ]
        },
    {
      id: 'transactions',
      title: 'Giao dịch',
      items: [
        {
          text: 'Giao dịch',
          icon: <TransactionIcon />,
          path: '/transactions',
          permission: PERMISSIONS.MANAGE_TRANSACTIONS,
        },
        {
          text: 'Quản lý công nợ',
          icon: <DebtIcon />,
          path: '/debts',
          permission: PERMISSIONS.MANAGE_DEBTS,
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
          <IconButton
            onClick={handleSidebarToggle}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-1"
            size="small"
          >
            {sidebarOpen ? <MenuOpenIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
          </IconButton>
        </div>
      </div>

      {/* User Info */}
      <div className="p-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <Avatar className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500">
            <span className="text-white text-sm font-semibold">
              {user?.fullName?.charAt(0) || 'U'}
            </span>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.fullName || 'Người dùng'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.role === 'owner' ? 'Chủ cửa hàng' : 
               user?.role === 'employee' ? 'Nhân viên' : 'Người bán'}
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
        <Toolbar className="justify-between px-2 sm:px-4">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 1, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              color="inherit"
              aria-label="toggle sidebar"
              edge="start"
              onClick={handleSidebarToggle}
              size="small"
              sx={{ mr: 1, display: { xs: 'none', sm: 'block' } }}
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
                <p className="text-sm font-medium text-gray-900 truncate max-w-24">{user?.fullName}</p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role === 'owner' ? 'Chủ cửa hàng' : 
                   user?.role === 'employee' ? 'Nhân viên' : 'Người bán'}
                </p>
              </div>
              <IconButton
                onClick={handleProfileMenuOpen}
                className="p-1"
              >
                <Avatar className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-indigo-500">
                  {user?.fullName?.charAt(0) || 'U'}
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
              {user?.fullName?.charAt(0) || 'U'}
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{user?.fullName}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
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
          p: 0,
          width: { sm: sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%' },
          transition: 'width 0.3s ease-in-out',
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;