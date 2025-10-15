
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { colors } from './utils/constants';
import { Button } from './components/atoms/Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center" 
          style={{ backgroundColor: colors.background }}
        >
          <div 
            className="bg-white rounded-lg border p-8 max-w-md" 
            style={{ borderColor: colors.grey200 }}
          >
            <AlertCircle 
              size={48} 
              style={{ color: colors.error }} 
              className="mx-auto mb-4" 
            />
            <h2 
              className="text-xl font-semibold mb-2 text-center" 
              style={{ color: colors.text }}
            >
              Something went wrong
            </h2>
            <p 
              className="text-sm text-center mb-4" 
              style={{ color: colors.grey600 }}
            >
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              style={{ width: '100%' }}
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
