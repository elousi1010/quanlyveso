import type { SimpleTableColumn, SimpleTableAction } from '../../../components/common/SimpleTable';
import type { Partner } from '../types/partnerTypes';
import { formatCurrency, formatDate } from '../../../utils/format';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { Tag, Switch, Space, Tooltip, Avatar } from 'antd';
import {
  getRiskStatusInfo,
  getDebtAgingStatus
} from '../../PartnerDebt/utils/partnerDebtHelpers';
import {
  UserOutlined,
  ShopOutlined,
  TeamOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
  IdcardOutlined,
  CalendarOutlined,
  DollarOutlined,
  HistoryOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined
} from '@ant-design/icons';

export const PARTNER_TABLE_COLUMNS: SimpleTableColumn[] = [
  {
    key: 'name',
    label: 'Tên đối tác',
    minWidth: 200,
  },
  {
    key: 'phone_number',
    label: 'Số điện thoại',
    minWidth: 150,
  },
  {
    key: 'address',
    label: 'Địa chỉ',
    minWidth: 200,
  },
  {
    key: 'work_area',
    label: 'Khu vực bán',
    minWidth: 150,
    render: (area: string) => area || '-',
  },
  {
    key: 'type',
    label: 'Loại',
    minWidth: 120,
    render: (type: string) => {
      const getTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' | 'default' => {
        switch (type) {
          case 'agent': return 'primary';
          case 'seller': return 'secondary';
          case 'distributor': return 'success';
          case 'retailer': return 'warning';
          default: return 'default';
        }
      };

      const getTypeLabel = (type: string) => {
        switch (type) {
          case 'agent': return 'Đại lý';
          case 'seller': return 'Người bán';
          case 'distributor': return 'Nhà phân phối';
          case 'retailer': return 'Bán lẻ';
          default: return type;
        }
      };

      return (
        <Chip
          label={getTypeLabel(type)}
          color={getTypeColor(type)}
          size="small"
          variant="outlined"
        />
      );
    },
  },
  {
    key: 'level',
    label: 'Cấp độ',
    minWidth: 120,
    render: (level: number) => (
      <Chip
        label={`Cấp ${level}`}
        color="primary"
        size="small"
        variant="outlined"
      />
    ),
  },
  {
    key: 'commission_rate',
    label: 'Hoa hồng (%)',
    minWidth: 120,
    align: 'center',
    render: (rate: number) => `${rate}%`,
  },
  {
    key: 'debt',
    label: 'Nợ hiện tại',
    minWidth: 150,
    align: 'right',
    render: (debt: number) => (
      <span style={{ fontWeight: 'bold', color: debt > 0 ? '#f44336' : 'inherit' }}>
        {formatCurrency(debt)}
      </span>
    ),
  },
  {
    key: 'status_risk',
    label: 'Rủi ro',
    minWidth: 140,
    render: (status: 'normal' | 'warning' | 'high_risk' | 'blacklisted', row: any) => {
      const risk = getRiskStatusInfo(status || 'normal');
      const aging = getDebtAgingStatus(row.debt_overdue_days || 0);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Tag color={risk.color}>{risk.label}</Tag>
          {row.debt_overdue_days > 0 && (
            <span style={{ fontSize: '11px', color: aging.color }}>
              Chễ hạn: {row.debt_overdue_days} ngày
            </span>
          )}
        </div>
      );
    },
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    minWidth: 120,
    render: (isActive: boolean) => {
      const getStatusColor = (isActive: boolean): 'success' | 'error' => {
        return isActive ? 'success' : 'error';
      };

      return (
        <Chip
          label={isActive ? 'Hoạt động' : 'Không hoạt động'}
          color={getStatusColor(isActive)}
          size="small"
          variant="filled"
        />
      );
    },
  },
  {
    key: 'created_at',
    label: 'Ngày tạo',
    minWidth: 150,
    render: (date: string) => formatDate(date),
  },
];

export const PARTNER_TABLE_ACTIONS: SimpleTableAction[] = [
  {
    key: 'delete',
    label: 'Xóa',
    icon: <DeleteIcon fontSize="small" />,
    color: 'error',
    onClick: (partner: Partner) => {

    },
  },
];
