import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tabs,
  Tab,
  Grid,
  Avatar,
  List,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Divider,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Support as SupportIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Schedule as ScheduleIcon,
  CheckCircle as CheckIcon,
  Reply as ReplyIcon,
  Flag as FlagIcon,
} from '@mui/icons-material';
import { DataGrid, type GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import dayjs from 'dayjs';

interface CommunicationChannel {
  id: string;
  name: string;
  type: 'email' | 'phone' | 'chat' | 'ticket' | 'meeting';
  isActive: boolean;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

interface SupportTicket {
  id: string;
  agentId: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  category: 'technical' | 'billing' | 'contract' | 'general' | 'complaint';
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  createdBy: string;
  lastMessageAt: Date;
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  message: string;
  messageType: 'text' | 'file' | 'image' | 'system';
  attachments?: string[];
  createdAt: Date;
  isRead: boolean;
}

interface Notification {
  id: string;
  agentId: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'system' | 'payment' | 'contract' | 'performance' | 'general';
  isRead: boolean;
  isImportant: boolean;
  createdAt: Date;
  readAt?: Date;
  actionUrl?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  targetAudience: 'all' | 'level1' | 'level2' | 'level3' | 'retail' | 'specific';
  targetAgents?: string[];
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  readBy: string[];
}

const mockChannels: CommunicationChannel[] = [
  {
    id: '1',
    name: 'Email hỗ trợ',
    type: 'email',
    isActive: true,
    description: 'Hỗ trợ qua email',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Hotline',
    type: 'phone',
    isActive: true,
    description: 'Hỗ trợ qua điện thoại',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Chat trực tuyến',
    type: 'chat',
    isActive: true,
    description: 'Chat hỗ trợ trực tuyến',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

const mockTickets: SupportTicket[] = [
  {
    id: '1',
    agentId: '1',
    subject: 'Vấn đề với hệ thống tính hoa hồng',
    description: 'Tôi không thể xem được báo cáo hoa hồng tháng này',
    priority: 'high',
    status: 'in_progress',
    category: 'technical',
    assignedTo: 'admin',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-22'),
    createdBy: 'agent1',
    lastMessageAt: new Date('2024-01-22'),
    messages: [
      {
        id: '1',
        ticketId: '1',
        senderId: 'agent1',
        senderName: 'Đại lý 1',
        message: 'Tôi không thể xem được báo cáo hoa hồng tháng này',
        messageType: 'text',
        createdAt: new Date('2024-01-20'),
        isRead: true,
      },
      {
        id: '2',
        ticketId: '1',
        senderId: 'admin',
        senderName: 'Admin',
        message: 'Chúng tôi đang kiểm tra vấn đề này. Sẽ phản hồi sớm nhất có thể.',
        messageType: 'text',
        createdAt: new Date('2024-01-21'),
        isRead: true,
      },
    ],
  },
  {
    id: '2',
    agentId: '2',
    subject: 'Yêu cầu tăng hạn mức tín dụng',
    description: 'Tôi muốn tăng hạn mức tín dụng từ 30M lên 50M',
    priority: 'medium',
    status: 'open',
    category: 'billing',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
    createdBy: 'agent2',
    lastMessageAt: new Date('2024-01-25'),
    messages: [
      {
        id: '3',
        ticketId: '2',
        senderId: 'agent2',
        senderName: 'Đại lý 2',
        message: 'Tôi muốn tăng hạn mức tín dụng từ 30M lên 50M',
        messageType: 'text',
        createdAt: new Date('2024-01-25'),
        isRead: false,
      },
    ],
  },
];

const mockNotifications: Notification[] = [
  {
    id: '1',
    agentId: '1',
    title: 'Hoa hồng tháng 1 đã được tính',
    message: 'Hoa hồng tháng 1 của bạn đã được tính và sẵn sàng để thanh toán',
    type: 'success',
    category: 'payment',
    isRead: false,
    isImportant: false,
    createdAt: new Date('2024-01-31'),
    actionUrl: '/commissions',
  },
  {
    id: '2',
    agentId: '2',
    title: 'Hợp đồng sắp hết hạn',
    message: 'Hợp đồng của bạn sẽ hết hạn trong 30 ngày. Vui lòng liên hệ để gia hạn.',
    type: 'warning',
    category: 'contract',
    isRead: true,
    isImportant: true,
    createdAt: new Date('2024-01-15'),
    readAt: new Date('2024-01-16'),
    actionUrl: '/contracts',
  },
  {
    id: '3',
    agentId: '3',
    title: 'Cảnh báo hiệu suất',
    message: 'Hiệu suất của bạn đang ở mức thấp. Vui lòng cải thiện để tránh bị cảnh báo.',
    type: 'error',
    category: 'performance',
    isRead: false,
    isImportant: true,
    createdAt: new Date('2024-01-28'),
    actionUrl: '/agent-performance',
  },
];

const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    title: 'Cập nhật hệ thống mới',
    content: 'Hệ thống quản lý đại lý đã được cập nhật với nhiều tính năng mới. Vui lòng đăng nhập để trải nghiệm.',
    priority: 'high',
    targetAudience: 'all',
    isActive: true,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    createdBy: 'admin',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    readBy: ['agent1', 'agent2'],
  },
  {
    id: '2',
    title: 'Thay đổi chính sách hoa hồng',
    content: 'Từ tháng 2/2024, chính sách hoa hồng sẽ có một số thay đổi. Vui lòng xem chi tiết trong phần quản lý hoa hồng.',
    priority: 'urgent',
    targetAudience: 'all',
    isActive: true,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    createdBy: 'admin',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    readBy: ['agent1'],
  },
];

const AgentCommunication: React.FC = () => {
  const [channels] = useState<CommunicationChannel[]>(mockChannels);
  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [tabValue, setTabValue] = useState(0);
  const [openTicketDialog, setOpenTicketDialog] = useState(false);
  const [openAnnouncementDialog, setOpenAnnouncementDialog] = useState(false);
  const [, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [ticketForm, setTicketForm] = useState({
    agentId: '',
    subject: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    category: 'general' as 'technical' | 'billing' | 'contract' | 'general' | 'complaint',
  });
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    targetAudience: 'all' as 'all' | 'level1' | 'level2' | 'level3' | 'retail' | 'specific',
    targetAgents: [] as string[],
    isActive: true,
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: '',
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'success';
      case 'medium': return 'info';
      case 'high': return 'warning';
      case 'urgent': return 'error';
      default: return 'default';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'low': return 'Thấp';
      case 'medium': return 'Trung bình';
      case 'high': return 'Cao';
      case 'urgent': return 'Khẩn cấp';
      default: return priority;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'error';
      case 'in_progress': return 'warning';
      case 'resolved': return 'success';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open': return 'Mở';
      case 'in_progress': return 'Đang xử lý';
      case 'resolved': return 'Đã giải quyết';
      case 'closed': return 'Đã đóng';
      default: return status;
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'technical': return 'Kỹ thuật';
      case 'billing': return 'Thanh toán';
      case 'contract': return 'Hợp đồng';
      case 'general': return 'Chung';
      case 'complaint': return 'Khiếu nại';
      default: return category;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'info': return 'info';
      case 'warning': return 'warning';
      case 'error': return 'error';
      case 'success': return 'success';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    switch (type) {
      case 'info': return 'Thông tin';
      case 'warning': return 'Cảnh báo';
      case 'error': return 'Lỗi';
      case 'success': return 'Thành công';
      default: return type;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'system': return 'info';
      case 'payment': return 'success';
      case 'contract': return 'warning';
      case 'performance': return 'error';
      case 'general': return 'default';
      default: return 'default';
    }
  };

  const getNotificationCategoryText = (category: string) => {
    switch (category) {
      case 'system': return 'Hệ thống';
      case 'payment': return 'Thanh toán';
      case 'contract': return 'Hợp đồng';
      case 'performance': return 'Hiệu suất';
      case 'general': return 'Chung';
      default: return category;
    }
  };

  const handleAddTicket = () => {
    setTicketForm({
      agentId: '',
      subject: '',
      description: '',
      priority: 'medium',
      category: 'general',
    });
    setOpenTicketDialog(true);
  };

  const handleSaveTicket = () => {
    if (!ticketForm.agentId || !ticketForm.subject || !ticketForm.description) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }

    const newTicket: SupportTicket = {
      id: Date.now().toString(),
      agentId: ticketForm.agentId,
      subject: ticketForm.subject,
      description: ticketForm.description,
      priority: ticketForm.priority,
      status: 'open',
      category: ticketForm.category,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: 'agent',
      lastMessageAt: new Date(),
      messages: [
        {
          id: Date.now().toString(),
          ticketId: Date.now().toString(),
          senderId: ticketForm.agentId,
          senderName: `Đại lý ${ticketForm.agentId}`,
          message: ticketForm.description,
          messageType: 'text',
          createdAt: new Date(),
          isRead: false,
        },
      ],
    };

    setTickets(prev => [newTicket, ...prev]);
    setAlert({ type: 'success', message: 'Tạo ticket hỗ trợ thành công' });
    setOpenTicketDialog(false);
  };

  const handleAddAnnouncement = () => {
    setAnnouncementForm({
      title: '',
      content: '',
      priority: 'medium',
      targetAudience: 'all',
      targetAgents: [],
      isActive: true,
      startDate: dayjs().format('YYYY-MM-DD'),
      endDate: '',
    });
    setOpenAnnouncementDialog(true);
  };

  const handleSaveAnnouncement = () => {
    if (!announcementForm.title || !announcementForm.content) {
      setAlert({ type: 'error', message: 'Vui lòng nhập đầy đủ thông tin' });
      return;
    }

    const newAnnouncement: Announcement = {
      id: Date.now().toString(),
      title: announcementForm.title,
      content: announcementForm.content,
      priority: announcementForm.priority,
      targetAudience: announcementForm.targetAudience,
      targetAgents: announcementForm.targetAgents,
      isActive: announcementForm.isActive,
      startDate: new Date(announcementForm.startDate),
      endDate: announcementForm.endDate ? new Date(announcementForm.endDate) : undefined,
      createdBy: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
      readBy: [],
    };

    setAnnouncements(prev => [newAnnouncement, ...prev]);
    setAlert({ type: 'success', message: 'Tạo thông báo thành công' });
    setOpenAnnouncementDialog(false);
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId 
        ? { ...n, isRead: true, readAt: new Date() }
        : n
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => 
      !n.isRead 
        ? { ...n, isRead: true, readAt: new Date() }
        : n
    ));
    setAlert({ type: 'success', message: 'Đã đánh dấu tất cả là đã đọc' });
  };

  const ticketColumns: GridColDef[] = [
    { field: 'id', headerName: 'Mã ticket', width: 120, flex: 1 },
    { field: 'agentId', headerName: 'Mã đại lý', width: 120, flex: 1 },
    { field: 'subject', headerName: 'Tiêu đề', width: 250, flex: 2 },
    { 
      field: 'category', 
      headerName: 'Danh mục', 
      width: 120, 
      renderCell: (params) => getCategoryText(params.value)
    },
    { 
      field: 'priority', 
      headerName: 'Ưu tiên', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={getPriorityText(params.value)} 
          color={getPriorityColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'status', 
      headerName: 'Trạng thái', 
      width: 120, 
      renderCell: (params) => (
        <Chip 
          label={getStatusText(params.value)} 
          color={getStatusColor(params.value)} 
          size="small" 
        />
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Ngày tạo', 
      width: 120, 
      renderCell: (params) => dayjs(params.value).format('DD/MM/YYYY')
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Thao tác',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Xem"
          onClick={() => setSelectedTicket(params.row)}
        />,
        <GridActionsCellItem
          icon={<ReplyIcon />}
          label="Phản hồi"
          onClick={() => {/* Handle reply */}}
        />,
      ],
    },
  ];

  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter(t => t.status === 'open').length,
    inProgressTickets: tickets.filter(t => t.status === 'in_progress').length,
    resolvedTickets: tickets.filter(t => t.status === 'resolved').length,
    unreadNotifications: notifications.filter(n => !n.isRead).length,
    importantNotifications: notifications.filter(n => n.isImportant).length,
    activeAnnouncements: announcements.filter(a => a.isActive).length,
    totalChannels: channels.filter(c => c.isActive).length,
  };

  return (
    <Box className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <MessageIcon className="text-2xl sm:text-3xl" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">Liên lạc & Hỗ trợ</h1>
              <p className="text-sm sm:text-base text-indigo-100">Hệ thống liên lạc và hỗ trợ đại lý</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddTicket}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-lg"
            >
              Tạo ticket
            </Button>
            <Button
              variant="contained"
              startIcon={<NotificationsIcon />}
              onClick={handleAddAnnouncement}
              className="bg-white text-indigo-600 hover:bg-indigo-50 font-semibold px-4 py-2 rounded-lg"
            >
              Thông báo
            </Button>
          </div>
        </div>
      </div>

      {/* Alert */}
      {alert && (
        <Alert 
          severity={alert.type} 
          onClose={() => setAlert(null)}
          className="mb-4"
        >
          {alert.message}
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="stat-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Tổng ticket
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.totalTickets}
                </Typography>
              </div>
              <SupportIcon className="text-blue-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Đã giải quyết
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.resolvedTickets}
                </Typography>
              </div>
              <CheckIcon className="text-green-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Chưa đọc
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.unreadNotifications}
                </Typography>
              </div>
              <NotificationsIcon className="text-yellow-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card-error">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <Typography variant="body2" className="text-gray-600 text-xs sm:text-sm">
                  Đang xử lý
                </Typography>
                <Typography variant="h4" className="font-bold text-gray-900 text-xl sm:text-2xl lg:text-3xl">
                  {stats.inProgressTickets}
                </Typography>
              </div>
              <ScheduleIcon className="text-red-500 text-2xl sm:text-3xl" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="card">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)}>
            <Tab label="Ticket hỗ trợ" />
            <Tab label="Thông báo" />
            <Tab label="Thông báo chung" />
            <Tab label="Kênh liên lạc" />
          </Tabs>
        </Box>

        {/* Support Tickets Tab */}
        {tabValue === 0 && (
          <CardContent className="p-0">
            <div style={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={tickets}
                columns={ticketColumns}
                initialState={{
                  pagination: {
                    paginationModel: { pageSize: 10 },
                  },
                }}
                pageSizeOptions={[10, 25, 50]}
                disableRowSelectionOnClick
                className="border-0"
              />
            </div>
          </CardContent>
        )}

        {/* Notifications Tab */}
        {tabValue === 1 && (
          <CardContent>
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6">Thông báo cá nhân</Typography>
              <Button
                variant="outlined"
                startIcon={<CheckIcon />}
                onClick={handleMarkAllAsRead}
                disabled={stats.unreadNotifications === 0}
              >
                Đánh dấu tất cả đã đọc
              </Button>
            </Box>
            <List>
              {notifications.map((notification) => (
                <React.Fragment key={notification.id}>
                  <ListItemButton
                    onClick={() => handleMarkAsRead(notification.id)}
                    className={!notification.isRead ? 'bg-blue-50' : ''}
                  >
                    <ListItemAvatar>
                      <Avatar className={!notification.isRead ? 'bg-blue-500' : 'bg-gray-300'}>
                        <NotificationsIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="subtitle1" className="font-semibold">
                            {notification.title}
                          </Typography>
                          {notification.isImportant && (
                            <FlagIcon color="error" fontSize="small" />
                          )}
                          <Chip 
                            label={getTypeText(notification.type)} 
                            color={getTypeColor(notification.type)} 
                            size="small" 
                          />
                          <Chip 
                            label={getNotificationCategoryText(notification.category)} 
                            color={getCategoryColor(notification.category)} 
                            size="small" 
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" className="text-gray-600">
                            {notification.message}
                          </Typography>
                          <Typography variant="caption" className="text-gray-500">
                            {dayjs(notification.createdAt).format('DD/MM/YYYY HH:mm')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItemButton>
                  <Divider />
                </React.Fragment>
              ))}
            </List>
          </CardContent>
        )}

        {/* Announcements Tab */}
        {tabValue === 2 && (
          <CardContent>
            <Box className="space-y-4">
              {announcements.map((announcement) => (
                <Card key={announcement.id} className="border-l-4 border-l-blue-500">
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} className="mb-2">
                      <Typography variant="h6" className="font-semibold">
                        {announcement.title}
                      </Typography>
                      <Chip 
                        label={getPriorityText(announcement.priority)} 
                        color={getPriorityColor(announcement.priority)} 
                        size="small" 
                      />
                      <Chip 
                        label={announcement.isActive ? 'Hoạt động' : 'Không hoạt động'} 
                        color={announcement.isActive ? 'success' : 'error'} 
                        size="small" 
                      />
                    </Box>
                    <Typography variant="body2" className="text-gray-600 mb-2">
                      {announcement.content}
                    </Typography>
                    <Typography variant="caption" className="text-gray-500">
                      Từ {dayjs(announcement.startDate).format('DD/MM/YYYY')} 
                      {announcement.endDate && ` đến ${dayjs(announcement.endDate).format('DD/MM/YYYY')}`}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </CardContent>
        )}

        {/* Communication Channels Tab */}
        {tabValue === 3 && (
          <CardContent>
            <Grid container spacing={3}>
              {channels.map((channel) => (
                <Grid size={{ xs: 12, md: 6 }} key={channel.id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} className="mb-2">
                        {channel.type === 'email' && <EmailIcon color="primary" />}
                        {channel.type === 'phone' && <PhoneIcon color="primary" />}
                        {channel.type === 'chat' && <MessageIcon color="primary" />}
                        {channel.type === 'ticket' && <SupportIcon color="primary" />}
                        {channel.type === 'meeting' && <ScheduleIcon color="primary" />}
                        <Typography variant="h6" className="font-semibold">
                          {channel.name}
                        </Typography>
                        <Chip 
                          label={channel.isActive ? 'Hoạt động' : 'Không hoạt động'} 
                          color={channel.isActive ? 'success' : 'error'} 
                          size="small" 
                        />
                      </Box>
                      <Typography variant="body2" className="text-gray-600">
                        {channel.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        )}
      </Card>

      {/* Add Ticket Dialog */}
      <Dialog open={openTicketDialog} onClose={() => setOpenTicketDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Tạo ticket hỗ trợ mới</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Đại lý</InputLabel>
                  <Select
                    value={ticketForm.agentId}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, agentId: e.target.value }))}
                    label="Đại lý"
                    required
                  >
                    <MenuItem value="1">Đại lý 1</MenuItem>
                    <MenuItem value="2">Đại lý 2</MenuItem>
                    <MenuItem value="3">Đại lý 3</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Danh mục</InputLabel>
                  <Select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, category: e.target.value as 'technical' | 'billing' | 'contract' | 'general' | 'complaint' }))}
                    label="Danh mục"
                  >
                    <MenuItem value="technical">Kỹ thuật</MenuItem>
                    <MenuItem value="billing">Thanh toán</MenuItem>
                    <MenuItem value="contract">Hợp đồng</MenuItem>
                    <MenuItem value="general">Chung</MenuItem>
                    <MenuItem value="complaint">Khiếu nại</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Ưu tiên</InputLabel>
                  <Select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' }))}
                    label="Ưu tiên"
                  >
                    <MenuItem value="low">Thấp</MenuItem>
                    <MenuItem value="medium">Trung bình</MenuItem>
                    <MenuItem value="high">Cao</MenuItem>
                    <MenuItem value="urgent">Khẩn cấp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Tiêu đề"
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Mô tả chi tiết"
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm(prev => ({ ...prev, description: e.target.value }))}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTicketDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveTicket} variant="contained">
            Tạo ticket
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Announcement Dialog */}
      <Dialog open={openAnnouncementDialog} onClose={() => setOpenAnnouncementDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Tạo thông báo chung</DialogTitle>
        <DialogContent>
          <div className="space-y-4 pt-4">
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Tiêu đề"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Ưu tiên</InputLabel>
                  <Select
                    value={announcementForm.priority}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' | 'urgent' }))}
                    label="Ưu tiên"
                  >
                    <MenuItem value="low">Thấp</MenuItem>
                    <MenuItem value="medium">Trung bình</MenuItem>
                    <MenuItem value="high">Cao</MenuItem>
                    <MenuItem value="urgent">Khẩn cấp</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth>
                  <InputLabel>Đối tượng</InputLabel>
                  <Select
                    value={announcementForm.targetAudience}
                    onChange={(e) => setAnnouncementForm(prev => ({ ...prev, targetAudience: e.target.value as 'all' | 'level1' | 'level2' | 'level3' | 'retail' | 'specific' }))}
                    label="Đối tượng"
                  >
                    <MenuItem value="all">Tất cả</MenuItem>
                    <MenuItem value="level1">Cấp 1</MenuItem>
                    <MenuItem value="level2">Cấp 2</MenuItem>
                    <MenuItem value="level3">Cấp 3</MenuItem>
                    <MenuItem value="retail">Bán lẻ</MenuItem>
                    <MenuItem value="specific">Cụ thể</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày bắt đầu"
                  type="date"
                  value={announcementForm.startDate}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, startDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Ngày kết thúc"
                  type="date"
                  value={announcementForm.endDate}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, endDate: e.target.value }))}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Nội dung"
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm(prev => ({ ...prev, content: e.target.value }))}
                  multiline
                  rows={4}
                  required
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={announcementForm.isActive}
                      onChange={(e) => setAnnouncementForm(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                  }
                  label="Thông báo hoạt động"
                />
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAnnouncementDialog(false)}>Hủy</Button>
          <Button onClick={handleSaveAnnouncement} variant="contained">
            Tạo thông báo
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentCommunication;
