import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get all module directories
const modulesDir = path.join(__dirname, '..', 'pages');
const modules = fs.readdirSync(modulesDir).filter(dir => {
  const fullPath = path.join(modulesDir, dir);
  return fs.statSync(fullPath).isDirectory() && dir !== 'Dashboard' && dir !== 'Unauthorized';
});

console.log('🔍 Found modules:', modules);

// Function to update search and filter components
function updateSearchAndFilterComponent(moduleName) {
  const componentPath = path.join(modulesDir, moduleName, 'components', `${moduleName}SearchAndFilter.tsx`);
  
  if (!fs.existsSync(componentPath)) {
    console.log(`❌ ${moduleName}SearchAndFilter.tsx not found`);
    return;
  }

  let content = fs.readFileSync(componentPath, 'utf8');
  
  // Add filter state management
  if (!content.includes('const [filters, setFilters] = useState({})')) {
    const useStateImport = content.includes('useState') ? '' : ', { useState }';
    content = content.replace(
      /import React(.*?)from 'react';/,
      `import React${useStateImport} from 'react';`
    );
    
    // Add filter state after existing state
    const stateMatch = content.match(/(const \[.*?\] = useState\([^)]+\);)/g);
    if (stateMatch) {
      const lastState = stateMatch[stateMatch.length - 1];
      content = content.replace(
        lastState,
        `${lastState}\n  const [filters, setFilters] = useState({});`
      );
    } else {
      // Add after component declaration
      content = content.replace(
        /const \w+SearchAndFilter[^{]*{/,
        `const ${moduleName}SearchAndFilter = () => {\n  const [filters, setFilters] = useState({});`
      );
    }
  }

  // Add filter handlers
  if (!content.includes('handleFilterChange')) {
    const handlersCode = `
  const handleFilterChange = (filterKey, value) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleApplyFilters = () => {
    onSearchChange({ ...searchParams, ...filters });
  };`;

    // Add handlers before return statement
    content = content.replace(/(\s+return\s+\()/, `${handlersCode}\n$1`);
  }

  // Add filter UI components
  if (!content.includes('Filter Controls')) {
    const filterUI = `
        {/* Filter Controls */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            Bộ lọc
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Tìm kiếm"
                value={searchParams.search || ''}
                onChange={(e) => setSearchParams(prev => ({ ...prev, search: e.target.value }))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  value={filters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  label="Trạng thái"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="active">Hoạt động</MenuItem>
                  <MenuItem value="inactive">Không hoạt động</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại</InputLabel>
                <Select
                  value={filters.type || ''}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  label="Loại"
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="individual">Cá nhân</MenuItem>
                  <MenuItem value="company">Công ty</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  variant="contained"
                  onClick={handleApplyFilters}
                  size="small"
                >
                  Áp dụng
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleClearFilters}
                  size="small"
                >
                  Xóa bộ lọc
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>`;

    // Add filter UI before existing search controls
    content = content.replace(
      /(\s+\{\/\* Search Controls \*\/\})/,
      `${filterUI}\n$1`
    );
  }

  // Add required imports
  if (!content.includes('FormControl')) {
    content = content.replace(
      /import { ([^}]+) } from '@mui\/material';/,
      `import { $1, FormControl, InputLabel, Select, MenuItem, Box, Typography, Grid } from '@mui/material';`
    );
  }

  fs.writeFileSync(componentPath, content);
  console.log(`✅ Updated ${moduleName}SearchAndFilter.tsx`);
}

// Function to update management components
function updateManagementComponent(moduleName) {
  const managementPath = path.join(modulesDir, moduleName, `${moduleName}Management.tsx`);
  
  if (!fs.existsSync(managementPath)) {
    console.log(`❌ ${moduleName}Management.tsx not found`);
    return;
  }

  let content = fs.readFileSync(managementPath, 'utf8');
  
  // Add filter state
  if (!content.includes('const [filters, setFilters] = useState({})')) {
    content = content.replace(
      /const \[searchParams, setSearchParams\] = useState\({}\);/,
      `const [searchParams, setSearchParams] = useState({});
  const [filters, setFilters] = useState({});`
    );
  }

  // Update search change handler to include filters
  if (!content.includes('handleSearchChange')) {
    const searchHandler = `
  const handleSearchChange = (newSearchParams) => {
    setSearchParams(newSearchParams);
    resetPagination();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    const combinedParams = { ...searchParams, ...newFilters };
    setSearchParams(combinedParams);
    resetPagination();
  };`;

    content = content.replace(
      /const handleSearchChange = \([^)]+\) => {[^}]+};/,
      searchHandler
    );
  }

  // Update search component props
  content = content.replace(
    /onSearchChange={handleSearchChange}/,
    `onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        filters={filters}`
  );

  fs.writeFileSync(managementPath, content);
  console.log(`✅ Updated ${moduleName}Management.tsx`);
}

// Function to update search config
function updateSearchConfig(moduleName) {
  const configPath = path.join(modulesDir, moduleName, 'constants', `${moduleName}SearchConfig.ts`);
  
  if (!fs.existsSync(configPath)) {
    console.log(`❌ ${moduleName}SearchConfig.ts not found`);
    return;
  }

  let content = fs.readFileSync(configPath, 'utf8');
  
  // Add filter fields to search config
  if (!content.includes('filterFields')) {
    const filterFields = `
export const filterFields = [
  {
    key: 'status',
    label: 'Trạng thái',
    type: 'select',
    options: [
      { value: '', label: 'Tất cả' },
      { value: 'active', label: 'Hoạt động' },
      { value: 'inactive', label: 'Không hoạt động' },
    ],
  },
  {
    key: 'type',
    label: 'Loại',
    type: 'select',
    options: [
      { value: '', label: 'Tất cả' },
      { value: 'individual', label: 'Cá nhân' },
      { value: 'company', label: 'Công ty' },
    ],
  },
  {
    key: 'dateRange',
    label: 'Khoảng thời gian',
    type: 'dateRange',
  },
];`;

    content += filterFields;
  }

  fs.writeFileSync(configPath, content);
  console.log(`✅ Updated ${moduleName}SearchConfig.ts`);
}

// Apply to all modules
modules.forEach(moduleName => {
  console.log(`\n🔄 Processing ${moduleName}...`);
  
  try {
    updateSearchAndFilterComponent(moduleName);
    updateManagementComponent(moduleName);
    updateSearchConfig(moduleName);
    console.log(`✅ ${moduleName} completed`);
  } catch (error) {
    console.log(`❌ Error processing ${moduleName}:`, error.message);
  }
});

console.log('\n🎉 Filter functionality applied to all modules!');
