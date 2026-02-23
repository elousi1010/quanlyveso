import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import vi_VN from 'antd/locale/vi_VN';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode') as 'light' | 'dark' | null;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleMode = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  const value = {
    mode,
    toggleMode,
  };

  return (
    <ThemeContext.Provider value={value}>
      <ConfigProvider
        locale={vi_VN}
        theme={{
          algorithm: mode === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: '#1976d2',
            borderRadius: 10,
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
          },
          components: {
            Card: {
              borderRadiusLG: 12,
            },
            Button: {
              borderRadius: 8,
              fontWeight: 500,
            },
            Input: {
              borderRadius: 8,
            },
            Select: {
              borderRadius: 8,
            }
          }
        }}
      >
        <div className={mode} style={{ minHeight: '100vh', background: mode === 'dark' ? '#0f172a' : '#f8fafc' }}>
          {children}
        </div>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
};
