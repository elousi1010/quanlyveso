import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton, Paper, useTheme } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

export interface FilterOption {
  value: string;
  label: string;
}

export interface SearchAndFilterConfig {
  searchPlaceholder?: string;
  sortOptions?: FilterOption[];
  filterOptions?: Array<{
    key: string;
    label: string;
    options: FilterOption[];
  }>;
}

interface CommonSearchAndFilterProps {
  config: SearchAndFilterConfig;
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onClearFilters?: () => void;
  filters?: Record<string, unknown>;
  loading?: boolean;
}

const CommonSearchAndFilter: React.FC<CommonSearchAndFilterProps> = ({
  config,
  onSearch,
  onSort,
  onFilter,
  onClearFilters,
  filters: externalFilters = {},
  loading = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(config?.sortOptions?.[0]?.value || '');
  const [filters, setFilters] = useState<Record<string, string>>(externalFilters as Record<string, string>);

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    onFilter({});
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2.5, 
        mb: 2, 
        background: isDark 
          ? 'linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)'
          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.1)'
          : '1px solid rgba(0, 0, 0, 0.08)',
        borderRadius: 3,
        boxShadow: isDark 
          ? '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)'
          : '0 4px 20px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: isDark 
            ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.1), transparent)',
        }
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search Input */}
        <TextField
          placeholder={config?.searchPlaceholder || 'Tìm kiếm...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ 
            minWidth: 280,
            '& .MuiOutlinedInput-root': {
              background: isDark 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              transition: 'all 0.2s ease',
              '&:hover': {
                border: isDark 
                  ? '1px solid rgba(255, 255, 255, 0.2)'
                  : '1px solid rgba(0, 0, 0, 0.15)',
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.08)'
                  : 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-focused': {
                border: isDark 
                  ? '1px solid #667eea'
                  : '1px solid #667eea',
                boxShadow: isDark 
                  ? '0 0 0 2px rgba(102, 126, 234, 0.2)'
                  : '0 0 0 2px rgba(102, 126, 234, 0.1)',
              }
            },
            '& .MuiInputBase-input': {
              color: isDark ? '#ffffff' : '#1a1a1a',
              '&::placeholder': {
                color: isDark ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.5)',
                opacity: 1,
              }
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ 
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                  fontSize: '1.1rem'
                }} />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  edge="end"
                  sx={{
                    color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                      color: isDark ? '#ff6b6b' : '#e74c3c',
                      background: isDark ? 'rgba(255, 107, 107, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                    }
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Sort By */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel sx={{ 
            color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
            '&.Mui-focused': {
              color: '#667eea',
            }
          }}>
            Sắp xếp theo
          </InputLabel>
          <Select
            value={sortBy}
            label="Sắp xếp theo"
            onChange={(e) => {
              setSortBy(e.target.value);
              onSort(e.target.value);
            }}
            sx={{
              background: isDark 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.1)'
                : '1px solid rgba(0, 0, 0, 0.08)',
              borderRadius: 2,
              color: isDark ? '#ffffff' : '#1a1a1a',
              '&:hover': {
                border: isDark 
                  ? '1px solid rgba(255, 255, 255, 0.2)'
                  : '1px solid rgba(0, 0, 0, 0.15)',
              },
              '&.Mui-focused': {
                border: '1px solid #667eea',
                boxShadow: isDark 
                  ? '0 0 0 2px rgba(102, 126, 234, 0.2)'
                  : '0 0 0 2px rgba(102, 126, 234, 0.1)',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              }
            }}
          >
            {config?.sortOptions?.map((option) => (
              <MenuItem 
                key={option.value} 
                value={option.value}
                sx={{
                  color: isDark ? '#ffffff' : '#1a1a1a',
                  '&:hover': {
                    background: isDark 
                      ? 'rgba(102, 126, 234, 0.1)'
                      : 'rgba(102, 126, 234, 0.05)',
                  },
                  '&.Mui-selected': {
                    background: isDark 
                      ? 'rgba(102, 126, 234, 0.2)'
                      : 'rgba(102, 126, 234, 0.1)',
                    '&:hover': {
                      background: isDark 
                        ? 'rgba(102, 126, 234, 0.3)'
                        : 'rgba(102, 126, 234, 0.15)',
                    }
                  }
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Dynamic Filters */}
        {config?.filterOptions?.map((filter) => (
          <FormControl key={filter.key} size="small" sx={{ minWidth: 140 }}>
            <InputLabel sx={{ 
              color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
              '&.Mui-focused': {
                color: '#667eea',
              }
            }}>
              {filter.label}
            </InputLabel>
            <Select
              value={filters[filter.key] || ''}
              label={filter.label}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
              sx={{
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.05)'
                  : 'rgba(0, 0, 0, 0.02)',
                border: isDark 
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.08)',
                borderRadius: 2,
                color: isDark ? '#ffffff' : '#1a1a1a',
                '&:hover': {
                  border: isDark 
                    ? '1px solid rgba(255, 255, 255, 0.2)'
                    : '1px solid rgba(0, 0, 0, 0.15)',
                },
                '&.Mui-focused': {
                  border: '1px solid #667eea',
                  boxShadow: isDark 
                    ? '0 0 0 2px rgba(102, 126, 234, 0.2)'
                    : '0 0 0 2px rgba(102, 126, 234, 0.1)',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none',
                }
              }}
            >
              <MenuItem 
                value=""
                sx={{
                  color: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
                  fontStyle: 'italic',
                  '&:hover': {
                    background: isDark 
                      ? 'rgba(102, 126, 234, 0.1)'
                      : 'rgba(102, 126, 234, 0.05)',
                  }
                }}
              >
                Tất cả
              </MenuItem>
              {filter.options.map((option) => (
                <MenuItem 
                  key={option.value} 
                  value={option.value}
                  sx={{
                    color: isDark ? '#ffffff' : '#1a1a1a',
                    '&:hover': {
                      background: isDark 
                        ? 'rgba(102, 126, 234, 0.1)'
                        : 'rgba(102, 126, 234, 0.05)',
                    },
                    '&.Mui-selected': {
                      background: isDark 
                        ? 'rgba(102, 126, 234, 0.2)'
                        : 'rgba(102, 126, 234, 0.1)',
                      '&:hover': {
                        background: isDark 
                          ? 'rgba(102, 126, 234, 0.3)'
                          : 'rgba(102, 126, 234, 0.15)',
                      }
                    }
                  }}
                >
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1.5, ml: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
            size="small"
            sx={{ 
              textTransform: 'none',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:disabled': {
                background: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                color: isDark ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.5)',
                boxShadow: 'none',
              }
            }}
          >
            Tìm kiếm
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            disabled={loading}
            size="small"
            sx={{ 
              textTransform: 'none',
              border: isDark 
                ? '1px solid rgba(255, 255, 255, 0.2)'
                : '1px solid rgba(0, 0, 0, 0.2)',
              color: isDark ? '#ffffff' : '#1a1a1a',
              borderRadius: 2,
              px: 3,
              py: 1,
              fontWeight: 500,
              background: isDark 
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.02)',
              '&:hover': {
                border: isDark 
                  ? '1px solid rgba(255, 255, 255, 0.3)'
                  : '1px solid rgba(0, 0, 0, 0.3)',
                background: isDark 
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
              '&:disabled': {
                border: isDark 
                  ? '1px solid rgba(255, 255, 255, 0.1)'
                  : '1px solid rgba(0, 0, 0, 0.1)',
                color: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
              }
            }}
          >
            Xóa bộ lọc
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommonSearchAndFilter;
