import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import './App.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import ErrorBoundary from './components/common/ErrorBoundary';
import AppRoutes from './components/Routing/AppRoutes';
import { ThemeProvider } from './contexts/ThemeContext';
import { useTokenRefresh } from './hooks/useTokenRefresh';
import './utils/tokenTestHelper'; // Load token test helper
import 'dayjs/locale/vi';

// Tạo QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

// App content component with token refresh
const AppContent: React.FC = () => {
  useTokenRefresh();
  return <AppRoutes />;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Router>
            <AppContent />
          </Router>
        </ThemeProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;