'use client';

import { useState, useCallback, useEffect } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { JsonUploadBox } from '@/components/json-merge/json-upload-box';
import { JsonViewer } from '@/components/json-merge/json-viewer';
import { DownloadButton } from '@/components/json-merge/download-button';
import { ErrorList } from '@/components/json-merge/error-display';
import { 
  UploadedFile, 
  JsonMergeState, 
  JsonMergeError 
} from '@/types/json-merge';
import { 
  validateStructure, 
  mergeJsonFiles, 
  generateMergeFilename,
  getValidationSummary
} from '@/lib/json-merger';

export default function JsonMergePage() {
  const [state, setState] = useState<JsonMergeState>({
    files: [],
    mergedJson: null,
    isValidating: false,
    isMerging: false,
    isDownloading: false,
    errors: [],
    validationStatus: 'pending',
    mergeType: null,
  });

  // File handling
  const handleFilesSelected = useCallback((newFiles: UploadedFile[]) => {
    setState(prev => ({
      ...prev,
      files: newFiles,
      validationStatus: 'pending',
      mergedJson: null,
      errors: prev.errors.filter(e => e.type !== 'upload')
    }));
  }, []);

  const handleFileRemove = useCallback((fileId: string) => {
    setState(prev => ({
      ...prev,
      files: prev.files.filter(f => f.id !== fileId),
      validationStatus: 'pending',
      mergedJson: null
    }));
  }, []);

  // Validation
  const validateFiles = useCallback(() => {
    if (state.files.length === 0) {
      setState(prev => ({ ...prev, validationStatus: 'pending' }));
      return;
    }

    setState(prev => ({ ...prev, isValidating: true }));

    const validationResult = validateStructure(state.files);
    
    setState(prev => ({
      ...prev,
      isValidating: false,
      validationStatus: validationResult.isValid ? 'valid' : 'invalid',
      mergeType: validationResult.mergeType || null,
      errors: validationResult.isValid 
        ? prev.errors.filter(e => e.type !== 'validation')
        : [
            ...prev.errors.filter(e => e.type !== 'validation'),
            {
              type: 'validation',
              message: validationResult.error || 'Validation failed'
            }
          ]
    }));
  }, [state.files]);

  // Merge files
  const handleMerge = useCallback(async () => {
    if (state.validationStatus !== 'valid' || !state.mergeType) return;

    setState(prev => ({ ...prev, isMerging: true }));

    // Add a small delay to ensure loading state is visible
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      const mergeResult = mergeJsonFiles(state.files, {
        type: state.mergeType!,
        resolveConflicts: true,
        preserveOrder: true
      });

      setState(prev => ({
        ...prev,
        isMerging: false,
        mergedJson: mergeResult.success ? mergeResult.data : null,
        errors: mergeResult.success
          ? prev.errors.filter(e => e.type !== 'merge')
          : [
              ...prev.errors.filter(e => e.type !== 'merge'),
              {
                type: 'merge',
                message: mergeResult.error || 'Merge failed'
              }
            ]
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isMerging: false,
        errors: [
          ...prev.errors.filter(e => e.type !== 'merge'),
          {
            type: 'merge',
            message: error instanceof Error ? error.message : 'Merge failed'
          }
        ]
      }));
    }
  }, [state.files, state.validationStatus, state.mergeType]);

  // Error handling
  const handleDismissError = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      errors: prev.errors.filter((_, i) => i !== index)
    }));
  }, []);

  const handleDismissAllErrors = useCallback(() => {
    setState(prev => ({ ...prev, errors: [] }));
  }, []);

  // Download handling
  const handleDownloadStart = useCallback(() => {
    setState(prev => ({ ...prev, isDownloading: true }));
  }, []);

  const handleDownloadComplete = useCallback(() => {
    setState(prev => ({ ...prev, isDownloading: false }));
  }, []);

  const handleDownloadError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      isDownloading: false,
      errors: [
        ...prev.errors,
        {
          type: 'download',
          message: error
        }
      ]
    }));
  }, []);

  // Clear all data
  const handleClearAll = useCallback(() => {
    setState({
      files: [],
      mergedJson: null,
      isValidating: false,
      isMerging: false,
      isDownloading: false,
      errors: [],
      validationStatus: 'pending',
      mergeType: null,
    });
  }, []);

  // Auto-validate when files change
  useEffect(() => {
    const timer = setTimeout(() => {
      validateFiles();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [validateFiles]);

  // Remove auto-merge - user must click merge button manually

  const canMerge = state.validationStatus === 'valid' && state.files.length >= 2;
  const validFiles = state.files.filter(f => f.isValid);
  const filename = state.mergeType ? generateMergeFilename(validFiles, state.mergeType) : 'merged.json';

  return (
    <PageContainer className="bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-secondary py-16 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0">
            <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-secondary-light border border-border rounded-full text-sm text-foreground-muted mb-8">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              JSON Merge Tool
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Merge JSON Files
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Effortlessly
              </span>
            </h1>
            
            <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">
              Upload multiple JSON files and merge them into a single, unified file.
              Fast, secure, and processed locally in your browser.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground-muted">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No file size limits
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Privacy focused
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-success" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Instant processing
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {/* Upload Section */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Upload Files</h2>
                  <p className="text-foreground-muted">
                    Select or drag and drop your JSON files. Files must have the same structure to be merged.
                  </p>
                </div>
                
                <JsonUploadBox
                  files={state.files}
                  onFilesSelected={handleFilesSelected}
                  onFileRemove={handleFileRemove}
                  isProcessing={state.isValidating || state.isMerging}
                  error={state.errors.find(e => e.type === 'upload')}
                />
                
                {/* Validation Status */}
                {state.files.length > 0 && (
                  <div className="bg-secondary border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-foreground">Structure Validation</h3>
                      {state.isValidating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      ) : state.validationStatus === 'valid' ? (
                        <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : state.validationStatus === 'invalid' ? (
                        <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : null}
                    </div>
                    
                    {!state.isValidating && (() => {
                      const validationSummary = getValidationSummary(state.files);
                      return (
                        <div className="space-y-3">
                          <div className={`text-sm font-medium ${
                            validationSummary.isCompatible ? 'text-success' : 'text-error'
                          }`}>
                            {validationSummary.summary}
                          </div>
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-foreground-muted">Total files:</span>
                              <span className="text-foreground">{state.files.length}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-foreground-muted">Valid JSON files:</span>
                              <span className="text-foreground">{validFiles.length}</span>
                            </div>
                            {state.mergeType && (
                              <div className="flex justify-between">
                                <span className="text-foreground-muted">Merge type:</span>
                                <span className="text-foreground capitalize">{state.mergeType}</span>
                              </div>
                            )}
                          </div>
                          
                          {validationSummary.details.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="text-xs font-medium text-foreground-muted mb-2">Validation Details:</div>
                              <div className="space-y-1">
                                {validationSummary.details.map((detail, index) => (
                                  <div key={index} className="text-xs text-foreground-muted flex items-start gap-2">
                                    <span className="text-foreground-muted">•</span>
                                    <span className="flex-1">{detail}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                
                {/* Actions */}
                {canMerge && (
                  <div className="flex gap-3">
                    <button
                      onClick={handleMerge}
                      disabled={state.isMerging || !canMerge}
                      className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                    >
                      {state.isMerging ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Merging...</span>
                        </div>
                      ) : (
                        'Merge Files'
                      )}
                    </button>
                    
                    <button
                      onClick={handleClearAll}
                      className="px-6 py-3 border border-border hover:border-error text-foreground-muted hover:text-error rounded-xl font-semibold transition-all duration-300 hover:bg-error/5"
                    >
                      Clear All
                    </button>
                  </div>
                )}
              </div>

              {/* Loading Animation */}
              {state.isMerging && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4">Merging Files</h2>
                    <p className="text-foreground-muted">
                      Please wait while we merge your JSON files...
                    </p>
                  </div>
                  
                  <div className="bg-secondary border border-border rounded-2xl p-8">
                    <div className="flex flex-col items-center space-y-6">
                      {/* Animated merge icon */}
                      <div className="relative">
                        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                          <svg className="w-8 h-8 text-primary animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        
                        {/* Rotating border */}
                        <div className="absolute inset-0 rounded-2xl border-2 border-primary/20 border-t-primary animate-spin"></div>
                      </div>
                      
                      {/* Status text */}
                      <div className="text-center">
                        <p className="text-lg text-foreground animate-pulse">
                          Processing {state.files.length} file{state.files.length === 1 ? '' : 's'}...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Results Section */}
              {state.mergedJson && !state.isMerging && (
                <div className="space-y-6 animate-fade-in">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                      <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Merge Complete
                    </h2>
                    <p className="text-foreground-muted">
                      Your JSON files have been successfully merged. You can copy or download the result.
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <JsonViewer
                      jsonData={state.mergedJson}
                    />
                    
                    <div className="flex gap-3">
                      <DownloadButton
                        jsonData={state.mergedJson}
                        filename={filename}
                        onDownloadStart={handleDownloadStart}
                        onDownloadComplete={handleDownloadComplete}
                        onDownloadError={handleDownloadError}
                        disabled={state.isDownloading}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Errors */}
        {state.errors.length > 0 && (
          <section className="py-6 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <ErrorList
                errors={state.errors}
                onDismiss={handleDismissError}
                onDismissAll={handleDismissAllErrors}
              />
            </div>
          </section>
        )}
    </PageContainer>
  );
}