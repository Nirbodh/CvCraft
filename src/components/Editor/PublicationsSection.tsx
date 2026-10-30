import React, { useState } from 'react';
import { BookOpen, Plus, Trash2, Copy, ChevronDown, ChevronUp, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react';
import { PublicationItem } from '../../types/cv.ts';

interface PublicationsSectionProps {
  items: PublicationItem[];
  onChange: (updated: PublicationItem[]) => void;
}

export const PublicationsSection: React.FC<PublicationsSectionProps> = ({ items = [], onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addItem = () => {
    const newItem: PublicationItem = {
      id: 'pub_' + Math.random().toString(36).substring(2, 9),
      title: '',
      publisher: '',
      date: new Date().getFullYear().toString(),
      authors: '',
      url: '',
      description: '',
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const duplicateItem = (item: PublicationItem) => {
    const clone: PublicationItem = {
      ...item,
      id: 'pub_' + Math.random().toString(36).substring(2, 9),
      title: `${item.title} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
    setExpandedId(clone.id);
  };

  const updateItem = (id: string, updates: Partial<PublicationItem>) => {
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
            <BookOpen className="w-4 h-4 text-purple-600" />
            <span>Publications &amp; Research</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Peer-reviewed papers, conference proceedings, patents, books, or technical articles.
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Publication</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No publications added yet.</p>
          <button
            type="button"
            onClick={addItem}
            className="text-xs text-blue-600 font-semibold hover:underline mt-1 cursor-pointer"
          >
            + Add your first publication
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
                      {item.title || 'Untitled Publication'}
                    </span>
                    {item.publisher && (
                      <span className="text-[11px] text-slate-500 truncate">
                        · {item.publisher}
                      </span>
                    )}
                    {item.date && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({item.date})
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
                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        Publication / Article Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateItem(item.id, { title: e.target.value })}
                        placeholder="e.g. Distributed Consensus in Cloud Architectures"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Journal / Publisher / Conference
                        </label>
                        <input
                          type="text"
                          value={item.publisher}
                          onChange={(e) => updateItem(item.id, { publisher: e.target.value })}
                          placeholder="e.g. IEEE Transactions on Cloud Computing"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Date / Year of Publication
                        </label>
                        <input
                          type="text"
                          value={item.date}
                          onChange={(e) => updateItem(item.id, { date: e.target.value })}
                          placeholder="e.g. Oct 2023"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Authors
                        </label>
                        <input
                          type="text"
                          value={item.authors || ''}
                          onChange={(e) => updateItem(item.id, { authors: e.target.value })}
                          placeholder="e.g. A. Vance, B. Smith, C. Taylor"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                          <span>DOI / Paper URL (Optional)</span>
                        </label>
                        <input
                          type="url"
                          value={item.url || ''}
                          onChange={(e) => updateItem(item.id, { url: e.target.value })}
                          placeholder="e.g. https://doi.org/10.1109/..."
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        Brief Abstract or Key Findings
                      </label>
                      <textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="Summarize the core premise, methods, and practical relevance..."
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
