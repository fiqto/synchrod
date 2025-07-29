'use client';

import { useState, useCallback } from 'react';

interface DownloadButtonProps {
  jsonData: any;
  filename?: string;
  disabled?: boolean;
  className?: string;
  onDownloadStart?: () => void;
  onDownloadComplete?: () => void;
  onDownloadError?: (error: string) => void;
}

export function DownloadButton({
  jsonData,
  filename = 'merged-json.json',
  disabled = false,
  className = '',
  onDownloadStart,
  onDownloadComplete,
  onDownloadError
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = useCallback(async () => {
    if (!jsonData || disabled || isDownloading) return;

    setIsDownloading(true);
    onDownloadStart?.();

    try {
      // Convert JSON to string
      const jsonString = JSON.stringify(jsonData, null, 2);
      
      // Create blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setDownloadSuccess(true);
      onDownloadComplete?.();
      
      // Reset success state after 2 seconds
      setTimeout(() => setDownloadSuccess(false), 2000);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download file';
      onDownloadError?.(errorMessage);
      console.error('Download error:', error);
    } finally {
      setIsDownloading(false);
    }
  }, [jsonData, filename, disabled, isDownloading, onDownloadStart, onDownloadComplete, onDownloadError]);

  const baseClasses = `
    flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold
    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-primary/50
  `;

  const variants = {
    primary: `
      bg-primary hover:bg-primary-hover text-white
      hover:shadow-lg hover:shadow-primary/25
    `,
    success: `
      bg-success hover:bg-success text-white
      hover:shadow-lg hover:shadow-success/25
    `
  };

  const currentVariant = downloadSuccess ? variants.success : variants.primary;

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || isDownloading || !jsonData}
      className={`${baseClasses} ${currentVariant} ${className}`}
    >
      {isDownloading ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Downloading...
        </>
      ) : downloadSuccess ? (
        <>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Downloaded!
        </>
      ) : (
        <>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download JSON
        </>
      )}
    </button>
  );
}

// Secondary variant for smaller contexts
export function DownloadButtonSecondary(props: DownloadButtonProps) {
  return (
    <DownloadButton
      {...props}
      className={`
        px-4 py-2 text-xs bg-secondary hover:bg-border text-foreground-muted hover:text-foreground
        border border-border hover:border-primary/50
        ${props.className || ''}
      `}
    />
  );
}