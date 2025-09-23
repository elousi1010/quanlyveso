import React from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  IconButton,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { 
  Close,
  ExpandMore,
} from '@mui/icons-material';
import type { Permission } from '../types';

interface PermissionDetailViewProps {
  permission: Permission;
}

export const PermissionDetailView: React.FC<PermissionDetailViewProps> = ({ permission }) => {
  return (
    <Box sx={{ p: 0 }}>
      <Paper 
        elevation={0}
        sx={{ 
          borderRadius: 2,
          background: 'white',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <Box sx={{
          p: 3,
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box>
            <Typography variant="h5" sx={{ 
              fontWeight: 700, 
              color: '#1976d2',
              fontSize: '24px',
              mb: 0.5
            }}>
              Chi tiết Quyền hạn
            </Typography>
            <Typography variant="body2" sx={{ 
              color: 'text.secondary',
              fontSize: '14px'
            }}>
              Xem thông tin chi tiết và phân quyền
            </Typography>
          </Box>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Close />
          </IconButton>
        </Box>

        {/* Form Content */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Name and Code in one row */}
            <Box sx={{ display: 'flex', gap: 4 }}>
              {/* Name Field */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ 
                  mb: 1, 
                  fontWeight: 500,
                  color: 'text.primary'
                }}>
                  Name
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontWeight: 500,
                  color: 'text.primary'
                }}>
                  {permission.name}
                </Typography>
              </Box>

              {/* Code Field */}
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ 
                  mb: 1, 
                  fontWeight: 500,
                  color: 'text.primary'
                }}>
                  Code
                </Typography>
                <Typography variant="body1" sx={{ 
                  fontFamily: 'monospace',
                  fontWeight: 500,
                  color: 'text.primary'
                }}>
                  {permission.code}
                </Typography>
              </Box>
            </Box>

            {/* Permissions Detail */}
            <Box>
              <Typography variant="body2" sx={{ 
                mb: 2, 
                fontWeight: 500,
                color: 'text.primary'
              }}>
                Chi tiết quyền hạn
              </Typography>
              
              {/* System Configuration */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      System Configuration
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Master Data */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Master Data
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Recipe */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Recipe
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Production Order */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Production Order
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Production Execution */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Production Execution
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Report & Dashboard */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Report & Dashboard
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Kpi Award */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Kpi Award
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Scan Cz */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Scan Cz
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Qrcode */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Qrcode
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>

              {/* Scan Silo */}
              <Accordion sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Checkbox size="small" />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Scan Silo
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="View"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Create"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Update"
                      sx={{ minWidth: '120px' }}
                    />
                    <FormControlLabel
                      control={<Checkbox size="small" />}
                      label="Delete"
                      sx={{ minWidth: '120px' }}
                    />
                  </Box>
                </AccordionDetails>
              </Accordion>
            </Box>

          </Box>
        </Box>

      </Paper>
    </Box>
  );
};