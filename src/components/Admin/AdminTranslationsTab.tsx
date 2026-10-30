import React, { useState } from 'react';
import {
  Languages,
  Sparkles,
  Globe2,
  Check,
  Bot,
  RefreshCw,
  Search,
} from 'lucide-react';
import { SUPPORTED_LANGUAGES } from '../../services/translationService.ts';

const SAMPLE_DICTIONARY_ENTRIES: Record<string, Record<string, string>> = {
  ja: {
    'Full-Stack Engineer': 'フルスタックエンジニア',
    'Senior Software Engineer': 'シニアソフトウェアエンジニア',
    'Work Experience': '職歴',
    'Education': '学歴',
    'Skills': '免許・資格・スキル',
    'Professional Summary': '職務要約 / 自己PR',
    'Present': '現在に至る',
  },
  de: {
    'Full-Stack Engineer': 'Full-Stack-Entwickler',
    'Senior Software Engineer': 'Senior Softwareentwickler',
    'Work Experience': 'Berufserfahrung',
    'Education': 'Ausbildung & Studium',
    'Skills': 'Kenntnisse & Fähigkeiten',
    'Professional Summary': 'Kurzprofil',
    'Present': 'Heute',
  },
  fr: {
    'Full-Stack Engineer': 'Ingénieur Full-Stack',
    'Senior Software Engineer': 'Ingénieur Logiciel Senior',
    'Work Experience': 'Expérience Professionnelle',
    'Education': 'Formation & Diplômes',
    'Skills': 'Compétences',
    'Professional Summary': 'Profil Professionnel',
    'Present': 'Présent',
  },
  es: {
    'Full-Stack Engineer': 'Ingeniero Full-Stack',
    'Senior Software Engineer': 'Ingeniero de Software Senior',
    'Work Experience': 'Experiencia Laboral',
    'Education': 'Educación y Títulos',
    'Skills': 'Habilidades y Tecnologías',
    'Professional Summary': 'Resumen Profesional',
    'Present': 'Actualidad',
  },
  bn: {
    'Full-Stack Engineer': 'ফুল-স্ট্যাক ইঞ্জিনিয়ার',
    'Senior Software Engineer': 'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার',
    'Work Experience': 'কাজের অভিজ্ঞতা',
    'Education': 'শিক্ষাগত যোগ্যতা',
    'Skills': 'দক্ষতা ও কারিগরি জ্ঞান',
    'Professional Summary': 'ক্যারিয়ার সারসংক্ষেপ',
    'Present': 'বর্তমান',
  },
};

export const AdminTranslationsTab: React.FC = () => {
  const [selectedLang, setSelectedLang] = useState('ja');
  const [dictionary, setDictionary] = useState(SAMPLE_DICTIONARY_ENTRIES);
  const [search, setSearch] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeDict = dictionary[selectedLang] || {};
  const activeLangObj = SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang);

  const handleUpdateTranslation = (key: string, value: string) => {
    setDictionary((prev) => ({
      ...prev,
      [selectedLang]: {
        ...prev[selectedLang],
        [key]: value,
      },
    }));
  };

  const handleSaveDictionary = () => {
    setStatusMessage(`Saved dictionary mappings for ${activeLangObj?.name || selectedLang}.`);
    setTimeout(() => setStatusMessage(null), 3500);
  };

  const filteredKeys = Object.keys(activeDict).filter(
    (k) =>
      k.toLowerCase().includes(search.toLowerCase()) ||
      activeDict[k].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Multi-Language Translation &amp; Localization Dictionary</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Administer deterministic vocabulary mappings and monitor Gemini AI contextual localization.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveDictionary}
          className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Check className="w-3.5 h-3.5" />
          <span>Save Dictionary Changes</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <button type="button" onClick={() => setStatusMessage(null)} className="text-emerald-700 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Language Selector Pills */}
      <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-2 items-center">
        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
          Target Language:
        </span>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => setSelectedLang(lang.code)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              selectedLang === lang.code
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>

      {/* Dictionary Mapping Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-xs">
              {activeLangObj?.flag} {activeLangObj?.name} Standard Terminology
            </h3>
            <span className="text-[11px] text-slate-500">
              When users localize their CV, these exact verified translations are prioritized.
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search terms..."
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredKeys.map((key) => (
            <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">
                  Source Term (English)
                </span>
                <div className="text-xs font-semibold text-slate-800 bg-white p-2 rounded border border-slate-200">
                  {key}
                </div>
              </div>
              <div>
                <span className="text-[10px] text-indigo-700 font-bold uppercase block mb-1">
                  Verified Translation ({activeLangObj?.name})
                </span>
                <input
                  type="text"
                  value={activeDict[key]}
                  onChange={(e) => handleUpdateTranslation(key, e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-indigo-200 rounded text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-indigo-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminTranslationsTab;
