import React from 'react';
import type { SimpleTableColumn, SimpleTableAction } from '../../../components/common/SimpleTable';
import type { Partner } from '../types/partnerTypes';
import { formatCurrency, formatDate } from '../../../utils/format';
import { Tag, Typography } from 'antd';
import {
  DeleteOutlined,
  EyeOutlined,
  EditOutlined
} from '@ant-design/icons';
import {
  getRiskStatusInfo,
  getDebtAgingStatus
} from '../../PartnerDebt/utils/partnerDebtHelpers';

const { Text } = Typography;

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
      const getTypeColor = (type: string) => {
        switch (type) {
          case 'agent': return 'blue';
          case 'seller': return 'magenta';
          case 'distributor': return 'green';
          case 'retailer': return 'orange';
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
        <Tag color={getTypeColor(type)} bordered={false}>
          {getTypeLabel(type)}
        </Tag>
      );
    },
  },
  {
    key: 'level',
    label: 'Cấp độ',
    minWidth: 120,
    render: (level: number) => (
      <Tag color="geekblue">Cấp {level}</Tag>
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
      <Text strong type={debt > 0 ? 'danger' : undefined}>
        {formatCurrency(debt)}
      </Text>
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
        <Flex vertical gap={4}>
          <Tag color={risk.color === 'error' ? 'red' : risk.color === 'warning' ? 'orange' : risk.color as any}>
            {risk.label}
          </Tag>
          {row.debt_overdue_days > 0 && (
            <Text type="danger" style={{ fontSize: '11px' }}>
              Chễ hạn: {row.debt_overdue_days} ngày
            </Text>
          )}
        </Flex>
      );
    },
  },
  {
    key: 'is_active',
    label: 'Trạng thái',
    minWidth: 120,
    render: (isActive: boolean) => {
      return (
        <Tag color={isActive ? 'success' : 'error'} bordered={false}>
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
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

import { Flex } from 'antd';

export const PARTNER_TABLE_ACTIONS: SimpleTableAction[] = [
  {
    key: 'view',
    label: 'Xem chi tiết',
    icon: <EyeOutlined />,
    color: 'primary',
    onClick: () => { }
  },
  {
    key: 'edit',
    label: 'Chỉnh sửa',
    icon: <EditOutlined />,
    color: 'warning',
    onClick: () => { }
  },
  {
    key: 'delete',
    label: 'Xóa',
    icon: <DeleteOutlined />,
    color: 'error',
    onClick: (partner: Partner) => {

    },
  },
];
