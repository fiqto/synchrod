export interface JsonReplacerFile {
  file: File;
  id: string;
  name: string;
  size: number;
  content?: any;
  isValid?: boolean;
  error?: string;
  type: 'entries' | 'assets';
}

export interface FieldInfo {
  key: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  sampleValue?: any;
  count?: number;
}

export interface FieldMapping {
  originalField: string;
  newField: string;
  keepOriginal: boolean;
  enabled: boolean;
  replacementKey?: string; // Optional per-field replacement key
}

export interface ReplacementConfig {
  matchingKey: string;
  replacementKey: string;
  fieldMappings: FieldMapping[];
  keepUnmatched: boolean;
  autoRename: boolean;
  caseSensitive: boolean;
}

export interface ReplacementResult {
  success: boolean;
  data?: any;
  error?: string;
  statistics: {
    totalEntries: number;
    matchedEntries: number;
    unmatchedEntries: number;
    replacedFields: number;
    processingTime: number;
  };
}

export interface JsonReplacerError {
  type: 'validation' | 'replacement' | 'download' | 'upload' | 'config';
  message: string;
  file?: string;
  field?: string;
  details?: string;
}

export interface JsonReplacerState {
  entriesFile: JsonReplacerFile | null;
  assetsFile: JsonReplacerFile | null;
  availableFields: FieldInfo[];
  assetFields: FieldInfo[];
  selectedFields: string[];
  fieldSelectionConfirmed: boolean;
  fieldMappings: FieldMapping[];
  matchingKey: string;
  replacementKey: string;
  keepOriginalIds: boolean;
  autoRename: boolean;
  caseSensitive: boolean;
  keepUnmatched: boolean;
  processedJson: any;
  isProcessing: boolean;
  isValidating: boolean;
  showPreview: boolean;
  errors: JsonReplacerError[];
  validationStatus: 'pending' | 'valid' | 'invalid';
  processingStatistics: ReplacementResult['statistics'];
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  entriesFields?: FieldInfo[];
  assetsFields?: FieldInfo[];
  suggestedMatchingKey?: string;
}

export interface PreviewItem {
  id: string;
  original: any;
  modified: any;
  changes: string[];
  matched: boolean;
}

export interface ProcessingOptions {
  matchingKey: string;
  replacementKey: string;
  fieldMappings: FieldMapping[];
  keepUnmatched: boolean;
  caseSensitive: boolean;
  autoRename: boolean;
}

export interface ReplacementHistory {
  id: string;
  timestamp: Date;
  entriesFileName: string;
  assetsFileName: string;
  config: ReplacementConfig;
  statistics: ReplacementResult['statistics'];
}