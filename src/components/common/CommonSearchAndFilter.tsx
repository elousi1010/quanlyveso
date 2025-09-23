import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton, Paper } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, ArrowUpward as ArrowUpwardIcon, Refresh as RefreshIcon } from '@mui/icons-material';

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
  loading?: boolean;
}

const CommonSearchAndFilter: React.FC<CommonSearchAndFilterProps> = ({
  config,
  onSearch,
  onSort,
  onFilter,
  loading = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState(config?.sortOptions?.[0]?.value || '');
  const [filters, setFilters] = useState<Record<string, string>>({});

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


  return (
    <Paper 
      elevation={0}
      sx={{ 
        p: 2, 
        mb: 0, 
        background: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: 2
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search Input */}
        <TextField
          placeholder={config?.searchPlaceholder || 'Tìm kiếm...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchQuery && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* Sort By */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={sortBy}
            label="Sắp xếp theo"
            onChange={(e) => setSortBy(e.target.value)}
          >
            {config?.sortOptions?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Dynamic Filters */}
        {config?.filterOptions?.map((filter) => (
          <FormControl key={filter.key} size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{filter.label}</InputLabel>
            <Select
              value={filters[filter.key] || ''}
              label={filter.label}
              onChange={(e) => handleFilterChange(filter.key, e.target.value)}
            >
              <MenuItem value="">Tất cả</MenuItem>
              {filter.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ))}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<SearchIcon />}
            onClick={handleSearch}
            disabled={loading}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Tìm kiếm
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CommonSearchAndFilter;
