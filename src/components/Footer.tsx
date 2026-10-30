import React from 'react';
import { ShieldCheck, Printer, FileText, Database, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'landing' | 'editor' | 'dashboard' | 'admin') => void;
  onOpenDbStatus: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDbStatus }) => {
  return (
    <footer className="no-print bg-slate-900 text-slate-300 py-12 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-black text-white tracking-tight text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                CV
              </div>
              <span>CVCraft</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              The complete free CV and Resume generator. Built with standard open-source tools: React, Express, MongoDB Atlas Free, and deterministic language algorithms.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Zero watermarks · No subscription required</span>
            </div>
          </div>

          {/* Features Col */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Core Features</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('editor')}>5 Free Designer Templates</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('editor')}>100% ATS-Friendly Layout</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('editor')}>Deterministic Writing Engine</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('editor')}>DOCX &amp; PDF Text Extractor</li>
              <li className="hover:text-white cursor-pointer" onClick={() => onNavigate('editor')}>High-Fidelity A4 PDF Print</li>
            </ul>
          </div>

          {/* Architecture Col */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Database &amp; Stack</h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="hover:text-white cursor-pointer flex items-center gap-1.5" onClick={onOpenDbStatus}>
                <Database className="w-3 h-3 text-blue-400" />
                <span>MongoDB Atlas Free / Fallback</span>
              </li>
              <li>Node.js + Express.js REST API</li>
              <li>JWT + Bcrypt Password Hashing</li>
              <li>Pure Client-Side PDF Generation</li>
              <li>Deployable on Render &amp; GitHub</li>
            </ul>
          </div>

          {/* Privacy & Legal Col */}
          <div className="space-y-2.5">
            <h4 className="text-white font-bold tracking-wider uppercase text-[11px]">Privacy &amp; Security</h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Your resume data is strictly confidential. In Guest Mode, all edits reside in your local browser storage. When registered, your CVs are safeguarded with private user ownership isolation.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} CVCraft. Free &amp; Open-Source Resume Generator.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => onNavigate('landing')}>Home</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => onNavigate('editor')}>Create CV</span>
            <span>·</span>
            <span className="hover:text-slate-300 cursor-pointer" onClick={onOpenDbStatus}>Database Status</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
