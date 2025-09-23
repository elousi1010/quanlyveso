import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Chip,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { CommonDrawer, type DetailField, type FormField } from './index';

export interface CommonViewEditDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown>;
  viewFields?: DetailField[];
  editFields?: FormField[];
  onSave?: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  width?: number | string;
  mode?: 'view' | 'edit';
  enableEdit?: boolean;
}

const CommonViewEditDrawer: React.FC<CommonViewEditDrawerProps> = ({
  open,
  onClose,
  title,
  data,
  viewFields = [],
  editFields = [],
  onSave,
  loading = false,
  error = null,
  width = 500,
  mode = 'view',
  enableEdit = true,
}) => {
  const [isEditing, setIsEditing] = useState(mode === 'edit');
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData(data);
      setFormErrors({});
      setIsEditing(mode === 'edit');
    }
  }, [open, data, mode]);

  const handleEdit = () => {
    setIsEditing(true);
    // Only keep fields that exist in editFields for form data
    const formFields = editFields.reduce((acc, field) => {
      acc[field.key] = data[field.key];
      return acc;
    }, {} as Record<string, unknown>);
    setFormData(formFields);
    setFormErrors({});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(data);
    setFormErrors({});
  };

  const handleSave = async () => {
    try {
      setFormErrors({});
      await onSave?.(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[fieldName]) {
      setFormErrors(prev => ({
        ...prev,
        [fieldName]: '',
      }));
    }
  };

  const renderFieldValue = (field: DetailField, value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Không có dữ liệu
        </Typography>
      );
    }

    // Handle objects that shouldn't be rendered directly
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          [Object - {Object.keys(value).join(', ')}]
        </Typography>
      );
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {String(value)}
          </Typography>
        );

      case 'number':
        return (
          <Typography variant="body2">
            {typeof value === 'number' ? value.toLocaleString() : String(value)}
          </Typography>
        );

      case 'currency':
        return (
          <Typography variant="body2" fontWeight="medium">
            {typeof value === 'number' ? value.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }) : String(value)}
          </Typography>
        );

      case 'date':
        return (
          <Typography variant="body2">
            {value ? new Date(value as string | number | Date).toLocaleDateString('vi-VN') : 'N/A'}
          </Typography>
        );

      case 'datetime':
        return (
          <Typography variant="body2">
            {value ? new Date(value as string | number | Date).toLocaleString('vi-VN') : 'N/A'}
          </Typography>
        );

      case 'boolean':
        return (
          <Chip
            label={value ? 'Có' : 'Không'}
            color={value ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        );

      case 'status': {
        const statusConfig = field.statusConfig?.[value as string] || {
          label: String(value),
          color: 'default' as const,
          variant: 'filled' as const,
        };
        return (
          <Chip
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            variant={statusConfig.variant || 'filled'}
          />
        );
      }

      case 'array':
        if (Array.isArray(value)) {
          return (
            <Box>
              {value.map((item, index) => (
                <Chip
                  key={index}
                  label={typeof item === 'object' ? item.name || item.label || JSON.stringify(item) : item}
                  size="small"
                  variant="outlined"
                  sx={{ mr: 0.5, mb: 0.5 }}
                />
              ))}
            </Box>
          );
        }
        return (
          <Typography variant="body2" color="text.secondary">
            {String(value)}
          </Typography>
        );

      case 'object':
        if (typeof value === 'object' && value !== null) {
          return (
            <Box>
              {Object.entries(value).map(([key, val]) => (
                <Box key={key} sx={{ mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">
                    {key}:
                  </Typography>
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                  </Typography>
                </Box>
              ))}
            </Box>
          );
        }
        return (
          <Typography variant="body2">
            {String(value)}
          </Typography>
        );

      case 'custom':
        if (field.render) {
          return field.render(value, data);
        }
        return (
          <Typography variant="body2">
            {String(value)}
          </Typography>
        );

      default:
        // Check if field has custom render function
        if (field.render) {
          const renderedValue = field.render(value, data);
          
          // If field has chip config, wrap in Chip component
          if (field.chip) {
            return (
              <Chip
                label={renderedValue}
                color={field.chip.color}
                size="small"
                variant={field.chip.variant || 'filled'}
              />
            );
          }
          
          return (
            <Typography variant="body2">
              {renderedValue}
            </Typography>
          );
        }
        
        return (
          <Typography variant="body2">
            {String(value)}
          </Typography>
        );
    }
  };

  const renderEditField = (field: FormField) => {
    const value = formData[field.key] || '';
    const error = formErrors[field.key];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            min={field.min}
            max={field.max}
            step={field.step}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        );

      case 'select':
        return (
          <select
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            disabled={field.disabled}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          >
            <option value="">{field.placeholder || 'Chọn...'}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            rows={field.rows || 3}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        );

      case 'boolean':
        return (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              checked={Boolean(value)}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              disabled={field.disabled}
            />
            <span>{field.placeholder || 'Bật/Tắt'}</span>
          </label>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value ? new Date(value as string | number | Date).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFieldChange(field.key, e.target.value ? new Date(e.target.value).toISOString() : '')}
            disabled={field.disabled}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        );

      case 'custom':
        if (field.render) {
          return field.render(value, formData, handleFieldChange);
        }
        return (
          <input
            type="text"
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        );

      default:
        return (
          <input
            type="text"
            value={String(value)}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            placeholder={field.placeholder}
            disabled={field.disabled}
            style={{
              width: '100%',
              padding: '8px 12px',
              border: `1px solid ${error ? '#d32f2f' : '#c4c4c4'}`,
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
        );
    }
  };

  const footerContent = (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
      {isEditing ? (
        <>
          <Button
            onClick={handleCancel}
            startIcon={<CancelIcon />}
            disabled={loading}
            size="small"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            startIcon={loading ? <CircularProgress size={16} /> : <SaveIcon />}
            variant="contained"
            disabled={loading}
            size="small"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </>
      ) : (
        enableEdit && onSave && (
          <Button
            onClick={handleEdit}
            startIcon={<EditIcon />}
            variant="contained"
            size="small"
          >
            Chỉnh sửa
          </Button>
        )
      )}
    </Box>
  );

  const fieldsToUse = isEditing ? (editFields || []) : (viewFields || []);
  
  // Fallback: if no fields provided, create basic fields from data
  const fallbackFields = fieldsToUse.length === 0 && Object.keys(data).length > 0 ? 
    Object.keys(data)
      .filter(key => {
        const value = data[key];
        // Filter out ID and organization_id fields
        if (key === 'id' || key === 'organization_id') {
          return false;
        }
        // Only include primitive values, not objects
        return value !== null && value !== undefined && 
               (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean');
      })
      .map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        type: 'text' as const
      })) : [];
  
  // Filter out ID and organization_id fields from provided fields as well
  const filteredFields = fieldsToUse.filter(field => 
    field.key !== 'id' && field.key !== 'organization_id'
  );
  
  const finalFields = filteredFields.length > 0 ? filteredFields : fallbackFields;

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={title}
      width={width}
      footerContent={footerContent}
    >
      <Box sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}


        {finalFields.length > 0 ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {finalFields.map((field) => {
              const value = isEditing ? formData[field.key] : data[field.key];
              const error = isEditing ? formErrors[field.key] : null;
              
              
              return (
                <Box 
                  key={field.key}
                  sx={{ 
                    flex: field.fullWidth ? '1 1 100%' : '1 1 calc(50% - 8px)',
                    minWidth: '300px'
                  }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      border: 1,
                      borderColor: error ? 'error.main' : 'divider',
                      borderRadius: 1,
                      height: '100%',
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color={error ? 'error.main' : 'text.secondary'}
                      gutterBottom
                      sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}
                    >
                      {field.label}
                      {field.required && <span style={{ color: '#d32f2f' }}> *</span>}
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      {isEditing ? renderEditField(field as FormField) : renderFieldValue(field as DetailField, value)}
                    </Box>
                    {error && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>
                        {error}
                      </Typography>
                    )}
                  </Paper>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 4,
              textAlign: 'center',
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Không có thông tin chi tiết
            </Typography>
          </Box>
        )}
      </Box>
    </CommonDrawer>
  );
};

export default CommonViewEditDrawer;
