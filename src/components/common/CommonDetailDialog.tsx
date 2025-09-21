import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Chip,
  Divider,
  Avatar,
  Stack,
  Skeleton,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Close as CloseIcon } from '@mui/icons-material';
import { formatDate } from '../../utils/format';

export interface DetailField {
  key: string;
  label: string;
  render?: (value: unknown, item: unknown) => React.ReactNode;
  chip?: {
    color: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'default';
    variant?: 'filled' | 'outlined';
  };
}

interface CommonDetailDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit?: (item: unknown) => void;
  title: string;
  item?: unknown;
  fields: DetailField[];
  isLoading?: boolean;
  error?: string;
  avatar?: {
    text: string;
    color?: string;
  };
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

const CommonDetailDialog: React.FC<CommonDetailDialogProps> = ({
  open,
  onClose,
  onEdit,
  title,
  item,
  fields,
  isLoading = false,
  error,
  avatar,
  maxWidth = 'sm',
  fullWidth = true,
}) => {
  const getTypeColor = (value: unknown): 'primary' | 'secondary' | 'success' | 'warning' | 'default' => {
    if (typeof value === 'boolean') {
      return value ? 'success' : 'warning';
    }
    if (typeof value === 'string') {
      if (value.toLowerCase().includes('active') || value.toLowerCase().includes('hoạt động')) {
        return 'success';
      }
      if (value.toLowerCase().includes('inactive') || value.toLowerCase().includes('không hoạt động')) {
        return 'warning';
      }
    }
    return 'default';
  };

  const renderFieldValue = (field: DetailField, value: unknown) => {
    if (field.render) {
      return field.render(value, item);
    }

    // Check if this is a date field
    const isDateField = field.key.includes('_at') || field.key.includes('date') || field.key.includes('Date');

    if (field.chip) {
      return (
        <Chip
          label={isDateField && value ? formatDate(value as string) : value as string}
          color={field.chip.color}
          variant={field.chip.variant || 'filled'}
          size="small"
        />
      );
    }

    if (typeof value === 'boolean') {
      return (
        <Chip
          label={value ? 'Có' : 'Không'}
          color={getTypeColor(value)}
          variant="filled"
          size="small"
        />
      );
    }

    return isDateField && value ? formatDate(value as string) : (value as string || 'N/A');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          <Button
            onClick={onClose}
            size="small"
            sx={{ minWidth: 'auto', p: 1 }}
          >
            <CloseIcon />
          </Button>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Box sx={{ minHeight: '400px', bgcolor: 'white' }}>
          {isLoading ? (
            <Box sx={{ p: 2 }}>
              <Stack spacing={2}>
                {fields.map((field) => (
                  <Box key={field.key}>
                    <Skeleton variant="text" width="30%" />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                ))}
              </Stack>
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ m: 2 }}>
              {error}
            </Alert>
          ) : item ? (
            <Box sx={{ p: 2 }}>
              {/* Avatar Section */}
              {avatar && (
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: avatar.color || 'primary.main',
                      width: 56,
                      height: 56,
                      mr: 2,
                    }}
                  >
                    {avatar.text}
                  </Avatar>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {(item as Record<string, unknown>).name as string || (item as Record<string, unknown>).title as string || 'Chi tiết'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Thông tin chi tiết
                    </Typography>
                  </Box>
                </Box>
              )}

              <Divider sx={{ mb: 2 }} />

              {/* Fields - Compact Row Layout */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {fields.map((field, index) => {
                  const value = field.render ? field.render(item[field.key], item) : item[field.key];
                  if ((field as unknown as DetailField) && (!value || (Array.isArray(value) && value.length === 0))) {
                    return null;
                  }
                  
                  return (
                    <Box
                      key={field.key}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        py: 1.5,
                        px: 2,
                        borderBottom: index < fields.length - 1 ? '1px solid #f0f0f0' : 'none',
                        '&:hover': {
                          backgroundColor: '#fafafa',
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ 
                          fontWeight: 500,
                          minWidth: '120px',
                          flexShrink: 0,
                        }}
                      >
                        {field.label}:
                      </Typography>
                      <Box sx={{ 
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                      }}>
                        {field.render ? field.render(item[field.key], item) : (
                          <Typography variant="body2" color="text.primary">
                            {renderFieldValue(field, value)}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ) : (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                Không có dữ liệu để hiển thị
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      {onEdit && item && (
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button
            onClick={onClose}
            sx={{ textTransform: 'none' }}
          >
            Đóng
          </Button>
          <Button
            onClick={() => onEdit(item)}
            variant="contained"
            startIcon={<EditIcon />}
            sx={{ textTransform: 'none' }}
          >
            Chỉnh sửa
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default CommonDetailDialog;
