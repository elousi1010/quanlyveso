import React, { useState, useCallback, useEffect } from 'react';
import {
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import CommonDrawer from '@/components/common/CommonDrawer';
import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../../Partners/api';
import { stationApi } from '../../Stations/api/stationApi';
import type { CreateInventoryDto, Ticket } from '../types';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState<CreateInventoryDto>({
    draw_date: new Date().toISOString().split('T')[0],
    ticket_type: 'T',
    station_id: '',
    type: 'import',
    sub_type: 'buy_from_agent',
    partner_id: '',
    note: '',
    tickets: [],
    is_update: false,
  });
  const [selectedStation, setSelectedStation] = useState('');
  const [selectedPartner, setSelectedPartner] = useState('');

  // Fetch partners and stations data
  const { data: partnersData, isLoading: partnersLoading } = useQuery({
    queryKey: ['partners', 'all'],
    queryFn: () => partnerApi.getPartners({ page: 1, limit: 1000 }),
    enabled: open,
  });

  const { data: stationsData, isLoading: stationsLoading } = useQuery({
    queryKey: ['stations', 'all'],
    queryFn: () => stationApi.getAll({ limit: 1000 }),
    enabled: open,
  });

  const partners = partnersData?.data?.data?.data || [];
  const stations = stationsData?.data?.data || [];

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      setFormData({
        draw_date: new Date().toISOString().split('T')[0],
        ticket_type: 'T',
        station_id: '',
        type: 'import',
        sub_type: 'buy_from_agent',
        partner_id: '',
        note: '',
        tickets: [],
        is_update: false,
      });
      setSelectedStation('');
      setSelectedPartner('');
    }
  }, [open]);


  const generateTicketCode = useCallback((stationCode: string, drawDate: string) => {
    const date = new Date(drawDate);
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '').substring(2); // YYMMDD
    
    // Find existing tickets for this station and date to determine next number
    const existingTickets = formData.tickets.filter(ticket => 
      ticket.code.startsWith(`${stationCode}-${dateStr}`)
    );
    
    const nextNumber = String(existingTickets.length + 1).padStart(2, '0');
    return `${stationCode}-${dateStr}-${nextNumber}`;
  }, [formData.tickets]);

  const handleAddTicket = useCallback(() => {
    if (!formData.station_id || !formData.draw_date) return;

    const selectedStationData = stations.find(s => s.id === formData.station_id);
    if (!selectedStationData) return;

    const newTicketCode = generateTicketCode(selectedStationData.code, formData.draw_date);
    const newTicket: Ticket = {
      code: newTicketCode,
      price: 0,
      quantity: 1,
      note: '',
    };

    setFormData(prev => ({
      ...prev,
      tickets: [...prev.tickets, newTicket],
    }));
  }, [formData.station_id, formData.draw_date, generateTicketCode, stations]);

  const handleRemoveTicket = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets.filter((_, i) => i !== index),
    }));
  }, []);

  const handleTicketChange = useCallback((index: number, field: keyof Ticket, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      tickets: prev.tickets.map((ticket, i) => 
        i === index ? { ...ticket, [field]: value } : ticket
      ),
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (formData.tickets.length === 0) {
      alert('Vui lòng thêm ít nhất một vé');
      return;
    }
    
    if (!formData.station_id) {
      alert('Vui lòng chọn đài');
      return;
    }
    
    if (!formData.partner_id) {
      alert('Vui lòng chọn đối tác');
      return;
    }
    
    onSave(formData);
  }, [formData, onSave]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      title="Quản lý Kho"
      width={isMobile ? '100%' : 600}
      anchor="right"
      loading={loading}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Form Content */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Loại Giao Dịch</InputLabel>
              <Select
                value={formData.type}
                disabled
                label="Loại Giao Dịch"
              >
                <MenuItem value="import">Nhập Kho</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Loại Vé</InputLabel>
              <Select
                value={formData.ticket_type}
                onChange={(e) => setFormData(prev => ({ ...prev, ticket_type: e.target.value }))}
                label="Loại Vé"
              >
                {TICKET_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Đài</InputLabel>
              <Select
                value={selectedStation}
                onChange={(e) => {
                  setSelectedStation(e.target.value);
                  setFormData(prev => ({ ...prev, station_id: e.target.value }));
                }}
                label="Đài"
                disabled={stationsLoading}
              >
                {stationsLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Đang tải...
                  </MenuItem>
                ) : (
                  stations.map((station) => (
                    <MenuItem key={station.id} value={station.id}>
                      {station.name} ({station.code})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Ngày Mở Thưởng"
              type="date"
              value={formData.draw_date}
              onChange={(e) => setFormData(prev => ({ ...prev, draw_date: e.target.value }))}
              InputLabelProps={{ shrink: true }}
            />

            <FormControl fullWidth>
              <InputLabel>Loại Phụ</InputLabel>
              <Select
                value={formData.sub_type}
                onChange={(e) => setFormData(prev => ({ ...prev, sub_type: e.target.value as any }))}
                label="Loại Phụ"
              >
                {SUB_TYPES[formData.type].map((subType) => (
                  <MenuItem key={subType.value} value={subType.value}>
                    {subType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>{formData.type === 'import' ? 'Nhà Cung Cấp' : 'Khách Hàng'}</InputLabel>
              <Select
                value={selectedPartner}
                onChange={(e) => {
                  setSelectedPartner(e.target.value);
                  setFormData(prev => ({ ...prev, partner_id: e.target.value }));
                }}
                label={formData.type === 'import' ? 'Nhà Cung Cấp' : 'Khách Hàng'}
                disabled={partnersLoading}
              >
                {partnersLoading ? (
                  <MenuItem disabled>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Đang tải...
                  </MenuItem>
                ) : (
                  partners.map((partner) => (
                    <MenuItem key={partner.id} value={partner.id}>
                      {partner.name} ({partner.type})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Danh sách Vé</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTicket}
            disabled={!formData.station_id || !formData.draw_date}
          >
            Thêm Vé
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Mã Vé</TableCell>
                <TableCell>Giá</TableCell>
                <TableCell>Số Lượng</TableCell>
                <TableCell>Ghi Chú</TableCell>
                <TableCell>Thao tác</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {formData.tickets.map((ticket, index) => (
                <TableRow key={index}>
                  <TableCell>{ticket.code}</TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={ticket.price}
                      onChange={(e) => handleTicketChange(index, 'price', Number(e.target.value))}
                      size="small"
                      inputProps={{ min: 0, step: 1000 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      type="number"
                      value={ticket.quantity}
                      onChange={(e) => handleTicketChange(index, 'quantity', Number(e.target.value))}
                      size="small"
                      inputProps={{ min: 1 }}
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={ticket.note || ''}
                      onChange={(e) => handleTicketChange(index, 'note', e.target.value)}
                      size="small"
                      placeholder="Ghi chú vé"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveTicket(index)}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {formData.tickets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Chưa có vé nào được thêm
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

          <TextField
            fullWidth
            label="Ghi chú chung"
            multiline
            rows={3}
            value={formData.note}
            onChange={(e) => setFormData(prev => ({ ...prev, note: e.target.value }))}
            sx={{ mt: 2 }}
          />
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button onClick={handleClose} disabled={loading}>
              Hủy
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              disabled={loading || formData.tickets.length === 0}
            >
              {loading ? 'Đang xử lý...' : (formData.type === 'import' ? 'Nhập Kho' : 'Xuất Kho')}
            </Button>
          </Box>
        </Box>
      </Box>
    </CommonDrawer>
  );
};
