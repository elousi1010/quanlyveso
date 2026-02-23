import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { Alert, Button, Typography, Result, theme as antdTheme } from 'antd';

const { Paragraph, Text } = Typography;

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
        <div style={{ padding: '48px', minHeight: '400px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Result
            status="error"
            title="Đã xảy ra lỗi"
            subTitle={import.meta.env.DEV ? this.state.error?.message : 'Có lỗi không mong muốn xảy ra'}
            extra={[
              <Button type="primary" key="retry" onClick={() => this.setState({ hasError: false, error: undefined })}>
                Thử lại
              </Button>,
            ]}
          >
            {import.meta.env.DEV && this.state.error?.stack && (
              <div style={{ textAlign: 'left', marginTop: '24px' }}>
                <Paragraph>
                  <Text strong>Chi tiết lỗi (Chế độ Development):</Text>
                </Paragraph>
                <div style={{
                  backgroundColor: '#f5f5f5',
                  padding: '16px',
                  borderRadius: '4px',
                  overflow: 'auto',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  maxHeight: '300px'
                }}>
                  <pre>{this.state.error.stack}</pre>
                </div>
              </div>
            )}
          </Result>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
export default ErrorBoundary;
