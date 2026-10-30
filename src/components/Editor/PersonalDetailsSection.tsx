import React from 'react';
import { UserCheck2, Info, Globe, Shield, Calendar, MapPin, Flag } from 'lucide-react';
import { PersonalDetailsData } from '../../types/cv.ts';
import { DynamicFieldRenderer } from './DynamicFieldRenderer.tsx';
import { TemplateFieldDefinition } from '../../types/template.ts';

interface PersonalDetailsSectionProps {
  data: PersonalDetailsData;
  dynamicFields?: TemplateFieldDefinition[];
  onChange: (updated: PersonalDetailsData) => void;
}

export const PersonalDetailsSection: React.FC<PersonalDetailsSectionProps> = ({
  data = {},
  dynamicFields = [],
  onChange,
}) => {
  const handleChange = (field: keyof PersonalDetailsData, value: string) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
          <UserCheck2 className="w-4 h-4 text-blue-600" />
          <span>Personal Details &amp; Biodata</span>
        </h3>
        <p className="text-[11px] text-slate-500 mt-0.5">
          Standard for German (Bewerbung), Middle Eastern, South Asian, and European CV formats.
        </p>
      </div>

      <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <span className="text-[11px] leading-relaxed">
          <b>Recruitment Advice:</b> Leave these blank if applying for roles in the US, UK, or Canada, where anti-discrimination regulations discourage demographic details.
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
            <Flag className="w-3.5 h-3.5 text-slate-400" />
            <span>Nationality / Citizenship</span>
          </label>
          <input
            type="text"
            value={data.nationality || ''}
            onChange={(e) => handleChange('nationality', e.target.value)}
            placeholder="e.g. German / British / Canadian"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Date of Birth</span>
          </label>
          <input
            type="text"
            value={data.dateOfBirth || ''}
            onChange={(e) => handleChange('dateOfBirth', e.target.value)}
            placeholder="e.g. 15 March 1994"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Place of Birth</span>
          </label>
          <input
            type="text"
            value={data.placeOfBirth || ''}
            onChange={(e) => handleChange('placeOfBirth', e.target.value)}
            placeholder="e.g. Munich, Germany"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Gender
          </label>
          <input
            type="text"
            value={data.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            placeholder="e.g. Male / Female / Unspecified"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Marital Status
          </label>
          <input
            type="text"
            value={data.maritalStatus || ''}
            onChange={(e) => handleChange('maritalStatus', e.target.value)}
            placeholder="e.g. Single / Married"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Visa / Work Authorization</span>
          </label>
          <input
            type="text"
            value={data.visaStatus || ''}
            onChange={(e) => handleChange('visaStatus', e.target.value)}
            placeholder="e.g. Permanent Resident / Citizen"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span>Passport or National ID No.</span>
          </label>
          <input
            type="text"
            value={data.passportOrId || ''}
            onChange={(e) => handleChange('passportOrId', e.target.value)}
            placeholder="Optional ID / Passport number"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Military / Civil Service Status
          </label>
          <input
            type="text"
            value={data.militaryService || ''}
            onChange={(e) => handleChange('militaryService', e.target.value)}
            placeholder="e.g. Completed / Exempt"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold mb-1">
            Additional Demographic Note
          </label>
          <input
            type="text"
            value={data.additionalNotes || ''}
            onChange={(e) => handleChange('additionalNotes', e.target.value)}
            placeholder="e.g. Available for relocation"
            className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900 bg-white"
          />
        </div>
      </div>

      {dynamicFields && dynamicFields.length > 0 && (
        <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-lg space-y-2 mt-4">
          <span className="text-xs font-bold text-blue-950 block pb-1 border-b border-blue-200">
            Template-Specific Demographic Fields
          </span>
          <DynamicFieldRenderer
            fields={dynamicFields}
            values={data as any}
            onChange={handleChange}
          />
        </div>
      )}
    </div>
  );
};
