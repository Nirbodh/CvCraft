import React, { useState } from 'react';
import { CV, TemplateId, COLOR_PALETTES } from '../types/cv.ts';
import {
  X,
  Check,
  Sparkles,
  LayoutTemplate,
  FileCheck2,
  ShieldCheck,
  Eye,
  Sliders,
  Palette,
  Briefcase,
  Layers,
  Award,
  GraduationCap,
  Code2,
  Brush,
} from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CV;
  onSelectTemplate: (templateId: TemplateId, optionalColor?: string) => void;
}

interface TemplateOption {
  id: TemplateId;
  name: string;
  category: 'ATS' | 'Modern' | 'Creative' | 'Executive' | 'Academic' | 'Technical' | 'Classic' | 'Minimal';
  group: 'ats' | 'modern' | 'creative' | 'leadership';
  badge: string;
  badgeColor: string;
  recommendedFor: string;
  description: string;
  features: string[];
  atsScore: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'ats',
    name: 'ATS-Friendly Standard',
    category: 'ATS',
    group: 'ats',
    badge: '100% Robot-Proof',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    recommendedFor: 'Online portal applications, Workday, Taleo, Greenhouse, Large Enterprises',
    description: 'Strict linear hierarchy, zero complex graphic clutter, standard font weight, and standard bullet formatting for maximum automated parsing accuracy.',
    features: ['Single-column flow', 'Standard web-safe fonts', 'No tables/columns', 'Universal parser friendly'],
    atsScore: '99/100',
  },
  {
    id: 'modern',
    name: 'Modern Professional',
    category: 'Modern',
    group: 'modern',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    recommendedFor: 'Corporate roles, Tech firms, Startups, Product Management, Marketing',
    description: 'Crisp geometric hierarchy featuring customizable accent dividers, clean contact metadata, optional headshot, and polished timeline alignment.',
    features: ['Top colored divider', 'Optional headshot photo', 'Vertical timeline rhythm', 'Unboxed metadata'],
    atsScore: '94/100',
  },
  {
    id: 'classic',
    name: 'Classic Academic Serif',
    category: 'Classic',
    group: 'leadership',
    badge: 'Timeless & Formal',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    recommendedFor: 'Legal, Finance, Banking, Consulting, Public Administration, Academia',
    description: 'Prestigious centered header layout with Merriweather serif typography and Ivy-League hairline dividing rules for traditional industries.',
    features: ['Centered header', 'Editorial serif typography', 'Hairline dividing rules', 'Formal structure'],
    atsScore: '96/100',
  },
  {
    id: 'minimal',
    name: 'Minimal Swiss Grid',
    category: 'Minimal',
    group: 'modern',
    badge: 'High Whitespace',
    badgeColor: 'bg-zinc-100 text-zinc-800 border-zinc-200',
    recommendedFor: 'Architecture, Copywriting, Design, Journalism, Scandinavian & Swiss markets',
    description: 'Stark, modern 2-column grid layout with category labels along the left gutter and expansive whitespace for effortless reading.',
    features: ['Asymmetrical 2-column grid', 'Generous whitespace', 'No decorative lines', 'Clean typography'],
    atsScore: '92/100',
  },
  {
    id: 'executive',
    name: 'Executive Leadership',
    category: 'Executive',
    group: 'leadership',
    badge: 'C-Suite & VP',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    recommendedFor: 'C-Level executives, VPs, Managing Directors, Board Advisors, Senior Partners',
    description: 'Commanding corporate header band, core competencies summary matrix, and prominent strategic achievement milestones.',
    features: ['Header hero banner', 'Core competencies matrix', 'Executive summary focus', 'Distinguished styling'],
    atsScore: '91/100',
  },
  {
    id: 'creative',
    name: 'Creative Designer & Media',
    category: 'Creative',
    group: 'creative',
    badge: 'Visual Impact',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200',
    recommendedFor: 'UI/UX Designers, Graphic Artists, Creative Directors, Media Specialists, Brand Managers',
    description: 'High-contrast dark sidebar with avatar frame, tool proficiency badges, and dedicated portfolio project cards.',
    features: ['Dark sidebar accent', 'Portfolio card grid', 'Skill proficiency levels', 'Dynamic visual layout'],
    atsScore: '85/100',
  },
  {
    id: 'technical',
    name: 'Engineering & DevOps',
    category: 'Technical',
    group: 'creative',
    badge: 'Software Engineers',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    recommendedFor: 'Software Engineers, DevOps, Full-Stack Developers, Cloud Architects, Data Scientists',
    description: 'Terminal-inspired monospace headers, categorized technology stack matrix (Languages, Cloud, Tools), and direct repository links.',
    features: ['Monospace tech accents', 'Categorized tech stacks', 'GitHub & demo callouts', 'Terminal-style title'],
    atsScore: '93/100',
  },
  {
    id: 'academic',
    name: 'Academic & Faculty CV',
    category: 'Academic',
    group: 'leadership',
    badge: 'Research & Faculty',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    recommendedFor: 'Professors, Postdoctoral Researchers, PhD Candidates, Grant Applications, Fellowships',
    description: 'Latinate Curriculum Vitae standard with multi-page flow prioritizing research statements, publications, teaching history, and grants.',
    features: ['Multi-page continuity', 'Latinate CV format', 'Publications emphasis', 'Formal academic margins'],
    atsScore: '95/100',
  },
  {
    id: 'japanese-rirekisho',
    name: 'JIS Japanese Rirekisho (履歴書)',
    category: 'Classic',
    group: 'leadership',
    badge: 'JIS 履歴書 (Japan)',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-300',
    recommendedFor: 'Japanese Enterprises, Government Agencies, Tokyo Branches, New Graduate & Mid-Career in Japan',
    description: 'Official standard Japanese JIS format featuring Furigana (ふりがな), formal 30x40mm portrait frame, chronological Education & Work grid ending with 以上, licenses, and Self-PR.',
    features: ['Furigana (ふりがな) headers', '30x40mm 証明写真 photo frame', 'Education & Work grid with 以上', '志望動機 / 自己PR'],
    atsScore: '96/100',
  },
  {
    id: 'japanese-shokumu',
    name: 'Japanese Shokumu Keirekisho (職務経歴書)',
    category: 'Modern',
    group: 'leadership',
    badge: '職務経歴書 (Japan)',
    badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-300',
    recommendedFor: 'Mid-career tech, engineering, and management applications in Japan',
    description: 'Structured Japanese career history document detailing project duties, technical skills, and key accomplishments.',
    features: ['職務要約 summary', '活かせるスキル skills matrix', 'Project breakdown', '自己PR self presentation'],
    atsScore: '94/100',
  },
];

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  cv,
  onSelectTemplate,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<'all' | 'ats' | 'modern' | 'creative' | 'leadership'>('all');
  const [previewColor, setPreviewColor] = useState<string>(cv.themeColor || '#2563eb');

  if (!isOpen) return null;

  const filteredTemplates = TEMPLATE_OPTIONS.filter((t) => {
    if (selectedGroup === 'all') return true;
    return t.group === selectedGroup;
  });

  const handleApply = (templateId: TemplateId) => {
    onSelectTemplate(templateId, previewColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  Template &amp; Style Gallery
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Your Data is 100% Intact
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch effortlessly between 8 CV styles. Your personal information, work experience, education, and custom sections are fully preserved.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="self-end sm:self-center p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            title="Close gallery"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Navigation Bar & Quick Color Tweaker */}
        <div className="px-4 sm:px-6 py-2.5 bg-white border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Styles (8)' },
              { id: 'ats', label: 'ATS-Friendly' },
              { id: 'modern', label: 'Modern & Clean' },
              { id: 'creative', label: 'Creative & Tech' },
              { id: 'leadership', label: 'Executive & Academic' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedGroup(id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer text-xs ${
                  selectedGroup === id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Quick Accent Color Swatches */}
          <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
            <span className="text-[11px] font-medium text-slate-500 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-slate-400" />
              Accent:
            </span>
            <div className="flex items-center gap-1">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.value}
                  type="button"
                  onClick={() => setPreviewColor(palette.value)}
                  className={`w-4.5 h-4.5 rounded-full transition-transform cursor-pointer flex items-center justify-center ${
                    previewColor.toLowerCase() === palette.value.toLowerCase()
                      ? 'scale-125 ring-2 ring-slate-900 ring-offset-1'
                      : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: palette.value }}
                  title={`${palette.name} (${palette.label})`}
                >
                  {previewColor.toLowerCase() === palette.value.toLowerCase() && (
                    <Check className="w-2.5 h-2.5 text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredTemplates.map((item) => {
              const isCurrent = cv.templateId === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => handleApply(item.id)}
                  className={`group relative bg-white rounded-xl border transition-all duration-150 flex flex-col overflow-hidden cursor-pointer ${
                    isCurrent
                      ? 'border-blue-600 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
                  }`}
                >
                  {/* Active Indicator Pin */}
                  {isCurrent && (
                    <div className="absolute top-2.5 right-2.5 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </div>
                  )}

                  {/* Visual Miniature Mockup (Custom visual illustration per template) */}
                  <div className="h-36 bg-slate-100 p-3 flex flex-col justify-between border-b border-slate-100 relative overflow-hidden select-none">
                    {/* ATS Miniature Mockup */}
                    {item.id === 'ats' && (
                      <div className="w-full h-full bg-white rounded shadow-2xs p-2 flex flex-col gap-1.5 border border-slate-200">
                        <div className="text-center font-bold text-[9px] text-slate-900 tracking-wider">
                          ALEX VANCE
                        </div>
                        <div className="h-0.5 w-full bg-slate-800" style={{ backgroundColor: previewColor }} />
                        <div className="flex justify-between text-[7px] text-slate-500">
                          <span className="font-semibold text-slate-700">EXPERIENCE</span>
                          <span>2020 – Present</span>
                        </div>
                        <div className="space-y-1">
                          <div className="h-1 w-full bg-slate-200 rounded" />
                          <div className="h-1 w-5/6 bg-slate-200 rounded" />
                          <div className="h-1 w-4/6 bg-slate-200 rounded" />
                        </div>
                        <div className="mt-auto flex justify-between text-[6px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.5 rounded">
                          <span>ATS COMPATIBLE</span>
                          <span>99% SCORE</span>
                        </div>
                      </div>
                    )}

                    {/* Modern Professional Miniature Mockup */}
                    {item.id === 'modern' && (
                      <div className="w-full h-full bg-white rounded shadow-2xs p-2 flex flex-col gap-1 border-t-2 border-slate-200" style={{ borderTopColor: previewColor }}>
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded-full border shrink-0" style={{ backgroundColor: `${previewColor}20`, borderColor: previewColor }} />
                          <div className="flex-1">
                            <div className="h-1.5 w-14 rounded" style={{ backgroundColor: previewColor }} />
                            <div className="h-1 w-10 bg-slate-300 rounded mt-0.5" />
                          </div>
                        </div>
                        <div className="h-px w-full bg-slate-100 my-0.5" />
                        <div className="flex gap-2">
                          <div className="w-1/3 space-y-1">
                            <div className="h-1 w-full bg-slate-200 rounded" />
                            <div className="h-1 w-4/5 bg-slate-200 rounded" />
                          </div>
                          <div className="w-2/3 space-y-1 pl-1 border-l border-slate-200">
                            <div className="h-1 w-full bg-slate-300 rounded" />
                            <div className="h-1 w-5/6 bg-slate-200 rounded" />
                            <div className="h-1 w-3/4 bg-slate-200 rounded" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Classic Academic Miniature Mockup */}
                    {item.id === 'classic' && (
                      <div className="w-full h-full bg-amber-50/40 rounded shadow-2xs p-2 flex flex-col gap-1 font-serif border border-amber-200/50">
                        <div className="text-center">
                          <div className="text-[9px] tracking-widest text-slate-900 font-bold">ALEX VANCE</div>
                          <div className="text-[7px] italic text-slate-500">Curriculum Vitae</div>
                        </div>
                        <div className="h-px w-full bg-slate-300 my-0.5" />
                        <div className="text-center text-[7px] uppercase tracking-wider font-bold" style={{ color: previewColor }}>
                          — Professional Summary —
                        </div>
                        <div className="space-y-1 mt-0.5">
                          <div className="h-1 w-full bg-slate-300/80 rounded" />
                          <div className="h-1 w-full bg-slate-300/80 rounded" />
                        </div>
                        <div className="h-px w-full bg-slate-200 my-0.5" />
                        <div className="text-center text-[7px] uppercase tracking-wider font-bold" style={{ color: previewColor }}>
                          — Experience —
                        </div>
                      </div>
                    )}

                    {/* Minimal Swiss Miniature Mockup */}
                    {item.id === 'minimal' && (
                      <div className="w-full h-full bg-white rounded shadow-2xs p-2 flex flex-col gap-1.5 border border-zinc-200">
                        <div>
                          <div className="text-[10px] font-light tracking-tight text-zinc-900">Alex Vance</div>
                          <div className="text-[7px] text-zinc-400">Senior Engineer</div>
                        </div>
                        <div className="h-px w-full bg-zinc-200" />
                        <div className="grid grid-cols-12 gap-1 text-[7px]">
                          <div className="col-span-4 font-semibold text-zinc-400 uppercase" style={{ color: previewColor }}>Profile</div>
                          <div className="col-span-8 space-y-1">
                            <div className="h-1 w-full bg-zinc-200 rounded" />
                            <div className="h-1 w-4/5 bg-zinc-200 rounded" />
                          </div>
                        </div>
                        <div className="grid grid-cols-12 gap-1 text-[7px]">
                          <div className="col-span-4 font-semibold text-zinc-400 uppercase" style={{ color: previewColor }}>Work</div>
                          <div className="col-span-8 space-y-1">
                            <div className="h-1 w-full bg-zinc-300 rounded" />
                            <div className="h-1 w-3/4 bg-zinc-200 rounded" />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Executive Leadership Miniature Mockup */}
                    {item.id === 'executive' && (
                      <div className="w-full h-full bg-white rounded shadow-2xs overflow-hidden flex flex-col border border-slate-200">
                        <div className="p-1.5 text-white flex flex-col justify-center" style={{ backgroundColor: previewColor }}>
                          <div className="text-[9px] font-bold tracking-wider">ALEX VANCE</div>
                          <div className="text-[7px] text-white/80">Chief Technology Officer</div>
                        </div>
                        <div className="p-2 flex-1 flex flex-col gap-1">
                          <div className="text-[7px] font-bold text-slate-800 uppercase tracking-wider">Executive Core Competencies</div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="h-1 bg-slate-200 rounded" />
                            <div className="h-1 bg-slate-200 rounded" />
                          </div>
                          <div className="h-px w-full bg-slate-200 my-0.5" />
                          <div className="text-[7px] font-bold text-slate-800 uppercase tracking-wider">Career Milestones</div>
                          <div className="h-1 w-5/6 bg-slate-300 rounded" />
                        </div>
                      </div>
                    )}

                    {/* Creative Designer Miniature Mockup */}
                    {item.id === 'creative' && (
                      <div className="w-full h-full bg-white rounded shadow-2xs overflow-hidden flex border border-slate-200">
                        {/* Dark sidebar */}
                        <div className="w-1/3 bg-slate-900 text-white p-1.5 flex flex-col gap-1">
                          <div className="w-3.5 h-3.5 rounded-full border" style={{ borderColor: previewColor }} />
                          <div className="text-[7px] font-bold">A. Vance</div>
                          <div className="h-0.5 w-full bg-slate-700 rounded" />
                          <div className="text-[6px] text-slate-400">SKILLS</div>
                          <div className="h-1 w-full bg-slate-700 rounded" />
                          <div className="h-1 w-3/4 bg-slate-700 rounded" />
                        </div>
                        {/* Right column */}
                        <div className="w-2/3 p-1.5 flex flex-col gap-1">
                          <div className="text-[7px] font-bold" style={{ color: previewColor }}>PORTFOLIO &amp; WORKS</div>
                          <div className="grid grid-cols-2 gap-1">
                            <div className="h-4 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[5px] text-slate-500">Card 1</div>
                            <div className="h-4 bg-slate-100 rounded border border-slate-200 flex items-center justify-center text-[5px] text-slate-500">Card 2</div>
                          </div>
                          <div className="h-1 w-full bg-slate-200 rounded mt-1" />
                        </div>
                      </div>
                    )}

                    {/* Technical Engineering Miniature Mockup */}
                    {item.id === 'technical' && (
                      <div className="w-full h-full bg-slate-900 text-slate-100 rounded shadow-2xs p-1.5 flex flex-col gap-1 font-mono text-[7px] border border-slate-800">
                        <div className="flex items-center justify-between pb-1 border-b border-slate-800">
                          <div className="flex gap-1 items-center">
                            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </div>
                          <span className="text-[6px] text-slate-400">~/cv/alex-vance</span>
                        </div>
                        <div className="text-emerald-400 font-bold">&gt; Alex Vance: Full-Stack</div>
                        <div className="p-1 bg-slate-800/80 rounded border border-slate-700 flex flex-col gap-0.5">
                          <div className="text-[6px] text-slate-400">STACK_MATRIX:</div>
                          <div className="flex gap-1">
                            <span className="px-1 bg-slate-700 rounded text-[5px]" style={{ color: previewColor }}>TypeScript</span>
                            <span className="px-1 bg-slate-700 rounded text-[5px]" style={{ color: previewColor }}>Node</span>
                            <span className="px-1 bg-slate-700 rounded text-[5px]" style={{ color: previewColor }}>AWS</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Academic Miniature Mockup */}
                    {item.id === 'academic' && (
                      <div className="w-full h-full bg-white rounded shadow-2xs p-2 flex flex-col gap-1 text-[7px] border border-slate-200">
                        <div className="text-center font-bold text-slate-900 uppercase tracking-widest text-[8px]">
                          CURRICULUM VITAE
                        </div>
                        <div className="text-center text-[6px] text-slate-500">Dr. Alex Vance, Ph.D.</div>
                        <div className="h-px w-full bg-slate-300" />
                        <div className="font-bold text-slate-800" style={{ color: previewColor }}>RESEARCH &amp; APPOINTMENTS</div>
                        <div className="h-1 w-full bg-slate-200 rounded" />
                        <div className="h-1 w-5/6 bg-slate-200 rounded" />
                        <div className="font-bold text-slate-800 mt-0.5" style={{ color: previewColor }}>PUBLICATIONS &amp; GRANTS</div>
                        <div className="h-1 w-full bg-slate-200 rounded" />
                      </div>
                    )}

                    {/* Japanese Rirekisho Miniature Mockup */}
                    {item.id === 'japanese-rirekisho' && (
                      <div className="w-full h-full bg-white rounded shadow-2xs p-1.5 flex flex-col gap-1 text-[7px] border-2 border-slate-800">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-0.5">
                          <span className="font-bold tracking-widest text-[8px] text-slate-900">履 歴 書</span>
                          <span className="text-[6px] text-slate-500">令和〇年 現在</span>
                        </div>
                        <div className="flex gap-1 border border-slate-800 p-0.5 bg-slate-50/50">
                          <div className="flex-1 text-[6px]">
                            <div className="text-[5px] text-slate-400">ふりがな</div>
                            <div className="font-bold text-slate-900">氏名: アレックス</div>
                          </div>
                          <div className="w-6 h-8 border border-dashed border-slate-500 bg-slate-200 flex items-center justify-center text-[5px] text-slate-500 text-center">
                            写真
                          </div>
                        </div>
                        <div className="border border-slate-800 text-[6px] p-0.5 flex flex-col gap-0.5">
                          <div className="bg-slate-200 text-center font-bold text-[5px]">学歴・職歴</div>
                          <div className="flex justify-between text-[5px]">
                            <span>2019年 4月</span>
                            <span>〇〇大学 卒業</span>
                          </div>
                          <div className="text-right font-bold text-[5px]">以 上</div>
                        </div>
                      </div>
                    )}

                    {/* Japanese Shokumu Miniature Mockup */}
                    {item.id === 'japanese-shokumu' && (
                      <div className="w-full h-full bg-white rounded shadow-2xs p-2 flex flex-col gap-1 text-[7px] border border-slate-300">
                        <div className="flex justify-between items-center border-b border-slate-800 pb-0.5">
                          <span className="font-bold tracking-wider text-[8px] text-slate-900">職 務 経 歴 書</span>
                          <span className="text-[6px] text-slate-500">現在</span>
                        </div>
                        <div className="bg-slate-100 px-1 py-0.5 font-bold text-[6px] border-l-2 border-slate-800">
                          【職務要約】
                        </div>
                        <div className="h-1 w-full bg-slate-200 rounded" />
                        <div className="bg-slate-100 px-1 py-0.5 font-bold text-[6px] border-l-2 border-slate-800">
                          【活かせる技術】
                        </div>
                        <div className="h-1 w-4/5 bg-slate-200 rounded" />
                      </div>
                    )}
                  </div>

                  {/* Template Details Card Body */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h3 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.name}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1.5 mb-2">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          ATS: {item.atsScore}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-600 leading-normal mb-3 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Best for */}
                      <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 mb-3">
                        <span className="font-semibold text-slate-700">Best for: </span>
                        <span>{item.recommendedFor}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleApply(item.id);
                      }}
                      className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                        isCurrent
                          ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                          : 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs'
                      }`}
                    >
                      {isCurrent ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Currently Active</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                          <span>Apply This Style</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Guarantee Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <b>Zero Data Loss:</b> Switching styles modifies only layout CSS and presentation. None of your input text or custom sections will be wiped.
            </span>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
