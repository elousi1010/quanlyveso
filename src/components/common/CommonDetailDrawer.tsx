import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Divider,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { CommonDrawer, type DetailField } from './index';

export interface CommonDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: Record<string, any>;
  fields: DetailField[];
  width?: number | string;
}

const CommonDetailDrawer: React.FC<CommonDetailDrawerProps> = ({
  open,
  onClose,
  title,
  data,
  fields,
  width = 500,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

  return (
    <CommonDrawer
      open={open}
      onClose={onClose}
      title={title}
      width={width}
    >
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {fields.map((field) => {
            const value = data[field.name];
            
            return (
              <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 1,
                    height: '100%',
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                    sx={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase' }}
                  >
                    {field.label}
                  </Typography>
                  <Box sx={{ mt: 0.5 }}>
                    {renderFieldValue(field, value)}
                  </Box>
                </Paper>
              </Grid>
            );
          })}
        </Grid>

        {fields.length === 0 && (
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

export default CommonDetailDrawer;
