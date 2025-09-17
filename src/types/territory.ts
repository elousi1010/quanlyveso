// Territory management types for agents

export interface Territory {
  id: string;
  name: string;
  code: string;
  type: 'province' | 'district' | 'ward' | 'custom';
  parentId?: string; // For hierarchical territories
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  boundaries?: GeoPoint[];
  area: number; // in square kilometers
  population?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface AgentTerritory {
  id: string;
  agentId: string;
  territoryId: string;
  territoryType: 'primary' | 'secondary' | 'exclusive' | 'shared';
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  assignedBy: string;
  assignedAt: Date;
  notes?: string;
}

export interface TerritoryConflict {
  id: string;
  territoryId: string;
  agentIds: string[];
  conflictType: 'overlap' | 'exclusive_violation' | 'boundary_dispute';
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  reportedBy: string;
  reportedAt: Date;
  resolvedBy?: string;
  resolvedAt?: Date;
  resolution?: string;
}

export interface TerritoryPerformance {
  territoryId: string;
  agentId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  
  // Sales metrics
  ticketsSold: number;
  revenue: number;
  newCustomers: number;
  returningCustomers: number;
  
  // Coverage metrics
  coveragePercentage: number;
  visitsCount: number;
  averageVisitDuration: number; // in minutes
  
  // Market penetration
  marketShare: number; // Percentage of total market
  competitorCount: number;
  
  // Quality metrics
  customerSatisfaction: number; // 1-5 scale
  complaintCount: number;
  returnRate: number;
  
  // Overall performance
  performanceScore: number; // 0-100
  ranking: number; // Among agents in same territory
}

export interface TerritoryMap {
  id: string;
  name: string;
  type: 'province' | 'district' | 'ward';
  svgPath: string; // SVG path for map rendering
  center: GeoPoint;
  zoom: number;
  isActive: boolean;
}

export interface TerritoryAssignment {
  id: string;
  agentId: string;
  territoryIds: string[];
  assignmentType: 'new' | 'transfer' | 'expansion' | 'reduction';
  reason: string;
  effectiveDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  requestedBy: string;
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
}

export interface TerritoryAnalytics {
  territoryId: string;
  period: string;
  totalAgents: number;
  totalRevenue: number;
  totalTicketsSold: number;
  averagePerformance: number;
  marketGrowth: number;
  topPerformingAgent: string;
  challenges: string[];
  opportunities: string[];
  recommendations: string[];
}

export interface TerritoryRestriction {
  id: string;
  territoryId: string;
  restrictionType: 'agent_limit' | 'revenue_cap' | 'ticket_limit' | 'time_restriction';
  value: number;
  unit?: string; // 'agents', 'vnđ', 'tickets', 'hours'
  description: string;
  isActive: boolean;
  startDate: Date;
  endDate?: Date;
  createdBy: string;
  createdAt: Date;
}
