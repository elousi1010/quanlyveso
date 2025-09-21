export interface FormField {
  key: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'json';
  required?: boolean;
  options?: Array<{ value: string | number; label: string }>;
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
}

export interface DetailField {
  key: string;
  label: string;
  chip?: {
    color: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' | 'default';
    variant?: 'filled' | 'outlined';
  };
  render?: (value: unknown, item: Record<string, unknown>) => React.ReactNode;
  hideIfEmpty?: boolean;
}

export interface DialogFieldConfig<T = Record<string, unknown>> extends FormField {
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
  onCreate: () => void;
  onRefresh: () => void;
  selectedCount?: number;
  onDeleteSelected?: () => void;
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
