import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Refresh as RefreshIcon, PersonAdd as PersonAddIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { PARTNER_CONSTANTS } from '../constants';

interface PartnerHeaderProps {
  onCreate: () => void;
  onRefresh: () => void;
  selectedCount: number;
  onDeleteSelected: () => void;
  onCreateSpecific?: () => void;
}

export const PartnerHeader: React.FC<PartnerHeaderProps> = ({
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
        mb: 2, 
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            {PARTNER_CONSTANTS.MODULE_TITLE}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Quản lý thông tin và cấp độ của các đối tác trong hệ thống
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRefresh}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
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
                borderColor: 'primary.main'
              }}
            >
              Tạo Đối tác 1
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={onCreate}
            size="small"
            sx={{ 
              textTransform: 'none',
              fontWeight: 500
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