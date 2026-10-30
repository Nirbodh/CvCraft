import React from 'react';
import { CountryId, CV } from '../types/cv.ts';
import { COUNTRY_PROFILES, COUNTRY_LIST, CountryProfile } from '../config/countries.ts';
import { Globe2, Info, Check, Sparkles, HelpCircle, AlertCircle } from 'lucide-react';

interface CountrySelectorProps {
  currentCountryId: CountryId;
  cv: CV;
  onSelectCountry: (countryId: CountryId, applyRecommendedDefaults?: boolean) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  currentCountryId,
  cv,
  onSelectCountry,
}) => {
  const currentProfile: CountryProfile = COUNTRY_PROFILES[currentCountryId] || COUNTRY_PROFILES.usa;

  const handleApplyDefaults = () => {
    onSelectCountry(currentProfile.id, true);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4 text-xs text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-blue-600" />
          <span className="font-bold text-slate-900 text-sm">Target Job Market &amp; Country Profile</span>
        </div>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
          Conventions are flexible recommendations, not mandatory legal rules
        </span>
      </div>

      {/* Country buttons grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {COUNTRY_LIST.map((country) => {
          const isSelected = country.id === currentCountryId;
          return (
            <button
              key={country.id}
              type="button"
              onClick={() => onSelectCountry(country.id, false)}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="text-base select-none">{country.flag}</span>
                {isSelected && <span className="text-blue-600 font-bold text-xs">✓</span>}
              </div>
              <div>
                <span className="font-bold text-slate-900 block truncate">{country.name}</span>
                <span className="text-[10px] text-slate-500 block truncate">
                  {country.documentTerm} · {country.photoConvention === 'discouraged' ? 'No Photo' : 'Photo OK'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Country Insight Card */}
      <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xl">{currentProfile.flag}</span>
            <div>
              <span className="font-bold text-slate-900 text-xs">
                {currentProfile.name} Recruitment Norms &amp; Structure
              </span>
              <span className="text-[11px] text-slate-500 block">
                Standard Term: <b>{currentProfile.documentTerm}</b> · Length: <b>{currentProfile.recommendedLength}</b>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApplyDefaults}
            className="px-2.5 py-1 text-[11px] font-semibold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded transition-colors self-start sm:self-auto cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>Apply {currentProfile.name} Order &amp; Layout</span>
          </button>
        </div>

        {/* Photo & ATS Guideline notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
          <div className="p-2.5 bg-white border border-slate-200 rounded space-y-1">
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <span>Photo Convention:</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                  currentProfile.photoConvention === 'discouraged'
                    ? 'bg-rose-50 text-rose-700'
                    : currentProfile.photoConvention === 'standard'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {currentProfile.photoConvention.toUpperCase()}
              </span>
            </span>
            <p className="text-slate-600 leading-relaxed">{currentProfile.photoExplanation}</p>
          </div>

          <div className="p-2.5 bg-white border border-slate-200 rounded space-y-1">
            <span className="font-bold text-slate-800">ATS &amp; Date Standard:</span>
            <p className="text-slate-600 leading-relaxed">
              Date format: <b>{currentProfile.defaultDateFormat}</b>. {currentProfile.atsGuidance}
            </p>
          </div>
        </div>

        {/* Actionable Country Tips */}
        <div className="space-y-1">
          <span className="font-bold text-slate-800 text-[11px]">Hiring Insights for {currentProfile.name}:</span>
          <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-slate-600">
            {currentProfile.countryTips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
