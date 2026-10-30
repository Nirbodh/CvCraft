import React, { useState } from 'react';
import { UserCheck, Plus, Trash2, Copy, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Mail, Phone } from 'lucide-react';
import { ReferenceItem } from '../../types/cv.ts';

interface ReferencesSectionProps {
  items: ReferenceItem[];
  onChange: (updated: ReferenceItem[]) => void;
}

export const ReferencesSection: React.FC<ReferencesSectionProps> = ({ items = [], onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addItem = () => {
    const newItem: ReferenceItem = {
      id: 'ref_' + Math.random().toString(36).substring(2, 9),
      name: '',
      company: '',
      position: '',
      email: '',
      phone: '',
      relationship: '',
      availableOnRequest: false,
    };
    onChange([...items, newItem]);
    setExpandedId(newItem.id);
  };

  const addAvailableUponRequestPlaceholder = () => {
    const placeholder: ReferenceItem = {
      id: 'ref_' + Math.random().toString(36).substring(2, 9),
      name: 'References Available Upon Request',
      company: '',
      position: '',
      availableOnRequest: true,
    };
    onChange([placeholder]);
  };

  const duplicateItem = (item: ReferenceItem) => {
    const clone: ReferenceItem = {
      ...item,
      id: 'ref_' + Math.random().toString(36).substring(2, 9),
      name: `${item.name} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
    setExpandedId(clone.id);
  };

  const updateItem = (id: string, updates: Partial<ReferenceItem>) => {
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
            <UserCheck className="w-4 h-4 text-blue-600" />
            <span>Professional References</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Former managers, colleagues, or academic advisors who can vouch for your work.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={addAvailableUponRequestPlaceholder}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors cursor-pointer"
            title="Set to 'References Available Upon Request'"
          >
            "Upon Request"
          </button>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Referee</span>
          </button>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
          <p className="text-xs text-slate-500">No references added yet.</p>
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={addItem}
              className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
            >
              + Add specific referee
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={addAvailableUponRequestPlaceholder}
              className="text-xs text-slate-600 hover:underline cursor-pointer"
            >
              Add "Available Upon Request" line
            </button>
          </div>
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
                      {item.name || 'Referee Name'}
                    </span>
                    {item.company && (
                      <span className="text-[11px] text-slate-500 truncate">
                        · {item.position ? `${item.position}, ` : ''}{item.company}
                      </span>
                    )}
                    {item.availableOnRequest && (
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                        Generic Note
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
                    <div className="flex items-center gap-2 pb-1 border-b border-slate-100">
                      <label className="inline-flex items-center gap-1.5 cursor-pointer font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={item.availableOnRequest || false}
                          onChange={(e) =>
                            updateItem(item.id, {
                              availableOnRequest: e.target.checked,
                              name: e.target.checked ? 'Available Upon Request' : item.name,
                            })
                          }
                          className="rounded text-blue-600"
                        />
                        <span>Display as "References available upon request" banner</span>
                      </label>
                    </div>

                    {!item.availableOnRequest && (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              Referee Full Name
                            </label>
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => updateItem(item.id, { name: e.target.value })}
                              placeholder="e.g. Dr. Jennifer Adams"
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              Job Title / Position
                            </label>
                            <input
                              type="text"
                              value={item.position}
                              onChange={(e) => updateItem(item.id, { position: e.target.value })}
                              placeholder="e.g. VP of Product Architecture"
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              Company / Organization
                            </label>
                            <input
                              type="text"
                              value={item.company}
                              onChange={(e) => updateItem(item.id, { company: e.target.value })}
                              placeholder="e.g. Google / Salesforce"
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-medium mb-1">
                              Professional Relationship
                            </label>
                            <input
                              type="text"
                              value={item.relationship || ''}
                              onChange={(e) => updateItem(item.id, { relationship: e.target.value })}
                              placeholder="e.g. Former Direct Supervisor (4 years)"
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>Email Address</span>
                            </label>
                            <input
                              type="email"
                              value={item.email || ''}
                              onChange={(e) => updateItem(item.id, { email: e.target.value })}
                              placeholder="e.g. j.adams@example.com"
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                            />
                          </div>
                          <div>
                            <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              <span>Phone Number</span>
                            </label>
                            <input
                              type="tel"
                              value={item.phone || ''}
                              onChange={(e) => updateItem(item.id, { phone: e.target.value })}
                              placeholder="e.g. +1 (555) 765-4321"
                              className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                            />
                          </div>
                        </div>
                      </>
                    )}
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
