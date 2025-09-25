import React, { useState, useMemo } from 'react';
import {
  Box,
  Autocomplete,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import { useInfiniteUsers } from '@/hooks';
import {
  Search as SearchIcon,
} from '@mui/icons-material';
import type { User } from '@/pages/Users/types';

export interface UserSelectorProps {
  value: string | null;
  onChange: (value: string | null, item: User | null) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  width?: number | string;
}

const UserSelector: React.FC<UserSelectorProps> = React.memo(({
  value,
  onChange,
  placeholder = 'Chọn người dùng',
  disabled = false,
  error = false,
  helperText,
  width = '100%',
}) => {
  const [searchKey, setSearchKey] = useState('');
  const { data = [], isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteUsers({ searchKey });

  const handleSearch = (query: string) => {
    setSearchKey(query);
  };

  const handleMenuScroll = (event: React.UIEvent<HTMLUListElement>) => {
    const { target } = event;
    const element = target as HTMLUListElement;
    
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  const getDisplayName = (item: User): string => {
    if (!item) return '';
    return item.name || item.id || '';
  };

  const selectedItem = useMemo(() => {
    if (!value || !data || data.length === 0) return null;
    return data.find((item: User) => item.id === value) || null;
  }, [value, data]);

  const options = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data;
  }, [data]);

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
        handleSearch(newInputValue);
      }}
      options={options}
      getOptionLabel={getDisplayName}
      loading={isLoading}
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
      ListboxProps={{
        onScroll: handleMenuScroll,
        style: { maxHeight: 300 },
      }}
      noOptionsText={
        isError ? "Có lỗi khi tải dữ liệu" : 
        options.length === 0 ? "Không có dữ liệu" : 
        "Không tìm thấy kết quả"
      }
      loadingText="Đang tải..."
    />
  );
});

UserSelector.displayName = 'UserSelector';

export default UserSelector;
