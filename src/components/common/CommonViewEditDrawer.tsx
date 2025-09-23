import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Grid,
  Chip,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
  Alert,
  CircularProgress,
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { CommonDrawer, type DetailField, type FormField } from './index';

export interface CommonViewEditDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  viewFields: DetailField[];
  editFields: FormField[];
  onSave: (data: Record<string, any>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  width?: number | string;
  allowEdit?: boolean;
}

const CommonViewEditDrawer: React.FC<CommonViewEditDrawerProps> = ({
  open,
  onClose,
  title,
  data,
  viewFields,
  editFields,
  onSave,
  loading = false,
  error = null,
  width = 500,
  allowEdit = true,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setFormData(data);
      setFormErrors({});
      setIsEditing(false);
    }
  }, [open, data]);

  const handleEdit = () => {
    setIsEditing(true);
    setFormData(data);
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
      await onSave(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Save error:', err);
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
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

  const renderFieldValue = (field: DetailField, value: any) => {
    if (value === null || value === undefined || value === '') {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Không có dữ liệu
        </Typography>
      );
    }

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {value}
          </Typography>
        );

      case 'number':
        return (
          <Typography variant="body2">
            {typeof value === 'number' ? value.toLocaleString() : value}
          </Typography>
        );

      case 'currency':
        return (
          <Typography variant="body2" fontWeight="medium">
            {typeof value === 'number' ? value.toLocaleString('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }) : value}
          </Typography>
        );

      case 'date':
        return (
          <Typography variant="body2">
            {value ? new Date(value).toLocaleDateString('vi-VN') : 'N/A'}
          </Typography>
        );

      case 'datetime':
        return (
          <Typography variant="body2">
            {value ? new Date(value).toLocaleString('vi-VN') : 'N/A'}
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

      case 'status':
        const statusConfig = field.statusConfig?.[value] || {
          label: value,
          color: 'default' as const,
        };
        return (
          <Chip
            label={statusConfig.label}
            color={statusConfig.color}
            size="small"
            variant="statusConfig.variant || 'filled'"
          />
        );

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
            {value}
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
            {value}
          </Typography>
        );

      case 'custom':
        if (field.render) {
          return field.render(value, data);
        }
        return (
          <Typography variant="body2">
            {value}
          </Typography>
        );

      default:
        return (
          <Typography variant="body2">
            {value}
          </Typography>
        );
    }
  };

  const renderEditField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = formErrors[field.name];

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
            value={value}
            onChange={(e) => handleFieldChange(field.name, parseFloat(e.target.value) || 0)}
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
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
              onChange={(e) => handleFieldChange(field.name, e.target.checked)}
              disabled={field.disabled}
            />
            <span>{field.placeholder || 'Bật/Tắt'}</span>
          </label>
        );

      case 'date':
        return (
          <input
            type="date"
            value={value ? new Date(value).toISOString().split('T')[0] : ''}
            onChange={(e) => handleFieldChange(field.name, e.target.value ? new Date(e.target.value).toISOString() : '')}
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
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
            value={value}
            onChange={(e) => handleFieldChange(field.name, e.target.value)}
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
        allowEdit && (
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

        <Grid container spacing={2}>
          {(isEditing ? editFields : viewFields).map((field) => {
            const value = isEditing ? formData[field.name] : data[field.name];
            const error = isEditing ? formErrors[field.name] : null;
            
            return (
              <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
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
              </Grid>
            );
          })}
        </Grid>

        {(isEditing ? editFields : viewFields).length === 0 && (
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
