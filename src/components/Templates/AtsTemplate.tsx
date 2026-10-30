import React from 'react';
import { CV } from '../../types/cv.ts';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const AtsTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility, customHeadings } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  const getHeading = (key: string, fallback: string) => {
    return (customHeadings?.[key] || fallback).toUpperCase();
  };

  const photoPos = personalInfo.photoConfig?.position || 'center';

  return (
    <div className="w-full bg-white text-black leading-normal font-sans">
      {/* ATS Header: Linear, parse-friendly text */}
      {sectionVisibility.personalInfo !== false && (
        <header className="mb-4">
          {/* Optional headshot if explicitly enabled */}
          <div className="flex justify-center mb-2">
            <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
          </div>

          <h1 className="text-2xl font-bold uppercase tracking-wide text-black text-center">
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          <p className="text-sm font-semibold text-center text-slate-800 mt-0.5">
            {personalInfo.jobTitle || 'Professional Title'}
          </p>

          <div className="text-center text-xs text-slate-700 mt-1.5 flex flex-wrap justify-center gap-x-2 gap-y-1">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && (
              <>
                <span aria-hidden="true">|</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.email && (
              <>
                <span aria-hidden="true">|</span>
                <span>{personalInfo.email}</span>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <span aria-hidden="true">|</span>
                <span>{personalInfo.linkedin}</span>
              </>
            )}
            {personalInfo.website && (
              <>
                <span aria-hidden="true">|</span>
                <span>{personalInfo.website}</span>
              </>
            )}
            {personalInfo.github && (
              <>
                <span aria-hidden="true">|</span>
                <span>{personalInfo.github}</span>
              </>
            )}
          </div>

          {(personalInfo.nationality || personalInfo.visaStatus || personalInfo.dateOfBirth) && (
            <div className="text-center text-[11px] text-slate-600 mt-1 flex flex-wrap justify-center gap-x-2">
              {personalInfo.dateOfBirth && <span>DOB: {personalInfo.dateOfBirth}</span>}
              {personalInfo.nationality && <span>| Nationality: {personalInfo.nationality}</span>}
              {personalInfo.visaStatus && <span>| Visa: {personalInfo.visaStatus}</span>}
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {sectionVisibility.summary !== false && summary && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5" style={{ borderBottomColor: themeColor }}>
            {getHeading('summary', 'PROFESSIONAL SUMMARY')}
          </h2>
          <p className="text-xs text-slate-900 leading-normal">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience !== false && experience && experience.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2" style={{ borderBottomColor: themeColor }}>
            {getHeading('experience', 'WORK EXPERIENCE')}
          </h2>
          <div className="space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between text-xs font-bold text-black">
                  <span>{exp.role}</span>
                  <span>{exp.startDate} – {exp.current ? 'Present' : exp.endDate}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-slate-800 mb-1">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-800 mb-1">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-900">
                    {exp.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills !== false && skills && skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5" style={{ borderBottomColor: themeColor }}>
            {getHeading('skills', 'TECHNICAL & CORE SKILLS')}
          </h2>
          <div className="space-y-1 text-xs text-slate-900">
            {skills.map((cat) => (
              <div key={cat.id}>
                <span className="font-bold text-black">{cat.category}: </span>
                <span>{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education !== false && education && education.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-2" style={{ borderBottomColor: themeColor }}>
            {getHeading('education', 'EDUCATION')}
          </h2>
          <div className="space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between text-xs font-bold text-black">
                  <span>
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                  <span>{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-800">
                  <span>{edu.institution}</span>
                  {edu.location && <span>{edu.location}</span>}
                </div>
                {edu.gpa && <div className="text-[11px] text-slate-700">Cumulative GPA: {edu.gpa}</div>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects !== false && projects && projects.length > 0 && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5" style={{ borderBottomColor: themeColor }}>
            {getHeading('projects', 'PROJECTS')}
          </h2>
          <div className="space-y-2 text-xs">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between font-bold text-black">
                  <span>{proj.name}</span>
                  {proj.link && <span className="font-normal text-slate-600">{proj.link}</span>}
                </div>
                <p className="text-slate-800">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-[11px] text-slate-700">
                    <span className="font-semibold">Technologies: </span>
                    {proj.technologies.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      {((sectionVisibility.certifications !== false && certifications && certifications.length > 0) ||
        (sectionVisibility.languages !== false && languages && languages.length > 0)) && (
        <section className="mb-4">
          <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5" style={{ borderBottomColor: themeColor }}>
            {getHeading('certifications', 'ADDITIONAL QUALIFICATIONS')}
          </h2>
          <div className="space-y-1.5 text-xs text-slate-900">
            {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
              <div>
                <span className="font-bold text-black">{getHeading('certifications', 'Certifications')}: </span>
                <span>
                  {certifications.map((c) => `${c.name} (${c.issuer}, ${c.issueDate})`).join('; ')}
                </span>
              </div>
            )}
            {sectionVisibility.languages !== false && languages && languages.length > 0 && (
              <div>
                <span className="font-bold text-black">{getHeading('languages', 'Languages')}: </span>
                <span>
                  {languages.map((l) => `${l.language} (${l.proficiency})`).join(', ')}
                </span>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Custom Sections */}
      {sectionVisibility.customSections !== false && customSections && customSections.length > 0 && (
        <div className="space-y-3">
          {customSections.map((sect) => (
            <section key={sect.id} className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider border-b border-black pb-0.5 mb-1.5" style={{ borderBottomColor: themeColor }}>
                {sect.title.toUpperCase()}
              </h2>
              {sect.subtitle && (
                <div className="text-[11px] font-semibold text-slate-800 mb-0.5">
                  {sect.subtitle} {sect.date && <span className="font-normal text-slate-500">({sect.date})</span>}
                </div>
              )}
              {sect.content && <p className="text-xs text-slate-900 leading-normal mb-1">{sect.content}</p>}
              {sect.items && sect.items.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-900">
                  {sect.items.filter(Boolean).map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Extended Sections in ATS format */}
      <CvSectionRenderer cv={cv} sectionKey="careerObjective" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="awards" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="publications" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="memberships" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="volunteering" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="trainings" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="references" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="interests" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="drivingLicence" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="personalDetails" themeColor={themeColor} variant="ats" />
      <CvSectionRenderer cv={cv} sectionKey="additionalInfo" themeColor={themeColor} variant="ats" />
    </div>
  );
};
