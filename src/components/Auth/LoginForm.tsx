import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Alert,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  Login as LoginIcon,
  PersonAdd as SignupIcon,
} from '@mui/icons-material';
import { useLogin, useSignup } from '../../hooks/useAuthApi';
import { debugJWT, logJWTInfo } from '../../utils/debugJWT';

const LoginForm: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone_number: '',
    password: '',
  });
  
  // Sử dụng API hooks
  const loginMutation = useLogin();
  const signupMutation = useSignup();

  // Debug JWT token khi login thành công
  useEffect(() => {
    if (loginMutation.isSuccess || signupMutation.isSuccess) {
      console.log('=== Login/Signup Success - Debug JWT ===');
      debugJWT();
      logJWTInfo();
    }
  }, [loginMutation.isSuccess, signupMutation.isSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (tabValue === 0) {
      // Login
      loginMutation.mutate({
        phone_number: formData.phone_number,
        password: formData.password,
      });
    } else {
      // Signup
      signupMutation.mutate({
        name: formData.name,
        phone_number: formData.phone_number,
        password: formData.password,
      });
    }
  };

  const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'owner':
        return {
          title: 'Chủ cửa hàng',
          description: 'Toàn quyền truy cập hệ thống',
          icon: <BankIcon className="text-blue-600" />,
          color: 'from-blue-500 to-blue-600'
        };
      case 'employee':
        return {
          title: 'Nhân viên quầy',
          description: 'Quản lý bán hàng và giao dịch',
          icon: <PersonIcon className="text-green-600" />,
          color: 'from-green-500 to-green-600'
        };
      case 'seller':
        return {
          title: 'Người bán vé dạo',
          description: 'Bán vé và cập nhật doanh số',
          icon: <StoreIcon className="text-purple-600" />,
          color: 'from-purple-500 to-purple-600'
        };
      default:
        return {
          title: 'Người dùng',
          description: 'Truy cập hệ thống',
          icon: <PersonIcon className="text-gray-600" />,
          color: 'from-gray-500 to-gray-600'
        };
    }
  };

  const roleInfo = getRoleInfo('owner');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 lg:space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-4 lg:mb-6">
              <BankIcon className="text-white text-3xl lg:text-4xl" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 lg:mb-4">
              System Management Lottery Ohna12
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 max-w-md mx-auto">
              Quản lý toàn diện hoạt động kinh doanh vé số với giao diện hiện đại và tính năng mạnh mẽ
            </p>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="p-2 lg:p-3 bg-blue-100 rounded-xl">
                  <BankIcon className="text-blue-600 text-xl lg:text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Quản lý tài chính</h3>
                  <p className="text-gray-600 text-xs lg:text-sm">Theo dõi doanh thu, lợi nhuận và chi phí</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="p-2 lg:p-3 bg-green-100 rounded-xl">
                  <StoreIcon className="text-green-600 text-xl lg:text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Quản lý vé</h3>
                  <p className="text-gray-600 text-xs lg:text-sm">Theo dõi tồn kho và bán hàng</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-3 lg:space-x-4">
                <div className="p-2 lg:p-3 bg-purple-100 rounded-xl">
                  <PersonIcon className="text-purple-600 text-xl lg:text-2xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base">Quản lý nhân viên</h3>
                  <p className="text-gray-600 text-xs lg:text-sm">Theo dõi hiệu suất và ca làm việc</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <Card className="w-full max-w-md shadow-2xl border-0">
            <CardContent className="p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6 sm:mb-8">
                <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r ${roleInfo.color} rounded-2xl mb-3 sm:mb-4`}>
                  {tabValue === 0 ? roleInfo.icon : <SignupIcon className="text-blue-600" />}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {tabValue === 0 ? 'Đăng nhập hệ thống' : 'Đăng ký tài khoản'}
                </h2>
              </div>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} centered>
                  <Tab 
                    icon={<LoginIcon />} 
                    label="Đăng nhập" 
                    iconPosition="start"
                    sx={{ minHeight: 48 }}
                  />
                  <Tab 
                    icon={<SignupIcon />} 
                    label="Đăng ký" 
                    iconPosition="start"
                    sx={{ minHeight: 48 }}
                  />
                </Tabs>
              </Box>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Role Selection - chỉ hiển thị khi login */}

                {/* Name field - chỉ hiển thị khi signup */}
                {tabValue === 1 && (
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                      Họ và tên
                    </label>
                    <TextField
                      fullWidth
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      placeholder="Nhập họ và tên"
                      className="rounded-lg"
                      size="small"
                      required
                    />
                  </div>
                )}

                {/* Phone Number */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <TextField
                    fullWidth
                    value={formData.phone_number}
                    onChange={handleInputChange('phone_number')}
                    placeholder="Nhập số điện thoại"
                    className="rounded-lg"
                    size="small"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <TextField
                    fullWidth
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Nhập mật khẩu"
                    className="rounded-lg"
                    size="small"
                    required
                  />
                </div>

                {/* Error Messages */}
                {(loginMutation.error || signupMutation.error) && (
                  <Alert severity="error" className="rounded-lg">
                    {loginMutation.error?.message || signupMutation.error?.message || 'Đã xảy ra lỗi, vui lòng thử lại'}
                  </Alert>
                )}

                {/* Success Message */}
                {(loginMutation.isSuccess || signupMutation.isSuccess) && (
                  <Alert severity="success" className="rounded-lg">
                    {tabValue === 0 ? 'Đăng nhập thành công!' : 'Đăng ký thành công!'}
                    <Button 
                      onClick={() => {
                        debugJWT();
                        logJWTInfo();
                      }}
                      size="small"
                      className="ml-2"
                    >
                      Debug JWT
                    </Button>
                  </Alert>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loginMutation.isPending || signupMutation.isPending}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base shadow-lg"
                  startIcon={tabValue === 0 ? <LoginIcon /> : <SignupIcon />}
                >
                  {loginMutation.isPending || signupMutation.isPending
                    ? (tabValue === 0 ? 'Đang đăng nhập...' : 'Đang đăng ký...')
                    : (tabValue === 0 ? 'Đăng nhập' : 'Đăng ký')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;