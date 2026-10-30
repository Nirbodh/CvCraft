import React from 'react';
import { FilePlus2, Plus, Trash2, Copy, Sparkles } from 'lucide-react';
import { AdditionalInfoItem } from '../../types/cv.ts';
import { DynamicFieldRenderer } from './DynamicFieldRenderer.tsx';
import { TemplateFieldDefinition } from '../../types/template.ts';

interface AdditionalInfoSectionProps {
  items: AdditionalInfoItem[];
  dynamicFields?: TemplateFieldDefinition[];
  dynamicValues?: Record<string, any>;
  onDynamicChange?: (fieldId: string, value: any) => void;
  onChange: (updated: AdditionalInfoItem[]) => void;
}

const COMMON_ADDITIONAL_SUGGESTIONS = [
  { title: 'Security Clearance', content: 'Active Secret Clearance / Baseline Personnel Security Standard (BPSS)' },
  { title: 'Notice Period & Availability', content: 'Immediate availability / Standard 4-week notice period' },
  { title: 'Work Authorization', content: 'Full, unrestricted work authorization with no sponsorship required' },
  { title: 'Patents & Trademarks', content: 'Co-inventor on 2 international systems patents for low-latency indexing' },
];

export const AdditionalInfoSection: React.FC<AdditionalInfoSectionProps> = ({
  items = [],
  dynamicFields = [],
  dynamicValues = {},
  onDynamicChange,
  onChange,
}) => {
  const addItem = (preset?: { title: string; content: string }) => {
    const newItem: AdditionalInfoItem = {
      id: 'add_' + Math.random().toString(36).substring(2, 9),
      title: preset?.title || '',
      content: preset?.content || '',
    };
    onChange([...items, newItem]);
  };

  const duplicateItem = (item: AdditionalInfoItem) => {
    const clone: AdditionalInfoItem = {
      ...item,
      id: 'add_' + Math.random().toString(36).substring(2, 9),
      title: `${item.title} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
  };

  const updateItem = (id: string, updates: Partial<AdditionalInfoItem>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <FilePlus2 className="w-4 h-4 text-slate-700" />
            <span>Additional Information</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Notice period, security clearances, patents, availability, or other key specifics.
          </p>
        </div>
        <button
          type="button"
          onClick={() => addItem()}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Entry</span>
        </button>
      </div>

      {/* Dynamic Template-Driven Fields for Additional Info (e.g. Self PR / Personal Requests) */}
      {dynamicFields && dynamicFields.length > 0 && onDynamicChange && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-lg space-y-2">
          <span className="text-xs font-bold text-blue-950 block pb-1 border-b border-blue-200">
            Template-Specific Additional Fields
          </span>
          <DynamicFieldRenderer
            fields={dynamicFields}
            values={dynamicValues}
            onChange={onDynamicChange}
          />
        </div>
      )}

      {items.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
          <p className="text-xs text-slate-500">No additional details recorded.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {COMMON_ADDITIONAL_SUGGESTIONS.slice(0, 2).map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addItem(sug)}
                className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                + Add "{sug.title}"
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => updateItem(item.id, { title: e.target.value })}
                  placeholder="e.g. Notice Period / Security Clearance"
                  className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded font-semibold text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => duplicateItem(item)}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                  title="Duplicate entry"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 hover:bg-rose-50 rounded text-rose-500 cursor-pointer"
                  title="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <textarea
                rows={2}
                value={item.content}
                onChange={(e) => updateItem(item.id, { content: e.target.value })}
                placeholder="Details or explanation..."
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-800"
              />
            </div>
          ))}
        </div>
      )}

      {/* Suggested chips */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-slate-500" />
          <span>Quick Inspiration Presets:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_ADDITIONAL_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addItem(sug)}
              className="px-2 py-1 text-[11px] bg-white border border-slate-200 hover:border-slate-400 rounded-md text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              + {sug.title}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
