import { 
  UploadedFile, 
  ValidationResult, 
  MergeResult, 
  JsonStructure, 
  MergeType,
  MergeOptions 
} from '@/types/json-merge';

/**
 * Validates if a file is valid JSON and parses its content
 */
export async function validateJsonFile(file: File): Promise<{ isValid: boolean; content?: any; error?: string }> {
  try {
    const text = await file.text();
    
    if (!text.trim()) {
      return { isValid: false, error: 'File is empty' };
    }

    const content = JSON.parse(text);
    return { isValid: true, content };
  } catch (error) {
    return { 
      isValid: false, 
      error: error instanceof Error ? error.message : 'Invalid JSON format' 
    };
  }
}

/**
 * Checks if all files have the same JSON structure
 */
export function validateStructure(files: UploadedFile[]): ValidationResult {
  if (files.length === 0) {
    return { isValid: false, error: 'No files to validate', files };
  }

  const validFiles = files.filter(f => f.isValid && f.content);
  
  if (validFiles.length === 0) {
    return { isValid: false, error: 'No valid JSON files found', files };
  }

  if (validFiles.length === 1) {
    const mergeType = Array.isArray(validFiles[0].content) ? 'array' : 'object';
    return { isValid: true, files, mergeType };
  }

  // Check if all files are either arrays or objects
  const firstFile = validFiles[0];
  const isFirstArray = Array.isArray(firstFile.content);
  const mergeType: MergeType = isFirstArray ? 'array' : 'object';

  // For arrays, we just need to check they're all arrays
  if (isFirstArray) {
    const allArrays = validFiles.every(f => Array.isArray(f.content));
    if (!allArrays) {
      return { 
        isValid: false, 
        error: 'Mixed types: some files contain arrays, others contain objects',
        files 
      };
    }
    return { isValid: true, files, mergeType: 'array' };
  }

  // For objects, check they have compatible structures
  const firstStructure = getObjectStructure(firstFile.content);
  
  for (let i = 1; i < validFiles.length; i++) {
    const currentFile = validFiles[i];
    
    if (Array.isArray(currentFile.content)) {
      return { 
        isValid: false, 
        error: 'Mixed types: some files contain objects, others contain arrays',
        files 
      };
    }
    
    const currentStructure = getObjectStructure(currentFile.content);
    
    if (!areStructuresCompatible(firstStructure, currentStructure)) {
      const details = getStructureComparisonDetails(
        firstStructure, 
        currentStructure, 
        firstFile.name, 
        currentFile.name
      );
      
      return { 
        isValid: false, 
        error: `Structure incompatible: ${details}`,
        files 
      };
    }
  }

  return { isValid: true, files, mergeType: 'object' };
}

/**
 * Gets the structure of an object (keys and their types)
 */
function getObjectStructure(obj: any): JsonStructure {
  const structure: JsonStructure = {};
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        structure[key] = 'array';
      } else if (value !== null && typeof value === 'object') {
        structure[key] = 'object';
      } else {
        structure[key] = typeof value;
      }
    }
  }
  
  return structure;
}

/**
 * Checks if two object structures are compatible for merging
 */
function areStructuresCompatible(structure1: JsonStructure, structure2: JsonStructure): boolean {
  const keys1 = Object.keys(structure1);
  const keys2 = Object.keys(structure2);
  
  // Check if all keys exist in both structures
  const allKeys = new Set([...keys1, ...keys2]);
  
  for (const key of allKeys) {
    if (!(key in structure1) || !(key in structure2)) {
      return false; // Missing key in one of the structures
    }
    
    if (structure1[key] !== structure2[key]) {
      return false; // Type mismatch
    }
  }
  
  return true;
}

/**
 * Gets detailed structure comparison information
 */
function getStructureComparisonDetails(structure1: JsonStructure, structure2: JsonStructure, file1Name: string, file2Name: string): string {
  const keys1 = Object.keys(structure1);
  const keys2 = Object.keys(structure2);
  const allKeys = new Set([...keys1, ...keys2]);
  
  const missingInFirst: string[] = [];
  const missingInSecond: string[] = [];
  const typeMismatches: string[] = [];
  
  for (const key of allKeys) {
    if (!(key in structure1)) {
      missingInFirst.push(key);
    } else if (!(key in structure2)) {
      missingInSecond.push(key);
    } else if (structure1[key] !== structure2[key]) {
      typeMismatches.push(`"${key}": ${structure1[key]} vs ${structure2[key]}`);
    }
  }
  
  const issues: string[] = [];
  
  if (missingInFirst.length > 0) {
    issues.push(`Missing in "${file1Name}": ${missingInFirst.join(', ')}`);
  }
  
  if (missingInSecond.length > 0) {
    issues.push(`Missing in "${file2Name}": ${missingInSecond.join(', ')}`);
  }
  
  if (typeMismatches.length > 0) {
    issues.push(`Type mismatches: ${typeMismatches.join(', ')}`);
  }
  
  return issues.join('; ');
}

/**
 * Gets a summary of the structure validation
 */
export function getValidationSummary(files: UploadedFile[]): {
  summary: string;
  details: string[];
  isCompatible: boolean;
} {
  const validFiles = files.filter(f => f.isValid && f.content);
  
  if (validFiles.length === 0) {
    return {
      summary: 'No valid JSON files to validate',
      details: [],
      isCompatible: false
    };
  }

  if (validFiles.length === 1) {
    const isArray = Array.isArray(validFiles[0].content);
    return {
      summary: `Single ${isArray ? 'array' : 'object'} file - ready to process`,
      details: [`File contains a JSON ${isArray ? 'array' : 'object'}`],
      isCompatible: true
    };
  }

  const firstFile = validFiles[0];
  const isFirstArray = Array.isArray(firstFile.content);
  
  if (isFirstArray) {
    const allArrays = validFiles.every(f => Array.isArray(f.content));
    if (allArrays) {
      const totalItems = validFiles.reduce((sum, f) => sum + (f.content?.length || 0), 0);
      return {
        summary: `${validFiles.length} compatible array files`,
        details: [
          `All files contain JSON arrays`,
          `Total items to merge: ${totalItems}`
        ],
        isCompatible: true
      };
    } else {
      return {
        summary: 'Incompatible: Mixed array and object files',
        details: ['Some files contain arrays, others contain objects'],
        isCompatible: false
      };
    }
  }

  // Object validation
  const firstStructure = getObjectStructure(firstFile.content);
  const structureKeys = Object.keys(firstStructure);
  
  let isCompatible = true;
  const details = [`Structure has ${structureKeys.length} keys: ${structureKeys.join(', ')}`];
  
  for (let i = 1; i < validFiles.length; i++) {
    const currentFile = validFiles[i];
    
    if (Array.isArray(currentFile.content)) {
      isCompatible = false;
      details.push(`❌ ${currentFile.name}: contains array (expected object)`);
      continue;
    }
    
    const currentStructure = getObjectStructure(currentFile.content);
    
    if (areStructuresCompatible(firstStructure, currentStructure)) {
      details.push(`✅ ${currentFile.name}: compatible structure`);
    } else {
      isCompatible = false;
      const comparisonDetails = getStructureComparisonDetails(
        firstStructure, 
        currentStructure, 
        firstFile.name, 
        currentFile.name
      );
      details.push(`❌ ${currentFile.name}: ${comparisonDetails}`);
    }
  }

  return {
    summary: isCompatible 
      ? `${validFiles.length} compatible object files` 
      : 'Structure validation failed',
    details,
    isCompatible
  };
}

/**
 * Merges multiple JSON files based on their type
 */
export function mergeJsonFiles(files: UploadedFile[], options: MergeOptions): MergeResult {
  const validFiles = files.filter(f => f.isValid && f.content);
  
  if (validFiles.length === 0) {
    return { success: false, error: 'No valid files to merge', mergeType: options.type };
  }

  try {
    if (options.type === 'array') {
      return mergeArrayFiles(validFiles);
    } else {
      return mergeObjectFiles(validFiles, options);
    }
  } catch (error) {
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to merge files',
      mergeType: options.type 
    };
  }
}

/**
 * Merges array files by concatenating all arrays
 */
function mergeArrayFiles(files: UploadedFile[]): MergeResult {
  const mergedArray: any[] = [];
  
  for (const file of files) {
    if (Array.isArray(file.content)) {
      mergedArray.push(...file.content);
    }
  }
  
  return { success: true, data: mergedArray, mergeType: 'array' };
}

/**
 * Merges object files by combining their properties
 */
function mergeObjectFiles(files: UploadedFile[], options: MergeOptions): MergeResult {
  const mergedObject: any = {};
  
  for (const file of files) {
    if (file.content && typeof file.content === 'object' && !Array.isArray(file.content)) {
      for (const key in file.content) {
        if (file.content.hasOwnProperty(key)) {
          const value = file.content[key];
          
          if (Array.isArray(value)) {
            // Merge arrays
            if (mergedObject[key]) {
              mergedObject[key] = [...mergedObject[key], ...value];
            } else {
              mergedObject[key] = [...value];
            }
          } else if (value !== null && typeof value === 'object') {
            // Merge nested objects
            if (mergedObject[key]) {
              mergedObject[key] = { ...mergedObject[key], ...value };
            } else {
              mergedObject[key] = { ...value };
            }
          } else {
            // For primitive values, later files override earlier ones
            mergedObject[key] = value;
          }
        }
      }
    }
  }
  
  return { success: true, data: mergedObject, mergeType: 'object' };
}

/**
 * Detects the merge type from the files
 */
export function detectMergeType(files: UploadedFile[]): MergeType | null {
  const validFiles = files.filter(f => f.isValid && f.content);
  
  if (validFiles.length === 0) return null;
  
  return Array.isArray(validFiles[0].content) ? 'array' : 'object';
}

/**
 * Generates a filename for the merged JSON
 */
export function generateMergeFilename(files: UploadedFile[], mergeType: MergeType): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const fileCount = files.length;
  return `merged-${mergeType}-${fileCount}-files-${timestamp}.json`;
}

/**
 * Validates file size and type
 */
export function validateFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'File size exceeds 10MB limit' };
  }
  
  if (!file.name.toLowerCase().endsWith('.json')) {
    return { isValid: false, error: 'Please upload only JSON files' };
  }
  
  return { isValid: true };
}