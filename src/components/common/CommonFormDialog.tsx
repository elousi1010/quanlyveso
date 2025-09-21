import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import type { FormField } from './types';

interface CommonFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
  title: string;
  fields: FormField[];
  initialData?: Record<string, unknown>;
  submitText?: string;
  cancelButtonText?: string;
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const CommonFormDialog: React.FC<CommonFormDialogProps> = ({
  open,
  onClose,
  onSave,
  title,
  fields,
  initialData = {},
  submitText = 'Lưu',
  cancelButtonText = 'Hủy',
  loading = false,
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  const [formData, setFormData] = React.useState<Record<string, unknown>>(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const prevInitialDataRef = React.useRef<Record<string, unknown>>(initialData);

  React.useEffect(() => {
    // Only update if initialData actually changed or dialog opened
    if (open && JSON.stringify(prevInitialDataRef.current) !== JSON.stringify(initialData)) {
      setFormData(initialData);
      setErrors({});
      prevInitialDataRef.current = initialData;
    } else if (open) {
      // Reset form when dialog opens
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
          <FormControl key={field.key} fullWidth error={!!errors[field.key]} size="small">
            <InputLabel required={field.required} shrink>
              {field.label}
            </InputLabel>
            <Select
              {...commonProps}
              label={field.label}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '400px',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mt: 1 }}>
          {/* Form Fields */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {fields.map((field) => (
              <Box key={field.key}>
                {renderField(field)}
              </Box>
            ))}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
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
      </DialogActions>
    </Dialog>
  );
};

export default CommonFormDialog;
