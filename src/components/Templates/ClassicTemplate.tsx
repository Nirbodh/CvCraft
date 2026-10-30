import React from 'react';
import { CV } from '../../types/cv.ts';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility, customHeadings } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  const getHeading = (key: string, fallback: string) => {
    return customHeadings?.[key] || fallback;
  };

  const photoPos = personalInfo.photoConfig?.position || 'center';

  return (
    <div className="w-full bg-white text-slate-900 leading-relaxed font-serif">
      {/* Centered Classic Header */}
      {sectionVisibility.personalInfo !== false && (
        <header className="text-center pb-4 mb-5 border-b border-slate-300">
          <div className="flex justify-center mb-3">
            <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-normal tracking-wider uppercase text-slate-950 font-serif">
            {personalInfo.fullName || 'Candidate Name'}
          </h1>
          <p className="text-sm italic text-slate-700 mt-1 font-serif">
            {personalInfo.jobTitle || 'Professional Title'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-xs text-slate-600 font-sans">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span>{personalInfo.phone}</span>
              </>
            )}
            {personalInfo.email && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
              </>
            )}
            {personalInfo.website && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a>
              </>
            )}
            {personalInfo.linkedin && (
              <>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a>
              </>
            )}
          </div>

          {/* Optional Demographics if provided */}
          {(personalInfo.nationality || personalInfo.dateOfBirth || personalInfo.maritalStatus || personalInfo.visaStatus) && (
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-0.5 mt-2 text-[11px] text-slate-500 font-sans italic">
              {personalInfo.dateOfBirth && <span>DOB: {personalInfo.dateOfBirth}</span>}
              {personalInfo.nationality && <span>Nationality: {personalInfo.nationality}</span>}
              {personalInfo.maritalStatus && <span>Status: {personalInfo.maritalStatus}</span>}
              {personalInfo.visaStatus && <span>Visa: {personalInfo.visaStatus}</span>}
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {sectionVisibility.summary !== false && summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-center border-b border-t border-slate-300 py-1 mb-2 font-sans" style={{ color: themeColor }}>
            {getHeading('summary', 'Professional Summary')}
          </h2>
          <p className="text-xs text-slate-800 leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {sectionVisibility.experience !== false && experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-center border-b border-t border-slate-300 py-1 mb-3 font-sans" style={{ color: themeColor }}>
            {getHeading('experience', 'Work Experience')}
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-slate-950 font-sans">{exp.role}</span>
                  <span className="text-xs italic text-slate-600 font-sans">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs mb-1">
                  <span className="italic font-medium text-slate-700">{exp.company}</span>
                  {exp.location && <span className="text-slate-500 font-sans">{exp.location}</span>}
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-800 mb-1">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-800">
                    {exp.highlights.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education !== false && education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-center border-b border-t border-slate-300 py-1 mb-3 font-sans" style={{ color: themeColor }}>
            {getHeading('education', 'Education & Credentials')}
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="font-bold text-slate-950 font-sans">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                  <span className="italic text-slate-600 font-sans">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-700 italic">
                  <span>{edu.institution}</span>
                  {edu.location && <span className="font-sans not-italic text-slate-500">{edu.location}</span>}
                </div>
                {edu.gpa && <div className="text-[11px] text-slate-600 font-sans">GPA: {edu.gpa}</div>}
                {edu.description && <p className="text-xs text-slate-700 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {sectionVisibility.skills !== false && skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-center border-b border-t border-slate-300 py-1 mb-2 font-sans" style={{ color: themeColor }}>
            {getHeading('skills', 'Areas of Expertise')}
          </h2>
          <div className="space-y-1.5 text-xs">
            {skills.map((cat) => (
              <div key={cat.id} className="text-slate-800">
                <span className="font-bold font-sans text-slate-900">{cat.category}: </span>
                <span>{cat.items.join(' · ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects !== false && projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-center border-b border-t border-slate-300 py-1 mb-3 font-sans" style={{ color: themeColor }}>
            {getHeading('projects', 'Notable Projects & Engagements')}
          </h2>
          <div className="space-y-2.5 text-xs">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between">
                  <span className="font-bold text-slate-950 font-sans">{proj.name}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs italic underline" style={{ color: themeColor }}>
                      Link
                    </a>
                  )}
                </div>
                <p className="text-slate-800 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications and Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-center border-b border-t border-slate-300 py-1 mb-2 font-sans" style={{ color: themeColor }}>
              {getHeading('certifications', 'Certifications')}
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-semibold font-sans">{c.name}</div>
                  <div className="text-[11px] text-slate-600 italic">{c.issuer} ({c.issueDate})</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.languages !== false && languages && languages.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-center border-b border-t border-slate-300 py-1 mb-2 font-sans" style={{ color: themeColor }}>
              {getHeading('languages', 'Languages')}
            </h2>
            <div className="space-y-1 text-xs text-slate-800">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span className="font-semibold">{l.language}</span>
                  <span className="italic text-slate-600">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Custom Sections */}
      {sectionVisibility.customSections !== false && customSections && customSections.length > 0 && (
        <div className="space-y-3">
          {customSections.map((sect) => (
            <section key={sect.id} className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-center border-b border-t border-slate-300 py-1 mb-2 font-sans" style={{ color: themeColor }}>
                {sect.title}
              </h2>
              {sect.subtitle && (
                <div className="text-[11px] font-semibold text-slate-800 mb-0.5 text-center italic">
                  {sect.subtitle} {sect.date && <span className="font-normal text-slate-500 font-sans">({sect.date})</span>}
                </div>
              )}
              {sect.content && <p className="text-xs text-slate-800 leading-normal mb-1">{sect.content}</p>}
              {sect.items && sect.items.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-800 font-sans">
                  {sect.items.filter(Boolean).map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Extended Sections */}
      <CvSectionRenderer cv={cv} sectionKey="careerObjective" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="awards" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="publications" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="memberships" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="volunteering" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="trainings" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="references" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="interests" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="drivingLicence" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="personalDetails" themeColor={themeColor} variant="classic" />
      <CvSectionRenderer cv={cv} sectionKey="additionalInfo" themeColor={themeColor} variant="classic" />
    </div>
  );
};
