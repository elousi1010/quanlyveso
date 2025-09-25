import React from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import CommonDrawer from './CommonDrawer';
import type { FormField } from './types';

interface CommonFormDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  title: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  submitText?: string;
  cancelButtonText?: string;
  loading?: boolean;
  width?: number | string;
  anchor?: 'left' | 'right' | 'top' | 'bottom';
}

const CommonFormDrawer: React.FC<CommonFormDrawerProps> = ({
  open,
  onClose,
  onSave,
  title,
  fields,
  initialData = {},
  submitText = 'Lưu',
  cancelButtonText = 'Hủy',
  loading = false,
  width = 400,
  anchor = 'right',
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = React.useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const prevInitialDataRef = React.useRef<Record<string, unknown>>(initialData);

  React.useEffect(() => {
    // Only update if initialData actually changed or drawer opened
    if (open && JSON.stringify(prevInitialDataRef.current) !== JSON.stringify(initialData)) {
      setFormData(initialData);
      setErrors({});
      prevInitialDataRef.current = initialData;
    } else if (open) {
      // Reset form when drawer opens
      setFormData(initialData);
      setErrors({});
    }
  }, [open]);

  const handleFieldChange = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach(field => {
      const value = formData[field.key];
      const isEmpty = value === undefined || value === null || value === '' || 
                     (typeof value === 'string' && value.trim() === '');
      
      if (field.required && isEmpty) {
        newErrors[field.key] = `${field.label} là bắt buộc`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const handleClose = () => {
    setFormData(initialData);
    setErrors({});
    onClose();
  };

  const renderField = (field: FormField) => {
    const fieldValue = formData[field.key] || '';
    
    const commonProps = {
      fullWidth: true,
      value: fieldValue,
      error: !!errors[field.key],
      helperText: errors[field.key],
      disabled: field.disabled || loading,
    };

    switch (field.type) {
      case 'select':
        return (
          <TextField
            key={field.key}
            {...commonProps}
            label={field.label}
            select
            size="small"
            required={field.required}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            SelectProps={{
              native: false,
            }}
          >
            {field.options?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );

      case 'textarea':
        return (
          <TextField
            key={field.key}
            {...commonProps}
            label={field.label}
            multiline
            rows={field.rows || 3}
            placeholder={field.placeholder}
            size="small"
            required={field.required}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );

      case 'date':
        return (
          <TextField
            key={field.key}
            {...commonProps}
            label={field.label}
            type="date"
            placeholder={field.placeholder}
            size="small"
            required={field.required}
            InputLabelProps={{ shrink: true }}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );

      case 'json':
        return (
          <TextField
            key={field.key}
            {...commonProps}
            label={field.label}
            multiline
            rows={field.rows || 4}
            placeholder={field.placeholder}
            size="small"
            required={field.required}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );

      default:
        return (
          <TextField
            key={field.key}
            {...commonProps}
            label={field.label}
            type={field.type}
            placeholder={field.placeholder}
            multiline={field.multiline}
            rows={field.rows}
            size="small"
            required={field.required}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );
    }
  };

  return (
    <CommonDrawer
      open={open}
      onClose={handleClose}
      title={title}
      width={width}
      anchor={anchor}
      loading={loading}
    >
      <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Form Fields */}
        <Box sx={{ flex: 1, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((field) => (
              <Box key={field.key}>
                {renderField(field)}
              </Box>
            ))}
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ mt: 3, pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleClose}
              disabled={loading}
              sx={{ textTransform: 'none' }}
            >
              {cancelButtonText}
            </Button>
            <LoadingButton
              onClick={handleSubmit}
              loading={loading}
              variant="contained"
              sx={{ textTransform: 'none' }}
            >
              {submitText}
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </CommonDrawer>
  );
};

export default CommonFormDrawer;
