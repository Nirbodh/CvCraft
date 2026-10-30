import React, { useState, useEffect } from 'react';
import {
  Globe,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  X,
  Languages,
  Check,
  Edit3,
} from 'lucide-react';
import { CV, CvData } from '../types/cv.ts';
import {
  SUPPORTED_LANGUAGES,
  extractTranslatableFields,
  translateCvContent,
  applyTranslationsToCvData,
  TranslatableField,
} from '../services/translationService.ts';

interface TranslationModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CV;
  onApplyTranslation: (translatedData: CvData, targetLang: string) => void;
}

export const TranslationModal: React.FC<TranslationModalProps> = ({
  isOpen,
  onClose,
  cv,
  onApplyTranslation,
}) => {
  const [targetLang, setTargetLang] = useState<string>('ja');
  const [sourceLang, setSourceLang] = useState<string>('en');
  const [fields, setFields] = useState<TranslatableField[]>([]);
  const [editedTranslations, setEditedTranslations] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [providerInfo, setProviderInfo] = useState<string>('');
  const [notice, setNotice] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'select' | 'preview'>('select');

  // Initialize fields on open
  useEffect(() => {
    if (isOpen) {
      const extracted = extractTranslatableFields(cv.data);
      setFields(extracted);
      const initialMap: Record<string, string> = {};
      extracted.forEach((f) => {
        initialMap[f.id] = f.originalText;
      });
      setEditedTranslations(initialMap);
      setStep('select');
      setError(null);
      setNotice('');
    }
  }, [isOpen, cv.data]);

  if (!isOpen) return null;

  const handleStartTranslation = async () => {
    setIsLoading(true);
    setError(null);
    setNotice('');

    try {
      const result = await translateCvContent(fields, sourceLang, targetLang);

      if (!result.success && result.error) {
        setError(result.error);
      } else {
        setProviderInfo(result.provider);
        setNotice(result.notice || '');
        const updatedMap: Record<string, string> = {};
        result.fields.forEach((f) => {
          updatedMap[f.id] = f.translatedText || f.originalText;
        });
        setEditedTranslations(updatedMap);
        setStep('preview');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred during translation.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextChange = (id: string, newText: string) => {
    setEditedTranslations((prev) => ({
      ...prev,
      [id]: newText,
    }));
  };

  const handleApply = () => {
    const localizedData = applyTranslationsToCvData(cv.data, editedTranslations);
    onApplyTranslation(localizedData, targetLang);
    onClose();
  };

  const selectedTargetLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-xs">
              <Languages className="w-5 h-5 text-blue-200" />
            </div>
            <div>
              <h2 className="text-lg font-bold">CVCraft Multi-Language Translation Engine</h2>
              <p className="text-xs text-blue-100">
                Localize your resume for foreign recruiters without altering your original draft
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Notice from Translation Engine</p>
                <p className="text-xs text-amber-700 mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {step === 'select' ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-800 mb-2">
                  1. Select Target Output Language
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {SUPPORTED_LANGUAGES.map((lang) => {
                    const isSelected = targetLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => setTargetLang(lang.code)}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/50 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-sm text-slate-900">
                              {lang.name}
                            </span>
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 ml-1" />
                            )}
                          </div>
                          <span className="text-xs text-slate-500 truncate block mt-0.5">
                            e.g. {lang.sampleJob}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Guaranteed Localization Protocol:
                </h4>
                <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                  <li>Original content remains safely preserved in your project.</li>
                  <li>Side-by-side review allows you to verify and edit every field before applying.</li>
                  <li>Proper nouns (names, companies, institutions, dates) are never hallucinated.</li>
                  <li>
                    Japanese target outputs natural business phrasing matching JIS Rirekisho standards.
                  </li>
                </ul>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleStartTranslation}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Translating CV Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Translate into {selectedTargetLangObj?.name || targetLang}
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Status Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600" />
                  <span>
                    Provider: <strong>{providerInfo || 'CVCraft Engine'}</strong>
                  </span>
                  {notice && <span className="text-blue-700 font-medium">({notice})</span>}
                </div>
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Change Language ({targetLang.toUpperCase()})
                </button>
              </div>

              {/* Side-by-Side Field Comparison and Editor */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-1">
                  <span>Original (English / Source)</span>
                  <span className="flex items-center gap-1 text-blue-600">
                    <Edit3 className="w-3.5 h-3.5" />
                    {selectedTargetLangObj?.name} (Editable)
                  </span>
                </div>

                <div className="space-y-3">
                  {fields.map((field) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                    >
                      <div>
                        <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">
                          {field.category}: {field.label}
                        </div>
                        <div className="text-xs text-slate-800 bg-white p-2.5 rounded-lg border border-slate-200 min-h-[42px] whitespace-pre-line leading-relaxed">
                          {field.originalText}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-semibold text-blue-700 uppercase mb-1">
                          Translated Field
                        </div>
                        <textarea
                          rows={field.originalText.length > 80 ? 3 : 1}
                          value={editedTranslations[field.id] || ''}
                          onChange={(e) => handleTextChange(field.id, e.target.value)}
                          className="w-full text-xs text-slate-900 bg-white p-2.5 rounded-lg border border-blue-200 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-hidden font-sans leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>

          {step === 'preview' && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setStep('select')}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                Apply Translation to CV
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
