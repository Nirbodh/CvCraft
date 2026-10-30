import React from 'react';
import { TemplateId } from '../types/cv.ts';
import { ArrowRight, Upload, Download, Sparkles, CheckCircle2, ShieldCheck, FileCheck, Layers, Cpu } from 'lucide-react';

interface LandingPageProps {
  onStartBuilding: (templateId?: TemplateId) => void;
  onOpenImport: () => void;
  onOpenWritingAssistant: () => void;
}

const TEMPLATE_PREVIEWS: Array<{
  id: TemplateId;
  name: string;
  tag: string;
  desc: string;
  accent: string;
  characteristics: string[];
}> = [
  {
    id: 'modern',
    name: 'Modern Executive',
    tag: 'Top Choice',
    desc: 'Contemporary geometric sans typography, subtle colored header dividers, and structured timeline markers.',
    accent: '#2563eb',
    characteristics: ['Clean vertical accents', 'Geometric typography', 'Best for tech & startups'],
  },
  {
    id: 'classic',
    name: 'Classic Academic',
    tag: 'Formal & Law',
    desc: 'Ivy-League centered headline with refined serif typography, double hairline section dividers, and formal hierarchy.',
    accent: '#831843',
    characteristics: ['Centered serif design', 'Academic prestige', 'Best for legal & finance'],
  },
  {
    id: 'minimal',
    name: 'Minimal Swiss',
    tag: 'Editorial',
    desc: 'Stark modernist two-column grid with generous whitespace, left-aligned section labels, and pure breathing room.',
    accent: '#18181b',
    characteristics: ['Generous whitespace', 'Swiss editorial grid', 'Best for designers & architects'],
  },
  {
    id: 'professional',
    name: 'Corporate Professional',
    tag: 'Executive',
    desc: 'Two-column structured layout with tinted executive sidebar housing contact, skills, and certifications.',
    accent: '#1e3a8a',
    characteristics: ['Tinted sidebar column', 'Compact efficiency', 'Best for managers & consultants'],
  },
  {
    id: 'ats',
    name: 'ATS 100% Robot-Proof',
    tag: 'Maximum Parse Rate',
    desc: 'Strict single-column flow with standardized semantic headers, high contrast, and bullet point perfection.',
    accent: '#059669',
    characteristics: ['Zero parser confusion', 'Standard headers', 'Best for enterprise job portals'],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartBuilding,
  onOpenImport,
  onOpenWritingAssistant,
}) => {
  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Tagline text */}
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/80 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free · No Watermarks · No Paid AI Subscriptions</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.15]">
              Build a Professional CV that Lands Interviews.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Create, customize, and download A4-ready resumes in minutes. Powered by our free deterministic writing engine, document extractor, and 5 designer templates.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onStartBuilding('modern')}
                className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <span>Create CV for Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenImport}
                className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-lg border border-slate-300 shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Import Existing Resume (PDF / DOCX)</span>
              </button>
            </div>

            {/* Value checklist (clean typography) */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 pt-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>No registration required to build &amp; export</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>A4 standard PDF download</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Zero fake hallucinations</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Designer Templates
          </h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
            5 Distinctive Layouts for Every Industry
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Switch templates instantly at any time without losing a single line of your entered data.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEMPLATE_PREVIEWS.map((tmpl) => (
            <div
              key={tmpl.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: tmpl.accent }}
                    />
                    <h4 className="font-bold text-sm text-slate-900">{tmpl.name}</h4>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{tmpl.tag}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{tmpl.desc}</p>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  {tmpl.characteristics.map((char, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      <span>{char}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onStartBuilding(tmpl.id)}
                  className="w-full py-2 bg-white hover:bg-blue-600 hover:text-white text-slate-900 font-semibold border border-slate-200 rounded-md text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Use This Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Deep Dive */}
      <section className="py-16 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Reliable Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">
              Engineered for Authenticity &amp; Privacy
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Deterministic Writing Engine</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No hallucinated degrees or invented skills. Uses proven resume grammar heuristics, active verb banks, and the STAR framework to enhance clarity while keeping you 100% truthful.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <FileCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Document Importer with Review</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extract existing credentials from PDF, DOCX, or plain text. Inspect and correct every extracted field in the verification screen before populating your CV.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Printer className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Vector-Grade A4 PDF Export</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates crisp, selectable, printable A4 documents via standard browser print styles. Zero blurry rasterizations, zero third-party watermarks, and zero fees.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Simple 4-Step Process</h2>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-950">How CVCraft Works</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Start or Import',
              desc: 'Begin with clean sample data or import your existing PDF/Word resume in one click.',
            },
            {
              step: '02',
              title: 'Fill & Optimize',
              desc: 'Enter your experience and use the rule-based assistant to sharpen action verbs and achievements.',
            },
            {
              step: '03',
              title: 'Style & Tailor',
              desc: 'Pick from 5 templates, custom colors, typography scales, and toggle section visibility.',
            },
            {
              step: '04',
              title: 'Download & Apply',
              desc: 'Export a pristine A4 PDF or create a free account to keep your CVs synchronized in the cloud.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-5 bg-white border border-slate-200 rounded-xl space-y-2">
              <span className="text-2xl font-black text-blue-600 font-mono">{item.step}</span>
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Build Your Professional CV?
          </h3>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            Join thousands of job seekers creating clean, recruiter-approved CVs without paywalls or hidden subscriptions.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onStartBuilding('modern')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer text-sm"
            >
              <span>Get Started Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

function Printer(props: any) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
      <polyline points="6 9 6 2 18 2 18 9" />
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
      <rect x="6" y="14" width="12" height="8" />
    </svg>
  );
}
