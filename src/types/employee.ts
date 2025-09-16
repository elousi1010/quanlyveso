// Employee and shift management types

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  position: 'cashier' | 'manager' | 'supervisor';
  isActive: boolean;
  hireDate: Date;
  salary: number;
  commission: number; // Phần trăm hoa hồng
}

export interface Shift {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string;   // HH:mm format
  isActive: boolean;
}

export interface ShiftAssignment {
  id: string;
  employeeId: string;
  shiftId: string;
  date: Date;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface ShiftPerformance {
  id: string;
  employeeId: string;
  shiftId: string;
  date: Date;
  ticketsSold: number;
  revenue: number;
  cost: number;
  profit: number;
  startTime: Date;
  endTime: Date;
  notes?: string;
}

export interface ShiftComparison {
  currentShift: ShiftPerformance;
  previousShift?: ShiftPerformance;
  sameDayLastWeek?: ShiftPerformance;
  sameDayLastMonth?: ShiftPerformance;
  improvement: {
    ticketsSold: number;
    revenue: number;
    profit: number;
  };
}

export interface EmployeeStats {
  employeeId: string;
  totalShifts: number;
  totalTicketsSold: number;
  totalRevenue: number;
  totalProfit: number;
  averageTicketsPerShift: number;
  averageRevenuePerShift: number;
  averageProfitPerShift: number;
  bestShift: ShiftPerformance;
  worstShift: ShiftPerformance;
}
