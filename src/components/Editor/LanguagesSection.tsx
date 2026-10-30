import React from 'react';
import { LanguageItem } from '../../types/cv.ts';
import { Plus, Trash2, Copy, ArrowUp, ArrowDown, Languages as LangIcon } from 'lucide-react';

interface LanguagesSectionProps {
  items: LanguageItem[];
  onChange: (updated: LanguageItem[]) => void;
}

const PROFICIENCY_LEVELS = [
  'Native / Bilingual',
  'Full Professional',
  'Professional Working',
  'Conversational',
  'Elementary',
];

const CEFR_LEVELS = [
  { value: '', label: 'CEFR (None)' },
  { value: 'C2', label: 'C2 (Mastery / Native)' },
  { value: 'C1', label: 'C1 (Effective Operational)' },
  { value: 'B2', label: 'B2 (Vantage / Upper Inter.)' },
  { value: 'B1', label: 'B1 (Threshold / Intermediate)' },
  { value: 'A2', label: 'A2 (Waystage / Elementary)' },
  { value: 'A1', label: 'A1 (Breakthrough / Beginner)' },
];

const POPULAR_LANGUAGES = ['English', 'Spanish', 'German', 'French', 'Mandarin', 'Japanese', 'Arabic', 'Bengali'];

export const LanguagesSection: React.FC<LanguagesSectionProps> = ({ items = [], onChange }) => {
  const addItem = (language = '', proficiency = 'Professional Working', level = '') => {
    const newItem: LanguageItem = {
      id: 'lang_' + Math.random().toString(36).substring(2, 9),
      language,
      proficiency,
      level,
    };
    onChange([...items, newItem]);
  };

  const duplicateItem = (item: LanguageItem) => {
    const clone: LanguageItem = {
      ...item,
      id: 'lang_' + Math.random().toString(36).substring(2, 9),
      language: `${item.language} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
  };

  const updateItem = (id: string, updates: Partial<LanguageItem>) => {
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
          <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
            <LangIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>Languages &amp; Proficiency</span>
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Spoken languages, CEFR European standard levels (A1–C2), or working proficiency.
          </p>
        </div>
        <button
          type="button"
          onClick={() => addItem()}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Language</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-500 space-y-2">
          <p>No languages added.</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {POPULAR_LANGUAGES.slice(0, 4).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => addItem(lang)}
                className="text-xs text-blue-600 hover:underline cursor-pointer"
              >
                + {lang}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <div
              key={item.id}
              className="p-2.5 border border-slate-200 rounded-md bg-white flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs"
            >
              <input
                type="text"
                value={item.language}
                onChange={(e) => updateItem(item.id, { language: e.target.value })}
                placeholder="Language (e.g. French)"
                className="flex-1 px-2.5 py-1 border border-slate-200 rounded text-slate-900"
              />
              <select
                value={item.proficiency}
                onChange={(e) => updateItem(item.id, { proficiency: e.target.value })}
                className="px-2 py-1 border border-slate-200 rounded text-slate-900 bg-white"
              >
                {PROFICIENCY_LEVELS.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>

              <select
                value={item.level || ''}
                onChange={(e) => updateItem(item.id, { level: e.target.value })}
                className="px-2 py-1 border border-slate-200 rounded text-slate-900 bg-white"
                title="Common European Framework of Reference (CEFR) Level"
              >
                {CEFR_LEVELS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>

              <div className="flex items-center justify-end gap-1 shrink-0">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveItem(index, 'up')}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 cursor-pointer"
                  title="Move up"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === items.length - 1}
                  onClick={() => moveItem(index, 'down')}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 disabled:opacity-30 cursor-pointer"
                  title="Move down"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => duplicateItem(item)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                  title="Duplicate language"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                  title="Delete language"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
