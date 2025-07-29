'use client';

import { JsonMergeError } from '@/types/json-merge';

interface ErrorDisplayProps {
  error: JsonMergeError;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({ error, onDismiss, className = '' }: ErrorDisplayProps) {
  const getErrorIcon = (type: JsonMergeError['type']) => {
    switch (type) {
      case 'validation':
        return (
          <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'merge':
        return (
          <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'download':
        return (
          <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        );
      case 'upload':
        return (
          <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getErrorStyles = (type: JsonMergeError['type']) => {
    switch (type) {
      case 'validation':
        return 'bg-warning/10 border-warning/20 text-warning';
      case 'merge':
        return 'bg-error/10 border-error/20 text-error';
      case 'download':
        return 'bg-error/10 border-error/20 text-error';
      case 'upload':
        return 'bg-error/10 border-error/20 text-error';
      default:
        return 'bg-error/10 border-error/20 text-error';
    }
  };

  const getErrorTitle = (type: JsonMergeError['type']) => {
    switch (type) {
      case 'validation':
        return 'Validation Error';
      case 'merge':
        return 'Merge Error';
      case 'download':
        return 'Download Error';
      case 'upload':
        return 'Upload Error';
      default:
        return 'Error';
    }
  };

  return (
    <div className={`
      border rounded-lg p-4 animate-fade-in ${getErrorStyles(error.type)} ${className}
    `}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {getErrorIcon(error.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm mb-1">
            {getErrorTitle(error.type)}
          </h4>
          <p className="text-sm opacity-90">
            {error.message}
          </p>
          
          {error.file && (
            <p className="text-xs opacity-75 mt-1">
              File: {error.file}
            </p>
          )}
          
          {error.details && (
            <details className="mt-2">
              <summary className="text-xs opacity-75 cursor-pointer hover:opacity-100">
                View details
              </summary>
              <div className="mt-1 p-2 bg-black/20 rounded text-xs font-mono opacity-75">
                {error.details}
              </div>
            </details>
          )}
        </div>
        
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-black/20 rounded transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

// Multiple errors display
interface ErrorListProps {
  errors: JsonMergeError[];
  onDismiss?: (index: number) => void;
  onDismissAll?: () => void;
  className?: string;
}

export function ErrorList({ errors, onDismiss, onDismissAll, className = '' }: ErrorListProps) {
  if (errors.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {errors.length > 1 && onDismissAll && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-foreground-muted">
            {errors.length} error{errors.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={onDismissAll}
            className="text-sm text-foreground-muted hover:text-foreground transition-colors"
          >
            Dismiss all
          </button>
        </div>
      )}
      
      {errors.map((error, index) => (
        <ErrorDisplay
          key={index}
          error={error}
          onDismiss={onDismiss ? () => onDismiss(index) : undefined}
        />
      ))}
    </div>
  );
}

// Inline error for form fields
export function InlineError({ message, className = '' }: { message: string; className?: string }) {
  return (
    <div className={`flex items-center gap-2 text-error text-sm ${className}`}>
      <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>{message}</span>
    </div>
  );
}