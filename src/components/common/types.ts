export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'json' | 'tel' | 'boolean' | 'custom';
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: number;
  fullWidth?: boolean;
  render?: (value: unknown, formData: Record<string, unknown>, handleFieldChange: (fieldKey: string, value: unknown) => void) => React.ReactNode;
}

export interface DetailField {
  key: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'currency' | 'date' | 'datetime' | 'boolean' | 'status' | 'array' | 'object' | 'custom';
  chip?: {
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
    variant?: 'filled' | 'outlined';
  };
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode;
  hideIfEmpty?: boolean;
  fullWidth?: boolean;
  statusConfig?: Record<string, {
    label: string;
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
    variant?: 'filled' | 'outlined';
  }>;
}

export interface DialogFieldConfig extends FormField {
  readonly?: boolean;
}

export interface SearchFieldConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: unknown) => React.ReactNode;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface CommonHeaderProps {
  title: string;
  subtitle?: string;
  onCreate: () => void;
  onRefresh?: () => void;
  createButtonText?: string;
  createButtonIcon?: React.ReactNode;
  refreshButtonText?: string;
  refreshButtonIcon?: React.ReactNode;
  loading?: boolean;
  onBulkEdit?: () => void;
  bulkEditButtonText?: string;
  bulkEditButtonIcon?: React.ReactNode;
  showBulkEdit?: boolean;
  selectedCount?: number;
  onDeleteSelected?: () => void;
  deleteButtonText?: string;
  deleteButtonIcon?: React.ReactNode;
  showDeleteSelected?: boolean;
  customActions?: React.ReactNode;
  showRefresh?: boolean;
}

export interface CommonSearchAndFilterProps {
  searchParams: Record<string, unknown>;
  onSearchChange: (params: Record<string, unknown>) => void;
  onReset: () => void;
}

export interface CommonDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName?: string;
  loading?: boolean;
}

export interface CommonDetailDialogProps {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  title: string;
  item: Record<string, unknown>;
  fields: DetailField[];
  avatar?: {
    src?: string;
    alt?: string;
  };
}
