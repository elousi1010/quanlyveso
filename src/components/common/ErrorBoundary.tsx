import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, Box, Button, Typography } from '@mui/material';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="400px"
          p={3}
        >
          <Alert severity="error" sx={{ mb: 2, maxWidth: 600 }}>
            <Typography variant="h6" gutterBottom>
              Đã xảy ra lỗi
            </Typography>
            <Typography variant="body2" gutterBottom>
              {import.meta.env.DEV ? this.state.error?.message : 'Có lỗi không mong muốn xảy ra'}
            </Typography>
            {import.meta.env.DEV && this.state.error?.stack && (
              <Box component="pre" sx={{ mt: 2, fontSize: '0.75rem', overflow: 'auto' }}>
                {this.state.error.stack}
              </Box>
            )}
          </Alert>
          <Button
            variant="contained"
            onClick={() => this.setState({ hasError: false, error: undefined })}
          >
            Thử lại
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;
