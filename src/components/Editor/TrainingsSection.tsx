import React, { useState } from 'react';
import { Presentation, Plus, Trash2, Copy, ChevronDown, ChevronUp, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { TrainingItem } from '../../types/cv.ts';

interface TrainingsSectionProps {
  items: TrainingItem[];
  onChange: (updated: TrainingItem[]) => void;
}

export const TrainingsSection: React.FC<TrainingsSectionProps> = ({ items = [], onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addItem = () => {
    const newItem: TrainingItem = {
      id: 'trn_' + Math.random().toString(36).substring(2, 9),
      name: '',
      provider: '',
      completionDate: new Date().getFullYear().toString(),
      credentialUrl: '',
      description: '',
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const duplicateItem = (item: TrainingItem) => {
    const clone: TrainingItem = {
      ...item,
      id: 'trn_' + Math.random().toString(36).substring(2, 9),
      name: `${item.name} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
    setExpandedId(clone.id);
  };

  const updateItem = (id: string, updates: Partial<TrainingItem>) => {
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
        <div>
          <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Presentation className="w-4 h-4 text-emerald-600" />
            <span>Training &amp; Workshops</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Executive courses, technical bootcamps, masterclasses, and corporate workshops.
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Training</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No training courses added yet.</p>
          <button
            type="button"
            onClick={addItem}
            className="text-xs text-blue-600 font-semibold hover:underline mt-1 cursor-pointer"
          >
            + Add your first training program
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.name || 'Untitled Training'}
                    </span>
                    {item.provider && (
                      <span className="text-[11px] text-slate-500 truncate">
                        · {item.provider}
                      </span>
                    )}
                    {item.completionDate && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({item.completionDate})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveItem(index, 'up')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === items.length - 1}
                      onClick={() => moveItem(index, 'down')}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateItem(item)}
                      className="p-1 hover:bg-slate-200 rounded text-slate-500 cursor-pointer"
                      title="Duplicate entry"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400 ml-1" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
                    )}
                  </div>
                </div>

                {/* Body */}
                {isExpanded && (
                  <div className="p-3.5 space-y-3 border-t border-slate-100 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 font-medium mb-1">
                          Training / Workshop Program Name
                        </label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, { name: e.target.value })}
                          placeholder="e.g. Advanced Distributed Systems Masterclass"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Completion Date
                        </label>
                        <input
                          type="text"
                          value={item.completionDate}
                          onChange={(e) => updateItem(item.id, { completionDate: e.target.value })}
                          placeholder="e.g. Dec 2023"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Provider / Institution / Platform
                        </label>
                        <input
                          type="text"
                          value={item.provider}
                          onChange={(e) => updateItem(item.id, { provider: e.target.value })}
                          placeholder="e.g. Linux Foundation, MIT Professional Education"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                          <span>Certificate Link (Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={item.credentialUrl || ''}
                          onChange={(e) => updateItem(item.id, { credentialUrl: e.target.value })}
                          placeholder="e.g. https://certificates.example.com/..."
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        Curriculum Highlights &amp; Skills Acquired
                      </label>
                      <textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="Topics covered: multi-cluster Kubernetes networking, eBPF telemetry, and zero-trust security..."
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
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
