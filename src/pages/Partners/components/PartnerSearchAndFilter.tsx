import React from 'react';
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, InputAdornment, IconButton, Paper } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, ArrowUpward as ArrowUpwardIcon } from '@mui/icons-material';

interface PartnerSearchAndFilterProps {
  searchKey: string;
  onSearchKeyChange: (value: string) => void;
  onSearch: () => void;
  onClearSearch: () => void;
  sortBy: string;
  onSortByChange: (value: string) => void;
  onSort: () => void;
}

const PartnerSearchAndFilter: React.FC<PartnerSearchAndFilterProps> = ({
  searchKey,
  onSearchKeyChange,
  onSearch,
  onClearSearch,
  sortBy,
  onSortByChange,
  onSort,
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
      <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
        <TextField
          placeholder="Tìm kiếm đối tác..."
          value={searchKey}
          onChange={(e) => onSearchKeyChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch()}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18 }} />
              </InputAdornment>
            ),
            endAdornment: searchKey && (
              <InputAdornment position="end">
                <IconButton onClick={onClearSearch} size="small">
                  <ClearIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ 
            minWidth: 250,
            flex: 1
          }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Sắp xếp theo</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            label="Sắp xếp theo"
          >
            <MenuItem value="name">Tên</MenuItem>
            <MenuItem value="created_at">Ngày tạo</MenuItem>
            <MenuItem value="type">Loại</MenuItem>
            <MenuItem value="level">Cấp độ</MenuItem>
            <MenuItem value="debt">Nợ</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="outlined"
          onClick={onSearch}
          startIcon={<SearchIcon />}
          size="small"
          sx={{ 
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Tìm kiếm
        </Button>
        <Button
          variant="outlined"
          onClick={onSort}
          startIcon={<ArrowUpwardIcon />}
          size="small"
          sx={{ 
            textTransform: 'none',
            fontWeight: 500
          }}
        >
          Sắp xếp
        </Button>
      </Box>
    </Paper>
  );
};

export default PartnerSearchAndFilter;
