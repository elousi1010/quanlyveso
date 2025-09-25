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
  
  // Check if already has filter functionality
  if (content.includes('onFilterChange') && content.includes('filters')) {
    console.log(`✅ ${moduleName}SearchAndFilter.tsx already has filter functionality`);
    return;
  }

  // Add filter props to interface
  if (!content.includes('onFilterChange')) {
    content = content.replace(
      /interface \w+SearchAndFilterProps \{([^}]+)\}/,
      (match, props) => {
        if (!props.includes('onFilterChange')) {
          return `interface ${moduleName}SearchAndFilterProps {${props}
  onFilterChange?: (filters: Record<string, unknown>) => void;
  filters?: Record<string, unknown>;}`;
        }
        return match;
      }
    );
  }

  // Add useState import if not present
  if (!content.includes('useState')) {
    content = content.replace(
      /import React(.*?)from 'react';/,
      `import React, { useState }$1 from 'react';`
    );
  }

  // Add filter state and handlers
  if (!content.includes('const [localFilters, setLocalFilters]')) {
    const componentMatch = content.match(/const \w+SearchAndFilter[^{]*{/);
    if (componentMatch) {
      const insertPoint = componentMatch[0].length;
      const beforeProps = content.substring(0, insertPoint);
      const afterProps = content.substring(insertPoint);
      
      const filterCode = `
  const [localFilters, setLocalFilters] = useState(filters || {});

  const handleFilterChange = (newFilters: Record<string, unknown>) => {
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
    onSearchChange({ ...searchParams, ...newFilters });
  };

  const handleClearFilters = () => {
    setLocalFilters({});
    if (onFilterChange) {
      onFilterChange({});
    }
    onReset();
  };`;

      content = beforeProps + filterCode + afterProps;
    }
  }

  // Update CommonSearchAndFilter props
  content = content.replace(
    /onFilter=\{([^}]+)\}/,
    `onFilter={handleFilterChange}
      onClearFilters={handleClearFilters}
      filters={localFilters}`
  );

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
  
  // Check if already has filter functionality
  if (content.includes('const [filters, setFilters]')) {
    console.log(`✅ ${moduleName}Management.tsx already has filter functionality`);
    return;
  }

  // Add filter state
  content = content.replace(
    /const \[searchParams, setSearchParams\] = useState[^;]+;/,
    `const [searchParams, setSearchParams] = useState({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});`
  );

  // Add filter handlers
  const filterHandlers = `
  const handleFilterChange = useCallback((newFilters: Record<string, unknown>) => {
    setFilters(newFilters);
    const combinedParams = { ...searchParams, ...newFilters };
    setSearchParams(combinedParams);
    resetPagination();
  }, [searchParams, resetPagination]);`;

  // Insert after handleReset
  content = content.replace(
    /const handleReset = useCallback\([^}]+\);[^}]+};/,
    `const handleReset = useCallback(() => {
    setSearchParams({});
    setFilters({});
    resetPagination();
  }, [resetPagination]);${filterHandlers}`
  );

  // Update search component props
  const searchComponentPattern = new RegExp(
    `(<${moduleName}SearchAndFilter[^>]*onSearchChange=\\{[^}]+\\}[^>]*onReset=\\{[^}]+\\}[^>]*>)`,
    'g'
  );
  
  content = content.replace(
    searchComponentPattern,
    `$1
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
  
  // Check if already has filter options
  if (content.includes('filterOptions')) {
    console.log(`✅ ${moduleName}SearchConfig.ts already has filter options`);
    return;
  }

  // Add filter options to config
  const filterOptions = `
  filterOptions: [
    {
      key: 'status',
      label: 'Trạng thái',
      options: [
        { value: '', label: 'Tất cả' },
        { value: 'active', label: 'Hoạt động' },
        { value: 'inactive', label: 'Không hoạt động' },
      ],
    },
    {
      key: 'type',
      label: 'Loại',
      options: [
        { value: '', label: 'Tất cả' },
        { value: 'individual', label: 'Cá nhân' },
        { value: 'company', label: 'Công ty' },
      ],
    },
  ],`;

  // Add to config object
  content = content.replace(
    /sortOptions: [^,]+,\s*}/,
    `sortOptions: [/* sort options */],${filterOptions}
};`
  );

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
