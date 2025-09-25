import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import { 
  Refresh as RefreshIcon, 
  PersonAdd as PersonAddIcon, 
  Edit as EditIcon,
  Delete as DeleteIcon
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
          mb: 3, 
          p: 3,
          background: 'transparent',
          borderRadius: 2,
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 0 }
        }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                fontWeight: 700, 
                color: 'text.primary', 
                mb: 1,
                fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                lineHeight: 1.2,
                letterSpacing: '-0.02em'
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography 
                variant="body1" 
                color="text.secondary"
                sx={{
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  lineHeight: 1.4,
                  opacity: 0.8,
                  maxWidth: '600px'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </motion.div>
          <motion.div 
            style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}
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
