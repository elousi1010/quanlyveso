import React, { useState } from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton, Paper } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';
import { USER_ROLES, USER_STATUS_OPTIONS, USER_SORT_OPTIONS } from '../constants';

interface UserSearchAndFilterProps {
  onSearch: (query: string) => void;
  onSort: (sortBy: string) => void;
  onFilter: (filters: Record<string, string>) => void;
  onRefresh: () => void;
  loading: boolean;
}

const UserSearchAndFilter: React.FC<UserSearchAndFilterProps> = ({
  onSearch,
  onSort,
  onFilter,
  onRefresh,
  loading,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const handleSearch = () => {
    onSearch(searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleSort = () => {
    onSort(sortBy);
  };

  const handleFilterChange = () => {
    const filters: Record<string, string> = {};
    if (roleFilter) filters.role = roleFilter;
    if (statusFilter) filters.status = statusFilter;
    onFilter(filters);
  };

  const handleRefresh = () => {
    onRefresh();
  };

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
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
        {/* Search Input */}
        <TextField
          placeholder="Tìm kiếm người dùng..."
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
            {USER_SORT_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Role Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Vai trò</InputLabel>
          <Select
            value={roleFilter}
            label="Vai trò"
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {USER_ROLES.map((role) => (
              <MenuItem key={role.value} value={role.value}>
                {role.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Status Filter */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={statusFilter}
            label="Trạng thái"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {USER_STATUS_OPTIONS.map((status) => (
              <MenuItem key={status.value} value={status.value}>
                {status.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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
          <Button
            variant="outlined"
            startIcon={<ArrowUpwardIcon />}
            onClick={handleSort}
            disabled={loading}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Sắp xếp
          </Button>
          <Button
            variant="outlined"
            startIcon={<ClearIcon />}
            onClick={handleRefresh}
            disabled={loading}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Làm mới
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default UserSearchAndFilter;