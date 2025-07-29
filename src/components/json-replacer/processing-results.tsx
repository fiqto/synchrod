'use client';

import { useState } from 'react';
import { ReplacementResult } from '@/types/json-replacer';

interface ProcessingResultsProps {
  result: ReplacementResult;
  filename: string;
  onDownload: () => void;
  onReset: () => void;
}

export function ProcessingResults({
  result,
  filename,
  onDownload,
  onReset
}: ProcessingResultsProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatFileSize = (data: any) => {
    const str = JSON.stringify(data, null, 2);
    const bytes = new Blob([str]).size;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSuccessRate = () => {
    if (result.statistics.totalEntries === 0) return 0;
    return Math.round((result.statistics.matchedEntries / result.statistics.totalEntries) * 100);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(result.data, null, 2));
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  if (!result.success) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Processing Failed</h3>
        <p className="text-error mb-6">{result.error}</p>
        <button
          onClick={onReset}
          className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Processing Complete</h3>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm font-medium text-success">Success</span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{result.statistics.totalEntries}</div>
          <div className="text-sm text-foreground-muted">Total Entries</div>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{result.statistics.matchedEntries}</div>
          <div className="text-sm text-foreground-muted">Matched</div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{result.statistics.replacedFields}</div>
          <div className="text-sm text-foreground-muted">Fields Replaced</div>
        </div>
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-accent">{getSuccessRate()}%</div>
          <div className="text-sm text-foreground-muted">Success Rate</div>
        </div>
      </div>

      {/* Processing Summary */}
      <div className="bg-secondary border border-border rounded-xl p-6">
        <h4 className="text-base font-medium text-foreground mb-4">Processing Summary</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground-muted">Processing Time:</span>
              <span className="text-sm font-medium text-foreground">{formatTime(result.statistics.processingTime)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground-muted">File Size:</span>
              <span className="text-sm font-medium text-foreground">{formatFileSize(result.data)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground-muted">Filename:</span>
              <span className="text-sm font-medium text-foreground truncate" title={filename}>
                {filename}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground-muted">Matched Entries:</span>
              <span className="text-sm font-medium text-success">{result.statistics.matchedEntries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground-muted">Unmatched Entries:</span>
              <span className="text-sm font-medium text-warning">{result.statistics.unmatchedEntries}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-foreground-muted">Fields Replaced:</span>
              <span className="text-sm font-medium text-primary">{result.statistics.replacedFields}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-foreground-muted">Match Rate</span>
          <span className="text-foreground">{getSuccessRate()}%</span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-success h-2 rounded-full transition-all duration-500"
            style={{ width: `${getSuccessRate()}%` }}
          ></div>
        </div>
      </div>

      {/* JSON Viewer */}
      <div className="bg-secondary border border-border rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-secondary-light border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h4 className="text-lg font-semibold text-foreground">Processed JSON</h4>
            <div className="flex items-center gap-4 text-sm text-foreground-muted">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {Array.isArray(result.data) ? result.data.length : Object.keys(result.data || {}).length} {Array.isArray(result.data) ? 'items' : 'properties'}
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {formatFileSize(result.data)}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-3 py-1 text-sm bg-secondary hover:bg-border text-foreground-muted hover:text-foreground rounded-lg transition-all duration-200"
            >
              {copySuccess ? (
                <>
                  <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* JSON Content */}
        <div 
          className="relative overflow-auto json-viewer"
          style={{ maxHeight: '600px' }}
        >
          <table className="w-full border-collapse">
            <tbody>
              {JSON.stringify(result.data, null, 2).split('\n').map((line, index) => (
                <tr key={index}>
                  <td className="bg-secondary-light border-r border-border text-sm font-mono select-none w-12 text-right py-0 px-3 align-top">
                    <code className="text-foreground-muted">
                      {index + 1}
                    </code>
                  </td>
                  <td className="text-sm font-mono py-0 px-3 align-top">
                    <code className="syntax-highlight whitespace-pre text-foreground">
                      {line || '\u00A0'}
                    </code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download Action */}
      <button
        onClick={onDownload}
        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-primary hover:bg-primary-hover text-white transition-all duration-300 hover:shadow-lg hover:shadow-primary/25 focus:outline-none focus:ring-2 focus:ring-primary/50"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Download JSON
      </button>

      {/* Additional Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border">
        <button
          onClick={onReset}
          className="flex-1 bg-secondary hover:bg-secondary-light text-foreground border border-border px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Process New Files
        </button>
        
        <button
          onClick={() => window.location.href = '/json-merge'}
          className="flex-1 bg-accent/10 hover:bg-accent/20 text-accent border border-accent/20 px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Try JSON Merge
        </button>
      </div>

      {/* Performance Insights */}
      {result.statistics.processingTime > 1000 && (
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-warning">Performance Notice</span>
          </div>
          <p className="text-sm text-foreground-muted">
            Processing took longer than expected. Consider using smaller files or fewer field mappings for better performance.
          </p>
        </div>
      )}
    </div>
  );
}