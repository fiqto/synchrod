'use client';

import { useCallback, useState } from 'react';
import { UploadedFile, JsonMergeError } from '@/types/json-merge';
import { validateFile, validateJsonFile } from '@/lib/json-merger';

interface JsonUploadBoxProps {
  files: UploadedFile[];
  onFilesSelected: (files: UploadedFile[]) => void;
  onFileRemove: (fileId: string) => void;
  isProcessing?: boolean;
  error?: JsonMergeError;
}

export function JsonUploadBox({ 
  files, 
  onFilesSelected, 
  onFileRemove, 
  isProcessing = false,
  error 
}: JsonUploadBoxProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    await processFiles(selectedFiles);
    // Reset the input value so the same files can be selected again
    e.target.value = '';
  }, []);

  const processFiles = async (newFiles: File[]) => {
    setIsValidating(true);
    
    const processedFiles: UploadedFile[] = [];
    
    for (const file of newFiles) {
      // Check if file with same name already exists
      const existingFile = files.find(f => f.name === file.name);
      if (existingFile) {
        // Skip duplicate files
        continue;
      }

      const fileValidation = validateFile(file);
      
      if (!fileValidation.isValid) {
        processedFiles.push({
          file,
          id: crypto.randomUUID(),
          name: file.name,
          size: file.size,
          isValid: false,
          error: fileValidation.error
        });
        continue;
      }

      const jsonValidation = await validateJsonFile(file);
      
      processedFiles.push({
        file,
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
        isValid: jsonValidation.isValid,
        content: jsonValidation.content,
        error: jsonValidation.error
      });
    }
    
    setIsValidating(false);
    onFilesSelected([...files, ...processedFiles]);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragActive 
            ? 'border-primary bg-primary/10 scale-105' 
            : 'border-border hover:border-primary/50 hover:bg-primary/5'
          }
          ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple
          accept=".json"
          onChange={handleFileInput}
          disabled={isProcessing}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
            {isValidating ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            ) : (
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            )}
          </div>
          
          <div>
            <p className="text-lg font-semibold text-foreground mb-2">
              {isDragActive ? 'Drop JSON files here' : 'Upload JSON files'}
            </p>
            <p className="text-foreground-muted">
              Drag and drop your JSON files here, or{' '}
              <span className="text-primary font-medium">click to browse</span>
            </p>
            <p className="text-sm text-foreground-muted mt-2">
              Supports multiple files • Max 10MB per file
            </p>
          </div>
        </div>
      </div>

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

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-foreground">Uploaded Files ({files.length})</h3>
          <div className="space-y-2">
            {files.map((file) => (
              <div
                key={file.id}
                className={`
                  bg-secondary border border-border rounded-lg p-4 flex items-center justify-between
                  ${file.isValid === false ? 'border-error/50 bg-error/5' : ''}
                  ${file.isValid === true ? 'border-success/50 bg-success/5' : ''}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`
                    w-10 h-10 rounded-lg flex items-center justify-center
                    ${file.isValid === false ? 'bg-error/10' : file.isValid === true ? 'bg-success/10' : 'bg-border'}
                  `}>
                    {file.isValid === false ? (
                      <svg className="w-5 h-5 text-error" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    ) : file.isValid === true ? (
                      <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-foreground-muted">{formatFileSize(file.size)}</p>
                    {file.error && (
                      <p className="text-sm text-error mt-1">{file.error}</p>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={() => onFileRemove(file.id)}
                  disabled={isProcessing}
                  className="text-foreground-muted hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10 disabled:opacity-50"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}