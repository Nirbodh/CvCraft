import React, { useState } from 'react';
import {
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Printer,
  Sparkles,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { AdminTemplate } from '../../types/template.ts';
import { CvRenderer } from '../Templates/CvRenderer.tsx';
import { DEFAULT_CV, CV } from '../../types/cv.ts';

interface AdminTemplatePreviewTabProps {
  template: AdminTemplate | null;
  onEditTemplate?: (t: AdminTemplate) => void;
}

export const AdminTemplatePreviewTab: React.FC<AdminTemplatePreviewTabProps> = ({
  template,
  onEditTemplate,
}) => {
  const [zoomScale, setZoomScale] = useState(0.85);
  const [candidateProfile, setCandidateProfile] = useState<'tech' | 'japan' | 'executive'>('tech');

  // Build simulated CV matching selected profile & template
  const previewCv: CV = {
    ...DEFAULT_CV,
    countryId: template?.countryId || 'usa',
    templateId: template?.id || 'modern',
    isCustomTemplate: template?.isCustomHtml || false,
    customTemplateHtml: template?.htmlContent,
    customTemplateCss: template?.cssContent,
    data: {
      ...DEFAULT_CV.data,
      personalInfo: {
        ...DEFAULT_CV.data.personalInfo,
        fullName: candidateProfile === 'japan' ? '山田 太郎' : candidateProfile === 'executive' ? 'Eleanor Vance' : 'Alex Vance',
        jobTitle: candidateProfile === 'japan' ? 'シニアシステムエンジニア' : candidateProfile === 'executive' ? 'Chief Technology Officer' : 'Senior Full-Stack Engineer',
        furiganaName: candidateProfile === 'japan' ? 'やまだ たろう' : undefined,
        location: candidateProfile === 'japan' ? '東京都千代田区神田錦町1-2-3' : 'San Francisco, CA',
        selfPr: candidateProfile === 'japan' ? 'これまでに培ったクラウド分散アーキテクチャの知識を活かし、チームの技術力向上と業務効率化に貢献いたします。' : undefined,
      },
    },
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              Visual Template Preview: {template ? template.name : 'Standard Preview'}
            </h2>
            {template && (
              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700">
                v{template.version}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Rendered in an isolated A4 container (210mm × 297mm) with zoom scaling and print fidelity.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Candidate profile dataset switcher */}
          <select
            value={candidateProfile}
            onChange={(e) => setCandidateProfile(e.target.value as any)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
          >
            <option value="tech">Profile: Senior Tech Lead</option>
            <option value="japan">Profile: Japan JIS Rirekisho (山田 太郎)</option>
            <option value="executive">Profile: Global Executive (CTO)</option>
          </select>

          {/* Zoom controls */}
          <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5">
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.max(0.4, prev - 0.1))}
              className="p-1 hover:bg-white rounded cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
            </button>
            <span className="font-mono text-[10px] px-1.5 font-bold text-slate-700">
              {Math.round(zoomScale * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoomScale((prev) => Math.min(1.3, prev + 0.1))}
              className="p-1 hover:bg-white rounded cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
            </button>
          </div>

          {template && onEditTemplate && (
            <button
              type="button"
              onClick={() => onEditTemplate(template)}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
            >
              Edit Source
            </button>
          )}
        </div>
      </div>

      {/* Scaled Preview Canvas */}
      <div className="bg-slate-200/80 rounded-2xl p-8 flex justify-center overflow-x-auto min-h-[700px] border border-slate-300 shadow-inner">
        <CvRenderer cv={previewCv} scale={zoomScale} />
      </div>
    </div>
  );
};

export default AdminTemplatePreviewTab;
