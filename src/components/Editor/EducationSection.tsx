import React, { useState } from 'react';
import { EducationItem } from '../../types/cv.ts';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Copy } from 'lucide-react';

interface EducationSectionProps {
  items: EducationItem[];
  onChange: (updated: EducationItem[]) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addItem = () => {
    const newItem: EducationItem = {
      id: 'edu_' + Math.random().toString(36).substring(2, 9),
      degree: '',
      field: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      description: '',
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const duplicateItem = (item: EducationItem) => {
    const clone: EducationItem = {
      ...item,
      id: 'edu_' + Math.random().toString(36).substring(2, 9),
      degree: `${item.degree} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
    setExpandedId(clone.id);
  };

  const updateItem = (id: string, updates: Partial<EducationItem>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= items.length) return;
    const newItems = [...items];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700">Degrees &amp; Academic Credentials</span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Education</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-500">
          No education entries added yet. Click &ldquo;Add Education&rdquo; to add your degrees.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="border border-slate-200 rounded-md bg-white overflow-hidden">
                <div
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.degree || 'Degree'} {item.field && `in ${item.field}`}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      · {item.institution || 'University'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateItem(item)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Duplicate degree"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-3.5 space-y-3 text-xs border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Degree / Qualification</label>
                        <input
                          type="text"
                          value={item.degree}
                          onChange={(e) => updateItem(item.id, { degree: e.target.value })}
                          placeholder="e.g. Bachelor of Science"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Field of Study / Major</label>
                        <input
                          type="text"
                          value={item.field}
                          onChange={(e) => updateItem(item.id, { field: e.target.value })}
                          placeholder="e.g. Computer Science"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Institution / School</label>
                        <input
                          type="text"
                          value={item.institution}
                          onChange={(e) => updateItem(item.id, { institution: e.target.value })}
                          placeholder="e.g. University of California, Berkeley"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Location</label>
                        <input
                          type="text"
                          value={item.location || ''}
                          onChange={(e) => updateItem(item.id, { location: e.target.value })}
                          placeholder="e.g. Berkeley, CA"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Start &amp; Graduation Year</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item.startDate}
                            onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                            placeholder="Start (e.g. 2016)"
                            className="px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                          />
                          <input
                            type="text"
                            value={item.endDate}
                            onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                            placeholder="Graduation (e.g. 2020)"
                            className="px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">GPA / Honors (optional)</label>
                        <input
                          type="text"
                          value={item.gpa || ''}
                          onChange={(e) => updateItem(item.id, { gpa: e.target.value })}
                          placeholder="e.g. 3.9 / 4.0 (Magna Cum Laude)"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Additional Academic Notes (optional)</label>
                      <input
                        type="text"
                        value={item.description || ''}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="e.g. Dean's Honor List, Capstone in Distributed Systems"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
