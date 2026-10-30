import React from 'react';
import { CV } from '../../types/cv.ts';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility, customHeadings } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  const getHeading = (key: string, fallback: string) => {
    return customHeadings?.[key] || fallback;
  };

  return (
    <div className="w-full bg-white text-zinc-800 leading-relaxed font-sans">
      {/* Header */}
      {sectionVisibility.personalInfo !== false && (
        <header className="mb-6 pb-4 border-b border-zinc-200 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-3xl font-light tracking-tight text-zinc-950">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-sm font-medium tracking-wide text-zinc-500 mt-1">
              {personalInfo.jobTitle || 'Professional Title'}
            </p>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-zinc-500">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.phone && (
                <>
                  <span className="text-zinc-300">/</span>
                  <span>{personalInfo.phone}</span>
                </>
              )}
              {personalInfo.email && (
                <>
                  <span className="text-zinc-300">/</span>
                  <a href={`mailto:${personalInfo.email}`} className="text-zinc-700 hover:text-black">
                    {personalInfo.email}
                  </a>
                </>
              )}
              {personalInfo.website && (
                <>
                  <span className="text-zinc-300">/</span>
                  <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-black">
                    {personalInfo.website.replace(/^https?:\/\//, '')}
                  </a>
                </>
              )}
              {personalInfo.linkedin && (
                <>
                  <span className="text-zinc-300">/</span>
                  <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="text-zinc-700 hover:text-black">
                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                  </a>
                </>
              )}
            </div>

            {(personalInfo.nationality || personalInfo.dateOfBirth || personalInfo.maritalStatus) && (
              <div className="flex flex-wrap items-center gap-x-2 mt-1.5 text-[11px] text-zinc-400">
                {personalInfo.dateOfBirth && <span>Born: {personalInfo.dateOfBirth}</span>}
                {personalInfo.nationality && <span>· {personalInfo.nationality}</span>}
                {personalInfo.maritalStatus && <span>· {personalInfo.maritalStatus}</span>}
              </div>
            )}
          </div>

          <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
        </header>
      )}

      {/* Summary */}
      {sectionVisibility.summary !== false && summary && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
          <div className="md:col-span-3 text-xs font-semibold uppercase tracking-wider text-zinc-400" style={{ color: themeColor }}>
            {getHeading('summary', 'Profile')}
          </div>
          <div className="md:col-span-9 text-xs text-zinc-700 leading-normal">
            {summary}
          </div>
        </div>
      )}

      {/* Experience */}
      {sectionVisibility.experience !== false && experience && experience.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
          <div className="md:col-span-3 text-xs font-semibold uppercase tracking-wider text-zinc-400" style={{ color: themeColor }}>
            {getHeading('experience', 'Experience')}
          </div>
          <div className="md:col-span-9 space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-zinc-900">{exp.role}</span>
                  <span className="text-[11px] text-zinc-400">
                    {exp.startDate} — {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs text-zinc-500 mb-1">
                  <span>{exp.company}</span>
                  {exp.location && <span>, {exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-xs text-zinc-600 mb-1">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-3.5 space-y-0.5 text-xs text-zinc-600">
                    {exp.highlights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {sectionVisibility.education !== false && education && education.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
          <div className="md:col-span-3 text-xs font-semibold uppercase tracking-wider text-zinc-400" style={{ color: themeColor }}>
            {getHeading('education', 'Education')}
          </div>
          <div className="md:col-span-9 space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-semibold text-zinc-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {edu.startDate} — {edu.endDate}
                  </span>
                </div>
                <div className="text-xs text-zinc-500">
                  {edu.institution} {edu.location && `· ${edu.location}`}
                </div>
                {edu.gpa && <div className="text-[11px] text-zinc-500">GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {sectionVisibility.skills !== false && skills && skills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
          <div className="md:col-span-3 text-xs font-semibold uppercase tracking-wider text-zinc-400" style={{ color: themeColor }}>
            {getHeading('skills', 'Skills')}
          </div>
          <div className="md:col-span-9 space-y-1.5 text-xs text-zinc-700">
            {skills.map((cat) => (
              <div key={cat.id}>
                <span className="font-medium text-zinc-900">{cat.category}: </span>
                <span className="text-zinc-600">{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {sectionVisibility.projects !== false && projects && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
          <div className="md:col-span-3 text-xs font-semibold uppercase tracking-wider text-zinc-400" style={{ color: themeColor }}>
            {getHeading('projects', 'Projects')}
          </div>
          <div className="md:col-span-9 space-y-2 text-xs">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between">
                  <span className="font-semibold text-zinc-900">{proj.name}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] text-zinc-500 hover:text-black">
                      Link ↗
                    </a>
                  )}
                </div>
                <p className="text-zinc-600 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications & Languages */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
        <div className="md:col-span-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Details
        </div>
        <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
            <div>
              <div className="font-medium text-zinc-900 mb-1">{getHeading('certifications', 'Certifications')}</div>
              <div className="space-y-1 text-zinc-600">
                {certifications.map((c) => (
                  <div key={c.id}>
                    {c.name} <span className="text-zinc-400">({c.issueDate})</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {sectionVisibility.languages !== false && languages && languages.length > 0 && (
            <div>
              <div className="font-medium text-zinc-900 mb-1">{getHeading('languages', 'Languages')}</div>
              <div className="space-y-0.5 text-zinc-600">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.language}</span>
                    <span className="text-zinc-400">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Sections */}
      {sectionVisibility.customSections !== false && customSections && customSections.length > 0 && (
        <div className="space-y-3">
          {customSections.map((sect) => (
            <div key={sect.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
              <div className="md:col-span-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                {sect.title}
                {sect.date && <div className="text-[10px] font-normal text-zinc-400">({sect.date})</div>}
              </div>
              <div className="md:col-span-9 text-xs text-zinc-700 leading-normal">
                {sect.subtitle && <div className="font-semibold text-zinc-800 mb-0.5">{sect.subtitle}</div>}
                {sect.content && <p className="mb-1">{sect.content}</p>}
                {sect.items && sect.items.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-zinc-700">
                    {sect.items.filter(Boolean).map((it, idx) => (
                      <li key={idx}>{it}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Extended Sections */}
      <CvSectionRenderer cv={cv} sectionKey="careerObjective" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="awards" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="publications" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="memberships" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="volunteering" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="trainings" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="references" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="interests" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="drivingLicence" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="personalDetails" themeColor={themeColor} variant="minimal" />
      <CvSectionRenderer cv={cv} sectionKey="additionalInfo" themeColor={themeColor} variant="minimal" />
    </div>
  );
};
