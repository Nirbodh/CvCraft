import React, { useState } from 'react';
import { CustomSectionItem } from '../../types/cv.ts';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface CustomSectionsProps {
  items: CustomSectionItem[];
  onChange: (updated: CustomSectionItem[]) => void;
}

export const CustomSections: React.FC<CustomSectionsProps> = ({ items = [], onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addItem = (title = 'New Custom Section') => {
    const newItem: CustomSectionItem = {
      id: 'cust_' + Math.random().toString(36).substring(2, 9),
      title,
      content: '',
      subtitle: '',
      date: '',
      items: [''],
    };
    onChange([...items, newItem]);
    setExpandedId(newItem.id);
  };

  const duplicateItem = (item: CustomSectionItem) => {
    const clone: CustomSectionItem = {
      ...item,
      id: 'cust_' + Math.random().toString(36).substring(2, 9),
      title: `${item.title} (Copy)`,
      items: item.items ? [...item.items] : [''],
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
    setExpandedId(clone.id);
  };

  const updateItem = (id: string, updates: Partial<CustomSectionItem>) => {
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

  const addBullet = (itemId: string) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const bullets = [...(target.items || []), ''];
    updateItem(itemId, { items: bullets });
  };

  const updateBullet = (itemId: string, index: number, value: string) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const bullets = [...(target.items || [])];
    bullets[index] = value;
    updateItem(itemId, { items: bullets });
  };

  const removeBullet = (itemId: string, index: number) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const bullets = (target.items || []).filter((_, i) => i !== index);
    updateItem(itemId, { items: bullets });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Custom Sections</span>
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Create any specialized section with custom headings, dates, and bullet points.
          </p>
        </div>
        <button
          type="button"
          onClick={() => addItem()}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Custom Section</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-500 space-y-2">
          <p>No custom sections created yet.</p>
          <button
            type="button"
            onClick={() => addItem()}
            className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            + Create a custom section
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-2xs text-xs"
              >
                {/* Header */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <span className="font-bold text-slate-900 truncate">
                      {item.title || 'Untitled Custom Section'}
                    </span>
                    {item.subtitle && (
                      <span className="text-[11px] text-slate-500 truncate">
                        · {item.subtitle}
                      </span>
                    )}
                    {item.date && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({item.date})
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
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
                      title="Duplicate section"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 hover:bg-rose-100 rounded text-rose-500 cursor-pointer"
                      title="Delete section"
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
                  <div className="p-3.5 space-y-3 border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="sm:col-span-2">
                        <label className="block text-slate-600 font-medium mb-1">
                          Section Heading / Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => updateItem(item.id, { title: e.target.value })}
                          placeholder="e.g. Keynote Speaking, Grants &amp; Funding, Side Ventures"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Date / Timeline (Optional)
                        </label>
                        <input
                          type="text"
                          value={item.date || ''}
                          onChange={(e) => updateItem(item.id, { date: e.target.value })}
                          placeholder="e.g. 2021 – Present"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        Subtitle / Role / Sub-heading (Optional)
                      </label>
                      <input
                        type="text"
                        value={item.subtitle || ''}
                        onChange={(e) => updateItem(item.id, { subtitle: e.target.value })}
                        placeholder="e.g. Invited Speaker at DevOps World 2023"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        Main Paragraph Description
                      </label>
                      <textarea
                        rows={2}
                        value={item.content}
                        onChange={(e) => updateItem(item.id, { content: e.target.value })}
                        placeholder="Detailed narrative or background..."
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 leading-relaxed"
                      />
                    </div>

                    {/* Bullet list */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-slate-600 font-medium">Bullet Items (Optional)</label>
                        <button
                          type="button"
                          onClick={() => addBullet(item.id)}
                          className="text-[11px] text-blue-600 hover:underline cursor-pointer"
                        >
                          + Add bullet
                        </button>
                      </div>
                      <div className="space-y-1.5">
                        {(item.items || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={bullet}
                              onChange={(e) => updateBullet(item.id, bIdx, e.target.value)}
                              placeholder="e.g. Delivered 45-minute keynote to 1,200 attendees."
                              className="flex-1 px-2.5 py-1 border border-slate-200 rounded text-slate-900 text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => removeBullet(item.id, bIdx)}
                              className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
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
