'use client';

import { useState, useCallback } from 'react';

interface JsonViewerProps {
  jsonData: any;
  maxHeight?: string;
}

export function JsonViewer({ 
  jsonData, 
  maxHeight = '600px'
}: JsonViewerProps) {
  const [copySuccess, setCopySuccess] = useState(false);

  const formatJson = useCallback((data: any) => {
    if (!data) return '';
    
    try {
      return JSON.stringify(data, null, 2); // Always pretty format
    } catch (error) {
      return 'Error formatting JSON';
    }
  }, []);

  const analyzeJsonData = useCallback((data: any) => {
    if (!data) return { itemCount: 0, totalSize: 0, dataType: 'unknown' };

    const jsonString = JSON.stringify(data);
    const totalSize = new Blob([jsonString]).size;

    if (Array.isArray(data)) {
      return {
        itemCount: data.length,
        totalSize,
        dataType: 'array'
      };
    } else if (typeof data === 'object' && data !== null) {
      const keys = Object.keys(data);
      return {
        itemCount: keys.length,
        totalSize,
        dataType: 'object'
      };
    } else {
      return {
        itemCount: 1,
        totalSize,
        dataType: typeof data
      };
    }
  }, []);

  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      const text = formatJson(jsonData);
      await navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  }, [jsonData, formatJson]);

  const jsonString = formatJson(jsonData);
  const lineCount = jsonString.split('\n').length;
  const { itemCount, totalSize, dataType } = analyzeJsonData(jsonData);

  return (
    <div className="bg-secondary border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-secondary-light border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-foreground">Merged JSON</h3>
          <div className="flex items-center gap-4 text-sm text-foreground-muted">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              {itemCount} {dataType === 'array' ? 'items' : dataType === 'object' ? 'properties' : 'element'}
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {formatFileSize(totalSize)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Copy Button */}
          <button
            onClick={handleCopy}
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
        style={{ maxHeight }}
      >
        <table className="w-full border-collapse">
          <tbody>
            {jsonString.split('\n').map((line, index) => (
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
  );
}

// Add syntax highlighting styles to globals.css
const syntaxHighlightStyles = `
  .syntax-highlight {
    color: var(--foreground);
  }
  
  .syntax-highlight .token.string {
    color: var(--color-accent);
  }
  
  .syntax-highlight .token.number {
    color: var(--color-warning);
  }
  
  .syntax-highlight .token.boolean {
    color: var(--color-primary);
  }
  
  .syntax-highlight .token.null {
    color: var(--color-error);
  }
  
  .syntax-highlight .token.key {
    color: var(--color-primary);
  }
`;