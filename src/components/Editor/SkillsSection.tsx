import React from 'react';
import { SkillCategory } from '../../types/cv.ts';
import { Plus, Trash2, Tag } from 'lucide-react';

interface SkillsSectionProps {
  items: SkillCategory[];
  onChange: (updated: SkillCategory[]) => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ items, onChange }) => {
  const addCategory = () => {
    const newCat: SkillCategory = {
      id: 'sk_' + Math.random().toString(36).substring(2, 9),
      category: 'Technical Skills',
      items: ['JavaScript', 'TypeScript', 'React'],
    };
    onChange([...items, newCat]);
  };

  const updateCategory = (id: string, updates: Partial<SkillCategory>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const removeCategory = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  const handleItemsChange = (id: string, text: string) => {
    const splitted = text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    updateCategory(id, { items: splitted });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700">Skills &amp; Competency Groups</span>
        <button
          type="button"
          onClick={addCategory}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Skill Group</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-500">
          No skills added yet. Add skill groups like &ldquo;Core Languages&rdquo;, &ldquo;Frameworks&rdquo;, or &ldquo;Management&rdquo;.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((cat) => (
            <div key={cat.id} className="p-3 border border-slate-200 rounded-md bg-white space-y-2 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={cat.category}
                    onChange={(e) => updateCategory(cat.id, { category: e.target.value })}
                    placeholder="e.g. Frontend Technologies"
                    className="font-semibold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeCategory(cat.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <label className="block text-slate-500 text-[11px] mb-1">
                  Skills (comma-separated list)
                </label>
                <input
                  type="text"
                  value={cat.items.join(', ')}
                  onChange={(e) => handleItemsChange(cat.id, e.target.value)}
                  placeholder="React, TypeScript, Next.js, Node.js, GraphQL"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
              </div>

              {/* Tag preview */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {cat.items.map((item, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[11px]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
