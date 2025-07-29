'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageContainer } from '@/components/layout/page-container';
import { DualUploadBox } from '@/components/json-replacer/dual-upload-box';
import { FieldSelector } from '@/components/json-replacer/field-selector';
import { MappingConfigurator } from '@/components/json-replacer/mapping-configurator';
import { ProcessingResults } from '@/components/json-replacer/processing-results';
import { WorkflowExample } from '@/components/json-replacer/json-example';
import { 
  JsonReplacerFile, 
  JsonReplacerState, 
  JsonReplacerError, 
  FieldMapping, 
  ReplacementConfig,
  ProcessingOptions 
} from '@/types/json-replacer';
import { 
  analyzeJsonStructure, 
  validateFiles, 
  processReplacement, 
  generatePreview, 
  validateReplacementConfig, 
  generateReplacementFilename,
  createDefaultFieldMappings
} from '@/lib/json-replacer';

export default function JsonReplacer() {
  const [state, setState] = useState<JsonReplacerState>({
    entriesFile: null,
    assetsFile: null,
    availableFields: [],
    assetFields: [],
    selectedFields: [],
    fieldSelectionConfirmed: false,
    fieldMappings: [],
    matchingKey: '',
    replacementKey: '',
    keepOriginalIds: false,
    autoRename: false,
    caseSensitive: false,
    keepUnmatched: true,
    processedJson: null,
    isProcessing: false,
    isValidating: false,
    showPreview: false,
    errors: [],
    validationStatus: 'pending',
    processingStatistics: {
      totalEntries: 0,
      matchedEntries: 0,
      unmatchedEntries: 0,
      replacedFields: 0,
      processingTime: 0
    }
  });

  const [currentStep, setCurrentStep] = useState<'upload' | 'select-fields' | 'configure' | 'results'>('upload');
  const [uploadConfirmed, setUploadConfirmed] = useState(false);
  const [fieldsConfirmed, setFieldsConfirmed] = useState(false);

  // Update state helper
  const updateState = useCallback((updates: Partial<JsonReplacerState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  // Add error helper
  const addError = useCallback((error: JsonReplacerError) => {
    setState(prev => ({
      ...prev,
      errors: [...prev.errors.filter(e => e.type !== error.type), error]
    }));
  }, []);

  // Clear errors helper
  const clearErrors = useCallback((type?: JsonReplacerError['type']) => {
    setState(prev => ({
      ...prev,
      errors: type ? prev.errors.filter(e => e.type !== type) : []
    }));
  }, []);

  // File upload handlers
  const handleEntriesFileSelected = useCallback(async (file: JsonReplacerFile) => {
    updateState({ entriesFile: file });
    clearErrors('upload');
    
    // Reset all confirmations when files change
    setUploadConfirmed(false);
    setFieldsConfirmed(false);
    
    if (file.isValid && file.content) {
      const fields = analyzeJsonStructure(file.content);
      updateState({ availableFields: fields });
    }
  }, [updateState, clearErrors]);

  const handleAssetsFileSelected = useCallback(async (file: JsonReplacerFile) => {
    updateState({ assetsFile: file });
    clearErrors('upload');
    
    // Reset all confirmations when files change
    setUploadConfirmed(false);
    setFieldsConfirmed(false);
    
    if (file.isValid && file.content) {
      const fields = analyzeJsonStructure(file.content);
      updateState({ assetFields: fields });
    }
  }, [updateState, clearErrors]);

  const handleFileRemove = useCallback((fileType: 'entries' | 'assets') => {
    if (fileType === 'entries') {
      updateState({ 
        entriesFile: null, 
        availableFields: [], 
        selectedFields: [],
        fieldSelectionConfirmed: false,
        fieldMappings: []
      });
    } else {
      updateState({ 
        assetsFile: null, 
        assetFields: [], 
        matchingKey: '',
        replacementKey: ''
      });
    }
    clearErrors();
  }, [updateState, clearErrors]);

  // Field selection handlers
  const handleFieldToggle = useCallback((fieldKey: string) => {
    setState(prev => {
      const newSelectedFields = prev.selectedFields.includes(fieldKey)
        ? prev.selectedFields.filter(f => f !== fieldKey)
        : [...prev.selectedFields, fieldKey];
      
      return {
        ...prev,
        selectedFields: newSelectedFields,
        fieldSelectionConfirmed: false
      };
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedFields: prev.availableFields.map(f => f.key),
      fieldSelectionConfirmed: false
    }));
  }, []);

  const handleDeselectAll = useCallback(() => {
    setState(prev => ({
      ...prev,
      selectedFields: [],
      fieldSelectionConfirmed: false
    }));
  }, []);

  const handleFieldSelectionConfirm = useCallback(() => {
    updateState({ fieldSelectionConfirmed: true });
    setFieldsConfirmed(false); // Reset when fields change
  }, [updateState]);

  // Configuration handlers
  const handleConfigChange = useCallback((config: ReplacementConfig) => {
    updateState({
      fieldMappings: config.fieldMappings,
      matchingKey: config.matchingKey,
      replacementKey: config.replacementKey,
      keepUnmatched: config.keepUnmatched,
      autoRename: config.autoRename,
      caseSensitive: config.caseSensitive
    });
  }, [updateState]);

  const handleUploadContinue = useCallback(() => {
    setUploadConfirmed(true);
  }, []);

  const handleFieldsContinue = useCallback(() => {
    setFieldsConfirmed(true);
  }, []);

  // Validate files when both are uploaded
  useEffect(() => {
    if (state.entriesFile && state.assetsFile) {
      updateState({ isValidating: true });
      
      const validation = validateFiles(state.entriesFile, state.assetsFile);
      
      if (validation.isValid) {
        updateState({
          validationStatus: 'valid',
          isValidating: false,
          availableFields: validation.entriesFields || [],
          assetFields: validation.assetsFields || [],
          matchingKey: validation.suggestedMatchingKey || ''
        });
        clearErrors('validation');
      } else {
        updateState({
          validationStatus: 'invalid',
          isValidating: false
        });
        addError({
          type: 'validation',
          message: validation.error || 'File validation failed'
        });
      }
    }
  }, [state.entriesFile, state.assetsFile, updateState, clearErrors, addError]);


  // Process replacement
  const handleProcess = useCallback(async () => {
    if (!state.entriesFile || !state.assetsFile) {
      addError({
        type: 'replacement',
        message: 'Both files are required for processing'
      });
      return;
    }

    const config: ReplacementConfig = {
      matchingKey: state.matchingKey,
      replacementKey: state.replacementKey,
      fieldMappings: state.fieldMappings,
      keepUnmatched: state.keepUnmatched,
      autoRename: state.autoRename,
      caseSensitive: state.caseSensitive
    };

    const configValidation = validateReplacementConfig(config, state.availableFields, state.assetFields);
    if (!configValidation.isValid) {
      addError({
        type: 'config',
        message: configValidation.error || 'Invalid configuration'
      });
      return;
    }

    updateState({ isProcessing: true });
    clearErrors();

    try {
      const processingOptions: ProcessingOptions = {
        matchingKey: state.matchingKey,
        replacementKey: state.replacementKey,
        fieldMappings: state.fieldMappings,
        keepUnmatched: state.keepUnmatched,
        caseSensitive: state.caseSensitive,
        autoRename: state.autoRename
      };

      const result = processReplacement(state.entriesFile, state.assetsFile, processingOptions);
      
      if (result.success) {
        updateState({
          processedJson: result.data,
          processingStatistics: result.statistics,
          isProcessing: false
        });
        setCurrentStep('results');
      } else {
        updateState({ isProcessing: false });
        addError({
          type: 'replacement',
          message: result.error || 'Processing failed'
        });
      }
    } catch (error) {
      updateState({ isProcessing: false });
      addError({
        type: 'replacement',
        message: error instanceof Error ? error.message : 'An unexpected error occurred'
      });
    }
  }, [state.entriesFile, state.assetsFile, state.matchingKey, state.replacementKey, state.fieldMappings, state.keepUnmatched, state.autoRename, state.caseSensitive, state.availableFields, state.assetFields, updateState, addError, clearErrors]);

  // Download handler
  const handleDownload = useCallback(() => {
    if (!state.processedJson || !state.entriesFile || !state.assetsFile) return;

    const filename = generateReplacementFilename(state.entriesFile.name, state.assetsFile.name);
    const blob = new Blob([JSON.stringify(state.processedJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [state.processedJson, state.entriesFile, state.assetsFile]);

  // Reset handler
  const handleReset = useCallback(() => {
    setState({
      entriesFile: null,
      assetsFile: null,
      availableFields: [],
      assetFields: [],
      selectedFields: [],
      fieldSelectionConfirmed: false,
      fieldMappings: [],
      matchingKey: '',
      replacementKey: '',
      keepOriginalIds: false,
      autoRename: false,
      caseSensitive: false,
      keepUnmatched: true,
      processedJson: null,
      isProcessing: false,
      isValidating: false,
      showPreview: false,
      errors: [],
      validationStatus: 'pending',
      processingStatistics: {
        totalEntries: 0,
        matchedEntries: 0,
        unmatchedEntries: 0,
        replacedFields: 0,
        processingTime: 0
      }
    });
    setCurrentStep('upload');
    setUploadConfirmed(false);
    setFieldsConfirmed(false);
  }, []);

  // Determine current step based on state and manual confirmations
  useEffect(() => {
    if (state.processedJson) {
      setCurrentStep('results');
    } else if (state.validationStatus === 'valid' && state.selectedFields.length > 0 && fieldsConfirmed) {
      setCurrentStep('configure');
    } else if (state.validationStatus === 'valid' && uploadConfirmed) {
      setCurrentStep('select-fields');
    } else {
      setCurrentStep('upload');
    }
  }, [state.processedJson, state.validationStatus, state.selectedFields, uploadConfirmed, fieldsConfirmed]);

  const canProcess = state.entriesFile?.isValid && 
                   state.assetsFile?.isValid && 
                   state.matchingKey && 
                   state.replacementKey && 
                   state.fieldMappings.some(m => m.enabled);

  return (
    <PageContainer>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-background via-background to-secondary py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-secondary-light border border-border rounded-full text-sm text-foreground-muted mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              JSON Field Replacement Tool
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
              Replace JSON fields with
              <br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                reference data
              </span>
            </h1>
            
            <p className="text-xl text-foreground-muted mb-8 max-w-2xl mx-auto">
              Transform your JSON entries by replacing field values with matching data from reference files. 
              Perfect for data normalization and enrichment workflows.
            </p>
          </div>
        </section>

        {/* Progress Steps */}
        <section className="py-8 px-4 sm:px-6 lg:px-8 bg-secondary">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center space-x-2 sm:space-x-8 overflow-x-auto pb-2">
              {[
                { key: 'upload', label: 'Upload Files', icon: '1' },
                { key: 'select-fields', label: 'Select Fields', icon: '2' },
                { key: 'configure', label: 'Configure', icon: '3' },
                { key: 'results', label: 'Results', icon: '4' }
              ].map((step, index) => (
                <div key={step.key} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center">
                    <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 transition-colors ${
                      currentStep === step.key 
                        ? 'border-primary bg-primary text-white' 
                        : index < ['upload', 'select-fields', 'configure', 'results'].indexOf(currentStep)
                        ? 'border-success bg-success text-white'
                        : 'border-border bg-background text-foreground-muted'
                    }`}>
                      <span className="text-xs sm:text-sm">{step.icon}</span>
                    </div>
                    <span className={`mt-1 text-xs sm:text-sm font-medium text-center ${
                      currentStep === step.key ? 'text-primary' : 'text-foreground-muted'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index < 3 && (
                    <div className={`w-4 sm:w-8 h-0.5 mx-1 sm:mx-4 ${
                      index < ['upload', 'select-fields', 'configure', 'results'].indexOf(currentStep)
                        ? 'bg-success'
                        : 'bg-border'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Error Display */}
            {state.errors.length > 0 && (
              <div className="mb-8 space-y-4">
                {state.errors.map((error, index) => (
                  <div key={index} className="bg-error/10 border border-error/20 rounded-lg p-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-error font-medium">{error.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Content based on current step */}
            {currentStep === 'upload' && (
              <div className="space-y-8">
                <DualUploadBox
                  entriesFile={state.entriesFile}
                  assetsFile={state.assetsFile}
                  onEntriesFileSelected={handleEntriesFileSelected}
                  onAssetsFileSelected={handleAssetsFileSelected}
                  onFileRemove={handleFileRemove}
                  isProcessing={state.isProcessing}
                  error={state.errors.find(e => e.type === 'upload')}
                />
                
                {state.validationStatus === 'valid' && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleUploadContinue}
                      disabled={state.isProcessing || state.isValidating}
                      className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                      Continue to Select Fields
                      <span className="bg-primary-hover text-white px-2 py-1 rounded text-sm ml-2">
                        Step 2
                      </span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 'select-fields' && (
              <FieldSelector
                fields={state.availableFields}
                selectedFields={state.selectedFields}
                onFieldToggle={handleFieldToggle}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                onContinue={handleFieldsContinue}
                isDisabled={state.isValidating}
              />
            )}

            {currentStep === 'configure' && (
              <MappingConfigurator
                entriesFields={state.availableFields}
                assetsFields={state.assetFields}
                selectedFields={state.selectedFields}
                config={{
                  matchingKey: state.matchingKey,
                  replacementKey: state.replacementKey,
                  fieldMappings: state.fieldMappings,
                  keepUnmatched: state.keepUnmatched,
                  autoRename: state.autoRename,
                  caseSensitive: state.caseSensitive
                }}
                onConfigChange={handleConfigChange}
                onContinue={handleProcess}
                suggestedMatchingKey={state.matchingKey}
                isDisabled={state.isProcessing}
              />
            )}

            {currentStep === 'results' && state.processedJson && (
              <ProcessingResults
                result={{
                  success: true,
                  data: state.processedJson,
                  statistics: state.processingStatistics
                }}
                filename={generateReplacementFilename(
                  state.entriesFile?.name || 'entries.json',
                  state.assetsFile?.name || 'assets.json'
                )}
                onDownload={handleDownload}
                onReset={handleReset}
              />
            )}
          </div>
        </section>
    </PageContainer>
  );
}