'use client';

import { FieldInfo } from '@/types/json-replacer';

interface FieldSelectorProps {
  fields: FieldInfo[];
  selectedFields: string[];
  onFieldToggle: (fieldKey: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onContinue?: () => void;
  isDisabled?: boolean;
}

export function FieldSelector({
  fields,
  selectedFields,
  onFieldToggle,
  onSelectAll,
  onDeselectAll,
  onContinue,
  isDisabled = false
}: FieldSelectorProps) {



  if (fields.length === 0) {
    return (
      <div className="bg-secondary border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 bg-border rounded-2xl flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">No Fields Available</h3>
        <p className="text-foreground-muted">Upload a valid entries JSON file to see available fields.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Select Fields to Replace</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm text-foreground-muted">
            {selectedFields.length} of {fields.length} selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={onSelectAll}
              disabled={isDisabled || selectedFields.length === fields.length}
              className="px-3 py-2 text-sm font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Select All
            </button>
            <button
              onClick={onDeselectAll}
              disabled={isDisabled || selectedFields.length === 0}
              className="px-3 py-2 text-sm font-medium text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* Field Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
        {fields.map((field) => (
          <div key={field.key} className="bg-secondary border border-border rounded-lg p-4 hover:bg-secondary-light transition-colors">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFields.includes(field.key)}
                onChange={() => onFieldToggle(field.key)}
                disabled={isDisabled}
                className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <span className="font-medium text-foreground text-sm truncate" title={field.key}>
                {field.key}
              </span>
            </label>
          </div>
        ))}
      </div>

      {selectedFields.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <p className="text-sm text-foreground-muted">
            <span className="font-medium text-primary">{selectedFields.length} field{selectedFields.length === 1 ? '' : 's'}</span> selected for replacement.
            These fields will be replaced with matching values from the assets file.
          </p>
        </div>
      )}

      {/* Continue Button */}
      {onContinue && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onContinue}
            disabled={selectedFields.length === 0 || isDisabled}
            className="bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Continue to Configure
            <span className="bg-primary-hover text-white px-2 py-1 rounded text-sm ml-2">
              Step 3
            </span>
          </button>
        </div>
      )}
    </div>
  );
}