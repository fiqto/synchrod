import { 
  JsonReplacerFile, 
  FieldInfo, 
  FieldMapping, 
  ReplacementConfig, 
  ReplacementResult, 
  ValidationResult, 
  PreviewItem, 
  ProcessingOptions 
} from '@/types/json-replacer';

/**
 * Analyzes JSON structure and extracts field information
 */
export function analyzeJsonStructure(data: any): FieldInfo[] {
  const fields: FieldInfo[] = [];
  
  if (!data) return fields;
  
  // Handle arrays
  if (Array.isArray(data)) {
    if (data.length === 0) return fields;
    
    // Analyze the first few items to get field information
    const sampleSize = Math.min(5, data.length);
    const fieldCounts: Record<string, { types: Set<string>, samples: any[], count: number }> = {};
    
    for (let i = 0; i < sampleSize; i++) {
      const item = data[i];
      if (item && typeof item === 'object' && !Array.isArray(item)) {
        Object.keys(item).forEach(key => {
          if (!fieldCounts[key]) {
            fieldCounts[key] = { types: new Set(), samples: [], count: 0 };
          }
          fieldCounts[key].types.add(getValueType(item[key]));
          fieldCounts[key].samples.push(item[key]);
          fieldCounts[key].count++;
        });
      }
    }
    
    // Convert to FieldInfo array
    Object.entries(fieldCounts).forEach(([key, info]) => {
      fields.push({
        key,
        type: info.types.size === 1 ? Array.from(info.types)[0] as any : 'string',
        sampleValue: info.samples[0],
        count: info.count
      });
    });
  }
  // Handle objects
  else if (typeof data === 'object') {
    Object.keys(data).forEach(key => {
      fields.push({
        key,
        type: getValueType(data[key]),
        sampleValue: data[key],
        count: 1
      });
    });
  }
  
  return fields.sort((a, b) => a.key.localeCompare(b.key));
}

/**
 * Determines the type of a value
 */
function getValueType(value: any): FieldInfo['type'] {
  if (value === null || value === undefined) return 'string';
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'object') return 'object';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  return 'string';
}

/**
 * Validates both files and their compatibility
 */
export function validateFiles(
  entriesFile: JsonReplacerFile | null, 
  assetsFile: JsonReplacerFile | null
): ValidationResult {
  if (!entriesFile || !assetsFile) {
    return { isValid: false, error: 'Both files are required' };
  }
  
  if (!entriesFile.isValid || !assetsFile.isValid) {
    return { isValid: false, error: 'One or both files contain invalid JSON' };
  }
  
  if (!entriesFile.content || !assetsFile.content) {
    return { isValid: false, error: 'Files cannot be empty' };
  }
  
  // Analyze structures
  const entriesFields = analyzeJsonStructure(entriesFile.content);
  const assetsFields = analyzeJsonStructure(assetsFile.content);
  
  if (entriesFields.length === 0) {
    return { isValid: false, error: 'Entries file has no detectable fields' };
  }
  
  if (assetsFields.length === 0) {
    return { isValid: false, error: 'Assets file has no detectable fields' };
  }
  
  // Suggest matching key (look for common ID fields)
  const commonIdFields = ['id', 'uid', '_id', 'key', 'identifier'];
  const suggestedMatchingKey = assetsFields.find(field => 
    commonIdFields.includes(field.key.toLowerCase())
  )?.key || assetsFields[0].key;
  
  return {
    isValid: true,
    entriesFields,
    assetsFields,
    suggestedMatchingKey
  };
}

/**
 * Creates a lookup map from assets data
 */
function createAssetLookup(assetsData: any, matchingKey: string, replacementKey: string, caseSensitive: boolean): Map<string, any> {
  const lookup = new Map<string, any>();
  
  if (Array.isArray(assetsData)) {
    assetsData.forEach(asset => {
      if (asset && typeof asset === 'object' && asset[matchingKey] !== undefined) {
        const key = caseSensitive ? asset[matchingKey] : String(asset[matchingKey]).toLowerCase();
        lookup.set(key, asset[replacementKey]);
      }
    });
  } else if (typeof assetsData === 'object') {
    Object.values(assetsData).forEach((asset: any) => {
      if (asset && typeof asset === 'object' && asset[matchingKey] !== undefined) {
        const key = caseSensitive ? asset[matchingKey] : String(asset[matchingKey]).toLowerCase();
        lookup.set(key, asset[replacementKey]);
      }
    });
  }
  
  return lookup;
}

/**
 * Creates multiple lookup maps for different replacement keys
 */
function createMultipleAssetLookups(
  assetsData: any, 
  matchingKey: string, 
  replacementKeys: string[], 
  caseSensitive: boolean
): Map<string, Map<string, any>> {
  const lookups = new Map<string, Map<string, any>>();
  
  // Initialize lookups for each replacement key
  replacementKeys.forEach(key => {
    lookups.set(key, new Map<string, any>());
  });
  
  if (Array.isArray(assetsData)) {
    assetsData.forEach(asset => {
      if (asset && typeof asset === 'object' && asset[matchingKey] !== undefined) {
        const key = caseSensitive ? asset[matchingKey] : String(asset[matchingKey]).toLowerCase();
        replacementKeys.forEach(replKey => {
          lookups.get(replKey)?.set(key, asset[replKey]);
        });
      }
    });
  } else if (typeof assetsData === 'object') {
    Object.values(assetsData).forEach((asset: any) => {
      if (asset && typeof asset === 'object' && asset[matchingKey] !== undefined) {
        const key = caseSensitive ? asset[matchingKey] : String(asset[matchingKey]).toLowerCase();
        replacementKeys.forEach(replKey => {
          lookups.get(replKey)?.set(key, asset[replKey]);
        });
      }
    });
  }
  
  return lookups;
}

/**
 * Generates field name based on auto-rename rules
 */
function generateFieldName(originalField: string, autoRename: boolean): string {
  if (!autoRename) return originalField;
  
  // Remove common ID suffixes
  const idSuffixes = ['Id', 'ID', '_id', '_ID'];
  for (const suffix of idSuffixes) {
    if (originalField.endsWith(suffix)) {
      return originalField.slice(0, -suffix.length);
    }
  }
  
  return originalField;
}

/**
 * Processes entries and replaces fields based on configuration
 */
export function processReplacement(
  entriesFile: JsonReplacerFile, 
  assetsFile: JsonReplacerFile, 
  options: ProcessingOptions
): ReplacementResult {
  const startTime = Date.now();
  
  try {
    const { matchingKey, replacementKey, fieldMappings, keepUnmatched, caseSensitive } = options;
    
    // Get all unique replacement keys (field-specific or global fallback)
    const allReplacementKeys = Array.from(new Set([
      replacementKey,
      ...fieldMappings.filter(m => m.replacementKey).map(m => m.replacementKey!)
    ]));
    
    // Create multiple asset lookups
    const assetLookups = createMultipleAssetLookups(
      assetsFile.content, 
      matchingKey, 
      allReplacementKeys, 
      caseSensitive
    );
    
    const statistics = {
      totalEntries: 0,
      matchedEntries: 0,
      unmatchedEntries: 0,
      replacedFields: 0,
      processingTime: 0
    };
    
    const processedData = processEntries(
      entriesFile.content,
      assetLookups,
      fieldMappings,
      replacementKey,
      keepUnmatched,
      caseSensitive,
      statistics
    );
    
    statistics.processingTime = Date.now() - startTime;
    
    return {
      success: true,
      data: processedData,
      statistics
    };
    
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Processing failed',
      statistics: {
        totalEntries: 0,
        matchedEntries: 0,
        unmatchedEntries: 0,
        replacedFields: 0,
        processingTime: Date.now() - startTime
      }
    };
  }
}

/**
 * Processes entries (array or object)
 */
function processEntries(
  entries: any,
  assetLookups: Map<string, Map<string, any>>,
  fieldMappings: FieldMapping[],
  defaultReplacementKey: string,
  keepUnmatched: boolean,
  caseSensitive: boolean,
  statistics: ReplacementResult['statistics']
): any {
  if (Array.isArray(entries)) {
    return entries.map(entry => processEntry(entry, assetLookups, fieldMappings, defaultReplacementKey, keepUnmatched, caseSensitive, statistics))
      .filter(entry => entry !== null);
  } else if (typeof entries === 'object') {
    const result: any = {};
    Object.keys(entries).forEach(key => {
      const processed = processEntry(entries[key], assetLookups, fieldMappings, defaultReplacementKey, keepUnmatched, caseSensitive, statistics);
      if (processed !== null) {
        result[key] = processed;
      }
    });
    return result;
  }
  
  return entries;
}

/**
 * Processes a single entry
 */
function processEntry(
  entry: any,
  assetLookups: Map<string, Map<string, any>>,
  fieldMappings: FieldMapping[],
  defaultReplacementKey: string,
  keepUnmatched: boolean,
  caseSensitive: boolean,
  statistics: ReplacementResult['statistics']
): any | null {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return entry;
  }
  
  statistics.totalEntries++;
  
  const result = { ...entry };
  let hasMatch = false;
  
  // Process each field mapping
  fieldMappings.forEach(mapping => {
    if (!mapping.enabled || !entry[mapping.originalField]) return;
    
    const originalValue = entry[mapping.originalField];
    const lookupKey = caseSensitive ? originalValue : String(originalValue).toLowerCase();
    
    // Use field-specific replacement key or fallback to global one
    const replacementKey = mapping.replacementKey || defaultReplacementKey;
    const assetLookup = assetLookups.get(replacementKey);
    
    if (assetLookup) {
      const replacementValue = assetLookup.get(lookupKey);
      
      if (replacementValue !== undefined) {
        hasMatch = true;
        statistics.replacedFields++;
        
        // Set the new field value
        result[mapping.newField] = replacementValue;
        
        // Remove original field if not keeping it
        if (!mapping.keepOriginal) {
          delete result[mapping.originalField];
        }
      } else {
        // No match found
        result[mapping.newField] = null;
        
        if (!mapping.keepOriginal) {
          delete result[mapping.originalField];
        }
      }
    }
  });
  
  if (hasMatch) {
    statistics.matchedEntries++;
  } else {
    statistics.unmatchedEntries++;
  }
  
  // Return entry or null based on keepUnmatched setting
  return (hasMatch || keepUnmatched) ? result : null;
}

/**
 * Generates preview data for the first few entries
 */
export function generatePreview(
  entriesFile: JsonReplacerFile,
  assetsFile: JsonReplacerFile,
  options: ProcessingOptions,
  maxItems = 5
): PreviewItem[] {
  try {
    const { matchingKey, replacementKey, fieldMappings, caseSensitive } = options;
    
    // Get all unique replacement keys
    const allReplacementKeys = Array.from(new Set([
      replacementKey,
      ...fieldMappings.filter(m => m.replacementKey).map(m => m.replacementKey!)
    ]));
    
    // Create multiple asset lookups
    const assetLookups = createMultipleAssetLookups(
      assetsFile.content, 
      matchingKey, 
      allReplacementKeys, 
      caseSensitive
    );
    
    const entries = Array.isArray(entriesFile.content) 
      ? entriesFile.content.slice(0, maxItems)
      : [entriesFile.content];
    
    return entries.map((entry, index) => {
      const statistics = {
        totalEntries: 0,
        matchedEntries: 0,
        unmatchedEntries: 0,
        replacedFields: 0,
        processingTime: 0
      };
      
      const original = { ...entry };
      const modified = processEntry(entry, assetLookups, fieldMappings, replacementKey, true, caseSensitive, statistics);
      
      // Identify changes
      const changes: string[] = [];
      fieldMappings.forEach(mapping => {
        if (mapping.enabled && original[mapping.originalField] !== undefined) {
          if (modified[mapping.newField] !== original[mapping.originalField]) {
            changes.push(mapping.newField);
          }
        }
      });
      
      return {
        id: `preview-${index}`,
        original,
        modified,
        changes,
        matched: changes.length > 0
      };
    });
    
  } catch (error) {
    console.error('Preview generation failed:', error);
    return [];
  }
}

/**
 * Validates replacement configuration
 */
export function validateReplacementConfig(
  config: ReplacementConfig,
  entriesFields: FieldInfo[],
  assetsFields: FieldInfo[]
): { isValid: boolean; error?: string } {
  if (!config.matchingKey) {
    return { isValid: false, error: 'Matching key is required' };
  }
  
  if (!config.replacementKey) {
    return { isValid: false, error: 'Replacement key is required' };
  }
  
  if (!assetsFields.some(f => f.key === config.matchingKey)) {
    return { isValid: false, error: `Matching key "${config.matchingKey}" not found in assets file` };
  }
  
  if (!assetsFields.some(f => f.key === config.replacementKey)) {
    return { isValid: false, error: `Replacement key "${config.replacementKey}" not found in assets file` };
  }
  
  // Validate field-specific replacement keys
  const customReplacementKeys = config.fieldMappings
    .filter(m => m.replacementKey && m.replacementKey !== config.replacementKey)
    .map(m => m.replacementKey!);
  
  for (const key of customReplacementKeys) {
    if (!assetsFields.some(f => f.key === key)) {
      return { isValid: false, error: `Custom replacement key "${key}" not found in assets file` };
    }
  }
  
  if (config.fieldMappings.length === 0) {
    return { isValid: false, error: 'At least one field mapping is required' };
  }
  
  // Check if selected fields exist in entries
  const invalidFields = config.fieldMappings.filter(mapping => 
    !entriesFields.some(f => f.key === mapping.originalField)
  );
  
  if (invalidFields.length > 0) {
    return { 
      isValid: false, 
      error: `Selected fields not found in entries: ${invalidFields.map(f => f.originalField).join(', ')}` 
    };
  }
  
  return { isValid: true };
}

/**
 * Generates filename for the processed result
 */
export function generateReplacementFilename(
  entriesFileName: string,
  assetsFileName: string
): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const entriesBase = entriesFileName.replace(/\.[^/.]+$/, '');
  const assetsBase = assetsFileName.replace(/\.[^/.]+$/, '');
  
  return `${entriesBase}-replaced-with-${assetsBase}-${timestamp}.json`;
}

/**
 * Creates default field mappings from selected fields
 */
export function createDefaultFieldMappings(
  selectedFields: string[],
  autoRename: boolean,
  keepOriginal: boolean
): FieldMapping[] {
  return selectedFields.map(field => ({
    originalField: field,
    newField: generateFieldName(field, autoRename),
    keepOriginal,
    enabled: true,
    replacementKey: undefined // Will use global replacement key by default
  }));
}