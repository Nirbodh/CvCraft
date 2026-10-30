import React from 'react';
import { CV } from '../../types/cv.ts';
import {
  Award,
  BookOpen,
  Users,
  HeartHandshake,
  Presentation,
  UserCheck,
  Compass,
  Car,
  FilePlus2,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';

interface CvSectionRendererProps {
  cv: CV;
  sectionKey: string;
  themeColor?: string;
  variant?: 'modern' | 'classic' | 'minimal' | 'ats' | 'executive';
}

export const CvSectionRenderer: React.FC<CvSectionRendererProps> = ({
  cv,
  sectionKey,
  themeColor = cv.themeColor || '#2563eb',
  variant = 'modern',
}) => {
  const { data, sectionVisibility = {}, customHeadings = {} } = cv;

  // Check section visibility
  if (sectionVisibility[sectionKey] === false) {
    return null;
  }

  const getHeading = (key: string, fallback: string) => {
    return customHeadings[key] || fallback;
  };

  const isAts = variant === 'ats';

  const headingEl = (title: string) => {
    if (isAts) {
      return (
        <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 mb-2 mt-3">
          {title}
        </h2>
      );
    }
    return (
      <h2
        className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-2 mt-4"
        style={{ color: themeColor }}
      >
        <span>{title}</span>
        <div className="h-[1px] flex-1 bg-slate-200" />
      </h2>
    );
  };

  // 1. CAREER OBJECTIVE
  if (sectionKey === 'careerObjective') {
    if (!data.careerObjective || data.careerObjective.trim() === '') return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('careerObjective', 'Career Objective'))}
        <p className="text-slate-700 leading-normal text-justify">
          {data.careerObjective}
        </p>
      </section>
    );
  }

  // 2. AWARDS & ACHIEVEMENTS
  if (sectionKey === 'awards') {
    const awards = data.awards || [];
    if (awards.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('awards', 'Awards & Achievements'))}
        <div className="space-y-2">
          {awards.map((award) => (
            <div key={award.id} className="flex justify-between items-baseline gap-2">
              <div className="flex-1">
                <span className="font-bold text-slate-900">{award.title}</span>
                {award.issuer && (
                  <span className="text-slate-600"> · {award.issuer}</span>
                )}
                {award.description && (
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {award.description}
                  </p>
                )}
              </div>
              {award.date && (
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  {award.date}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 3. PUBLICATIONS & RESEARCH
  if (sectionKey === 'publications') {
    const pubs = data.publications || [];
    if (pubs.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('publications', 'Publications & Research'))}
        <div className="space-y-2.5">
          {pubs.map((pub) => (
            <div key={pub.id} className="leading-snug">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{pub.title}</span>
                {pub.date && (
                  <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    {pub.date}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-600 flex flex-wrap items-center gap-x-2">
                {pub.publisher && <span className="italic">{pub.publisher}</span>}
                {pub.authors && <span>· {pub.authors}</span>}
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center gap-0.5"
                  >
                    <span>Link</span>
                  </a>
                )}
              </div>
              {pub.description && (
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {pub.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 4. PROFESSIONAL MEMBERSHIPS
  if (sectionKey === 'memberships') {
    const memberships = data.memberships || [];
    if (memberships.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('memberships', 'Professional Memberships'))}
        <div className="space-y-1.5">
          {memberships.map((mem) => (
            <div key={mem.id} className="flex justify-between items-baseline gap-2">
              <div>
                <span className="font-bold text-slate-900">{mem.organization}</span>
                {mem.role && <span className="text-slate-600"> — {mem.role}</span>}
                {mem.description && (
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {mem.description}
                  </p>
                )}
              </div>
              {(mem.startDate || mem.endDate) && (
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  {mem.startDate} {mem.endDate ? `– ${mem.endDate}` : mem.current ? '– Present' : ''}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 5. VOLUNTEER EXPERIENCE
  if (sectionKey === 'volunteering') {
    const vol = data.volunteering || [];
    if (vol.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('volunteering', 'Volunteer Experience'))}
        <div className="space-y-3">
          {vol.map((item) => (
            <div key={item.id} className="leading-snug">
              <div className="flex justify-between items-baseline gap-2">
                <span className="font-bold text-slate-900">{item.role}</span>
                {(item.startDate || item.endDate) && (
                  <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                    {item.startDate} – {item.current ? 'Present' : item.endDate}
                  </span>
                )}
              </div>
              <div className="text-slate-600 font-semibold mb-1">
                {item.organization}
                {item.location && <span className="font-normal text-slate-500"> · {item.location}</span>}
              </div>
              {item.description && (
                <p className="text-slate-700 mb-1">{item.description}</p>
              )}
              {item.highlights && item.highlights.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-slate-700">
                  {item.highlights.filter(Boolean).map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 6. TRAINING & WORKSHOPS
  if (sectionKey === 'trainings') {
    const trainings = data.trainings || [];
    if (trainings.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('trainings', 'Training & Workshops'))}
        <div className="space-y-2">
          {trainings.map((trn) => (
            <div key={trn.id} className="flex justify-between items-baseline gap-2 leading-snug">
              <div>
                <span className="font-bold text-slate-900">{trn.name}</span>
                {trn.provider && (
                  <span className="text-slate-600"> · {trn.provider}</span>
                )}
                {trn.description && (
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                    {trn.description}
                  </p>
                )}
              </div>
              {trn.completionDate && (
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  {trn.completionDate}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 7. REFERENCES
  if (sectionKey === 'references') {
    const references = data.references || [];
    if (references.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('references', 'References'))}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {references.map((ref) => {
            if (ref.availableOnRequest) {
              return (
                <div key={ref.id} className="col-span-full italic text-slate-600 text-xs">
                  References available upon request.
                </div>
              );
            }
            return (
              <div key={ref.id} className="leading-snug bg-slate-50/60 p-2.5 rounded border border-slate-100">
                <span className="font-bold text-slate-900 block">{ref.name}</span>
                <span className="text-slate-600 block text-[11px]">
                  {ref.position ? `${ref.position}, ` : ''}{ref.company}
                </span>
                {ref.relationship && (
                  <span className="text-slate-500 block text-[10px] mt-0.5 italic">
                    {ref.relationship}
                  </span>
                )}
                <div className="flex flex-wrap gap-x-2 text-[11px] text-slate-500 mt-1">
                  {ref.email && <span>{ref.email}</span>}
                  {ref.phone && <span>· {ref.phone}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  // 8. INTERESTS & HOBBIES
  if (sectionKey === 'interests') {
    const interests = data.interests || [];
    if (interests.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('interests', 'Interests & Hobbies'))}
        <div className="flex flex-wrap gap-2">
          {interests.map((it) => (
            <span
              key={it.id}
              className="inline-flex items-center px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs"
            >
              <b>{it.name}</b>
              {it.description && <span className="text-slate-500 ml-1">({it.description})</span>}
            </span>
          ))}
        </div>
      </section>
    );
  }

  // 9. DRIVING LICENCE
  if (sectionKey === 'drivingLicence') {
    const dl = data.drivingLicence || [];
    if (dl.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('drivingLicence', 'Driving Licence'))}
        <div className="space-y-1">
          {dl.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-slate-800">
              <span>
                <b>{item.category}</b>
                {item.issuedBy && <span className="text-slate-500"> ({item.issuedBy})</span>}
              </span>
              {item.hasOwnVehicle && (
                <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  Own vehicle
                </span>
              )}
            </div>
          ))}
        </div>
      </section>
    );
  }

  // 10. PERSONAL DETAILS / DEMOGRAPHICS
  if (sectionKey === 'personalDetails') {
    const pd = data.personalDetails || {};
    const hasValues = Object.values(pd).some(Boolean);
    if (!hasValues) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('personalDetails', 'Personal Details'))}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-slate-700">
          {pd.nationality && <div>Nationality: <b>{pd.nationality}</b></div>}
          {pd.dateOfBirth && <div>DOB: <b>{pd.dateOfBirth}</b></div>}
          {pd.placeOfBirth && <div>Place of Birth: <b>{pd.placeOfBirth}</b></div>}
          {pd.gender && <div>Gender: <b>{pd.gender}</b></div>}
          {pd.maritalStatus && <div>Status: <b>{pd.maritalStatus}</b></div>}
          {pd.visaStatus && <div>Visa: <b>{pd.visaStatus}</b></div>}
          {pd.militaryService && <div>Military Service: <b>{pd.militaryService}</b></div>}
        </div>
      </section>
    );
  }

  // 11. ADDITIONAL INFORMATION
  if (sectionKey === 'additionalInfo') {
    const addInfo = data.additionalInfo || [];
    if (addInfo.length === 0) return null;
    return (
      <section className="mb-4 text-xs">
        {headingEl(getHeading('additionalInfo', 'Additional Information'))}
        <div className="space-y-2">
          {addInfo.map((item) => (
            <div key={item.id}>
              <span className="font-bold text-slate-900 block">{item.title}</span>
              <p className="text-slate-700 leading-normal">{item.content}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return null;
};
