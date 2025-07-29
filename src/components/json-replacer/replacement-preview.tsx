'use client';

import { useState, useMemo } from 'react';
import { PreviewItem } from '@/types/json-replacer';

interface ReplacementPreviewProps {
  previewItems: PreviewItem[];
  isLoading?: boolean;
  error?: string;
}

export function ReplacementPreview({
  previewItems,
  isLoading = false,
  error
}: ReplacementPreviewProps) {
  const [selectedPreview, setSelectedPreview] = useState<string | null>(null);
  const [showOnlyChanges, setShowOnlyChanges] = useState(false);

  const filteredItems = useMemo(() => {
    if (!showOnlyChanges) return previewItems;
    return previewItems.filter(item => item.matched && item.changes.length > 0);
  }, [previewItems, showOnlyChanges]);

  const statistics = useMemo(() => {
    const total = previewItems.length;
    const matched = previewItems.filter(item => item.matched).length;
    const unmatched = total - matched;
    const fieldsChanged = previewItems.reduce((sum, item) => sum + item.changes.length, 0);
    
    return { total, matched, unmatched, fieldsChanged };
  }, [previewItems]);

  const formatValue = (value: any, maxLength = 50) => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') {
      const truncated = value.length > maxLength ? value.substring(0, maxLength) + '...' : value;
      return `"${truncated}"`;
    }
    if (typeof value === 'object') {
      const str = JSON.stringify(value);
      return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
    }
    return String(value);
  };

  const getValueDiff = (original: any, modified: any, field: string) => {
    const originalValue = original[field];
    const modifiedValue = modified[field];
    
    if (originalValue === modifiedValue) return null;
    
    return {
      original: originalValue,
      modified: modifiedValue,
      isChanged: true
    };
  };

  if (isLoading) {
    return (
      <div className="bg-secondary border border-border rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-foreground-muted">Generating preview...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-error/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Preview Error</h3>
        <p className="text-error">{error}</p>
      </div>
    );
  }

  if (previewItems.length === 0) {
    return (
      <div className="bg-secondary border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-border rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Preview Available</h3>
        <p className="text-foreground-muted">Configure your mapping settings to see a preview of the transformation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Preview</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={showOnlyChanges}
              onChange={(e) => setShowOnlyChanges(e.target.checked)}
              className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary"
            />
            <span className="text-sm font-medium text-foreground">Show only changes</span>
          </label>
          <span className="text-sm text-foreground-muted">
            {filteredItems.length} of {previewItems.length} items
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-secondary border border-border rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{statistics.total}</div>
          <div className="text-sm text-foreground-muted">Total Items</div>
        </div>
        <div className="bg-success/10 border border-success/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-success">{statistics.matched}</div>
          <div className="text-sm text-foreground-muted">Matched</div>
        </div>
        <div className="bg-warning/10 border border-warning/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-warning">{statistics.unmatched}</div>
          <div className="text-sm text-foreground-muted">Unmatched</div>
        </div>
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">{statistics.fieldsChanged}</div>
          <div className="text-sm text-foreground-muted">Fields Changed</div>
        </div>
      </div>

      {/* Preview Items */}
      <div className="space-y-4">
        {filteredItems.map((item, index) => (
          <div key={item.id} className="bg-secondary border border-border rounded-xl overflow-hidden">
            <div 
              className="p-4 cursor-pointer hover:bg-secondary-light transition-colors"
              onClick={() => setSelectedPreview(selectedPreview === item.id ? null : item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.matched ? 'bg-success' : 'bg-warning'
                  }`}></div>
                  <span className="font-medium text-foreground">
                    Item {index + 1} {item.matched ? '' : '(No Match)'}
                  </span>
                  {item.changes.length > 0 && (
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded text-xs">
                      {item.changes.length} field{item.changes.length === 1 ? '' : 's'} changed
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.changes.length > 0 && (
                    <div className="flex gap-1">
                      {item.changes.slice(0, 3).map(field => (
                        <span key={field} className="text-xs bg-border text-foreground-muted px-2 py-1 rounded">
                          {field}
                        </span>
                      ))}
                      {item.changes.length > 3 && (
                        <span className="text-xs bg-border text-foreground-muted px-2 py-1 rounded">
                          +{item.changes.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                  <svg className={`w-4 h-4 text-foreground-muted transition-transform ${
                    selectedPreview === item.id ? 'rotate-180' : ''
                  }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {selectedPreview === item.id && (
              <div className="border-t border-border">
                <div className="p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Original */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-border rounded-full"></span>
                        Original
                      </h4>
                      <div className="bg-background border border-border rounded-lg p-3 space-y-2">
                        {Object.entries(item.original).map(([key, value]) => {
                          const diff = getValueDiff(item.original, item.modified, key);
                          return (
                            <div key={key} className="flex items-start gap-2">
                              <span className="text-sm font-medium text-foreground min-w-0 flex-shrink-0">
                                {key}:
                              </span>
                              <span className={`text-sm font-mono break-all ${
                                diff?.isChanged ? 'text-warning line-through' : 'text-foreground-muted'
                              }`}>
                                {formatValue(value)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Modified */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          item.matched ? 'bg-success' : 'bg-warning'
                        }`}></span>
                        Modified
                      </h4>
                      <div className="bg-background border border-border rounded-lg p-3 space-y-2">
                        {Object.entries(item.modified).map(([key, value]) => {
                          const diff = getValueDiff(item.original, item.modified, key);
                          const isNew = !(key in item.original);
                          const isChanged = diff?.isChanged;
                          
                          return (
                            <div key={key} className="flex items-start gap-2">
                              <span className="text-sm font-medium text-foreground min-w-0 flex-shrink-0">
                                {key}:
                              </span>
                              <span className={`text-sm font-mono break-all ${
                                isNew ? 'text-success' : 
                                isChanged ? 'text-primary' : 
                                'text-foreground-muted'
                              }`}>
                                {formatValue(value)}
                                {isNew && (
                                  <span className="text-xs bg-success/10 text-success px-1 py-0.5 rounded ml-2">
                                    NEW
                                  </span>
                                )}
                                {isChanged && !isNew && (
                                  <span className="text-xs bg-primary/10 text-primary px-1 py-0.5 rounded ml-2">
                                    CHANGED
                                  </span>
                                )}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Changes Summary */}
                  {item.changes.length > 0 && (
                    <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                      <h4 className="text-sm font-medium text-foreground mb-2">Changes Made:</h4>
                      <div className="flex flex-wrap gap-2">
                        {item.changes.map(field => (
                          <span key={field} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && showOnlyChanges && (
        <div className="bg-secondary border border-border rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-border rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No Changes to Show</h3>
          <p className="text-foreground-muted">
            No items have matching replacements. Check your configuration or try different matching keys.
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="bg-secondary border border-border rounded-lg p-4">
        <h4 className="text-sm font-medium text-foreground mb-3">Legend:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-foreground-muted">Matched items</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-warning rounded-full"></div>
            <span className="text-foreground-muted">Unmatched items</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">Blue text:</span>
            <span className="text-foreground-muted">Modified values</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-success">Green text:</span>
            <span className="text-foreground-muted">New fields</span>
          </div>
        </div>
      </div>
    </div>
  );
}