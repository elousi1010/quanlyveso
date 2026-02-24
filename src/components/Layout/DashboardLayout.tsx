import React, { useState, useMemo, useEffect } from 'react';
import {
  Layout,
  Menu,
  Typography,
  Avatar,
  Badge,
  Space,
  Button,
  Dropdown,
  Divider,
  theme as antdTheme,
  ConfigProvider,
  Flex,
  Tooltip,
  Grid,
  type MenuProps,
} from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  KeyOutlined,
  EnvironmentOutlined,
  FileProtectOutlined,
  DatabaseOutlined,
  MoneyCollectOutlined,
  ImportOutlined,
  ExportOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  GlobalOutlined,
  MoonOutlined,
  SunOutlined,
  DownOutlined,
  GiftOutlined,
  BookOutlined,
  FieldTimeOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuthState } from '../../hooks/useAuthState';
import { useTheme } from '../../contexts/ThemeContext';
import { PERMISSIONS, ROLE_PERMISSIONS } from '../../types/auth';
import { getRoleDisplayName } from '../../utils/roleMapping';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const screens = useBreakpoint();
  const isMobile = screens.xs || (screens.sm && !screens.md);
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthState();
  const { mode, toggleMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = antdTheme.useToken();
  const isDark = mode === 'dark';

  // Automatically collapse on small screens
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [isMobile]);

  // Helper function to check permissions
  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'admin' || user.role === 'user' || user.role === 'owner') return true;

    const userPermissions = ROLE_PERMISSIONS[user.role as keyof typeof ROLE_PERMISSIONS] || [];
    return userPermissions.includes(permission);
  };

  const menuItems = useMemo(() => {
    const groups = [
      {
        key: 'dashboard-group',
        label: 'DASHBOARD',
        type: 'group' as const,
        children: [
          {
            key: '/dashboard',
            icon: <DashboardOutlined />,
            label: 'Tổng Quan',
            permission: PERMISSIONS.VIEW_DASHBOARD,
          },
        ]
      },
      {
        key: 'management-group',
        label: 'QUẢN LÝ',
        type: 'group' as const,
        children: [
          {
            key: '/users',
            icon: <UserOutlined />,
            label: 'Người Dùng',
            permission: PERMISSIONS.MANAGE_EMPLOYEES,
          },
          {
            key: '/partners',
            icon: <TeamOutlined />,
            label: 'Đối Tác',
            permission: PERMISSIONS.MANAGE_PARTNERS,
          },
          {
            key: 'permissions-sub',
            icon: <KeyOutlined />,
            label: 'Quyền Hạn',
            children: [
              { key: '/permissions', label: 'Danh Sách Quyền' },
            ],
            permission: PERMISSIONS.MANAGE_EMPLOYEES,
          },
          {
            key: '/stations',
            icon: <EnvironmentOutlined />,
            label: 'Trạm Vé',
            permission: PERMISSIONS.MANAGE_EMPLOYEES,
          },
          {
            key: '/tickets',
            icon: <FileProtectOutlined />,
            label: 'Quản Lý Vé',
            permission: PERMISSIONS.MANAGE_TICKETS,
          },
          {
            key: '/prize-claims',
            icon: <GiftOutlined />,
            label: 'Đổi Số Trúng',
            permission: PERMISSIONS.MANAGE_TICKETS, // Cùng nhóm quyền vé số
          },
          {
            key: '/inventory',
            icon: <DatabaseOutlined />,
            label: 'Kho Hàng',
            permission: PERMISSIONS.MANAGE_EMPLOYEES,
          },
          {
            key: '/partner-debt',
            icon: <MoneyCollectOutlined />,
            label: 'Công Nợ',
            permission: PERMISSIONS.MANAGE_PARTNERS,
          },
          {
            key: '/cashbooks',
            icon: <BookOutlined />,
            label: 'Sổ Quỹ Tiền Mặt',
            permission: PERMISSIONS.MANAGE_PARTNERS,
          },
          {
            key: '/shifts',
            icon: <FieldTimeOutlined />,
            label: 'Bàn Giao Ca',
            permission: PERMISSIONS.MANAGE_EMPLOYEES,
          },
        ]
      },
      {
        key: 'inventory-group',
        label: 'GIAO DỊCH KHO',
        type: 'group' as const,
        children: [
          {
            key: '/inventory-transactions/import',
            icon: <ImportOutlined />,
            label: 'Nhập Kho',
            permission: PERMISSIONS.MANAGE_EMPLOYEES,
          },
          {
            key: '/inventory-transactions/export',
            icon: <ExportOutlined />,
            label: 'Xuất Kho',
            permission: PERMISSIONS.MANAGE_EMPLOYEES,
          },
        ]
      }
    ];

    return groups.map(group => ({
      ...group,
      children: group.children.filter(item => hasPermission(item.permission || ''))
    })).filter(group => group.children.length > 0);
  }, [user]);

  const getCurrentPageInfo = () => {
    const currentPath = location.pathname;

    const findItem = (items: any[]): any => {
      for (const item of items) {
        if (item.key === currentPath) return item;
        if (item.children) {
          const found = findItem(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    const matched = findItem(menuItems);
    if (matched) {
      return {
        title: matched.label,
        subtitle: currentPath.includes('/dashboard') ? 'Hệ thống quản lý xổ số' : 'Quản lý ' + matched.label.toLowerCase()
      };
    }
    return { title: 'QUẢN LÝ', subtitle: 'Hệ thống quản lý xổ số' };
  };

  const { title, subtitle } = getCurrentPageInfo();

  const profileMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      label: (
        <Flex gap={12} align="center" style={{ padding: '4px 0' }}>
          <Avatar size={40} style={{ background: token.colorPrimary }}>
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Flex vertical>
            <Text strong>{user?.name}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{user?.phone_number}</Text>
          </Flex>
        </Flex>
      ),
    },
    { type: 'divider' },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      danger: true,
      onClick: () => logout(),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: isDark ? '#0f172a' : '#f8fafc' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        width={260}
        theme={isDark ? 'dark' : 'light'}
        style={{
          boxShadow: '1px 0 10px rgba(0,0,0,0.05)',
          zIndex: 1001,
          position: 'fixed',
          height: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          background: isDark ? '#1e293b' : '#ffffff',
          overflow: 'auto',
        }}
      >
        <div style={{ padding: '24px 16px', display: 'flex', justifyContent: 'center' }}>
          <Link to="/dashboard" style={{ width: '100%' }}>
            <div
              style={{
                background: isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.02)',
                padding: (collapsed && !isMobile) ? '8px' : '12px 16px',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                justifyContent: (collapsed && !isMobile) ? 'center' : 'flex-start',
                border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
              }}
            >
              <div style={{
                width: 32, height: 32,
                background: token.colorPrimary,
                borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <GlobalOutlined style={{ color: '#fff', fontSize: '18px' }} />
              </div>
              {(!collapsed || isMobile) && (
                <div>
                  <Text strong style={{ display: 'block', lineHeight: 1.2, fontSize: '16px' }}>Daily</Text>
                  <Text style={{ color: token.colorTextSecondary, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Veso System</Text>
                </div>
              )}
            </div>
          </Link>
        </div>

        <Menu
          mode="inline"
          theme={isDark ? 'dark' : 'light'}
          selectedKeys={[location.pathname]}
          defaultOpenKeys={[menuItems.find(g => g.children.some((i: any) => i.key === location.pathname))?.key || '']}
          items={menuItems}
          onClick={({ key }) => {
            navigate(key);
            if (isMobile) setCollapsed(true);
          }}
          style={{ borderRight: 0, padding: '0 8px', background: 'transparent' }}
          className="sidebar-menu"
        />
      </Sider>

      {/* Overlay for mobile sidebar */}
      {isMobile && !collapsed && (
        <div
          onClick={() => setCollapsed(true)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 1000,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <Layout style={{
        marginLeft: isMobile ? 0 : (collapsed ? 80 : 260),
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        background: 'transparent',
        minWidth: 0,
      }}>
        <Header style={{
          background: isDark ? '#1e293b' : '#ffffff',
          padding: isMobile ? '0 12px' : '0 24px',
          height: '70px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)'}`,
          position: 'sticky',
          top: 0,
          zIndex: 999,
          width: '100%',
        }}>
          <Flex align="center" gap={isMobile ? 8 : 16}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: '18px', width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />

            <Flex vertical align="flex-start" justify="center" style={{ overflow: 'hidden' }}>
              <Title level={5} style={{ margin: 0, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: isMobile ? '120px' : 'none' }}>{title}</Title>
              {!isMobile && <Text type="secondary" style={{ fontSize: '11px', lineHeight: 1.2 }}>{subtitle}</Text>}
            </Flex>
          </Flex>

          <Flex align="center" gap={isMobile ? 8 : 16}>
            <Tooltip title={isDark ? 'Chế độ sáng' : 'Chế độ tối'}>
              <Button
                shape="circle"
                icon={isDark ? <SunOutlined /> : <MoonOutlined />}
                onClick={toggleMode}
                style={{ border: 'none', background: 'transparent' }}
              />
            </Tooltip>

            <Badge count={3} size="small" offset={[-2, 2]}>
              <Button
                shape="circle"
                icon={<BellOutlined />}
                style={{ border: 'none', background: 'transparent' }}
              />
            </Badge>

            {!isMobile && <Divider type="vertical" style={{ height: '20px', margin: '0 8px' }} />}

            <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={['click']}>
              <Flex align="center" gap={8} style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: '8px' }} className="profile-trigger">
                <Avatar
                  size={isMobile ? 32 : 36}
                  style={{ background: token.colorPrimary, fontWeight: 600, flexShrink: 0 }}
                >
                  {user?.name?.charAt(0) || 'U'}
                </Avatar>
                {!isMobile && (
                  <Flex vertical align="flex-start" justify="center" style={{ gap: 0 }}>
                    <Text strong style={{ fontSize: '13px', lineHeight: 1.2 }}>{user?.name}</Text>
                    <Text type="secondary" style={{ fontSize: '11px', lineHeight: 1.2 }}>{getRoleDisplayName(user?.role || 'user')}</Text>
                  </Flex>
                )}
                <DownOutlined style={{ fontSize: '10px', color: token.colorTextSecondary }} />
              </Flex>
            </Dropdown>
          </Flex>
        </Header>

        <Content style={{
          padding: isMobile ? '16px 12px' : '24px',
          minHeight: 'calc(100vh - 70px)',
          width: '100%',
          overflowX: 'hidden'
        }}>
          <div style={{ maxWidth: '100%' }}>
            {children}
          </div>
        </Content>
      </Layout>

      <style>{`
        .sidebar-menu .ant-menu-item-selected {
          background-color: ${token.colorPrimary}15 !important;
          color: ${token.colorPrimary} !important;
          font-weight: 600 !important;
        }
        .sidebar-menu .ant-menu-item {
          border-radius: 8px !important;
          margin: 4px 0 !important;
        }
        .profile-trigger:hover {
          background: ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
        }
        .sidebar-menu .ant-menu-item-group-title {
          font-size: 10px !important;
          font-weight: 700 !important;
          color: ${isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.4)'} !important;
          margin-top: 20px !important;
          padding-left: 24px !important;
          letter-spacing: 0.5px !important;
        }
        /* Mobile table scrollbar fix */
        .ant-table-wrapper {
          max-width: 100%;
        }
        .ant-table {
          font-size: ${isMobile ? '13px' : '14px'} !important;
        }
      `}</style>
    </Layout>
  );
};

export default DashboardLayout;
