import type { TableColumn, TableAction } from '../../../components/common';
import type { Partner } from '../types/partnerTypes';
import { formatCurrency, formatDate } from '../../../utils/format';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Chip } from '@mui/material';

export const PARTNER_TABLE_COLUMNS: TableColumn[] = [
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
    key: 'debt',
    label: 'Nợ (VNĐ)',
    minWidth: 150,
    align: 'right',
    render: (debt: number) => formatCurrency(debt),
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

export const PARTNER_TABLE_ACTIONS: TableAction[] = [
  {
    key: 'delete',
    label: 'Xóa',
    icon: <DeleteIcon fontSize="small" />,
    color: 'error.main',
    onClick: (partner: Partner) => {
      console.log('Delete partner:', partner);
    },
  },
];
