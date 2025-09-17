// Commission calculation types for agents

export interface CommissionRule {
  id: string;
  name: string;
  description: string;
  agentType: 'level1' | 'level2' | 'level3' | 'retail';
  territoryType?: 'province' | 'district' | 'ward';
  territoryIds?: string[];
  
  // Base commission
  baseRate: number; // Percentage
  
  // Tiered commission based on sales volume
  tiers: CommissionTier[];
  
  // Bonus conditions
  bonuses: CommissionBonus[];
  
  // Penalties
  penalties: CommissionPenalty[];
  
  // Time-based rules
  effectiveDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  
  // Priority (higher number = higher priority)
  priority: number;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CommissionTier {
  id: string;
  ruleId: string;
  minAmount: number;
  maxAmount?: number;
  rate: number; // Percentage
  description: string;
}

export interface CommissionBonus {
  id: string;
  ruleId: string;
  type: 'sales_target' | 'customer_growth' | 'territory_expansion' | 'quality_score' | 'loyalty' | 'seasonal';
  condition: string;
  value: number; // Amount or percentage
  isPercentage: boolean;
  maxAmount?: number;
  description: string;
  isActive: boolean;
}

export interface CommissionPenalty {
  id: string;
  ruleId: string;
  type: 'late_payment' | 'complaint_rate' | 'return_rate' | 'territory_violation' | 'contract_breach';
  condition: string;
  value: number; // Amount or percentage
  isPercentage: boolean;
  description: string;
  isActive: boolean;
}

export interface CommissionCalculation {
  id: string;
  agentId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  
  // Sales data
  totalSales: number;
  totalTickets: number;
  averageTicketPrice: number;
  
  // Commission calculation
  baseCommission: number;
  tierCommission: number;
  bonusCommission: number;
  penaltyAmount: number;
  totalCommission: number;
  
  // Applied rules
  appliedRules: string[];
  appliedBonuses: string[];
  appliedPenalties: string[];
  
  // Breakdown
  breakdown: CommissionBreakdown[];
  
  // Status
  status: 'calculated' | 'reviewed' | 'approved' | 'paid' | 'disputed';
  calculatedAt: Date;
  reviewedAt?: Date;
  approvedAt?: Date;
  paidAt?: Date;
  reviewedBy?: string;
  approvedBy?: string;
  notes?: string;
}

export interface CommissionBreakdown {
  id: string;
  calculationId: string;
  type: 'base' | 'tier' | 'bonus' | 'penalty';
  description: string;
  amount: number;
  rate?: number;
  appliedRule?: string;
  details?: string;
}

export interface CommissionPayment {
  id: string;
  calculationId: string;
  agentId: string;
  amount: number;
  paymentMethod: 'bank_transfer' | 'cash' | 'check' | 'credit';
  paymentDate: Date;
  reference: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  processedBy: string;
  notes?: string;
}

export interface CommissionDispute {
  id: string;
  calculationId: string;
  agentId: string;
  reason: string;
  disputedAmount: number;
  requestedAmount: number;
  status: 'open' | 'under_review' | 'resolved' | 'rejected';
  submittedAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string;
  resolution?: string;
  supportingDocuments?: string[];
}

export interface CommissionReport {
  id: string;
  period: string;
  startDate: Date;
  endDate: Date;
  totalCommission: number;
  totalPayments: number;
  totalDisputes: number;
  agentCount: number;
  averageCommission: number;
  topPerformers: {
    agentId: string;
    commission: number;
  }[];
  breakdown: {
    baseCommission: number;
    tierCommission: number;
    bonusCommission: number;
    penaltyAmount: number;
  };
  trends: {
    period: string;
    totalCommission: number;
    agentCount: number;
  }[];
}

export interface CommissionAnalytics {
  agentId: string;
  period: string;
  totalCommission: number;
  averageCommission: number;
  commissionGrowth: number;
  rank: number;
  percentile: number;
  topBonuses: {
    type: string;
    amount: number;
    count: number;
  }[];
  penalties: {
    type: string;
    amount: number;
    count: number;
  }[];
  recommendations: string[];
}
