import React from 'react';
import { Table, Button, Space, Typography, Flex, Tooltip, Alert, Spin, theme as antdTheme } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Text, Title } = Typography;

export interface SimpleTableColumn {
  key: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: unknown) => React.ReactNode;
}

export interface SimpleTableAction {
  key: string;
  label: string;
  icon: React.ReactNode;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  onClick: (row: unknown) => void;
}

interface SimpleTableProps {
  data: any[] | undefined;
  columns: SimpleTableColumn[];
  actions?: SimpleTableAction[];
  loading?: boolean;
  error?: unknown;
  onRefresh?: () => void;
  emptyMessage?: string;
  // Pagination
  page?: number;
  rowsPerPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rowsPerPage: number) => void;
  // Styling
  maxHeight?: number;
  stickyHeader?: boolean;
}

const SimpleTable: React.FC<SimpleTableProps> = ({
  data = [],
  columns,
  actions = [],
  loading = false,
  error,
  onRefresh,
  emptyMessage = 'Không có dữ liệu',
  page = 0,
  rowsPerPage = 10,
  total = 0,
  onPageChange,
  onRowsPerPageChange,
  maxHeight = 600,
  stickyHeader = true,
}) => {
  const { token } = antdTheme.useToken();

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Alert
          message="Lỗi tải dữ liệu"
          description={(error as Error).message}
          type="error"
          showIcon
          action={
            onRefresh && (
              <Button size="small" type="primary" danger onClick={onRefresh} icon={<ReloadOutlined />}>
                Thử lại
              </Button>
            )
          }
        />
      </div>
    );
  }

  const antdColumns: ColumnsType<any> = columns.map(col => ({
    title: col.label,
    dataIndex: col.key,
    key: col.key,
    align: col.align || 'left',
    width: col.minWidth,
    render: (text, record) => col.render ? col.render(text, record) : (text || '-'),
  }));

  if (actions.length > 0) {
    antdColumns.push({
      title: 'Thao tác',
      key: 'actions',
      align: 'center',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          {actions.map(action => (
            <Tooltip key={action.key} title={action.label}>
              <Button
                type="text"
                size="small"
                icon={action.icon}
                onClick={() => action.onClick(record)}
                danger={action.color === 'error'}
                style={{
                  color: action.color === 'error' ? token.colorError : (action.color === 'primary' ? token.colorPrimary : undefined)
                }}
              />
            </Tooltip>
          ))}
        </Space>
      ),
    });
  }

  return (
    <div style={{ width: '100%' }}>
      <Table
        dataSource={data}
        columns={antdColumns}
        loading={loading}
        pagination={{
          current: (page || 0) + 1,
          pageSize: rowsPerPage || 10,
          total: total || data?.length || 0,
          onChange: (p, ps) => {
            if (onPageChange) onPageChange(p - 1);
            if (onRowsPerPageChange && ps !== rowsPerPage) onRowsPerPageChange(ps);
          },
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '25', '50'],
          locale: { items_per_page: '/ trang' },
        }}
        scroll={{ y: maxHeight, x: 'max-content' }}
        rowKey={(record) => record.id || record.key || Math.random().toString()}
        bordered={false}
        size="middle"
        locale={{
          emptyText: (
            <Flex vertical align="center" gap={12} style={{ padding: '32px 0' }}>
              <Text type="secondary">{emptyMessage}</Text>
              {onRefresh && (
                <Button onClick={onRefresh} icon={<ReloadOutlined />}>Làm mới</Button>
              )}
            </Flex>
          )
        }}
      />
    </div>
  );
};

export default SimpleTable;
