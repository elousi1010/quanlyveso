import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import { CommonDrawer, type DetailField, type FormField } from './index';

export interface CommonDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, unknown>;
  fields: DetailField[];
  width?: number | string;
  enableEdit?: boolean;
  onEdit?: () => void;
  onSave?: (data: Record<string, unknown>) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  isEditing?: boolean;
  editFields?: FormField[];
}

const CommonDetailDrawer: React.FC<CommonDetailDrawerProps> = ({
  open,
  onClose,
  title,
  data,
  fields,
  enableEdit = false,
  onEdit,
  onSave,
  loading = false,
  error = null,
  isEditing = false,
  editFields = [],
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const renderFieldValue = (field: DetailField, value: unknown) => {
    if (value === null || value === undefined || value === '') {
      return (
        <Typography variant="body2" color="text.secondary" fontStyle="italic">
          Không có dữ liệu
        </Typography>
      );
    }

    // Priority: use custom render function if available
    if (field.render) {
      return field.render(value, data);
    }

    // Default rendering
    return (
      <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
        {String(value)}
      </Typography>
    );
  };

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={title}
      width={isMobile ? '100%' : 720}
    >
      <Box sx={{ 
        p: 0,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'grey.50'
      }}>
        {/* Header Section */}
        <Box sx={{ 
          p: 3, 
          pb: 2,
          backgroundColor: 'white',
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <Typography variant="h6" sx={{ 
            fontWeight: 600,
            color: 'primary.main',
            mb: 0.5
          }}>
            {(data.name as string) || 'Chi tiết'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {(data.name as string) || 'Chi tiết'}
          </Typography>
        </Box>

        {/* Content Section */}
        <Box sx={{ 
          flex: 1,
          overflow: 'auto',
          p: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'grey.300',
            borderRadius: '3px',
          },
        }}>
          <Box sx={{ 
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 1.5
          }}>
            {fields
              .filter(field => field.key !== 'id' && field.key !== 'organization_id')
              .map((field) => {
              const value = data[field.key];
              
              // Skip empty fields if hideIfEmpty is true
              if (field.hideIfEmpty && (value === null || value === undefined || value === '')) {
                return null;
              }
              
              return (
                <Paper
                  key={field.key}
                  elevation={0}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'grey.200',
                    borderRadius: 2,
                    backgroundColor: 'white',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      borderColor: 'primary.light',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column',
                    gap: 1
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                        fontSize: '0.75rem'
                      }}
                    >
                      {field.label}
                    </Typography>
                    
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      minHeight: 24
                    }}>
                      {field.chip && typeof renderFieldValue(field, value) === 'string' ? (
                        <Chip
                          label={renderFieldValue(field, value) as string}
                          color={field.chip.color}
                          variant={field.chip.variant || 'filled'}
                          size="small"
                          sx={{ 
                            fontWeight: 500,
                            '& .MuiChip-label': {
                              px: 1.5
                            }
                          }}
                        />
                      ) : (
                        <Box sx={{ 
                          '& .MuiTypography-root': {
                            fontWeight: 500,
                            color: 'text.primary',
                            fontSize: '0.95rem'
                          }
                        }}>
                          {renderFieldValue(field, value)}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Paper>
              );
            })}
          </Box>

          {fields.length === 0 && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 8,
                textAlign: 'center',
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Không có thông tin chi tiết
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer Actions */}
        <Box sx={{ 
          p: 2,
          backgroundColor: 'white',
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 1,
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Typography variant="caption" color="text.secondary">
            Cập nhật lần cuối: {data.updated_at ? new Date(data.updated_at as string).toLocaleDateString('vi-VN') : 'N/A'}
          </Typography>
          
          {enableEdit && onEdit && !isEditing && (
            <button
              onClick={onEdit}
              style={{
                padding: '8px 16px',
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 500
              }}
            >
              Chỉnh sửa
            </button>
          )}
        </Box>
      </Box>
    </CommonDrawer>
  );
};

export default CommonDetailDrawer;