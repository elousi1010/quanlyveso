// Credit and debt management types for agents

export interface CreditProfile {
  agentId: string;
  creditLimit: number;
  currentDebt: number;
  availableCredit: number;
  creditScore: number; // 0-1000
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  lastAssessment: Date;
  paymentHistory: PaymentRecord[];
  creditHistory: CreditEvent[];
}

export interface PaymentRecord {
  id: string;
  agentId: string;
  amount: number;
  type: 'payment' | 'credit' | 'debit' | 'refund';
  description: string;
  date: Date;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference: string;
  method: 'cash' | 'bank_transfer' | 'check' | 'other';
  processedBy: string;
  notes?: string;
}

export interface CreditEvent {
  id: string;
  agentId: string;
  eventType: 'credit_increase' | 'credit_decrease' | 'payment_made' | 'payment_missed' | 'overdue' | 'default';
  amount: number;
  description: string;
  date: Date;
  impact: 'positive' | 'negative' | 'neutral';
  processedBy: string;
}

export interface DebtSummary {
  agentId: string;
  totalDebt: number;
  currentDebt: number;
  overdueDebt: number;
  daysOverdue: number;
  lastPaymentDate?: Date;
  nextPaymentDue?: Date;
  paymentFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
  averagePaymentAmount: number;
  paymentReliability: number; // 0-100
}

export interface CreditLimitAdjustment {
  id: string;
  agentId: string;
  oldLimit: number;
  newLimit: number;
  reason: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: Date;
  processedAt?: Date;
  effectiveDate?: Date;
}

export interface PaymentPlan {
  id: string;
  agentId: string;
  totalAmount: number;
  remainingAmount: number;
  installmentAmount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'defaulted' | 'cancelled';
  nextPaymentDate: Date;
  missedPayments: number;
  createdBy: string;
  notes?: string;
}

export interface CreditAlert {
  id: string;
  agentId: string;
  alertType: 'overdue_payment' | 'credit_limit_exceeded' | 'payment_missed' | 'credit_score_drop' | 'high_risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface CreditReport {
  agentId: string;
  reportDate: Date;
  creditScore: number;
  riskLevel: string;
  totalDebt: number;
  availableCredit: number;
  paymentHistory: {
    onTime: number;
    late: number;
    missed: number;
  };
  recommendations: string[];
  nextReviewDate: Date;
}
