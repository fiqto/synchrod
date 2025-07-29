'use client';

import { useCallback, useState } from 'react';
import { JsonReplacerFile, JsonReplacerError } from '@/types/json-replacer';

interface DualUploadBoxProps {
  entriesFile: JsonReplacerFile | null;
  assetsFile: JsonReplacerFile | null;
  onEntriesFileSelected: (file: JsonReplacerFile) => void;
  onAssetsFileSelected: (file: JsonReplacerFile) => void;
  onFileRemove: (fileType: 'entries' | 'assets') => void;
  isProcessing?: boolean;
  error?: JsonReplacerError;
}

export function DualUploadBox({
  entriesFile,
  assetsFile,
  onEntriesFileSelected,
  onAssetsFileSelected,
  onFileRemove,
  isProcessing = false,
  error
}: DualUploadBoxProps) {
  const [isDragActiveEntries, setIsDragActiveEntries] = useState(false);
  const [isDragActiveAssets, setIsDragActiveAssets] = useState(false);
  const [isValidatingEntries, setIsValidatingEntries] = useState(false);
  const [isValidatingAssets, setIsValidatingAssets] = useState(false);

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    if (!file.name.endsWith('.json')) {
      return { isValid: false, error: 'Only JSON files are allowed' };
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      return { isValid: false, error: 'File size must be less than 10MB' };
    }
    
    if (file.size === 0) {
      return { isValid: false, error: 'File cannot be empty' };
    }
    
    return { isValid: true };
  };

  const validateJsonFile = async (file: File): Promise<{ isValid: boolean; content?: any; error?: string }> => {
    try {
      const text = await file.text();
      const content = JSON.parse(text);
      return { isValid: true, content };
    } catch (error) {
      return { isValid: false, error: 'Invalid JSON format' };
    }
  };

  const processFile = async (file: File, type: 'entries' | 'assets') => {
    if (type === 'entries') {
      setIsValidatingEntries(true);
    } else {
      setIsValidatingAssets(true);
    }

    const fileValidation = validateFile(file);
    
    if (!fileValidation.isValid) {
      const processedFile: JsonReplacerFile = {
        file,
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        type,
        isValid: false,
        error: fileValidation.error
      };
      
      if (type === 'entries') {
        setIsValidatingEntries(false);
        onEntriesFileSelected(processedFile);
      } else {
        setIsValidatingAssets(false);
        onAssetsFileSelected(processedFile);
      }
      return;
    }

    const jsonValidation = await validateJsonFile(file);
    
    const processedFile: JsonReplacerFile = {
      file,
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type,
      isValid: jsonValidation.isValid,
      content: jsonValidation.content,
      error: jsonValidation.error
    };

    if (type === 'entries') {
      setIsValidatingEntries(false);
      onEntriesFileSelected(processedFile);
    } else {
      setIsValidatingAssets(false);
      onAssetsFileSelected(processedFile);
    }
  };

  const createDragHandlers = (type: 'entries' | 'assets') => {
    const setDragActive = type === 'entries' ? setIsDragActiveEntries : setIsDragActiveAssets;
    
    return {
      onDragEnter: useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
      }, []),
      
      onDragLeave: useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
      }, []),
      
      onDragOver: useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
      }, []),
      
      onDrop: useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
          await processFile(files[0], type);
        }
      }, [type])
    };
  };

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>, type: 'entries' | 'assets') => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      await processFile(files[0], type);
    }
    e.target.value = '';
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const entriesDragHandlers = createDragHandlers('entries');
  const assetsDragHandlers = createDragHandlers('assets');

  const renderUploadZone = (
    type: 'entries' | 'assets',
    file: JsonReplacerFile | null,
    isDragActive: boolean,
    isValidating: boolean,
    dragHandlers: any,
    title: string,
    description: string
  ) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${file?.isValid === true ? 'bg-success' : file?.isValid === false ? 'bg-error' : 'bg-border'}`}></div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-primary bg-primary/10 scale-105' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        {...dragHandlers}
      >
        <input
          type="file"
          accept=".json"
          onChange={(e) => handleFileInput(e, type)}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-3">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            {isValidating ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            ) : file?.isValid === true ? (
              <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : file?.isValid === false ? (
              <svg className="w-6 h-6 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          
          <div>
            <p className="font-medium text-foreground">
              {isDragActive ? `Drop ${type} file here` : `Upload ${type} file`}
            </p>
            <p className="text-sm text-foreground-muted mt-1">
              {description}
            </p>
            <p className="text-xs text-foreground-muted mt-1">
              JSON only • Max 10MB
            </p>
          </div>
        </div>
      </div>

      {file && (
        <div className={`
          bg-secondary border border-border rounded-lg p-4 flex items-center justify-between
          ${file.isValid === false ? 'border-error/50 bg-error/5' : ''}
          ${file.isValid === true ? 'border-success/50 bg-success/5' : ''}
        `}>
          <div className="flex items-center gap-3">
            <div className={`
              w-8 h-8 rounded-lg flex items-center justify-center
              ${file.isValid === false ? 'bg-error/10' : file.isValid === true ? 'bg-success/10' : 'bg-border'}
            `}>
              {file.isValid === false ? (
                <svg className="w-4 h-4 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : file.isValid === true ? (
                <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium text-foreground text-sm">{file.name}</p>
              <p className="text-xs text-foreground-muted">{formatFileSize(file.size)}</p>
              {file.error && (
                <p className="text-xs text-error mt-1">{file.error}</p>
              )}
            </div>
          </div>
          
          <button
            onClick={() => onFileRemove(type)}
            disabled={isProcessing}
            className="text-foreground-muted hover:text-error transition-colors p-1 rounded-lg hover:bg-error/10 disabled:opacity-50"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Error Display */}
      {error && error.type === 'upload' && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-error font-medium">{error.message}</span>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {/* Entries File Upload */}
        {renderUploadZone(
          'entries',
          entriesFile,
          isDragActiveEntries,
          isValidatingEntries,
          entriesDragHandlers,
          'Entries JSON',
          'Data you want to modify'
        )}

        {/* Assets File Upload */}
        {renderUploadZone(
          'assets',
          assetsFile,
          isDragActiveAssets,
          isValidatingAssets,
          assetsDragHandlers,
          'Assets JSON',
          'Reference data for replacements'
        )}
      </div>

      {/* Connection indicator */}
      {entriesFile?.isValid && assetsFile?.isValid && (
        <div className="flex items-center justify-center">
          <div className="bg-success/10 border border-success/20 rounded-full px-4 py-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-success text-sm font-medium">Both files ready</span>
          </div>
        </div>
      )}
    </div>
  );
}