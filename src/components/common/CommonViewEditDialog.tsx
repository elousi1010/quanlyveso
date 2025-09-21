import React, { useState, useEffect } from 'react';
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
  IconButton,
  Chip,
  Avatar,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Edit, Save, Cancel } from '@mui/icons-material';
import { formatDate } from '../../utils/format';
import type { FormField, DetailField } from './types';


const CommonViewEditDialog = <T = Record<string, unknown>>({
  open,
  onClose,
  onSave,
  title,
  item,
  formFields,
  detailFields,
  loading = false,
  maxWidth = 'sm',
  fullWidth = true,
  avatar,
}: {
  open: boolean;
  onClose: () => void;
  onSave?: (data: Record<string, unknown>) => void;
  title: string;
  item: T | null;
  formFields: FormField[];
  detailFields: DetailField[];
  loading?: boolean;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  avatar?: {
    text: string;
    color: string;
  };
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prevItemRef = React.useRef<T | null>(null);

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (open) {
      setIsEditMode(false);
      // Only update formData if item actually changed
      if (item && JSON.stringify(prevItemRef.current) !== JSON.stringify(item)) {
        setFormData(item as Record<string, unknown>);
        prevItemRef.current = item;
      } else if (!item) {
        setFormData({});
        prevItemRef.current = null;
      }
      setErrors({});
    }
  }, [open, item]);

  const handleFieldChange = (key: string, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    // Clear error when user starts typing
    if (errors[key]) {
      setErrors(prev => ({ ...prev, [key]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    formFields.forEach(field => {
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

  const handleSave = () => {
    if (validateForm() && onSave) {
      // Only send the form fields, not the entire item data
      const formFieldsData: Record<string, unknown> = {};
      formFields.forEach(field => {
        if (formData[field.key] !== undefined) {
          formFieldsData[field.key] = formData[field.key];
        }
      });
      onSave(formFieldsData);
    }
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setFormData(item || {});
    setErrors({});
  };

  const handleClose = () => {
    setIsEditMode(false);
    setFormData(item || {});
    setErrors({});
    onClose();
  };

  const renderField = (field: FormField) => {
    const fieldValue = formData[field.key] || '';
    const isDisabled = !isEditMode || field.disabled || loading;
    
    const commonProps = {
      fullWidth: true,
      value: fieldValue,
      error: !!errors[field.key],
      helperText: errors[field.key],
      disabled: isDisabled,
    };

    switch (field.type) {
      case 'select':
        return (
          <FormControl key={field.key} fullWidth error={!!errors[field.key]} size="small">
            <InputLabel required={field.required && isEditMode} shrink>
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
            required={field.required && isEditMode}
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
            required={field.required && isEditMode}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
          />
        );
    }
  };

  const renderDetailField = (field: DetailField) => {
    const value = item?.[field.key];
    
    // Check if this is a date field
    const isDateField = field?.key?.includes('_at') || field?.key?.includes('date') || field?.key?.includes('Date');
    
    if (field?.render) {
      return (
        <Box key={field.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: '120px', fontWeight: 500 }}>
            {field.label}:
          </Typography>
          <Box sx={{ flex: 1 }}>
            {field.render(value, item as Record<string, unknown>)}
          </Box>
        </Box>
      );
    }

    if (field?.chip) {
      return (
        <Box key={field.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ minWidth: '120px', fontWeight: 500 }}>
            {field.label}:
          </Typography>
          <Chip
            label={isDateField && value ? formatDate(value as string) : String(value || 'N/A')}
            color={field?.chip?.color}
            variant={field?.chip?.variant || 'filled'}
            size="small"
          />
        </Box>
      );
    }

    return (
      <Box key={field.key} sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ minWidth: '120px', fontWeight: 500 }}>
          {field.label}:
        </Typography>
        <Typography variant="body2" sx={{ flex: 1 }}>
          {isDateField && value ? formatDate(value as string) : String(value || 'N/A')}
        </Typography>
      </Box>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth as 'xs' | 'sm' | 'md' | 'lg' | 'xl'}
      fullWidth={fullWidth}
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '400px',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {avatar && (
            <Avatar sx={{ bgcolor: avatar.color, width: 40, height: 40 }}>
              {avatar.text}
            </Avatar>
          )}
          <Typography variant="h6" component="div" sx={{ fontWeight: 600, flex: 1 }}>
            {title}
          </Typography>
          {!isEditMode && onSave && (
            <IconButton onClick={handleEdit} size="small" color="primary">
              <Edit />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ mt: 1 }}>
          {isEditMode ? (
            // Edit mode - show form fields
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {formFields?.map((field) => (
                <Box key={field.key}>
                  {renderField(field)}
                </Box>
              ))}
            </Box>
          ) : (
            // View mode - show detail fields
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {detailFields?.map((field) => renderDetailField(field))}
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        {isEditMode ? (
          <>
            <Button
              onClick={handleCancel}
              disabled={loading}
              sx={{ textTransform: 'none' }}
              startIcon={<Cancel />}
            >
              Hủy
            </Button>
            <LoadingButton
              onClick={handleSave}
              loading={loading}
              variant="contained"
              sx={{ textTransform: 'none' }}
              startIcon={<Save />}
            >
              Lưu
            </LoadingButton>
          </>
        ) : (
          <Button
            onClick={handleClose}
            sx={{ textTransform: 'none' }}
          >
            Đóng
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommonViewEditDialog;
