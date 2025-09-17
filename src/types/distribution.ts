// Ticket distribution management types

export interface TicketDistribution {
  id: string;
  agentId: string;
  provinceId: string;
  ticketType: 'regular' | 'special' | 'vip';
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  distributionDate: Date;
  expectedDeliveryDate: Date;
  actualDeliveryDate?: Date;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  trackingNumber?: string;
  notes?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DistributionRequest {
  id: string;
  agentId: string;
  provinceId: string;
  ticketType: 'regular' | 'special' | 'vip';
  requestedQuantity: number;
  requestedDate: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  approvedBy?: string;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryLevel {
  id: string;
  provinceId: string;
  ticketType: 'regular' | 'special' | 'vip';
  totalQuantity: number;
  availableQuantity: number;
  reservedQuantity: number;
  distributedQuantity: number;
  lastUpdated: Date;
  reorderLevel: number;
  maxLevel: number;
}

export interface DistributionSchedule {
  id: string;
  agentId: string;
  provinceId: string;
  scheduleType: 'daily' | 'weekly' | 'monthly' | 'custom';
  dayOfWeek?: number; // 0-6 for weekly
  dayOfMonth?: number; // 1-31 for monthly
  time: string; // HH:MM format
  quantity: number;
  ticketType: 'regular' | 'special' | 'vip';
  isActive: boolean;
  nextDelivery: Date;
  lastDelivery?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface DistributionHistory {
  id: string;
  distributionId: string;
  agentId: string;
  action: 'created' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'modified';
  description: string;
  performedBy: string;
  performedAt: Date;
  metadata?: Record<string, any>;
}

export interface DistributionAnalytics {
  agentId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  
  // Distribution metrics
  totalDistributed: number;
  totalValue: number;
  averageOrderSize: number;
  onTimeDeliveryRate: number;
  
  // Performance metrics
  fulfillmentRate: number;
  returnRate: number;
  cancellationRate: number;
  
  // Trends
  distributionTrend: 'increasing' | 'decreasing' | 'stable';
  growthRate: number;
  
  // Top performing
  topProvinces: {
    provinceId: string;
    quantity: number;
    value: number;
  }[];
  
  // Issues
  commonIssues: {
    issue: string;
    count: number;
    impact: 'low' | 'medium' | 'high';
  }[];
}

export interface DistributionAlert {
  id: string;
  type: 'low_inventory' | 'overdue_delivery' | 'high_return_rate' | 'distribution_delay' | 'agent_request';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  agentId?: string;
  provinceId?: string;
  distributionId?: string;
  isActive: boolean;
  createdAt: Date;
  acknowledgedAt?: Date;
  acknowledgedBy?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface DistributionReport {
  id: string;
  reportType: 'inventory' | 'distribution' | 'performance' | 'analytics';
  period: string;
  generatedAt: Date;
  generatedBy: string;
  data: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
  status: 'generating' | 'ready' | 'failed';
  downloadUrl?: string;
}
