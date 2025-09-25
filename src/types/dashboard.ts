// Dashboard types
export interface DashboardStats {
  title: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ReactNode;
  color?: string;
  bgColor?: string;
}

export interface DashboardActivity {
  id: string | number;
  title: string;
  description: string;
  time: string;
  type: 'success' | 'warning' | 'error' | 'info';
  avatar?: string;
  color?: string;
}

export interface DashboardChart {
  name: string;
  value: number;
  color?: string;
}

export interface DashboardRevenue {
  date: string;
  revenue: number;
  ticketsSold: number;
  transactions: number;
}

export interface DashboardTopItem {
  id: string;
  name: string;
  revenue: number;
  ticketsSold: number;
  growth: number;
}

export interface DashboardTransaction {
  id: string;
  type: string;
  amount: number;
  partnerName: string;
  stationName: string;
  createdAt: string;
  status: string;
}

export interface DashboardInventoryStatus {
  totalItems: number;
  lowStockItems: number;
  outOfStockItems: number;
  totalValue: number;
}

export interface DashboardSystemHealth {
  uptime: number;
  activeUsers: number;
  systemLoad: number;
  errorRate: number;
}

export interface DashboardFilters {
  startDate?: string;
  endDate?: string;
  partnerId?: string;
  stationId?: string;
}

// Chart data types for visualization
export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface LineChartData {
  name: string;
  data: Array<{
    x: string;
    y: number;
  }>;
  color?: string;
}

export interface BarChartData {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  percentage: number;
  color?: string;
}

// Dashboard component props
export interface StatsCardProps {
  stat: DashboardStats;
  loading?: boolean;
}

export interface ActivityListProps {
  activities: DashboardActivity[];
  loading?: boolean;
  maxItems?: number;
}

export interface ChartCardProps {
  title: string;
  data: ChartDataPoint[];
  loading?: boolean;
  height?: number;
  type?: 'line' | 'bar' | 'pie' | 'area';
}

export interface TopItemsListProps {
  title: string;
  items: DashboardTopItem[];
  loading?: boolean;
  maxItems?: number;
  showGrowth?: boolean;
}

export interface RecentTransactionsProps {
  transactions: DashboardTransaction[];
  loading?: boolean;
  maxItems?: number;
}

export interface SystemHealthProps {
  health: DashboardSystemHealth;
  loading?: boolean;
}

export interface DashboardFiltersProps {
  filters: DashboardFilters;
  onFiltersChange: (filters: DashboardFilters) => void;
  loading?: boolean;
}
