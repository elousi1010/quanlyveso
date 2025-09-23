import React from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  IconButton,
  Chip,
  Avatar,
  LinearProgress,
  Stack
} from '@mui/material';
import {
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  AttachMoney as MoneyIcon,
  ConfirmationNumber as TicketIcon,
  Assessment as AssessmentIcon,
  Refresh as RefreshIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';

const DashboardOverview: React.FC = () => {
  // Mock data - trong thực tế sẽ fetch từ API
  const statsData = [
    {
      title: 'Tổng doanh thu',
      value: '2,450,000,000',
      unit: 'VNĐ',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: <MoneyIcon />,
      color: '#4caf50',
      bgColor: '#e8f5e8',
    },
    {
      title: 'Vé đã bán',
      value: '15,420',
      unit: 'vé',
      change: '+8.2%',
      changeType: 'positive' as const,
      icon: <TicketIcon />,
      color: '#2196f3',
      bgColor: '#e3f2fd',
    },
    {
      title: 'Giao dịch',
      value: '3,250',
      unit: 'giao dịch',
      change: '+15.3%',
      changeType: 'positive' as const,
      icon: <ReceiptIcon />,
      color: '#ff9800',
      bgColor: '#fff3e0',
    },
    {
      title: 'Đối tác',
      value: '125',
      unit: 'đối tác',
      change: '+2.4%',
      changeType: 'positive' as const,
      icon: <PeopleIcon />,
      color: '#9c27b0',
      bgColor: '#f3e5f5',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      title: 'Giao dịch mới',
      description: 'Đối tác ABC vừa thực hiện giao dịch 500,000 VNĐ',
      time: '2 phút trước',
      type: 'transaction',
      icon: <ReceiptIcon />,
      color: '#4caf50',
    },
    {
      id: 2,
      title: 'Vé số mới',
      description: 'Đã thêm 1000 vé số mới vào hệ thống',
      time: '15 phút trước',
      type: 'ticket',
      icon: <TicketIcon />,
      color: '#2196f3',
    },
    {
      id: 3,
      title: 'Đối tác mới',
      description: 'Đối tác XYZ đã đăng ký thành công',
      time: '1 giờ trước',
      type: 'partner',
      icon: <PeopleIcon />,
      color: '#ff9800',
    },
    {
      id: 4,
      title: 'Báo cáo',
      description: 'Báo cáo tháng 12 đã được tạo',
      time: '2 giờ trước',
      type: 'report',
      icon: <AssessmentIcon />,
      color: '#9c27b0',
    },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              Tổng quan hệ thống
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Chào mừng bạn quay trở lại! Đây là tổng quan về hoạt động của hệ thống.
            </Typography>
          </Box>
          <IconButton color="primary">
            <RefreshIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Statistics Cards */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
          gap: 2 
        }}>
          {statsData.map((stat, index) => (
            <Card
              key={index}
              sx={{
                height: '100%',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid #e0e0e0',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: stat.bgColor,
                      color: stat.color,
                      width: 48,
                      height: 48,
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Chip
                    label={stat.change}
                    size="small"
                    color={stat.changeType === 'positive' ? 'success' : 'error'}
                    sx={{ fontWeight: 600 }}
                  />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: 'text.primary' }}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {stat.unit}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                  {stat.title}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>

      {/* Charts and Activities */}
      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' } }}>
        {/* Revenue Chart Placeholder */}
        <Box sx={{ flex: 2 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Biểu đồ doanh thu
                </Typography>
                <IconButton size="small">
                  <MoreVertIcon />
                </IconButton>
              </Box>
              <Box 
                sx={{ 
                  height: 300, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  border: '2px dashed',
                  borderColor: 'grey.300'
                }}
              >
                <Typography variant="body1" color="text.secondary">
                  Biểu đồ sẽ được hiển thị ở đây
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Recent Activities */}
        <Box sx={{ flex: 1 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Hoạt động gần đây
              </Typography>
              <Stack spacing={2}>
                {recentActivities.map((activity, index) => (
                  <Box
                    key={activity.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'grey.50',
                      transition: 'background-color 0.2s',
                      '&:hover': {
                        bgcolor: 'grey.100',
                      },
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: activity.color + '20',
                        color: activity.color,
                        width: 32,
                        height: 32,
                      }}
                    >
                      {activity.icon}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {activity.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                        {activity.description}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {activity.time}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Progress Section */}
      <Box sx={{ mt: 3 }}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Tiến độ thực hiện
            </Typography>
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 3 
            }}>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Mục tiêu doanh thu
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    75%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={75}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: 'primary.main',
                    },
                  }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Vé đã bán
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    60%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={60}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: 'success.main',
                    },
                  }}
                />
              </Box>
              <Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Đối tác mới
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    90%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={90}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: 'grey.200',
                    '& .MuiLinearProgress-bar': {
                      borderRadius: 4,
                      bgcolor: 'warning.main',
                    },
                  }}
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default DashboardOverview;