import React, { useState } from 'react';
import { Compass, Plus, Trash2, Copy, Sparkles } from 'lucide-react';
import { InterestItem } from '../../types/cv.ts';

interface InterestsSectionProps {
  items: InterestItem[];
  onChange: (updated: InterestItem[]) => void;
}

const COMMON_INTERESTS_SUGGESTIONS = [
  { name: 'Open-Source Software Development', description: 'Active contributor to developer tools and frameworks' },
  { name: 'Marathon & Long-Distance Running', description: 'Completed multiple half and full marathons' },
  { name: 'Chess & Strategy Games', description: 'Competitive club player with 1800+ online rating' },
  { name: 'Photography & Digital Media', description: 'Landscape and architectural photography' },
  { name: 'Robotics & Microcontroller Projects', description: 'Building custom IoT sensor platforms' },
  { name: 'Mountain Biking & Hiking', description: 'Alpine endurance trail navigation' },
];

export const InterestsSection: React.FC<InterestsSectionProps> = ({ items = [], onChange }) => {
  const addItem = (preset?: { name: string; description: string }) => {
    const newItem: InterestItem = {
      id: 'int_' + Math.random().toString(36).substring(2, 9),
      name: preset?.name || '',
      description: preset?.description || '',
    };
    onChange([...items, newItem]);
  };

  const duplicateItem = (item: InterestItem) => {
    const clone: InterestItem = {
      ...item,
      id: 'int_' + Math.random().toString(36).substring(2, 9),
      name: `${item.name} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
  };

  const updateItem = (id: string, updates: Partial<InterestItem>) => {
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
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Interests &amp; Hobbies</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Demonstrate curiosity, team spirit, and well-rounded personality outside of work.
          </p>
        </div>
        <button
          type="button"
          onClick={() => addItem()}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Interest</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
          <p className="text-xs text-slate-500">No hobbies or interests added yet.</p>
          <button
            type="button"
            onClick={() => addItem()}
            className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            + Add custom interest
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateItem(item.id, { name: e.target.value })}
                  placeholder="e.g. Marathon Running, Open-Source Mentorship"
                  className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded font-semibold text-slate-900"
                />
                <button
                  type="button"
                  onClick={() => duplicateItem(item)}
                  className="p-1.5 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                  title="Duplicate interest"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="p-1.5 hover:bg-rose-50 rounded text-rose-500 cursor-pointer"
                  title="Delete interest"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <input
                type="text"
                value={item.description || ''}
                onChange={(e) => updateItem(item.id, { description: e.target.value })}
                placeholder="Optional details: Completed 3 marathons; volunteer coordinator for local trails"
                className="w-full px-2.5 py-1 border border-slate-200 rounded text-[11px] text-slate-600"
              />
            </div>
          ))}
        </div>
      )}

      {/* Suggested Quick Add Chips */}
      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
        <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Quick Inspiration Chips:</span>
        </span>
        <div className="flex flex-wrap gap-1.5">
          {COMMON_INTERESTS_SUGGESTIONS.map((sug, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addItem(sug)}
              className="px-2 py-1 text-[11px] bg-white border border-slate-200 hover:border-indigo-400 rounded-md text-slate-700 hover:text-indigo-900 transition-colors cursor-pointer"
            >
              + {sug.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
