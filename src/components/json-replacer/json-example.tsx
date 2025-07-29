'use client';

import { useState } from 'react';

interface JsonExampleProps {
  title: string;
  description?: string;
  data: any;
  highlightFields?: string[];
  className?: string;
}

export function JsonExample({ title, description, data, highlightFields = [], className = '' }: JsonExampleProps) {
  const formatJson = (obj: any): string => {
    return JSON.stringify(obj, null, 2);
  };

  const highlightSyntax = (jsonString: string): string => {
    return jsonString
      .replace(/(".*?")(\s*:\s*)/g, '<span class="text-blue-400">$1</span>$2')
      .replace(/:\s*(".*?")/g, ': <span class="text-green-400">$1</span>')
      .replace(/:\s*(\d+)/g, ': <span class="text-yellow-400">$1</span>')
      .replace(/:\s*(true|false|null)/g, ': <span class="text-purple-400">$1</span>');
  };

  const addFieldHighlighting = (jsonString: string): string => {
    let highlighted = jsonString;
    highlightFields.forEach(field => {
      const regex = new RegExp(`("${field}")`, 'g');
      highlighted = highlighted.replace(regex, '<span class="bg-primary/20 text-primary rounded px-1">$1</span>');
    });
    return highlighted;
  };

  const processedJson = addFieldHighlighting(highlightSyntax(formatJson(data)));

  return (
    <div className={`bg-secondary border border-border rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <svg className="w-4 h-4 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      {description && (
        <p className="text-xs text-foreground-muted mb-3">{description}</p>
      )}
      <div className="bg-background border border-border rounded-lg p-3 overflow-x-auto">
        <pre 
          className="text-sm font-mono text-foreground whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: processedJson }}
        />
      </div>
    </div>
  );
}

interface WorkflowExampleProps {
  title: string;
  description: string;
  beforeData: any;
  afterData: any;
  beforeTitle?: string;
  afterTitle?: string;
  highlightFields?: string[];
}

export function WorkflowExample({ 
  title, 
  description, 
  beforeData, 
  afterData, 
  beforeTitle = "Before", 
  afterTitle = "After",
  highlightFields = []
}: WorkflowExampleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <div>
          <h3 className="text-base font-medium text-foreground mb-1">{title}</h3>
          <p className="text-sm text-foreground-muted">{description}</p>
        </div>
        <svg 
          className={`w-5 h-5 text-primary transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="mt-4 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <JsonExample
              title={beforeTitle}
              data={beforeData}
              highlightFields={highlightFields}
            />
            <div className="flex flex-col">
              <div className="flex items-center justify-center h-8 mb-2">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
              <JsonExample
                title={afterTitle}
                data={afterData}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}