import React from 'react';
import { Car, Plus, Trash2, Copy, CheckCircle2 } from 'lucide-react';
import { DrivingLicenceItem } from '../../types/cv.ts';

interface DrivingLicenceSectionProps {
  items: DrivingLicenceItem[];
  onChange: (updated: DrivingLicenceItem[]) => void;
}

const COMMON_LICENCE_PRESETS = [
  { category: 'Full Clean Driving Licence (Category B / Car)', hasOwnVehicle: true },
  { category: 'Commercial Driver License (CDL / Class A/B)', hasOwnVehicle: false },
  { category: 'Motorcycle Endorsement (Class M / Category A)', hasOwnVehicle: true },
  { category: 'Clean European Driver Licence', hasOwnVehicle: true },
];

export const DrivingLicenceSection: React.FC<DrivingLicenceSectionProps> = ({ items = [], onChange }) => {
  const addItem = (preset?: { category: string; hasOwnVehicle: boolean }) => {
    const newItem: DrivingLicenceItem = {
      id: 'dl_' + Math.random().toString(36).substring(2, 9),
      category: preset?.category || '',
      issuedBy: '',
      hasOwnVehicle: preset?.hasOwnVehicle ?? false,
      notes: '',
    };
    onChange([...items, newItem]);
  };

  const duplicateItem = (item: DrivingLicenceItem) => {
    const clone: DrivingLicenceItem = {
      ...item,
      id: 'dl_' + Math.random().toString(36).substring(2, 9),
      category: `${item.category} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
  };

  const updateItem = (id: string, updates: Partial<DrivingLicenceItem>) => {
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
            <Car className="w-4 h-4 text-blue-600" />
            <span>Driving Licence &amp; Mobility</span>
          </h3>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Particularly valued for field roles, engineering inspections, logistics, and UK/EU positions.
          </p>
        </div>
        <button
          type="button"
          onClick={() => addItem()}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Licence</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 bg-slate-50 border border-dashed border-slate-200 rounded-xl space-y-2">
          <p className="text-xs text-slate-500">No driving licence information added.</p>
          <div className="flex flex-wrap justify-center gap-2">
            {COMMON_LICENCE_PRESETS.slice(0, 2).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addItem(preset)}
                className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
              >
                + Add "{preset.category}"
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 bg-white border border-slate-200 rounded-lg shadow-2xs space-y-2.5 text-xs"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.category}
                  onChange={(e) => updateItem(item.id, { category: e.target.value })}
                  placeholder="e.g. Category B (Clean, 0 penalty points)"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-slate-500 font-medium mb-1">
                    Issuing Authority / Country
                  </label>
                  <input
                    type="text"
                    value={item.issuedBy || ''}
                    onChange={(e) => updateItem(item.id, { issuedBy: e.target.value })}
                    placeholder="e.g. DVLA (UK), DMV (California)"
                    className="w-full px-2.5 py-1 border border-slate-200 rounded text-slate-800 text-[11px]"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="inline-flex items-center gap-2 cursor-pointer font-medium text-slate-700 text-[11px]">
                    <input
                      type="checkbox"
                      checked={item.hasOwnVehicle || false}
                      onChange={(e) => updateItem(item.id, { hasOwnVehicle: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Has Own Vehicle / Independent Transport</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
