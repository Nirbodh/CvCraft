import React, { useState } from 'react';
import { ProjectItem } from '../../types/cv.ts';
import { Plus, Trash2, ArrowUp, ArrowDown, ChevronDown, ChevronUp, ExternalLink, Copy } from 'lucide-react';

interface ProjectsSectionProps {
  items: ProjectItem[];
  onChange: (updated: ProjectItem[]) => void;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ items, onChange }) => {
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const addItem = () => {
    const newItem: ProjectItem = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name: '',
      description: '',
      link: '',
      technologies: [],
      highlights: [],
    };
    onChange([newItem, ...items]);
    setExpandedId(newItem.id);
  };

  const duplicateItem = (item: ProjectItem) => {
    const clone: ProjectItem = {
      ...item,
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      name: `${item.name} (Copy)`,
      technologies: [...(item.technologies || [])],
      highlights: item.highlights ? [...item.highlights] : [],
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
    setExpandedId(clone.id);
  };

  const updateItem = (id: string, updates: Partial<ProjectItem>) => {
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

  const handleTechChange = (id: string, text: string) => {
    const splitted = text
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    updateItem(id, { technologies: splitted });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700">Notable Projects &amp; Open Source</span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-500">
          No projects added yet. Click &ldquo;Add Project&rdquo; to showcase your portfolio applications.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, idx) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="border border-slate-200 rounded-md bg-white overflow-hidden">
                <div
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {item.name || 'New Project'}
                    </span>
                    {item.technologies && item.technologies.length > 0 && (
                      <span className="text-xs text-slate-500 truncate">
                        · {item.technologies.slice(0, 3).join(', ')}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, 'up')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === items.length - 1}
                      onClick={() => moveItem(idx, 'down')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateItem(item)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      title="Duplicate project"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
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

                {isExpanded && (
                  <div className="p-3.5 space-y-3 text-xs border-t border-slate-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-slate-600 font-medium mb-1">Project Name</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => updateItem(item.id, { name: e.target.value })}
                          placeholder="e.g. Distributed Analytics Engine"
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium mb-1 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                          <span>Live Demo or Repository URL</span>
                        </label>
                        <input
                          type="url"
                          value={item.link || ''}
                          onChange={(e) => updateItem(item.id, { link: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Technologies Used (comma-separated)</label>
                      <input
                        type="text"
                        value={(item.technologies || []).join(', ')}
                        onChange={(e) => handleTechChange(item.id, e.target.value)}
                        placeholder="React, TypeScript, Tailwind, Docker, PostgreSQL"
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-600 font-medium mb-1">Project Impact &amp; Architecture</label>
                      <textarea
                        rows={3}
                        value={item.description}
                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                        placeholder="Engineered telemetry dashboard processing 50k events/sec with sub-20ms p99 latency..."
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900 leading-relaxed"
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
