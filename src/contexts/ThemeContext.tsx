import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline, type Theme } from '@mui/material';

interface ThemeContextType {
  mode: 'light' | 'dark';
  toggleMode: () => void;
  theme: Theme;
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

  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#1976d2' : '#90caf9',
        light: mode === 'light' ? '#42a5f5' : '#bbdefb',
        dark: mode === 'light' ? '#1565c0' : '#5c6bc0',
        contrastText: mode === 'light' ? '#fff' : '#000',
      },
      secondary: {
        main: mode === 'light' ? '#dc004e' : '#f48fb1',
        light: mode === 'light' ? '#ff5983' : '#ffc1e3',
        dark: mode === 'light' ? '#9a0036' : '#bf5f82',
        contrastText: mode === 'light' ? '#fff' : '#000',
      },
      background: {
        default: mode === 'light' ? '#fafafa' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
      text: {
        primary: mode === 'light' ? '#212121' : '#ffffff',
        secondary: mode === 'light' ? '#757575' : '#b0b0b0',
      },
      divider: mode === 'light' ? '#e0e0e0' : '#424242',
      grey: {
        50: mode === 'light' ? '#fafafa' : '#212121',
        100: mode === 'light' ? '#f5f5f5' : '#424242',
        200: mode === 'light' ? '#eeeeee' : '#616161',
        300: mode === 'light' ? '#e0e0e0' : '#757575',
        400: mode === 'light' ? '#bdbdbd' : '#9e9e9e',
        500: mode === 'light' ? '#9e9e9e' : '#bdbdbd',
        600: mode === 'light' ? '#757575' : '#e0e0e0',
        700: mode === 'light' ? '#616161' : '#eeeeee',
        800: mode === 'light' ? '#424242' : '#f5f5f5',
        900: mode === 'light' ? '#212121' : '#fafafa',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.8125rem',
        lineHeight: 1.6,
      },
      button: {
        fontSize: '0.875rem',
        fontWeight: 500,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: mode === 'light' 
      ? [
          'none',
          '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)',
          '0px 3px 6px rgba(0, 0, 0, 0.16), 0px 3px 6px rgba(0, 0, 0, 0.23)',
          '0px 10px 20px rgba(0, 0, 0, 0.19), 0px 6px 6px rgba(0, 0, 0, 0.23)',
          '0px 14px 28px rgba(0, 0, 0, 0.25), 0px 10px 10px rgba(0, 0, 0, 0.22)',
          '0px 19px 38px rgba(0, 0, 0, 0.30), 0px 15px 12px rgba(0, 0, 0, 0.22)',
          '0px 24px 48px rgba(0, 0, 0, 0.35), 0px 20px 16px rgba(0, 0, 0, 0.24)',
          '0px 29px 58px rgba(0, 0, 0, 0.40), 0px 25px 20px rgba(0, 0, 0, 0.26)',
          '0px 34px 68px rgba(0, 0, 0, 0.45), 0px 30px 24px rgba(0, 0, 0, 0.28)',
          '0px 39px 78px rgba(0, 0, 0, 0.50), 0px 35px 28px rgba(0, 0, 0, 0.30)',
          '0px 44px 88px rgba(0, 0, 0, 0.55), 0px 40px 32px rgba(0, 0, 0, 0.32)',
          '0px 49px 98px rgba(0, 0, 0, 0.60), 0px 45px 36px rgba(0, 0, 0, 0.34)',
          '0px 54px 108px rgba(0, 0, 0, 0.65), 0px 50px 40px rgba(0, 0, 0, 0.36)',
          '0px 59px 118px rgba(0, 0, 0, 0.70), 0px 55px 44px rgba(0, 0, 0, 0.38)',
          '0px 64px 128px rgba(0, 0, 0, 0.75), 0px 60px 48px rgba(0, 0, 0, 0.40)',
          '0px 69px 138px rgba(0, 0, 0, 0.80), 0px 65px 52px rgba(0, 0, 0, 0.42)',
          '0px 74px 148px rgba(0, 0, 0, 0.85), 0px 70px 56px rgba(0, 0, 0, 0.44)',
          '0px 79px 158px rgba(0, 0, 0, 0.90), 0px 75px 60px rgba(0, 0, 0, 0.46)',
          '0px 84px 168px rgba(0, 0, 0, 0.95), 0px 80px 64px rgba(0, 0, 0, 0.48)',
          '0px 89px 178px rgba(0, 0, 0, 1.00), 0px 85px 68px rgba(0, 0, 0, 0.50)',
          '0px 94px 188px rgba(0, 0, 0, 1.00), 0px 90px 72px rgba(0, 0, 0, 0.52)',
          '0px 99px 198px rgba(0, 0, 0, 1.00), 0px 95px 76px rgba(0, 0, 0, 0.54)',
          '0px 104px 208px rgba(0, 0, 0, 1.00), 0px 100px 80px rgba(0, 0, 0, 0.56)',
          '0px 109px 218px rgba(0, 0, 0, 1.00), 0px 105px 84px rgba(0, 0, 0, 0.58)',
          '0px 114px 228px rgba(0, 0, 0, 1.00), 0px 110px 88px rgba(0, 0, 0, 0.60)',
        ]
      : [
          'none',
          '0px 1px 3px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          '0px 3px 6px rgba(0, 0, 0, 0.6), 0px 3px 6px rgba(0, 0, 0, 0.4)',
          '0px 10px 20px rgba(0, 0, 0, 0.7), 0px 6px 6px rgba(0, 0, 0, 0.5)',
          '0px 14px 28px rgba(0, 0, 0, 0.8), 0px 10px 10px rgba(0, 0, 0, 0.6)',
          '0px 19px 38px rgba(0, 0, 0, 0.9), 0px 15px 12px rgba(0, 0, 0, 0.7)',
          '0px 24px 48px rgba(0, 0, 0, 1.0), 0px 20px 16px rgba(0, 0, 0, 0.8)',
          '0px 29px 58px rgba(0, 0, 0, 1.0), 0px 25px 20px rgba(0, 0, 0, 0.9)',
          '0px 34px 68px rgba(0, 0, 0, 1.0), 0px 30px 24px rgba(0, 0, 0, 1.0)',
          '0px 39px 78px rgba(0, 0, 0, 1.0), 0px 35px 28px rgba(0, 0, 0, 1.0)',
          '0px 44px 88px rgba(0, 0, 0, 1.0), 0px 40px 32px rgba(0, 0, 0, 1.0)',
          '0px 49px 98px rgba(0, 0, 0, 1.0), 0px 45px 36px rgba(0, 0, 0, 1.0)',
          '0px 54px 108px rgba(0, 0, 0, 1.0), 0px 50px 40px rgba(0, 0, 0, 1.0)',
          '0px 59px 118px rgba(0, 0, 0, 1.0), 0px 55px 44px rgba(0, 0, 0, 1.0)',
          '0px 64px 128px rgba(0, 0, 0, 1.0), 0px 60px 48px rgba(0, 0, 0, 1.0)',
          '0px 69px 138px rgba(0, 0, 0, 1.0), 0px 65px 52px rgba(0, 0, 0, 1.0)',
          '0px 74px 148px rgba(0, 0, 0, 1.0), 0px 70px 56px rgba(0, 0, 0, 1.0)',
          '0px 79px 158px rgba(0, 0, 0, 1.0), 0px 75px 60px rgba(0, 0, 0, 1.0)',
          '0px 84px 168px rgba(0, 0, 0, 1.0), 0px 80px 64px rgba(0, 0, 0, 1.0)',
          '0px 89px 178px rgba(0, 0, 0, 1.0), 0px 85px 68px rgba(0, 0, 0, 1.0)',
          '0px 94px 188px rgba(0, 0, 0, 1.0), 0px 90px 72px rgba(0, 0, 0, 1.0)',
          '0px 99px 198px rgba(0, 0, 0, 1.0), 0px 95px 76px rgba(0, 0, 0, 1.0)',
          '0px 104px 208px rgba(0, 0, 0, 1.0), 0px 100px 80px rgba(0, 0, 0, 1.0)',
          '0px 109px 218px rgba(0, 0, 0, 1.0), 0px 105px 84px rgba(0, 0, 0, 1.0)',
          '0px 114px 228px rgba(0, 0, 0, 1.0), 0px 110px 88px rgba(0, 0, 0, 1.0)',
        ],
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 500,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: mode === 'light' 
                ? '0px 2px 4px rgba(0, 0, 0, 0.1)' 
                : '0px 2px 4px rgba(255, 255, 255, 0.1)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: mode === 'light' 
              ? '0px 1px 3px rgba(0, 0, 0, 0.12), 0px 1px 2px rgba(0, 0, 0, 0.24)'
              : '0px 1px 3px rgba(0, 0, 0, 0.5), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 8,
            },
          },
        },
      },
    },
  });

  const value = {
    mode,
    toggleMode,
    theme,
  };

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
