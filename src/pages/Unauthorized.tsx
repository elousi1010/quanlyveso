import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Chip
} from '@mui/material';
import {
  Lock as LockIcon,
  ArrowBack as ArrowBackIcon,
  Home as HomeIcon
} from '@mui/icons-material';

const Unauthorized: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const state = location.state as {
    from?: { pathname: string };
    requiredRole?: string;
    requiredRoles?: string[];
    userRole?: string;
  };
  const from = state?.from?.pathname || '/';
  const requiredRole = state?.requiredRole;
  const requiredRoles = state?.requiredRoles;
  const userRole = state?.userRole;

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      p={3}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', p: 4 }}>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mb={3}
          >
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: 'error.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2
              }}
            >
              <LockIcon sx={{ fontSize: 40, color: 'error.main' }} />
            </Box>
          </Box>

          <Typography variant="h4" gutterBottom color="error">
            Truy cập bị từ chối
          </Typography>

          <Typography variant="body1" color="text.secondary" paragraph>
            Bạn không có quyền truy cập trang này.
          </Typography>

          <Alert severity="warning" sx={{ mb: 3, textAlign: 'left' }}>
            <Typography variant="body2" gutterBottom>
              <strong>Thông tin chi tiết:</strong>
            </Typography>
            <Typography variant="body2">
              • Vai trò hiện tại: <Chip label={userRole || 'Unknown'} size="small" />
            </Typography>
            {requiredRole && (
              <Typography variant="body2">
                • Vai trò yêu cầu: <Chip label={requiredRole} size="small" color="primary" />
              </Typography>
            )}
            {requiredRoles && (
              <Typography variant="body2">
                • Vai trò yêu cầu: {requiredRoles.map(role => (
                  <Chip key={role} label={role} size="small" color="primary" sx={{ ml: 0.5 }} />
                ))}
              </Typography>
            )}
            <Typography variant="body2" sx={{ mt: 1 }}>
              • Trang yêu cầu: <code>{from}</code>
            </Typography>
          </Alert>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              startIcon={<ArrowBackIcon />}
              onClick={handleGoBack}
            >
              Quay lại
            </Button>
            <Button
              variant="outlined"
              startIcon={<HomeIcon />}
              onClick={handleGoHome}
            >
              Trang chủ
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
            Nếu bạn cho rằng đây là lỗi, vui lòng liên hệ quản trị viên.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Unauthorized;
