import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Typography,
  Table,
  InputNumber,
  Select,
  Alert,
  Divider,
  Flex,
  theme as antdTheme,
} from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../../Partners/api';
import type { Inventory, UpdateInventoryDto } from '../types';

const { Text, Title } = Typography;

// Sub-type options
const SUB_TYPES = [
  { value: 'buy_from_agent', label: 'Mua từ đại lý' },
  { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
  { value: 'transfer', label: 'Chuyển kho' },
  { value: 'return', label: 'Trả về' },
];

// Type options
const TYPES = [
  { value: 'import', label: 'Nhập kho' },
  { value: 'export', label: 'Xuất kho' },
];

interface InventoryBulkEditDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (updates: Array<{ id: string; data: UpdateInventoryDto }>) => Promise<void>;
  selectedInventories: Inventory[];
  loading?: boolean;
}

export const InventoryBulkEditDialog: React.FC<InventoryBulkEditDialogProps> = ({
  open,
  onClose,
  onSave,
  selectedInventories,
  loading = false,
}) => {
  const { token } = antdTheme.useToken();
  const [editableFields, setEditableFields] = useState<Record<string, Partial<UpdateInventoryDto>>>({});
  const [globalFields, setGlobalFields] = useState<{
    type: string;
    sub_type: string;
    partner_id: string;
  }>({
    type: 'import',
    sub_type: 'buy_from_agent',
    partner_id: '',
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Fetch partners data
  const { data: partnersData, isLoading: partnersLoading } = useQuery({
    queryKey: ['partners', 'all'],
    queryFn: () => partnerApi.getPartners({ page: 1, limit: 1000 }),
    enabled: open,
  });

  const partners = partnersData?.data?.data?.data || [];

  // Initialize editable fields when dialog opens
  useEffect(() => {
    if (open && selectedInventories.length > 0) {
      const initialFields: Record<string, Partial<UpdateInventoryDto>> = {};
      selectedInventories.forEach(inventory => {
        initialFields[inventory.id] = {
          quantity: inventory.quantity,
          avg_cost: inventory.avg_cost,
        };
      });
      setEditableFields(initialFields);
      setGlobalFields({
        type: 'import',
        sub_type: 'buy_from_agent',
        partner_id: '',
      });
      setHasChanges(false);
      setValidationErrors({});
    }
  }, [open, selectedInventories]);

  const validateQuantity = (quantity: number): string => {
    if (quantity < 0) {
      return 'Số lượng không được âm';
    }
    if (!Number.isInteger(quantity)) {
      return 'Số lượng phải là số nguyên';
    }
    if (quantity > 1000000) {
      return 'Số lượng không được vượt quá 1,000,000';
    }
    return '';
  };

  const handleFieldChange = (inventoryId: string, field: keyof UpdateInventoryDto, value: any) => {
    // Validate quantity field
    if (field === 'quantity') {
      const quantity = typeof value === 'number' ? value : parseInt(value as string) || 0;
      const error = validateQuantity(quantity);
      setValidationErrors(prev => ({
        ...prev,
        [`${inventoryId}_quantity`]: error,
      }));
    }

    setEditableFields(prev => ({
      ...prev,
      [inventoryId]: {
        ...prev[inventoryId],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleGlobalFieldChange = (field: 'type' | 'sub_type' | 'partner_id', value: string) => {
    setGlobalFields(prev => ({
      ...prev,
      [field]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    // Check for validation errors
    const hasValidationErrors = Object.values(validationErrors).some(error => error !== '');
    if (hasValidationErrors) {
      return;
    }

    const updates = Object.entries(editableFields).map(([id, data]) => {
      const inventory = selectedInventories.find(inv => inv.id === id);
      if (!inventory) return null;

      // Create tickets array from quantity and avg_cost
      const tickets = [{
        price: data.avg_cost || inventory.avg_cost,
        quantity: data.quantity || inventory.quantity,
        code: inventory.code,
        note: ''
      }];

      return {
        id,
        data: {
          type: globalFields.type as 'import' | 'export',
          sub_type: globalFields.sub_type as 'buy_from_agent' | 'sell_to_customer' | 'transfer' | 'return',
          partner_id: globalFields.partner_id,
          note: '',
          tickets: tickets,
        } as UpdateInventoryDto,
      };
    }).filter(Boolean);

    await onSave(updates as any);
    setHasChanges(false);
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('Bạn có chắc chắn muốn đóng? Các thay đổi chưa được lưu sẽ bị mất.')) {
        onClose();
        setHasChanges(false);
      }
    } else {
      onClose();
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const columns = [
    {
      title: 'Mã Vé',
      dataIndex: 'code',
      key: 'code',
      render: (text: string) => <Text strong>{text}</Text>
    },
    {
      title: 'Số Lượng',
      key: 'quantity',
      render: (_: any, record: Inventory) => {
        const editableData = editableFields[record.id] || {};
        const error = validationErrors[`${record.id}_quantity`];
        return (
          <Flex vertical gap={4}>
            <InputNumber
              min={0}
              max={1000000}
              precision={0}
              value={editableData.quantity}
              onChange={(val) => handleFieldChange(record.id, 'quantity', val || 0)}
              status={error ? 'error' : ''}
              style={{ width: '100%' }}
            />
            {error && <Text type="danger" style={{ fontSize: '11px' }}>{error}</Text>}
          </Flex>
        );
      }
    },
    {
      title: 'Giá Trung Bình',
      key: 'avg_cost',
      render: (_: any, record: Inventory) => {
        const editableData = editableFields[record.id] || {};
        return (
          <InputNumber
            min={0}
            step={100}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            value={editableData.avg_cost}
            onChange={(val) => handleFieldChange(record.id, 'avg_cost', val || 0)}
            style={{ width: '100%' }}
          />
        );
      }
    }
  ];

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={1000}
      title={
        <Flex align="center" gap={8}>
          <EditOutlined style={{ color: token.colorWarning }} />
          <Text strong style={{ fontSize: '16px' }}>
            Chỉnh sửa hàng loạt ({selectedInventories.length} kho)
          </Text>
        </Flex>
      }
      footer={[
        <Button key="cancel" onClick={handleClose} disabled={loading} icon={<CloseOutlined />}>
          Hủy
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={loading}
          disabled={!hasChanges || Object.values(validationErrors).some(error => error !== '')}
          icon={<SaveOutlined />}
          style={{ backgroundColor: token.colorWarning }}
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      ]}
    >
      <div style={{ padding: '8px 0' }}>
        <Alert
          message={`Bạn đang chỉnh sửa ${selectedInventories.length} kho được chọn. Các thay đổi sẽ được áp dụng cho tất cả các kho đã chọn.`}
          type="info"
          showIcon
          style={{ marginBottom: '16px' }}
        />

        {/* Global Fields Section */}
        <div style={{
          padding: '16px',
          backgroundColor: token.colorFillAlter,
          borderRadius: '8px',
          border: `1px solid ${token.colorBorderSecondary}`,
          marginBottom: '24px'
        }}>
          <Title level={5} style={{ marginTop: 0, marginBottom: '16px', color: token.colorPrimary }}>
            Cài đặt chung (áp dụng cho tất cả)
          </Title>

          <Flex vertical gap={16}>
            <div style={{ padding: '8px 12px', backgroundColor: token.colorInfoBg, borderRadius: '4px' }}>
              <Text type="secondary">
                <Text strong>Ngày Quay:</Text> {selectedInventories[0]?.draw_date ? formatDate(selectedInventories[0].draw_date) : 'N/A'}
                <Text italic style={{ marginLeft: '8px' }}>(Cố định - không thể chỉnh sửa)</Text>
              </Text>
            </div>

            <Flex gap={16} wrap="wrap">
              <Flex vertical gap={4} style={{ minWidth: '200px', flex: 1 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Loại</Text>
                <Select
                  value={globalFields.type}
                  onChange={(val) => handleGlobalFieldChange('type', val)}
                  options={TYPES}
                  style={{ width: '100%' }}
                />
              </Flex>
              <Flex vertical gap={4} style={{ minWidth: '200px', flex: 1 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Loại Phụ</Text>
                <Select
                  value={globalFields.sub_type}
                  onChange={(val) => handleGlobalFieldChange('sub_type', val)}
                  options={SUB_TYPES}
                  style={{ width: '100%' }}
                />
              </Flex>
              <Flex vertical gap={4} style={{ minWidth: '200px', flex: 1 }}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Đối Tác</Text>
                <Select
                  value={globalFields.partner_id}
                  onChange={(val) => handleGlobalFieldChange('partner_id', val)}
                  loading={partnersLoading}
                  placeholder="Chọn đối tác"
                  options={partners.map(p => ({ value: p.id, label: `${p.name} (${p.type})` }))}
                  style={{ width: '100%' }}
                />
              </Flex>
            </Flex>
          </Flex>
        </div>

        <Divider style={{ margin: '16px 0' }} />

        <Table
          dataSource={selectedInventories}
          columns={columns}
          rowKey="id"
          pagination={false}
          scroll={{ y: 350 }}
          size="small"
        />

        {hasChanges && (
          <Alert
            message="Bạn có thay đổi chưa được lưu. Nhấn 'Lưu thay đổi' để áp dụng các thay đổi."
            type="warning"
            showIcon
            style={{ marginTop: '16px' }}
          />
        )}
      </div>
    </Modal>
  );
};
