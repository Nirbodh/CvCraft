/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Dynamic Field Renderer
 * Renders template-defined fields seamlessly within existing CV editor sections.
 */

import React from 'react';
import { TemplateFieldDefinition } from '../../types/template.ts';
import { HelpCircle } from 'lucide-react';

interface DynamicFieldRendererProps {
  fields: TemplateFieldDefinition[];
  values: Record<string, any>;
  onChange: (fieldId: string, value: any) => void;
  themeColor?: string;
}

export const DynamicFieldRenderer: React.FC<DynamicFieldRendererProps> = ({
  fields,
  values,
  onChange,
  themeColor = '#2563eb',
}) => {
  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {fields.map((field) => {
        const value = values[field.id] !== undefined ? values[field.id] : '';
        const isFullWidth = field.type === 'textarea' || (field.placeholder && field.placeholder.length > 40);

        return (
          <div
            key={field.id}
            className={isFullWidth ? 'col-span-full' : 'sm:col-span-1'}
          >
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor={`dynamic-field-${field.id}`}
                className="block text-slate-700 font-medium text-[11px]"
              >
                {field.label}
                {field.required && <span className="text-rose-500 ml-1 font-bold">*</span>}
              </label>

              {field.helpText && (
                <div
                  className="group relative flex items-center text-slate-400 hover:text-slate-600 cursor-help"
                  title={field.helpText}
                >
                  <HelpCircle className="w-3 h-3" />
                  <div className="hidden group-hover:block absolute right-0 bottom-full mb-1 w-48 p-1.5 bg-slate-900 text-white text-[10px] rounded shadow-md z-30 pointer-events-none">
                    {field.helpText}
                  </div>
                </div>
              )}
            </div>

            {/* Field Type Specific Controls */}
            {field.type === 'textarea' && (
              <textarea
                id={`dynamic-field-${field.id}`}
                rows={3}
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white leading-relaxed"
              />
            )}

            {field.type === 'select' && (
              <select
                id={`dynamic-field-${field.id}`}
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer"
              >
                <option value="">-- Select --</option>
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'date' && (
              <input
                type="date"
                id={`dynamic-field-${field.id}`}
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
            )}

            {field.type === 'number' && (
              <input
                type="number"
                id={`dynamic-field-${field.id}`}
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
                min={field.validation?.min}
                max={field.validation?.max}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
            )}

            {field.type === 'boolean' && (
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  id={`dynamic-field-${field.id}`}
                  checked={Boolean(value)}
                  onChange={(e) => onChange(field.id, e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-slate-700 select-none">
                  {field.placeholder || 'Yes / Enable'}
                </span>
              </label>
            )}

            {(field.type === 'text' || field.type === 'email' || field.type === 'phone' || field.type === 'url') && (
              <input
                type={field.type}
                id={`dynamic-field-${field.id}`}
                value={value}
                onChange={(e) => onChange(field.id, e.target.value)}
                placeholder={field.placeholder || ''}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
            )}

            {field.helpText && !field.required && (
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{field.helpText}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
