// Agent performance management types

export interface AgentPerformance {
  agentId: string;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  startDate: Date;
  endDate: Date;
  
  // Sales metrics
  ticketsSold: number;
  revenue: number;
  targetRevenue: number;
  achievementRate: number; // Percentage of target achieved
  
  // Financial metrics
  cost: number;
  profit: number;
  profitMargin: number;
  commissionEarned: number;
  
  // Performance indicators
  averageTicketPrice: number;
  salesGrowth: number; // Compared to previous period
  customerRetention: number; // Percentage
  
  // Territory performance
  territoryCoverage: number; // Percentage of assigned territory covered
  newCustomers: number;
  returningCustomers: number;
  
  // Quality metrics
  complaintRate: number; // Complaints per 1000 tickets
  returnRate: number; // Returned tickets percentage
  onTimeDelivery: number; // Percentage
  
  // Overall score
  performanceScore: number; // 0-100
  ranking: number; // Among all agents
  status: 'excellent' | 'good' | 'average' | 'below_average' | 'poor';
}

export interface PerformanceTarget {
  id: string;
  agentId: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  year: number;
  month?: number;
  quarter?: number;
  
  // Sales targets
  revenueTarget: number;
  ticketTarget: number;
  profitTarget: number;
  
  // Quality targets
  maxComplaintRate: number;
  maxReturnRate: number;
  minOnTimeDelivery: number;
  
  // Growth targets
  salesGrowthTarget: number;
  customerGrowthTarget: number;
  
  // Status
  status: 'active' | 'achieved' | 'not_achieved' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface PerformanceReward {
  id: string;
  agentId: string;
  period: string;
  rewardType: 'bonus' | 'commission_bonus' | 'gift' | 'recognition' | 'promotion';
  amount?: number;
  description: string;
  criteria: string;
  awardedAt: Date;
  awardedBy: string;
  status: 'pending' | 'approved' | 'paid' | 'cancelled';
}

export interface PerformanceReview {
  id: string;
  agentId: string;
  reviewPeriod: string;
  reviewerId: string;
  reviewDate: Date;
  
  // Scores (1-5 scale)
  salesPerformance: number;
  customerService: number;
  teamwork: number;
  reliability: number;
  innovation: number;
  
  // Overall assessment
  overallScore: number;
  strengths: string[];
  areasForImprovement: string[];
  goals: string[];
  
  // Comments
  managerComments: string;
  agentComments?: string;
  
  // Status
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  nextReviewDate: Date;
}

export interface PerformanceComparison {
  agentId: string;
  currentPeriod: AgentPerformance;
  previousPeriod: AgentPerformance;
  yearOverYear: {
    revenueGrowth: number;
    profitGrowth: number;
    ticketGrowth: number;
  };
  peerComparison: {
    rank: number;
    totalAgents: number;
    percentile: number;
  };
}

export interface PerformanceAlert {
  id: string;
  agentId: string;
  alertType: 'target_missed' | 'performance_drop' | 'excellent_performance' | 'complaint_spike' | 'low_activity';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  threshold: number;
  actualValue: number;
  createdAt: Date;
  status: 'active' | 'acknowledged' | 'resolved';
  resolvedAt?: Date;
  resolvedBy?: string;
}

export interface PerformanceDashboard {
  agentId: string;
  currentScore: number;
  trend: 'up' | 'down' | 'stable';
  keyMetrics: {
    revenue: number;
    profit: number;
    ticketsSold: number;
    customerSatisfaction: number;
  };
  achievements: string[];
  challenges: string[];
  recommendations: string[];
  nextReviewDate: Date;
}
