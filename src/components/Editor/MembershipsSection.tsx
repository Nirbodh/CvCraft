import React, { useState } from 'react';
import { Users, Plus, Trash2, Copy, ChevronDown, ChevronUp, ArrowUp, ArrowDown } from 'lucide-react';
import { MembershipItem } from '../../types/cv.ts';

interface MembershipsSectionProps {
  items: MembershipItem[];
  onChange: (updated: MembershipItem[]) => void;
}

export const MembershipsSection: React.FC<MembershipsSectionProps> = ({ items = [], onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addItem = () => {
    const newItem: MembershipItem = {
      id: 'mem_' + Math.random().toString(36).substring(2, 9),
      organization: '',
      role: 'Member',
      startDate: new Date().getFullYear().toString(),
      endDate: 'Present',
      current: true,
      description: '',
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const duplicateItem = (item: MembershipItem) => {
    const clone: MembershipItem = {
      ...item,
      id: 'mem_' + Math.random().toString(36).substring(2, 9),
      organization: `${item.organization} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
    setExpandedId(clone.id);
  };

  const updateItem = (id: string, updates: Partial<MembershipItem>) => {
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
            <Users className="w-4 h-4 text-teal-600" />
            <span>Professional Memberships</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Industry associations, engineering societies (e.g. IEEE, ACM, Bar Association, CIPD).
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Membership</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs text-slate-500">No memberships added yet.</p>
          <button
            type="button"
            onClick={addItem}
            className="text-xs text-blue-600 font-semibold hover:underline mt-1 cursor-pointer"
          >
            + Add your first membership
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
                      {item.organization || 'Untitled Organization'}
                    </span>
                    {item.role && (
                      <span className="text-[11px] text-slate-500 truncate">
                        · {item.role}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Organization / Society Name
                        </label>
                        <input
                          type="text"
                          value={item.organization}
                          onChange={(e) => updateItem(item.id, { organization: e.target.value })}
                          placeholder="e.g. IEEE Computer Society"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Membership Level / Role
                        </label>
                        <input
                          type="text"
                          value={item.role || ''}
                          onChange={(e) => updateItem(item.id, { role: e.target.value })}
                          placeholder="e.g. Senior Member, Fellow, Committee Chair"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          Member Since
                        </label>
                        <input
                          type="text"
                          value={item.startDate || ''}
                          onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                          placeholder="e.g. 2020"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">
                          End Date / Status
                        </label>
                        <input
                          type="text"
                          value={item.endDate || 'Present'}
                          onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                          placeholder="e.g. Present"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">
                        Activities &amp; Contributions (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="e.g. Co-organizer of annual regional symposium, peer reviewer for transaction articles..."
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
