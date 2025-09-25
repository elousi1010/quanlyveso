import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Autocomplete,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { stationApi } from '@/pages/Stations/api';
import type { Station } from '@/pages/Stations/types';

export interface StationSelectorProps {
  value: string | null;
  onChange: (value: string | null, item: Station | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  width?: number | string;
}

const StationSelector: React.FC<StationSelectorProps> = React.memo(({
  value,
  onChange,
  placeholder = 'Chọn trạm',
  disabled = false,
  error = false,
  helperText,
  width = '100%',
}) => {
  const [options, setOptions] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const hasLoadedRef = useRef(false);

  // Load stations data on mount
  useEffect(() => {
    if (hasLoadedRef.current) return; // Đã load rồi thì không load nữa
    
    const loadStations = async () => {

      hasLoadedRef.current = true;
      setLoading(true);
      try {
        const response = await stationApi.getAll({ 
          page: 1, 
          limit: 5
        });
        setOptions(response.data?.data || []);
      } catch (error) {
        console.error('Error loading stations:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadStations();
  }, []); // Chỉ chạy 1 lần khi component mount

  // Search stations when searchKey changes
  useEffect(() => {
    if (searchKey.trim() === '') return; // Không search khi empty

    const searchStations = async () => {
      setLoading(true);
      try {
        const response = await stationApi.getAll({ 
          page: 1, 
          limit: 5,
          searchKey: searchKey
        });
        setOptions(response.data?.data || []);
      } catch (error) {
        console.error('Error searching stations:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchStations, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [searchKey]);

  const getDisplayName = (item: Station): string => {
    if (!item) return '';
    return item.name || item.id || '';
  };

  const selectedItem = Array.isArray(options) ? options.find((item: Station) => item.id === value) || null : null;

  return (
    <Autocomplete
      value={selectedItem}
      onChange={(event, newValue) => {
        if (newValue) {
          onChange(newValue.id, newValue);
        } else {
          onChange(null, null);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setSearchKey(newInputValue);
      }}
      options={Array.isArray(options) ? options : []}
      getOptionLabel={getDisplayName}
      loading={loading}
      disabled={disabled}
      sx={{ width }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={placeholder}
          error={error}
          helperText={helperText}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <>
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
                {params.InputProps.startAdornment}
              </>
            ),
          }}
        />
      )}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box component="li" key={key} {...otherProps}>
            <Typography 
              variant="body2" 
              sx={{ 
                fontWeight: 500, 
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                py: 0.5
              }}
            >
              {getDisplayName(option)}
            </Typography>
          </Box>
        );
      }}
      noOptionsText={
        loading ? "Đang tải..." :
        !Array.isArray(options) || options.length === 0 ? "Không có dữ liệu" : 
        "Không tìm thấy kết quả"
      }
      loadingText="Đang tải..."
    />
  );
});

StationSelector.displayName = 'StationSelector';

export default StationSelector;