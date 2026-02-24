import React, { useState, useCallback, useEffect } from 'react';
import {
  Button,
  Typography,
  Table,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Form,
  Space,
  Flex,
  theme as antdTheme,
  Divider,
  Alert,
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CommonDrawer from '@/components/common/CommonDrawer';
import type { CreateInventoryDto, Ticket } from '../types';
import type { Station } from '@/pages/Stations/types';
import { PartnerSelector, StationSelector } from '@/components/common';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

interface InventoryFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateInventoryDto) => void;
  loading?: boolean;
}

const TICKET_TYPES = [
  { value: 'T', label: 'Truyền thống' },
  { value: 'E', label: 'Điện tử' },
  { value: 'S', label: 'Cào' },
];

const SUB_TYPES = {
  import: [
    { value: 'buy_from_agent', label: 'Mua từ đại lý' },
    { value: 'return_from_seller', label: 'Trả về từ người bán' },
    { value: 'buy_from_partner', label: 'Mua từ đối tác' },
    { value: 'exchange_ticket', label: 'Đổi vé' },
  ],
  export: [
    { value: 'return_to_agent', label: 'Trả về đại lý' },
    { value: 'sell_to_seller', label: 'Bán cho người bán' },
    { value: 'sell_to_customer', label: 'Bán cho khách hàng' },
    { value: 'sell_to_online', label: 'Bán online' },
  ],
};

export const InventoryFormDialog: React.FC<InventoryFormDialogProps> = ({
  open,
  onClose,
  onSave,
  loading = false,
}) => {
  const { token } = antdTheme.useToken();
  const [form] = Form.useForm();

  const [formData, setFormData] = useState<CreateInventoryDto>({
    draw_date: dayjs().format('YYYY-MM-DD'),
    ticket_type: 'T',
    station_id: '',
    type: 'import',
    sub_type: 'buy_from_agent',
    partner_id: '',
    note: '',
    tickets: [],
    is_update: false,
  });

  const [selectedStationData, setSelectedStationData] = useState<Station | null>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        draw_date: dayjs().format('YYYY-MM-DD'),
        ticket_type: 'T',
        station_id: '',
        type: 'import',
        sub_type: 'buy_from_agent',
        partner_id: '',
        note: '',
        tickets: [],
        is_update: false,
      });
      setSelectedStationData(null);
      form.resetFields();
    }
  }, [open, form]);

  const generateTicketCode = useCallback((stationCode: string, drawDate: string) => {
    const date = dayjs(drawDate);
    const dateStr = date.format('YYMMDD');

    const existingTickets = formData.tickets.filter(ticket =>
      ticket.code.startsWith(`${stationCode}-${dateStr}`)
    );

    const nextNumber = String(existingTickets.length + 1).padStart(2, '0');
    return `${stationCode}-${dateStr}-${nextNumber}`;
  }, [formData.tickets]);

  const handleAddTicket = useCallback(() => {
    if (!formData.station_id || !formData.draw_date || !selectedStationData) return;

    const newTicketCode = generateTicketCode(selectedStationData.code, formData.draw_date);
    const newTicket: Ticket = {
      code: newTicketCode,
      price: 10000,
      quantity: 1,
      note: '',
    };

    setFormData(prev => ({
      ...prev,
      tickets: [...prev.tickets, newTicket],
    }));
  }, [formData.station_id, formData.draw_date, generateTicketCode, selectedStationData]);

  const handleRemoveTicket = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }));
  }, []);

  const handleTicketChange = useCallback((index: number, field: keyof Ticket, value: any) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) =>
        i === index ? { ...ticket, [field]: value } : ticket
      ),
    }));
  }, []);

  const [isTimeUp, setIsTimeUp] = useState(false);
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      if (now.getHours() >= 15) {
        setIsTimeUp(true);
      } else {
        setIsTimeUp(false);
      }
    };
    checkTime();
    const timer = setInterval(checkTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const isReturnTicket = formData.sub_type.includes('return');
  const isSubmitDisabled = formData.tickets.length === 0 || (isReturnTicket && isTimeUp);

  const handleSubmit = useCallback(() => {
    if (formData.tickets.length === 0) {
      return;
    }

    if (!formData.station_id) {
      return;
    }

    if (!formData.partner_id) {
      return;
    }

    onSave(formData);
  }, [formData, onSave]);

  const columns = [
    {
      title: 'Mã Series (Lẻ)',
      dataIndex: 'code',
      key: 'code',
      width: 140,
      render: (_: any, record: any, index: number) => (
        <Input
          value={record.code}
          onChange={(e) => {
            handleTicketChange(index, 'code', e.target.value);
            handleTicketChange(index, 'is_block', false);
          }}
          placeholder="Mã/Ký hiệu"
        />
      )
    },
    {
      title: 'Seri Đầu (Lốc)',
      key: 'start_code',
      width: 120,
      render: (_: any, record: any, index: number) => (
        <Input
          value={record.start_code}
          onChange={(e) => {
            handleTicketChange(index, 'start_code', e.target.value);
            const startStr = String(e.target.value || '');
            const endStr = String(record.end_code || '');
            if (startStr && endStr && !isNaN(Number(startStr)) && !isNaN(Number(endStr))) {
              const qty = Math.abs(Number(endStr) - Number(startStr)) + 1;
              handleTicketChange(index, 'quantity', qty);
              handleTicketChange(index, 'is_block', true);
            }
          }}
          placeholder="000000"
        />
      )
    },
    {
      title: 'Seri Cuối (Lốc)',
      key: 'end_code',
      width: 120,
      render: (_: any, record: any, index: number) => (
        <Input
          value={record.end_code}
          onChange={(e) => {
            handleTicketChange(index, 'end_code', e.target.value);
            const endStr = String(e.target.value || '');
            const startStr = String(record.start_code || '');
            if (startStr && endStr && !isNaN(Number(startStr)) && !isNaN(Number(endStr))) {
              const qty = Math.abs(Number(endStr) - Number(startStr)) + 1;
              handleTicketChange(index, 'quantity', qty);
              handleTicketChange(index, 'is_block', true);
            }
          }}
          placeholder="000099"
        />
      )
    },
    {
      title: 'Giá',
      key: 'price',
      width: 120,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          min={0}
          step={1000}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value!.replace(/\$\s?|(,*)/g, '')}
          value={record.price}
          onChange={(val) => handleTicketChange(index, 'price', val || 0)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'SL',
      key: 'quantity',
      width: 80,
      render: (_: any, record: any, index: number) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(val) => handleTicketChange(index, 'quantity', val || 1)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 60,
      render: (_: any, __: any, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveTicket(index)}
        />
      )
    }
  ];

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title="Quản lý Kho"
      width={900}
      loading={loading}
    >
      <div style={{ padding: '24px', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, overflow: 'auto', paddingRight: '4px' }}>
          <Form layout="vertical">
            <Flex gap={16} wrap="wrap">
              <Form.Item label="Loại Giao Dịch" style={{ flex: 1, minWidth: '200px' }}>
                <Select value={formData.type} disabled options={[{ value: 'import', label: 'Nhập Kho' }]} />
              </Form.Item>

              <Form.Item label="Loại Vé" style={{ flex: 1, minWidth: '200px' }}>
                <Select
                  value={formData.ticket_type}
                  onChange={(val) => setFormData(prev => ({ ...prev, ticket_type: val }))}
                  options={TICKET_TYPES}
                />
              </Form.Item>

              <Form.Item label="Địa điểm (Đài)" style={{ flex: 1, minWidth: '240px' }}>
                <StationSelector
                  value={formData.station_id}
                  onChange={(id, item) => {
                    setSelectedStationData(item);
                    setFormData(prev => ({ ...prev, station_id: id || '' }));
                  }}
                />
              </Form.Item>

              <Form.Item label="Ngày Mở Thưởng" style={{ flex: 1, minWidth: '200px' }}>
                <DatePicker
                  style={{ width: '100%' }}
                  value={dayjs(formData.draw_date)}
                  onChange={(date) => setFormData(prev => ({ ...prev, draw_date: date ? date.format('YYYY-MM-DD') : '' }))}
                />
              </Form.Item>

              <Form.Item label="Loại Phụ" style={{ flex: 1, minWidth: '200px' }}>
                <Select
                  value={formData.sub_type}
                  onChange={(val) => setFormData(prev => ({ ...prev, sub_type: val }))}
                  options={SUB_TYPES[formData.type as keyof typeof SUB_TYPES]}
                />
              </Form.Item>

              <Form.Item label="Đối Tác" style={{ flex: 1, minWidth: '240px' }}>
                <PartnerSelector
                  value={formData.partner_id}
                  onChange={(id) => setFormData(prev => ({ ...prev, partner_id: id || '' }))}
                />
              </Form.Item>
            </Flex>

            <Divider style={{ margin: '16px 0' }} />

            <Flex justify="space-between" align="center" style={{ marginBottom: '16px' }}>
              <Title level={5} style={{ margin: 0 }}>Danh sách Vé</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddTicket}
                disabled={!formData.station_id || !formData.draw_date}
              >
                Thêm Vé
              </Button>
            </Flex>

            <Table
              dataSource={formData.tickets}
              columns={columns}
              rowKey={(record, index) => `${record.code}-${index}`}
              pagination={false}
              size="small"
              bordered
              locale={{ emptyText: <Text type="secondary">Chưa có vé nào được thêm</Text> }}
            />

            <Form.Item label="Ghi chú chung" style={{ marginTop: '24px' }}>
              <Input.TextArea
                rows={3}
                value={formData.note}
                onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Nhập ghi chú chung cho giao dịch này..."
              />
            </Form.Item>
          </Form>
        </div>

        <div style={{
          marginTop: '24px',
          paddingTop: '16px',
          borderTop: `1px solid ${token.colorBorderSecondary}`,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          {isReturnTicket && isTimeUp && (
            <div style={{ flex: 1 }}>
              <Alert
                message="Đã quá 15:00, không thể thao tác trả vé."
                type="error"
                showIcon
                style={{ padding: '4px 12px' }}
              />
            </div>
          )}
          <Button onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={isSubmitDisabled}
            style={{ minWidth: '120px' }}
          >
            {formData.type === 'import' ? 'Nhập Kho' : 'Xuất Kho'}
          </Button>
        </div>
      </div>
    </CommonDrawer>
  );
};
