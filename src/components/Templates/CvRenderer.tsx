import React from 'react';
import { CV } from '../../types/cv.ts';
import { AtsTemplate } from './AtsTemplate.tsx';
import { ModernTemplate } from './ModernTemplate.tsx';
import { ClassicTemplate } from './ClassicTemplate.tsx';
import { MinimalTemplate } from './MinimalTemplate.tsx';
import { ExecutiveTemplate } from './ExecutiveTemplate.tsx';
import { CreativeTemplate } from './CreativeTemplate.tsx';
import { TechnicalTemplate } from './TechnicalTemplate.tsx';
import { AcademicTemplate } from './AcademicTemplate.tsx';
import { ProfessionalTemplate } from './ProfessionalTemplate.tsx';
import { JapaneseRirekishoTemplate } from './JapaneseRirekishoTemplate.tsx';
import { JapaneseShokumuTemplate } from './JapaneseShokumuTemplate.tsx';
import { CustomHtmlTemplateEngine } from './CustomHtmlTemplateEngine.tsx';

interface CvRendererProps {
  cv: CV;
  scale?: number;
}

export const CvRenderer: React.FC<CvRendererProps> = ({ cv, scale = 1 }) => {
  const getFontFamilyClass = () => {
    switch (cv.fontFamily) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  const getFontSizeClass = () => {
    switch (cv.fontSize) {
      case 'compact':
        return 'text-[11px] leading-snug';
      case 'large':
        return 'text-[13px] leading-relaxed';
      case 'normal':
      default:
        return 'text-xs leading-normal';
    }
  };

  const getMarginClass = () => {
    // JIS Rirekisho and custom two-column sidebars handle custom padding
    if (
      cv.templateId === 'creative' ||
      cv.templateId === 'professional' ||
      cv.templateId === 'japanese-rirekisho'
    ) {
      return 'p-6';
    }

    switch (cv.margins) {
      case 'compact':
        return 'p-6';
      case 'relaxed':
        return 'p-10';
      case 'normal':
      default:
        return 'p-8';
    }
  };

  const renderTemplate = () => {
    // If it's a custom user HTML/CSS template
    if (cv.isCustomTemplate || (cv.customTemplateHtml && cv.customTemplateHtml.trim() !== '')) {
      return <CustomHtmlTemplateEngine cv={cv} />;
    }

    switch (cv.templateId) {
      case 'japanese-rirekisho':
        return <JapaneseRirekishoTemplate cv={cv} />;
      case 'japanese-shokumu':
        return <JapaneseShokumuTemplate cv={cv} />;
      case 'ats':
        return <AtsTemplate cv={cv} />;
      case 'classic':
        return <ClassicTemplate cv={cv} />;
      case 'minimal':
        return <MinimalTemplate cv={cv} />;
      case 'executive':
        return <ExecutiveTemplate cv={cv} />;
      case 'creative':
        return <CreativeTemplate cv={cv} />;
      case 'technical':
        return <TechnicalTemplate cv={cv} />;
      case 'academic':
        return <AcademicTemplate cv={cv} />;
      case 'professional':
        return <ProfessionalTemplate cv={cv} />;
      case 'modern':
      default:
        return <ModernTemplate cv={cv} />;
    }
  };

  return (
    <div className="print-area-wrapper flex flex-col items-center w-full">
      <div
        id="cv-printable-document"
        className={`cv-a4-page relative bg-white shadow-xl rounded-sm transition-all duration-150 origin-top text-slate-800 ${getFontFamilyClass()} ${getFontSizeClass()} ${getMarginClass()}`}
        style={{
          width: '210mm',
          minHeight: '297mm',
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: 'top center',
        }}
      >
        {renderTemplate()}

        {/* Visual A4 Page 1 boundary guideline indicator (hidden on print) */}
        <div
          aria-hidden="true"
          className="no-print absolute left-0 right-0 pointer-events-none border-b-2 border-dashed border-slate-300/80 z-20"
          style={{ top: '297mm' }}
        >
          <span className="absolute right-4 -top-3 text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-mono shadow-xs">
            Page 1 Boundary (A4: 297mm)
          </span>
        </div>
      </div>
    </div>
  );
};
