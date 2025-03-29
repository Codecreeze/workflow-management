import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styles } from '../styles/ErrorBoundary.styles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// Global error handler setup function
export function setupGlobalErrorHandlers() {
  // Handle uncaught promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    // Optionally could show a notification or toast here
  });

  // Handle runtime errors
  window.addEventListener('error', (event) => {
    console.error('Runtime Error:', event.error);
    // Optionally could show a notification or toast here
  });
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  componentDidMount(): void {
    // Set up global error handlers when the ErrorBoundary mounts
    setupGlobalErrorHandlers();
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Box sx={styles.container}>
          <Typography variant="h4" color="error" gutterBottom sx={styles.title}>
            Something went wrong
          </Typography>
          <Typography variant="body1" sx={styles.message}>
            The application encountered an unexpected error. You can try to reset the component or return to the dashboard.
          </Typography>
          <Box sx={styles.buttonContainer}>
            <Button variant="contained" color="primary" onClick={this.handleReset}>
              Try Again
            </Button>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={() => window.location.href = '/dashboard'}
            >
              Go to Dashboard
            </Button>
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 