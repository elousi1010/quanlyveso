import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { useAuth } from './hooks/useAuth';
import LoginForm from './components/Auth/LoginForm';
import DashboardLayout from './components/Layout/DashboardLayout';
import Dashboard from './pages/Dashboard.tsx';
import ProfitCalculation from './pages/ProfitCalculation.tsx';
import TicketManagement from './pages/TicketManagement.tsx';
import DebtManagement from './pages/DebtManagement.tsx';
import ProvinceManagement from './pages/ProvinceManagement.tsx';
import SellerManagement from './pages/SellerManagement.tsx';
import ExchangeManagement from './pages/ExchangeManagement.tsx';
import TransactionManagement from './pages/TransactionManagement.tsx';
import EmployeeManagement from './pages/EmployeeManagement.tsx';
import PartnerManagement from './pages/PartnerManagement.tsx';
import ShiftManagement from './pages/ShiftManagement.tsx';
import DailySalesReport from './pages/DailySalesReport.tsx';
import TicketImport from './pages/TicketImport.tsx';
import Analytics from './pages/Analytics.tsx';
import FinancialManagement from './pages/FinancialManagement.tsx';
import ScratchTicketManagement from './pages/ScratchTicketManagement.tsx';
import BroadcasterManagement from './pages/BroadcasterManagement.tsx';
import AgentManagement from './pages/AgentManagement.tsx';
import PriceManagement from './pages/PriceManagement.tsx';
import NumberPairAnalysis from './pages/NumberPairAnalysis.tsx';
import ContractManagement from './pages/ContractManagement.tsx';
import CreditDebtManagement from './pages/CreditDebtManagement.tsx';
import AgentPerformanceManagement from './pages/AgentPerformanceManagement.tsx';
import TerritoryManagement from './pages/TerritoryManagement.tsx';
import CommissionManagement from './pages/CommissionManagement.tsx';
import AgentDashboard from './pages/AgentDashboard.tsx';
import TicketDistributionManagement from './pages/TicketDistributionManagement.tsx';
import AgentAnalytics from './pages/AgentAnalytics.tsx';
import RiskManagement from './pages/RiskManagement.tsx';
import AgentCommunication from './pages/AgentCommunication.tsx';
import 'dayjs/locale/vi';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const AppContent: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profit" element={<ProfitCalculation />} />
        <Route path="/tickets" element={<TicketManagement />} />
        <Route path="/debts" element={<DebtManagement />} />
        <Route path="/provinces" element={<ProvinceManagement />} />
        <Route path="/sellers" element={<SellerManagement />} />
        <Route path="/exchanges" element={<ExchangeManagement />} />
        <Route path="/transactions" element={<TransactionManagement />} />
        <Route path="/employees" element={<EmployeeManagement />} />
        <Route path="/partners" element={<PartnerManagement />} />
        <Route path="/shifts" element={<ShiftManagement />} />
        <Route path="/daily-sales" element={<DailySalesReport />} />
        <Route path="/ticket-import" element={<TicketImport />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/financial" element={<FinancialManagement />} />
        <Route path="/scratch-tickets" element={<ScratchTicketManagement />} />
        <Route path="/broadcasters" element={<BroadcasterManagement />} />
        <Route path="/agents" element={<AgentManagement />} />
        <Route path="/prices" element={<PriceManagement />} />
        <Route path="/number-analysis" element={<NumberPairAnalysis />} />
        <Route path="/contracts" element={<ContractManagement />} />
        <Route path="/credit-debt" element={<CreditDebtManagement />} />
        <Route path="/agent-performance" element={<AgentPerformanceManagement />} />
        <Route path="/territories" element={<TerritoryManagement />} />
        <Route path="/commissions" element={<CommissionManagement />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
        <Route path="/ticket-distribution" element={<TicketDistributionManagement />} />
        <Route path="/agent-analytics" element={<AgentAnalytics />} />
        <Route path="/risk-management" element={<RiskManagement />} />
        <Route path="/agent-communication" element={<AgentCommunication />} />
          </Routes>
    </DashboardLayout>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
        <AuthProvider>
          <Router>
            <AppContent />
          </Router>
        </AuthProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;