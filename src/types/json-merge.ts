export interface UploadedFile {
  file: File;
  id: string;
  name: string;
  size: number;
  content?: any;
  isValid?: boolean;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  files: UploadedFile[];
  mergeType?: 'array' | 'object';
}

export interface MergeResult {
  success: boolean;
  data?: any;
  error?: string;
  mergeType: 'array' | 'object';
}

export interface JsonMergeError {
  type: 'validation' | 'merge' | 'download' | 'upload';
  message: string;
  file?: string;
  details?: string;
}

export interface JsonMergeState {
  files: UploadedFile[];
  mergedJson: any;
  isValidating: boolean;
  isMerging: boolean;
  isDownloading: boolean;
  errors: JsonMergeError[];
  validationStatus: 'pending' | 'valid' | 'invalid';
  mergeType: 'array' | 'object' | null;
}

export type MergeType = 'array' | 'object';

export interface JsonStructure {
  [key: string]: any;
}

export interface MergeOptions {
  type: MergeType;
  resolveConflicts?: boolean;
  preserveOrder?: boolean;
}