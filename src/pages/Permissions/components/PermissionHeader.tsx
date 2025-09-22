import React from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { 
  Refresh as RefreshIcon, 
  PersonAdd as PersonAddIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  Security as SecurityIcon,
  Speed as SpeedIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import { PERMISSION_CONSTANTS } from '../constants';

interface PermissionHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onCreateSpecific?: () => void;
}

export const PermissionHeader: React.FC<PermissionHeaderProps> = ({
  onCreate,
  onRefresh,
  selectedCount,
  onDeleteSelected,
  onCreateSpecific,
}) => {
  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <SecurityIcon sx={{ mr: 1, color: 'primary.main', fontSize: 28 }} />
            <Typography variant="h5" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {PERMISSION_CONSTANTS.MODULE_TITLE}
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Quản lý quyền hạn và phân quyền người dùng
          </Typography>
          
          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<GroupIcon />} 
              label="6 Modules" 
              size="small" 
              color="primary" 
              variant="outlined"
              sx={{ fontSize: '11px' }}
            />
            <Chip 
              icon={<SpeedIcon />} 
              label="4 Actions/Module" 
              size="small" 
              color="secondary" 
              variant="outlined"
              sx={{ fontSize: '11px' }}
            />
            {selectedCount > 0 && (
              <Chip 
                label={`${selectedCount} đã chọn`} 
                size="small" 
                color="error" 
                variant="filled"
                sx={{ fontSize: '11px' }}
              />
            )}
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2
            }}
          >
            Làm mới
          </Button>
          
          {onCreateSpecific && (
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onCreateSpecific}
              size="small"
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                color: 'primary.main',
                borderColor: 'primary.main',
                borderRadius: 2
              }}
            >
              Tạo Permission 1
            </Button>
          )}
          
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={onCreate}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500,
              borderRadius: 2,
              boxShadow: 2
            }}
          >
            Thêm mới
          </Button>
          
          {selectedCount > 0 && onDeleteSelected && (
            <Button
              variant="contained"
              startIcon={<DeleteIcon />}
              onClick={onDeleteSelected}
              size="small"
              sx={{ 
                textTransform: 'none',
                fontWeight: 500,
                backgroundColor: 'error.main',
                borderRadius: 2,
                '&:hover': {
                  backgroundColor: 'error.dark',
                }
              }}
            >
              Xóa ({selectedCount})
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
