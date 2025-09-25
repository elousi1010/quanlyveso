import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Autocomplete,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { partnerApi } from '@/pages/Partners/api';
import type { Partner } from '@/pages/Partners/types';

export interface PartnerSelectorProps {
  value: string | null;
  onChange: (value: string | null, item: Partner | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  width?: number | string;
}

const PartnerSelector: React.FC<PartnerSelectorProps> = React.memo(({
  value,
  onChange,
  placeholder = 'Chọn đối tác',
  disabled = false,
  error = false,
  helperText,
  width = '100%',
}) => {
  const [options, setOptions] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchKey, setSearchKey] = useState('');
  const hasLoadedRef = useRef(false);

  // Load partners data on mount
  useEffect(() => {
    if (hasLoadedRef.current) return; // Đã load rồi thì không load nữa
    
    const loadPartners = async () => {

      hasLoadedRef.current = true;
      setLoading(true);
      try {
        const response = await partnerApi.getPartners({ 
          page: 1, 
          limit: 5
        });
        setOptions(response.data?.data?.data || []);
      } catch (error) {
        console.error('Error loading partners:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    loadPartners();
  }, []); // Chỉ chạy 1 lần khi component mount

  // Search partners when searchKey changes
  useEffect(() => {
    if (searchKey.trim() === '') return; // Không search khi empty

    const searchPartners = async () => {
      setLoading(true);
      try {
        const response = await partnerApi.getPartners({ 
          page: 1, 
          limit: 100,
          searchKey: searchKey
        });
        setOptions(response.data?.data?.data || []);
      } catch (error) {
        console.error('Error searching partners:', error);
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchPartners, 300); // Debounce 300ms
    return () => clearTimeout(timeoutId);
  }, [searchKey]);

  const getDisplayName = (item: Partner): string => {
    if (!item) return '';
    return item.name || item.id || '';
  };

  const selectedItem = Array.isArray(options) ? options.find((item: Partner) => item.id === value) || null : null;

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

PartnerSelector.displayName = 'PartnerSelector';

export default PartnerSelector;
