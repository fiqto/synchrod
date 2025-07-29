'use client';

import { useState, useEffect } from 'react';
import { FieldInfo, FieldMapping, ReplacementConfig } from '@/types/json-replacer';

interface MappingConfiguratorProps {
  entriesFields: FieldInfo[];
  assetsFields: FieldInfo[];
  selectedFields: string[];
  config: ReplacementConfig;
  onConfigChange: (config: ReplacementConfig) => void;
  onContinue?: () => void;
  suggestedMatchingKey?: string;
  isDisabled?: boolean;
}

export function MappingConfigurator({
  entriesFields,
  assetsFields,
  selectedFields,
  config,
  onConfigChange,
  onContinue,
  suggestedMatchingKey,
  isDisabled = false
}: MappingConfiguratorProps) {

  // Update field mappings when selected fields change
  useEffect(() => {
    const newMappings = selectedFields.map(field => {
      const existingMapping = config.fieldMappings.find(m => m.originalField === field);
      if (existingMapping) {
        return existingMapping;
      }
      
      return {
        originalField: field,
        newField: field,
        keepOriginal: true,
        enabled: true
      };
    });

    onConfigChange({
      ...config,
      fieldMappings: newMappings
    });
  }, [selectedFields]);

  // Update suggested matching key when it changes
  useEffect(() => {
    if (suggestedMatchingKey && !config.matchingKey) {
      onConfigChange({
        ...config,
        matchingKey: suggestedMatchingKey
      });
    }
  }, [suggestedMatchingKey]);

  const updateFieldMapping = (originalField: string, updates: Partial<FieldMapping>) => {
    const newMappings = config.fieldMappings.map(mapping => 
      mapping.originalField === originalField 
        ? { ...mapping, ...updates }
        : mapping
    );
    
    onConfigChange({
      ...config,
      fieldMappings: newMappings
    });
  };

  const isConfigurationValid = () => {
    return (
      config.matchingKey &&
      config.replacementKey &&
      config.fieldMappings.some(m => m.enabled) &&
      config.fieldMappings.every(m => !m.enabled || m.newField.trim())
    );
  };

  if (selectedFields.length === 0) {
    return (
      <div className="bg-secondary border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-border rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Fields Selected</h3>
        <p className="text-foreground-muted">Select fields to replace before configuring mappings.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground mb-2">Configure Field Mappings</h3>
        <p className="text-sm text-foreground-muted">Set up how your fields will be replaced with asset data</p>
      </div>

      {/* Global Configuration */}
      <div className="bg-secondary border border-border rounded-xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Match Key
            </label>
            <select
              value={config.matchingKey}
              onChange={(e) => onConfigChange({ ...config, matchingKey: e.target.value })}
              disabled={isDisabled}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select match key...</option>
              {assetsFields.map(field => (
                <option key={field.key} value={field.key}>
                  {field.key}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Replace With
            </label>
            <select
              value={config.replacementKey}
              onChange={(e) => onConfigChange({ ...config, replacementKey: e.target.value })}
              disabled={isDisabled}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Select replacement key...</option>
              {assetsFields.map(field => (
                <option key={field.key} value={field.key}>
                  {field.key}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Field Mappings */}
      <div className="space-y-4">
        <h4 className="text-base font-medium text-foreground">Field Mappings</h4>
        
        <div className="space-y-3">
          {config.fieldMappings.map((mapping) => (
            <div key={mapping.originalField} className="bg-secondary border border-border rounded-lg p-4">
              <div className="grid md:grid-cols-3 gap-4 items-end">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Source Field
                  </label>
                  <div className="px-3 py-2 bg-background border border-border rounded-lg text-foreground text-sm">
                    {mapping.originalField}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    New Field Name
                  </label>
                  <input
                    type="text"
                    value={mapping.newField}
                    onChange={(e) => updateFieldMapping(mapping.originalField, { newField: e.target.value })}
                    disabled={isDisabled}
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Enter field name..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={mapping.keepOriginal}
                      onChange={(e) => updateFieldMapping(mapping.originalField, { keepOriginal: e.target.checked })}
                      disabled={isDisabled}
                      className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-sm font-medium text-foreground">Keep original field</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Continue Button */}
      {onContinue && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onContinue}
            disabled={!isConfigurationValid() || isDisabled}
            className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Process Replacement
            <span className="bg-primary-hover text-white px-2 py-1 rounded text-sm ml-2">
              Step 4
            </span>
          </button>
        </div>
      )}
    </div>
  );
}