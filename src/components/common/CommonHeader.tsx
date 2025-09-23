import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Refresh as RefreshIcon, 
  PersonAdd as PersonAddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon
} from '@mui/icons-material';

interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  onCreate: () => void;
  onRefresh?: () => void;
  createButtonText?: string;
  createButtonIcon?: React.ReactNode;
  refreshButtonText?: string;
  refreshButtonIcon?: React.ReactNode;
  loading?: boolean;
  onBulkEdit?: () => void;
  bulkEditButtonText?: string;
  bulkEditButtonIcon?: React.ReactNode;
  showBulkEdit?: boolean;
  selectedCount?: number;
  onDeleteSelected?: () => void;
  deleteButtonText?: string;
  deleteButtonIcon?: React.ReactNode;
  showDeleteSelected?: boolean;
  customActions?: React.ReactNode;
  showRefresh?: boolean;
}

const CommonHeader: React.FC<CommonHeaderProps> = ({
  title,
  subtitle,
  onCreate,
  onRefresh,
  createButtonText = 'Thêm mới',
  createButtonIcon = <PersonAddIcon />,
  refreshButtonText = 'Làm mới',
  refreshButtonIcon = <RefreshIcon />,
  loading = false,
  onBulkEdit,
  bulkEditButtonText = 'Chỉnh sửa hàng loạt',
  bulkEditButtonIcon = <EditIcon />,
  showBulkEdit = false,
  selectedCount = 0,
  onDeleteSelected,
  deleteButtonText = 'Xóa đã chọn',
  deleteButtonIcon = <DeleteIcon />,
  showDeleteSelected = false,
  customActions,
  showRefresh = true,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper 
        elevation={0}
        sx={{ 
          mb: 2, 
          // background: 'white',
          // border: '1px solid #e0e0e0',
          borderRadius: 2,
          // padding: 2,
          // boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography variant="h5" component="h1" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </motion.div>
          <motion.div 
            style={{ display: 'flex', gap: 12, alignItems: 'center' }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {customActions}
            
            {showRefresh && onRefresh && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  startIcon={refreshButtonIcon}
                  onClick={onRefresh}
                  disabled={loading}
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    },
                  }}
                >
                  {refreshButtonText}
                </Button>
              </motion.div>
            )}

            {showBulkEdit && onBulkEdit && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  startIcon={bulkEditButtonIcon}
                  onClick={onBulkEdit}
                  disabled={loading}
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    color: 'warning.main',
                    borderColor: 'warning.main',
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: 'warning.dark',
                      backgroundColor: 'warning.light',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  {bulkEditButtonText}
                </Button>
              </motion.div>
            )}

            {showDeleteSelected && onDeleteSelected && selectedCount > 0 && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="outlined"
                  startIcon={deleteButtonIcon}
                  onClick={onDeleteSelected}
                  disabled={loading || selectedCount === 0}
                  size="small"
                  sx={{ 
                    textTransform: 'none',
                    fontWeight: 500,
                    color: 'error.main',
                    borderColor: 'error.main',
                    borderRadius: 2,
                    boxShadow: 'none',
                    '&:hover': {
                      borderColor: 'error.dark',
                      backgroundColor: 'error.light',
                      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                    }
                  }}
                >
                  {deleteButtonText} ({selectedCount})
                </Button>
              </motion.div>
            )}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="contained"
                startIcon={createButtonIcon}
                onClick={onCreate}
                disabled={loading}
                size="small"
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
                  },
                }}
              >
                {createButtonText}
              </Button>
            </motion.div>
          </motion.div>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default CommonHeader;
