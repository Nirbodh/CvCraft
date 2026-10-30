import React, { useState } from 'react';
import { Sparkles, AlertCircle, Check } from 'lucide-react';
import { generateDeterministicSummary, SummaryGenerationInput } from '../../services/writingAssistant.ts';
import { DynamicFieldRenderer } from './DynamicFieldRenderer.tsx';
import { TemplateFieldDefinition } from '../../types/template.ts';

interface SummarySectionProps {
  summary: string;
  contextInput: SummaryGenerationInput;
  dynamicFields?: TemplateFieldDefinition[];
  dynamicValues?: Record<string, any>;
  onDynamicChange?: (fieldId: string, value: any) => void;
  onChange: (updated: string) => void;
}

export const SummarySection: React.FC<SummarySectionProps> = ({
  summary,
  contextInput,
  dynamicFields = [],
  dynamicValues = {},
  onDynamicChange,
  onChange,
}) => {
  const [showGenerator, setShowGenerator] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const words = summary.trim() ? summary.trim().split(/\s+/).length : 0;
  const chars = summary.length;

  const handleGenerate = () => {
    setShowGenerator(true);
    setFeedbackMsg(null);
  };

  const generationResult = generateDeterministicSummary(contextInput);

  const applySummary = (text: string) => {
    onChange(text);
    setFeedbackMsg('Applied summary to your CV. You can edit any sentence below!');
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">
          Professional Summary / Objective
        </label>
        <button
          type="button"
          onClick={handleGenerate}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generate from My Facts</span>
        </button>
      </div>

      {feedbackMsg && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {showGenerator && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-slate-900">Deterministic Summary Generator</span>
            <button
              type="button"
              onClick={() => setShowGenerator(false)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>

          {!generationResult.hasSufficientData ? (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-amber-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Missing actual background info</p>
                <p className="text-[11px] text-amber-700 mt-0.5">
                  The rule-based writing engine strictly uses your real credentials and will never invent fake degrees, employers, or skills. Please provide:
                </p>
                <ul className="list-disc ml-4 mt-1 space-y-0.5 text-[11px]">
                  {generationResult.missingFields.map((field, idx) => (
                    <li key={idx}>{field}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-slate-600 text-[11px]">
                Select a factual summary generated from your job title (<b>{contextInput.jobTitle}</b>) and verified skills:
              </p>
              <div className="space-y-2">
                {generationResult.options.map((opt, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-slate-200 rounded hover:border-blue-400 transition-all">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-[11px] text-slate-800">{opt.style}</span>
                      <button
                        type="button"
                        onClick={() => applySummary(opt.text)}
                        className="px-2 py-0.5 text-[11px] font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded cursor-pointer"
                      >
                        Use This Summary
                      </button>
                    </div>
                    <p className="text-slate-600 text-[11px] leading-relaxed">{opt.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div>
        <textarea
          rows={5}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Brief 2-4 sentence overview of your professional trajectory, key technical strengths, and core accomplishments..."
          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400 leading-relaxed"
        />
        <div className="flex justify-between text-[11px] text-slate-400 mt-1">
          <span>Target length: 40–80 words</span>
          <span>{words} words · {chars} chars</span>
        </div>
      </div>

      {dynamicFields && dynamicFields.length > 0 && onDynamicChange && (
        <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2 mt-4">
          <span className="text-xs font-bold text-slate-900 block pb-1 border-b border-slate-200">
            Template-Specific Summary &amp; Objective Fields
          </span>
          <DynamicFieldRenderer
            fields={dynamicFields}
            values={dynamicValues}
            onChange={onDynamicChange}
          />
        </div>
      )}
    </div>
  );
};
