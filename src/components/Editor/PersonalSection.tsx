import React, { useState } from 'react';
import { PersonalInfo } from '../../types/cv.ts';
import {
  User,
  Briefcase,
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Camera,
  Trash2,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';

import { ProfilePhotoSection } from './ProfilePhotoSection.tsx';
import { DynamicFieldRenderer } from './DynamicFieldRenderer.tsx';
import { TemplateFieldDefinition } from '../../types/template.ts';

interface PersonalSectionProps {
  data: PersonalInfo;
  countryId?: string;
  themeColor?: string;
  dynamicFields?: TemplateFieldDefinition[];
  onChange: (updated: PersonalInfo) => void;
}

export const PersonalSection: React.FC<PersonalSectionProps> = ({
  data,
  countryId = 'usa',
  themeColor = '#2563eb',
  dynamicFields = [],
  onChange,
}) => {
  const [showDemographics, setShowDemographics] = useState(
    Boolean(
      data.dateOfBirth ||
        data.nationality ||
        data.maritalStatus ||
        data.visaStatus ||
        data.fatherName ||
        data.permanentAddress
    )
  );

  const handleChange = (field: string, value: any) => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  return (
    <div className="space-y-5">
      {/* 1. Complete Profile Photo Studio */}
      <ProfilePhotoSection
        personalInfo={data}
        countryId={countryId}
        themeColor={themeColor}
        onChange={onChange}
      />

      {/* 2. Primary Contact Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Full Name <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            value={data.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g. Alex Vance"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-slate-400" />
            <span>Job Title <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="text"
            value={data.jobTitle || ''}
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            placeholder="e.g. Senior Software Engineer"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Email Address <span className="text-rose-500">*</span></span>
          </label>
          <input
            type="email"
            value={data.email || ''}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="e.g. alex@example.com"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-slate-400" />
            <span>Phone Number</span>
          </label>
          <input
            type="tel"
            value={data.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="e.g. +1 (555) 019-2834"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>Location / City, Country</span>
          </label>
          <input
            type="text"
            value={data.location || ''}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="e.g. San Francisco, CA (or London, UK)"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <span>Portfolio / Website</span>
          </label>
          <input
            type="url"
            value={data.website || ''}
            onChange={(e) => handleChange('website', e.target.value)}
            placeholder="e.g. https://alexvance.dev"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-slate-400" />
            <span>LinkedIn Profile</span>
          </label>
          <input
            type="text"
            value={data.linkedin || ''}
            onChange={(e) => handleChange('linkedin', e.target.value)}
            placeholder="e.g. linkedin.com/in/alexvance"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <Github className="w-3.5 h-3.5 text-slate-400" />
            <span>GitHub Profile</span>
          </label>
          <input
            type="text"
            value={data.github || ''}
            onChange={(e) => handleChange('github', e.target.value)}
            placeholder="e.g. github.com/alexvance"
            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 text-slate-900 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* 2.5 Template-Driven Fields (Automatically determined by selected template) */}
      {dynamicFields && dynamicFields.length > 0 && (
        <div className="p-4 bg-slate-50/80 rounded-lg border border-slate-200 space-y-3">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-900">
              Template-Specific Personal Fields
            </span>
            <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              Active Template
            </span>
          </div>
          <DynamicFieldRenderer
            fields={dynamicFields}
            values={data as any}
            onChange={handleChange}
            themeColor={themeColor}
          />
        </div>
      )}

      {/* 3. Collapsible Country & Demographic Information */}
      <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
        <button
          type="button"
          onClick={() => setShowDemographics(!showDemographics)}
          className="w-full p-3 bg-slate-50 hover:bg-slate-100 transition-colors flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-slate-500" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Country-Specific &amp; Demographic Details (Optional)
              </span>
              <span className="text-[11px] text-slate-500 block">
                Nationality, Date of Birth, Visa Status, Biodata fields
              </span>
            </div>
          </div>
          {showDemographics ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showDemographics && (
          <div className="p-3.5 bg-white border-t border-slate-100 space-y-3 text-xs">
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Include these fields only if customary for your target region (e.g. Germany, UAE, Bangladesh). Leave blank if applying in the US, UK, or Canada.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Date of Birth</label>
                <input
                  type="text"
                  value={data.dateOfBirth || ''}
                  onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                  placeholder="e.g. 15 March 1995"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Nationality / Citizenship</label>
                <input
                  type="text"
                  value={data.nationality || ''}
                  onChange={(e) => handleChange('nationality', e.target.value)}
                  placeholder="e.g. German / British / Canadian"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Visa / Work Rights</label>
                <input
                  type="text"
                  value={data.visaStatus || ''}
                  onChange={(e) => handleChange('visaStatus', e.target.value)}
                  placeholder="e.g. PR / Golden Visa / Citizen"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Marital Status</label>
                <input
                  type="text"
                  value={data.maritalStatus || ''}
                  onChange={(e) => handleChange('maritalStatus', e.target.value)}
                  placeholder="e.g. Single / Married"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Blood Group (optional)</label>
                <input
                  type="text"
                  value={data.bloodGroup || ''}
                  onChange={(e) => handleChange('bloodGroup', e.target.value)}
                  placeholder="e.g. O+ / B+"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Religion (optional)</label>
                <input
                  type="text"
                  value={data.religion || ''}
                  onChange={(e) => handleChange('religion', e.target.value)}
                  placeholder="e.g. Islam / Christianity / etc."
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Father's Name (Biodata)</label>
                <input
                  type="text"
                  value={data.fatherName || ''}
                  onChange={(e) => handleChange('fatherName', e.target.value)}
                  placeholder="Father's Full Name"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Mother's Name (Biodata)</label>
                <input
                  type="text"
                  value={data.motherName || ''}
                  onChange={(e) => handleChange('motherName', e.target.value)}
                  placeholder="Mother's Full Name"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-1">
                <label className="block text-slate-600 font-medium mb-1 text-[11px]">Permanent Address</label>
                <input
                  type="text"
                  value={data.permanentAddress || ''}
                  onChange={(e) => handleChange('permanentAddress', e.target.value)}
                  placeholder="Permanent Home Address"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-slate-900"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
