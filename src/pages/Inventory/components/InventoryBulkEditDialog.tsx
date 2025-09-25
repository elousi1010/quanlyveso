import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { partnerApi } from '../../Partners/api';
import type { Partner } from '../../Partners/types';
import type { Inventory, UpdateInventoryDto } from '../types';

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

  const handleFieldChange = (inventoryId: string, field: keyof UpdateInventoryDto, value: unknown) => {
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
    
    await onSave(updates);
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { minHeight: '70vh' }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <EditIcon color="warning" />
        <Typography variant="h6" component="div">
          Chỉnh sửa hàng loạt ({selectedInventories.length} kho)
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Alert severity="info" sx={{ mb: 2 }}>
          Bạn đang chỉnh sửa {selectedInventories.length} kho được chọn. Các thay đổi sẽ được áp dụng cho tất cả các kho đã chọn.
        </Alert>

        {partnersLoading && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Đang tải danh sách đối tác...
          </Alert>
        )}

        {/* Global Fields Section */}
        <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1, border: '1px solid', borderColor: 'grey.300' }}>
          <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
            Cài đặt chung (áp dụng cho tất cả)
          </Typography>
          
          {/* Read-only Draw Date Info */}
          <Box sx={{ mb: 2, p: 1, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.dark">
              <strong>Ngày Quay:</strong> {selectedInventories[0]?.draw_date ? formatDate(selectedInventories[0].draw_date) : 'N/A'} 
              <em> (Cố định - không thể chỉnh sửa)</em>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Loại</InputLabel>
              <Select
                value={globalFields.type}
                onChange={(e) => handleGlobalFieldChange('type', e.target.value)}
                label="Loại"
              >
                {TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Loại Phụ</InputLabel>
              <Select
                value={globalFields.sub_type}
                onChange={(e) => handleGlobalFieldChange('sub_type', e.target.value)}
                label="Loại Phụ"
              >
                {SUB_TYPES.map((subType) => (
                  <MenuItem key={subType.value} value={subType.value}>
                    {subType.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Đối Tác</InputLabel>
              <Select
                value={globalFields.partner_id}
                onChange={(e) => handleGlobalFieldChange('partner_id', e.target.value)}
                label="Đối Tác"
                displayEmpty
              >
                <MenuItem value="">
                  <em>Chọn đối tác</em>
                </MenuItem>
                {partners.map((partner) => (
                  <MenuItem key={partner.id} value={partner.id}>
                    {partner.name} ({partner.type})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>

        <Divider sx={{ mb: 2 }} />

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Mã Vé</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 100 }}>Số Lượng</TableCell>
                <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Giá Trung Bình</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {selectedInventories.map((inventory) => {
                const editableData = editableFields[inventory.id] || {};
                return (
                  <TableRow key={inventory.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {inventory.code}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={editableData.quantity || ''}
                        onChange={(e) => handleFieldChange(inventory.id, 'quantity', parseInt(e.target.value) || 0)}
                        inputProps={{ min: 0, step: 1 }}
                        error={!!validationErrors[`${inventory.id}_quantity`]}
                        helperText={validationErrors[`${inventory.id}_quantity`]}
                        sx={{ width: 100 }}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="number"
                        size="small"
                        value={editableData.avg_cost || ''}
                        onChange={(e) => handleFieldChange(inventory.id, 'avg_cost', parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0, step: 0.01 }}
                        sx={{ width: 100 }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {hasChanges && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Bạn có thay đổi chưa được lưu. Nhấn "Lưu thay đổi" để áp dụng các thay đổi.
          </Alert>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, gap: 1 }}>
        <Button
          onClick={handleClose}
          startIcon={<CloseIcon />}
          disabled={loading}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSave}
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={loading || !hasChanges || Object.values(validationErrors).some(error => error !== '')}
          color="warning"
        >
          {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
