import React, { useState } from 'react';
import { ExperienceItem } from '../../types/cv.ts';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, Sparkles, Check, Copy } from 'lucide-react';
import { analyzeAndEnhanceBullet, BulletAnalysis } from '../../services/writingAssistant.ts';

interface ExperienceSectionProps {
  items: ExperienceItem[];
  onChange: (updated: ExperienceItem[]) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);
  const [activeAnalysis, setActiveAnalysis] = useState<{
    itemId: string;
    bulletIdx: number;
    analysis: BulletAnalysis;
  } | null>(null);

  const addItem = () => {
    const newItem: ExperienceItem = {
      id: 'exp_' + Math.random().toString(36).substring(2, 9),
      role: '',
      company: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      current: true,
      description: '',
      highlights: [''],
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const duplicateItem = (item: ExperienceItem) => {
    const clone: ExperienceItem = {
      ...item,
      id: 'exp_' + Math.random().toString(36).substring(2, 9),
      role: `${item.role} (Copy)`,
      highlights: item.highlights ? [...item.highlights] : [''],
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
    setExpandedId(clone.id);
  };

  const updateItem = (id: string, updates: Partial<ExperienceItem>) => {
    onChange(
      items.map((it) => (it.id === id ? { ...it, ...updates } : it))
    );
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

  const addHighlight = (itemId: string) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const highlights = [...(target.highlights || []), ''];
    updateItem(itemId, { highlights });
  };

  const updateHighlight = (itemId: string, index: number, value: string) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const highlights = [...(target.highlights || [])];
    highlights[index] = value;
    updateItem(itemId, { highlights });
  };

  const removeHighlight = (itemId: string, index: number) => {
    const target = items.find((it) => it.id === itemId);
    if (!target) return;
    const highlights = (target.highlights || []).filter((_, i) => i !== index);
    updateItem(itemId, { highlights });
  };

  const handleAnalyzeBullet = (itemId: string, bulletIdx: number, text: string) => {
    const analysis = analyzeAndEnhanceBullet(text);
    setActiveAnalysis({ itemId, bulletIdx, analysis });
  };

  const applyEnhancedBullet = (suggestion: string) => {
    if (!activeAnalysis) return;
    updateHighlight(activeAnalysis.itemId, activeAnalysis.bulletIdx, suggestion);
    setActiveAnalysis(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700">Work History &amp; Roles</span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Position</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-500">
          No experience entries added yet. Click &ldquo;Add Position&rdquo; to add your career history.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="border border-slate-200 rounded-md bg-white overflow-hidden">
                {/* Header bar */}
                <div
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.role || 'New Position'}
                    </span>
                    <span className="text-xs text-slate-500 truncate">
                      · {item.company || 'Company Name'}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({item.startDate || 'Year'} - {item.current ? 'Present' : item.endDate || 'Year'})
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateItem(item)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Duplicate position"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                      title="Delete entry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Form fields */}
                {isExpanded && (
                  <div className="p-3.5 space-y-3 text-xs border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Job Title / Role</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => updateItem(item.id, { role: e.target.value })}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => updateItem(item.id, { company: e.target.value })}
                          placeholder="e.g. Acme Corp"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Location</label>
                        <input
                          type="text"
                          value={item.location || ''}
                          onChange={(e) => updateItem(item.id, { location: e.target.value })}
                          placeholder="e.g. New York, NY (or Remote)"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-slate-600 font-medium">Dates</label>
                          <label className="inline-flex items-center gap-1 text-[11px] text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.current}
                              onChange={(e) => updateItem(item.id, { current: e.target.checked })}
                              className="rounded text-blue-600"
                            />
                            <span>Currently working here</span>
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={item.startDate}
                            onChange={(e) => updateItem(item.id, { startDate: e.target.value })}
                            placeholder="Start (e.g. 2021)"
                            className="px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                          />
                          <input
                            type="text"
                            disabled={item.current}
                            value={item.current ? 'Present' : item.endDate}
                            onChange={(e) => updateItem(item.id, { endDate: e.target.value })}
                            placeholder="End (e.g. 2024)"
                            className="px-2 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 disabled:bg-slate-100 disabled:text-slate-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Role Overview (optional)</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="Brief 1-sentence synopsis of team scope or mandate..."
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                      />
                    </div>

                    {/* Key Accomplishments / Bullets */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Key Achievements &amp; Responsibilities</span>
                        <button
                          type="button"
                          onClick={() => addHighlight(item.id)}
                          className="text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                        >
                          + Add Achievement Bullet
                        </button>
                      </div>

                      <div className="space-y-2">
                        {(item.highlights || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-400 select-none">•</span>
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => updateHighlight(item.id, bIdx, e.target.value)}
                                placeholder="Action verb + Context + Quantifiable Metric (e.g., Architected CI/CD pipeline reducing build time by 45%)"
                                className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => handleAnalyzeBullet(item.id, bIdx, bullet)}
                                className="px-2 py-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded inline-flex items-center gap-1 shrink-0 cursor-pointer"
                                title="Enhance grammar & action verbs"
                              >
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span>Enhance</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => removeHighlight(item.id, bIdx)}
                                className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Active Analysis Panel for this specific bullet */}
                            {activeAnalysis &&
                              activeAnalysis.itemId === item.id &&
                              activeAnalysis.bulletIdx === bIdx && (
                                <div className="ml-5 p-2.5 bg-slate-50 border border-slate-200 rounded space-y-2 text-xs">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                      <span className="font-bold text-slate-900">Deterministic Writing Engine</span>
                                      <span className="px-1.5 py-0.5 text-[10px] bg-blue-100 text-blue-800 rounded font-mono">
                                        Score: {activeAnalysis.analysis.clarityScore}/100
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => setActiveAnalysis(null)}
                                      className="text-slate-400 hover:text-slate-600"
                                    >
                                      ✕
                                    </button>
                                  </div>

                                  {activeAnalysis.analysis.feedbackTips.length > 0 && (
                                    <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-slate-600">
                                      {activeAnalysis.analysis.feedbackTips.map((tip, tIdx) => (
                                        <li key={tIdx}>{tip}</li>
                                      ))}
                                    </ul>
                                  )}

                                  {activeAnalysis.analysis.enhancedSuggestions.length > 0 && (
                                    <div className="space-y-1 pt-1">
                                      <span className="font-semibold text-slate-700 text-[11px]">
                                        Deterministic Enhancements (Edit or Apply):
                                      </span>
                                      {activeAnalysis.analysis.enhancedSuggestions.map((sug, sIdx) => (
                                        <div
                                          key={sIdx}
                                          className="p-1.5 bg-white border border-slate-200 rounded flex justify-between items-center gap-2"
                                        >
                                          <span className="text-[11px] text-slate-800 leading-snug">{sug}</span>
                                          <button
                                            type="button"
                                            onClick={() => applyEnhancedBullet(sug)}
                                            className="px-2 py-0.5 text-[10px] bg-blue-600 text-white rounded font-medium hover:bg-blue-700 shrink-0 flex items-center gap-1 cursor-pointer"
                                          >
                                            <Check className="w-3 h-3" />
                                            <span>Apply</span>
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
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
