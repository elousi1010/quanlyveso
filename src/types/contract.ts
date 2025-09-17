// Contract management types for agents

export interface AgentContract {
  id: string;
  agentId: string;
  contractNumber: string;
  contractType: 'exclusive' | 'non-exclusive' | 'temporary';
  startDate: Date;
  endDate: Date;
  renewalDate?: Date;
  status: 'active' | 'expired' | 'terminated' | 'pending';
  
  // Contract terms
  commissionRate: number;
  creditLimit: number;
  territory: string[]; // Province IDs
  minimumSalesTarget: number;
  paymentTerms: number; // Days
  
  // Legal information
  legalRepresentative: string;
  businessLicense: string;
  taxCode: string;
  
  // Documents
  documents: ContractDocument[];
  
  // Terms and conditions
  terms: string;
  specialConditions?: string;
  
  // Audit
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  lastModifiedBy: string;
}

export interface ContractDocument {
  id: string;
  contractId: string;
  name: string;
  type: 'contract' | 'license' | 'certificate' | 'other';
  filePath: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ContractRenewal {
  id: string;
  contractId: string;
  renewalDate: Date;
  newEndDate: Date;
  changes: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
}

export interface ContractViolation {
  id: string;
  contractId: string;
  violationType: 'payment_delay' | 'territory_violation' | 'sales_target' | 'other';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  occurredAt: Date;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  resolution?: string;
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface ContractPerformance {
  contractId: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  salesTarget: number;
  actualSales: number;
  achievementRate: number;
  commissionEarned: number;
  violations: number;
  performanceScore: number; // 0-100
}
