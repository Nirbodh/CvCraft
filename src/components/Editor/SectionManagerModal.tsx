import React, { useState } from 'react';
import {
  X,
  Layers,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Edit2,
  Check,
  RotateCcw,
  Plus,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { ALL_CV_SECTIONS, SectionMeta, CV } from '../../types/cv.ts';

interface SectionManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CV;
  onUpdateSectionOrder: (newOrder: string[]) => void;
  onUpdateSectionVisibility: (visibility: Record<string, boolean>) => void;
  onUpdateCustomHeadings: (headings: Record<string, string>) => void;
}

export const SectionManagerModal: React.FC<SectionManagerModalProps> = ({
  isOpen,
  onClose,
  cv,
  onUpdateSectionOrder,
  onUpdateSectionVisibility,
  onUpdateCustomHeadings,
}) => {
  const [editingHeadingKey, setEditingHeadingKey] = useState<string | null>(null);
  const [tempHeadingValue, setTempHeadingValue] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'core' | 'professional' | 'personal' | 'custom'>('all');

  if (!isOpen) return null;

  const currentOrder = cv.sectionOrder || [];
  const visibility = cv.sectionVisibility || {};
  const headings = cv.customHeadings || {};

  // Build ordered list of sections
  const orderedSections: SectionMeta[] = [];
  currentOrder.forEach((key) => {
    const found = ALL_CV_SECTIONS.find((s) => s.key === key);
    if (found) orderedSections.push(found);
  });
  // Add any missing sections
  ALL_CV_SECTIONS.forEach((s) => {
    if (!orderedSections.some((it) => it.key === s.key)) {
      orderedSections.push(s);
    }
  });

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= orderedSections.length) return;
    const newItems = [...orderedSections];
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    onUpdateSectionOrder(newItems.map((s) => s.key));
  };

  const toggleVisibility = (key: string) => {
    const current = visibility[key] !== false;
    onUpdateSectionVisibility({
      ...visibility,
      [key]: !current,
    });
  };

  const startRename = (key: string, currentLabel: string) => {
    setEditingHeadingKey(key);
    setTempHeadingValue(headings[key] || currentLabel);
  };

  const saveRename = (key: string) => {
    onUpdateCustomHeadings({
      ...headings,
      [key]: tempHeadingValue.trim(),
    });
    setEditingHeadingKey(null);
  };

  const resetAllHeadings = () => {
    if (window.confirm('Reset all section headings back to their original defaults?')) {
      onUpdateCustomHeadings({});
    }
  };

  const filteredSections = orderedSections.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                CV Section Manager &amp; Layout Order
              </h3>
              <p className="text-xs text-slate-500">
                Reorder, hide, show, or rename any section to customize your CV layout.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter bar */}
        <div className="px-6 py-2.5 bg-slate-100/60 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1">
            {[
              { id: 'all', label: 'All Sections' },
              { id: 'core', label: 'Core' },
              { id: 'professional', label: 'Professional' },
              { id: 'personal', label: 'Personal & Biodata' },
              { id: 'custom', label: 'Custom' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveCategory(id as any)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                  activeCategory === id
                    ? 'bg-white text-blue-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={resetAllHeadings}
            className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
            title="Reset any custom headings to standard terminology"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Headings</span>
          </button>
        </div>

        {/* Section List Body */}
        <div className="p-6 overflow-y-auto space-y-2.5">
          {filteredSections.map((section, idx) => {
            const isVisible = visibility[section.key] !== false;
            const customTitle = headings[section.key];
            const isEditing = editingHeadingKey === section.key;

            return (
              <div
                key={section.key}
                className={`p-3 rounded-xl border transition-all duration-150 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isVisible
                    ? 'bg-white border-slate-200 shadow-2xs hover:border-slate-300'
                    : 'bg-slate-50/70 border-dashed border-slate-300 opacity-60'
                }`}
              >
                {/* Left: Reorder position + Name + Description */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-slate-100 text-slate-500 font-mono text-xs flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={tempHeadingValue}
                          onChange={(e) => setTempHeadingValue(e.target.value)}
                          className="px-2 py-1 text-xs font-bold text-slate-900 border border-blue-500 rounded bg-blue-50/30 focus:outline-none"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveRename(section.key);
                            if (e.key === 'Escape') setEditingHeadingKey(null);
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => saveRename(section.key)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">
                          {customTitle || section.name}
                        </span>
                        {customTitle && (
                          <span className="text-[10px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded font-mono">
                            Renamed (Default: {section.name})
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 capitalize px-1.5 py-0.2 bg-slate-100 rounded">
                          {section.category}
                        </span>
                      </div>
                    )}
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {section.description}
                    </p>
                  </div>
                </div>

                {/* Right: Actions (Rename, Toggle Visibility, Up / Down Reorder) */}
                <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto text-xs">
                  {/* Rename Button */}
                  <button
                    type="button"
                    onClick={() => startRename(section.key, section.name)}
                    className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded flex items-center gap-1 transition-colors cursor-pointer"
                    title="Rename this section heading on the CV"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Rename</span>
                  </button>

                  {/* Up / Down buttons */}
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 rounded cursor-pointer"
                    title="Move higher in CV"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === orderedSections.length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 rounded cursor-pointer"
                    title="Move lower in CV"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  {/* Toggle Visibility Switch */}
                  <button
                    type="button"
                    onClick={() => toggleVisibility(section.key)}
                    className={`px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      isVisible
                        ? 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {isVisible ? (
                      <>
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Visible</span>
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                        <span>Hidden</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            💡 Sections with 0 entries automatically collapse in print and preview to keep your CV clean.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
