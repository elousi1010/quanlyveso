import { useState } from 'react';
import {
  TextField,
  Button,
  Alert,
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import {
  AccountBalance as BankIcon,
  Person as PersonIcon,
  Store as StoreIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'owner' | 'employee' | 'seller'>('owner');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (!success) {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch {
      setError('Đã xảy ra lỗi, vui lòng thử lại');
    } finally {
      setIsLoading(false);
    }
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

  const roleInfo = getRoleInfo(role);

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
              Hệ thống quản lý vé số
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
                  {roleInfo.icon}
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  Đăng nhập hệ thống
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Chọn vai trò và đăng nhập để tiếp tục
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Role Selection */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Vai trò
                  </label>
                  <FormControl fullWidth>
                    <Select
                      value={role}
                      onChange={(e) => setRole(e.target.value as 'owner' | 'employee' | 'seller')}
                      className="rounded-lg"
                    >
                      <MenuItem value="owner">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <BankIcon className="text-blue-600 text-sm sm:text-base" />
                          <div>
                            <div className="font-medium text-sm sm:text-base">Chủ cửa hàng</div>
                            <div className="text-xs sm:text-sm text-gray-500">Toàn quyền truy cập</div>
                          </div>
                        </div>
                      </MenuItem>
                      <MenuItem value="employee">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <PersonIcon className="text-green-600 text-sm sm:text-base" />
                          <div>
                            <div className="font-medium text-sm sm:text-base">Nhân viên quầy</div>
                            <div className="text-xs sm:text-sm text-gray-500">Quản lý bán hàng</div>
                          </div>
                        </div>
                      </MenuItem>
                      <MenuItem value="seller">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <StoreIcon className="text-purple-600 text-sm sm:text-base" />
                          <div>
                            <div className="font-medium text-sm sm:text-base">Người bán vé dạo</div>
                            <div className="text-xs sm:text-sm text-gray-500">Bán vé và cập nhật</div>
                          </div>
                        </div>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </div>

                <Divider />

                {/* Username */}
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Tên đăng nhập
                  </label>
                  <TextField
                    fullWidth
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nhập tên đăng nhập"
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu"
                    className="rounded-lg"
                    size="small"
                    required
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <Alert severity="error" className="rounded-lg">
                    {error}
                  </Alert>
                )}

                {/* Login Button */}
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-2 sm:py-3 rounded-lg font-medium text-sm sm:text-base shadow-lg"
                  startIcon={<LoginIcon />}
                >
                  {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Thông tin demo:</h4>
                <div className="space-y-1 text-xs sm:text-sm text-gray-600">
                  <p><strong>Chủ cửa hàng:</strong> owner / password</p>
                  <p><strong>Nhân viên:</strong> employee / password</p>
                  <p><strong>Người bán:</strong> seller / password</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;