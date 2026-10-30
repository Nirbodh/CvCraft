import React from 'react';
import {
  Palette,
  ShieldCheck,
  Layout,
  Layers,
  Sliders,
  Type,
  MousePointer,
  RotateCcw,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';

export const AdminDesignStudioTab: React.FC = () => {
  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">User Drag-and-Drop Design Studio Monitoring</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Supervising user visual layout customizations, layer controls, and architectural isolation guarantees.
          </p>
        </div>
        <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full font-semibold text-[10px] flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Zero Pollution Architecture Active</span>
        </span>
      </div>

      {/* Architectural Isolation Guarantee Banner */}
      <div className="p-5 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 border border-purple-200 rounded-2xl space-y-3">
        <h3 className="font-bold text-sm text-purple-950 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <span>Strict Architecture Separation Protocol</span>
        </h3>
        <p className="text-xs text-purple-900 leading-relaxed">
          In CVCraft, the <b>Admin Template Editor</b> controls the master reusable blueprints, while the <b>User Drag-and-Drop Design Studio</b> operates on private clones assigned directly to each user's CV. Under no circumstances can user layout drag/drop operations, layer changes, or font overrides mutate an Admin template.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3 bg-white/80 rounded-xl border border-purple-200 shadow-2xs">
            <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Master Catalog</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Immutable global templates with version numbers, publication status, and country bindings.
            </p>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-purple-200 shadow-2xs">
            <div className="font-bold text-blue-900 mb-1 flex items-center gap-1.5">
              <MousePointer className="w-3.5 h-3.5 text-blue-600" />
              <span>User Design Canvas</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Users freely reposition headers, badges, profile photos, and custom sections via Drag &amp; Drop without affecting other users.
            </p>
          </div>

          <div className="p-3 bg-white/80 rounded-xl border border-purple-200 shadow-2xs">
            <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Vector A4 Exporter</span>
            </div>
            <p className="text-[11px] text-slate-600">
              Both standard templates and custom drag-and-drop layouts export cleanly via standard A4 print CSS.
            </p>
          </div>
        </div>
      </div>

      {/* Feature Checklist */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          User Studio Capabilities Matrix
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {[
            { title: 'Drag-and-Drop Repositioning', desc: 'Free-form coordinates snapped to standard A4 printable margins.' },
            { title: 'Layer Stack Hierarchy', desc: 'Bring forward, send backward, z-index depth order management.' },
            { title: 'Custom Columns & Grids', desc: '1-column linear, 2-column asymmetric sidebar, and 3-column matrices.' },
            { title: 'Styling & Geometry Inspector', desc: 'Accent theme palette, border radius, letter spacing, font families.' },
            { title: 'Undo / Redo History Stack', desc: 'Multi-step action rollback in memory during interactive design.' },
            { title: 'A4 Live Print Boundary', desc: 'Dashed line guideline at 297mm indicating standard page 1 cutoff.' },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">{item.title}</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDesignStudioTab;
