import React, { ReactNode } from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Define the props for the ErrorFallback component
const ErrorFallback: React.FC<FallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

// Define the props for the ErrorBoundaryWrapper component
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({ children }) => {
  // Cast `ErrorBoundary` to `React.ComponentType` to ensure proper JSX usage
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const TypedErrorBoundary = ErrorBoundary as unknown as React.ComponentType<any>;

  return (
    <TypedErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset logic can be added here if necessary
      }}
    >
      {children}
    </TypedErrorBoundary>
  );
};

export default ErrorBoundaryWrapper;
