import React, { useState } from 'react';
import { CV, TemplateId, COLOR_PALETTES, FontFamily, SpacingScale, FontSizeScale, MarginScale } from '../types/cv.ts';
import { Layout, Palette, Type, Sliders, Eye, MoveVertical, ArrowUp, ArrowDown, Edit2, LayoutTemplate, Sparkles } from 'lucide-react';

interface TemplateSelectorProps {
  cv: CV;
  onChange: (updated: Partial<CV>) => void;
  onOpenGallery?: () => void;
}

const TEMPLATES: Array<{
  id: TemplateId;
  name: string;
  category: string;
  tag: string;
  desc: string;
}> = [
  {
    id: 'ats',
    name: 'ATS-Friendly',
    category: 'ATS',
    tag: '100% Robot-Proof',
    desc: 'Strict single-column flow, standard headers, and bullet hierarchy for Workday, Greenhouse & Taleo.',
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    category: 'Modern',
    tag: 'All-Rounder',
    desc: 'Contemporary geometric sans typography with crisp vertical timeline and subtle header divider.',
  },
  {
    id: 'classic',
    name: 'Classic Academic',
    category: 'Classic',
    tag: 'Traditional & Legal',
    desc: 'Refined serif typography with centered header and ivy-league hairline section borders.',
  },
  {
    id: 'minimal',
    name: 'Minimal Swiss',
    category: 'Minimal',
    tag: 'High Whitespace',
    desc: 'Stark modernist two-column grid with generous breathing room and zero graphic clutter.',
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'Executive',
    tag: 'C-Suite & Directors',
    desc: 'Commanding tinted header banner, strategic capabilities matrix, and executive initiative highlights.',
  },
  {
    id: 'creative',
    name: 'Creative Designer',
    category: 'Creative',
    tag: 'Designers & Media',
    desc: 'High-contrast dark sidebar with portfolio project cards, visual tool tags, and artistic layout.',
  },
  {
    id: 'technical',
    name: 'Engineering & Technical',
    category: 'Technical',
    tag: 'Software & DevOps',
    desc: 'Terminal-inspired monospace accents, categorized technology matrix, and repository demo links.',
  },
  {
    id: 'academic',
    name: 'Academic / Research',
    category: 'Academic',
    tag: 'Scholars & Faculty',
    desc: 'Comprehensive multi-page format prioritizing qualifications, research statements, grants, and publications.',
  },
  {
    id: 'japanese-rirekisho',
    name: 'JIS Japanese Rirekisho',
    category: 'Traditional',
    tag: '履歴書 (Japan)',
    desc: 'Official Japanese standard format with Furigana (ふりがな), 30x40mm photo frame, and chronological table ending with 以上.',
  },
  {
    id: 'japanese-shokumu',
    name: 'Japanese Shokumu Keirekisho',
    category: 'Modern',
    tag: '職務経歴書 (Japan)',
    desc: 'Detailed Japanese career progression document detailing project duties, technical stack, and achievements.',
  },
];

const SECTION_LABELS: Record<string, string> = {
  personalInfo: 'Personal Information',
  summary: 'Professional Summary',
  experience: 'Work Experience',
  education: 'Education',
  skills: 'Skills & Competencies',
  projects: 'Key Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  customSections: 'Custom Sections',
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({ cv, onChange, onOpenGallery }) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'typography' | 'sections' | 'headings'>('templates');

  const toggleVisibility = (sectionKey: string) => {
    const current = cv.sectionVisibility || {};
    onChange({
      sectionVisibility: {
        ...current,
        [sectionKey]: current[sectionKey] === false ? true : false,
      },
    });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const order = [...(cv.sectionOrder || Object.keys(SECTION_LABELS))];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= order.length) return;

    const temp = order[index];
    order[index] = order[targetIndex];
    order[targetIndex] = temp;
    onChange({ sectionOrder: order });
  };

  const handleCustomHeadingChange = (key: string, value: string) => {
    onChange({
      customHeadings: {
        ...(cv.customHeadings || {}),
        [key]: value,
      },
    });
  };

  return (
    <div className="space-y-5 text-xs text-slate-800">
      {/* Sub-navigation tabs */}
      <div className="p-1 bg-slate-100 rounded-lg flex items-center gap-1 border border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('templates')}
          className={`flex-1 py-1.5 font-semibold rounded-md transition-colors cursor-pointer text-center ${
            activeTab === 'templates' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Templates ({TEMPLATES.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('typography')}
          className={`flex-1 py-1.5 font-semibold rounded-md transition-colors cursor-pointer text-center ${
            activeTab === 'typography' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Styling &amp; Geometry
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-1.5 font-semibold rounded-md transition-colors cursor-pointer text-center ${
            activeTab === 'sections' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Reorder Sections
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('headings')}
          className={`flex-1 py-1.5 font-semibold rounded-md transition-colors cursor-pointer text-center ${
            activeTab === 'headings' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Custom Headings
        </button>
      </div>

      {/* TAB 1: 8 Templates Picker & Palette */}
      {activeTab === 'templates' && (
        <div className="space-y-5">
          {/* Gallery Modal Trigger Banner */}
          {onOpenGallery && (
            <div className="p-3.5 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl flex items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-purple-600 text-white rounded-lg shadow-xs shrink-0">
                  <LayoutTemplate className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Template &amp; Style Gallery</h4>
                  <p className="text-[11px] text-slate-500">Visual miniatures, ATS scores, and 100% data preservation guarantee.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onOpenGallery}
                className="px-3 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Gallery</span>
              </button>
            </div>
          )}

          {/* Accent Color */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-blue-600" />
              <span>Accent Theme Palette</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {COLOR_PALETTES.map((color) => {
                const isSelected = cv.themeColor === color.value;
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => onChange({ themeColor: color.value })}
                    title={color.name}
                    className={`w-7 h-7 rounded-full transition-transform cursor-pointer border border-black/10 flex items-center justify-center ${
                      isSelected ? 'scale-110 ring-2 ring-offset-2 ring-slate-900' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                  >
                    {isSelected && <span className="text-white text-[10px]">✓</span>}
                  </button>
                );
              })}
              <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-slate-200">
                <span className="text-[11px] text-slate-500">Custom:</span>
                <input
                  type="color"
                  value={cv.themeColor || '#2563eb'}
                  onChange={(e) => onChange({ themeColor: e.target.value })}
                  className="w-7 h-7 p-0 border border-slate-200 rounded cursor-pointer bg-transparent"
                />
              </div>
            </div>
          </div>

          {/* Template Grid */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-2.5 flex items-center gap-1.5">
              <Layout className="w-3.5 h-3.5 text-blue-600" />
              <span>Select Template Archetype</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {TEMPLATES.map((tmpl) => {
                const isSelected = cv.templateId === tmpl.id || (cv.templateId === 'professional' && tmpl.id === 'modern');
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => onChange({ templateId: tmpl.id })}
                    className={`p-3 text-left rounded-lg border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/40 ring-1 ring-blue-600'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-slate-900 text-xs">{tmpl.name}</span>
                      <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                        {tmpl.tag}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{tmpl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Typography & Spacing & Margins */}
      {activeTab === 'typography' && (
        <div className="space-y-4">
          {/* Font Family */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-blue-600" />
              <span>Primary Font Family</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'sans', name: 'Sans-Serif', note: 'Plus Jakarta Sans / Modern' },
                { id: 'serif', name: 'Serif', note: 'Merriweather / Classic' },
                { id: 'mono', name: 'Monospace', note: 'Roboto Mono / Technical' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => onChange({ fontFamily: f.id as FontFamily })}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    cv.fontFamily === f.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs">{f.name}</span>
                  <span className="block text-[10px] text-slate-400 font-normal">{f.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Font Size Scale */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Font Size Scale</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'compact', label: 'Compact', hint: '11px (Fits more on 1 page)' },
                { id: 'normal', label: 'Standard', hint: '12px (Recommended)' },
                { id: 'large', label: 'Expanded', hint: '13px (High readability)' },
              ].map((sz) => (
                <button
                  key={sz.id}
                  type="button"
                  onClick={() => onChange({ fontSize: sz.id as FontSizeScale })}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    (cv.fontSize || 'normal') === sz.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs">{sz.label}</span>
                  <span className="block text-[10px] text-slate-400 font-normal">{sz.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="block text-xs font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-blue-600" />
              <span>Page Margins</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'compact', label: 'Narrow', hint: '15mm Margins' },
                { id: 'normal', label: 'Standard', hint: '20mm Margins (A4)' },
                { id: 'relaxed', label: 'Spacious', hint: '25mm Margins' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onChange({ margins: m.id as MarginScale })}
                  className={`p-2 rounded border text-left cursor-pointer transition-colors ${
                    (cv.margins || 'normal') === m.id
                      ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  <span className="block text-xs">{m.label}</span>
                  <span className="block text-[10px] text-slate-400 font-normal">{m.hint}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Visibility toggles */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-blue-600" />
              <span>Section Visibility</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.entries(SECTION_LABELS).map(([key, label]) => {
                const isVisible = cv.sectionVisibility?.[key] !== false;
                return (
                  <label
                    key={key}
                    className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-200 rounded cursor-pointer hover:bg-slate-100 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => toggleVisibility(key)}
                      className="rounded text-blue-600"
                    />
                    <span className="text-[11px] font-medium text-slate-700">{label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Section Reordering */}
      {activeTab === 'sections' && (
        <div className="space-y-3">
          <p className="text-[11px] text-slate-500">
            Use the arrow buttons to reorder how sections appear top-to-bottom on your generated CV:
          </p>
          <div className="space-y-1.5">
            {(cv.sectionOrder || Object.keys(SECTION_LABELS)).map((key, idx, arr) => (
              <div
                key={key}
                className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-mono text-[10px]">#{idx + 1}</span>
                  <span className="font-semibold text-slate-900">{SECTION_LABELS[key] || key}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => moveSection(idx, 'up')}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    title="Move section up"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === arr.length - 1}
                    onClick={() => moveSection(idx, 'down')}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                    title="Move section down"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Custom Section Headings */}
      {activeTab === 'headings' && (
        <div className="space-y-3">
          <p className="text-[11px] text-slate-500">
            Customize heading labels for multi-lingual applications (e.g. German &ldquo;Berufserfahrung&rdquo;, French &ldquo;Expérience Professionnelle&rdquo;, or British &ldquo;Employment History&rdquo;):
          </p>
          <div className="space-y-2">
            {[
              { key: 'summary', defaultTitle: 'Professional Summary' },
              { key: 'experience', defaultTitle: 'Work Experience' },
              { key: 'education', defaultTitle: 'Education & Credentials' },
              { key: 'skills', defaultTitle: 'Skills & Competencies' },
              { key: 'projects', defaultTitle: 'Key Projects' },
              { key: 'certifications', defaultTitle: 'Certifications' },
              { key: 'languages', defaultTitle: 'Languages' },
            ].map(({ key, defaultTitle }) => (
              <div key={key} className="p-2 border border-slate-200 rounded bg-white space-y-1">
                <span className="text-[11px] font-semibold text-slate-600 block">{defaultTitle}</span>
                <input
                  type="text"
                  value={cv.customHeadings?.[key] || ''}
                  onChange={(e) => handleCustomHeadingChange(key, e.target.value)}
                  placeholder={`Default: ${defaultTitle}`}
                  className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded text-slate-900"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
