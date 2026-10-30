import React from 'react';
import { CV } from '../../types/cv.ts';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility, customHeadings = {} } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  const getHeading = (key: string, fallback: string) => customHeadings[key] || fallback;

  const photoPos = personalInfo.photoConfig?.position || 'left';
  const isCenter = photoPos === 'center';
  const isRight = photoPos === 'right';

  return (
    <div className="w-full bg-white text-slate-800 leading-relaxed">
      {/* Header */}
      {sectionVisibility.personalInfo !== false && (
        <header className="border-b-2 pb-5 mb-5" style={{ borderColor: themeColor }}>
          <div
            className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${
              isCenter ? 'sm:flex-col sm:items-center text-center' : ''
            }`}
          >
            {/* Left Photo if position === 'left' */}
            {photoPos === 'left' && (
              <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
            )}

            <div className={`flex-1 ${isCenter ? 'text-center' : ''}`}>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                {personalInfo.fullName || 'Candidate Name'}
              </h1>
              <p className="text-base font-semibold mt-1 tracking-wide" style={{ color: themeColor }}>
                {personalInfo.jobTitle || 'Professional Title'}
              </p>
            </div>

            {/* Right Photo if position === 'right' */}
            {isRight && (
              <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
            )}

            {/* Center Photo if position === 'center' */}
            {isCenter && (
              <div className="my-1">
                <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
              </div>
            )}

            {personalInfo.location && !isCenter && (
              <div className="flex items-center gap-1.5 text-xs text-slate-500 sm:text-right shrink-0">
                <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                <span>{personalInfo.location}</span>
              </div>
            )}
          </div>

          {/* Contact Details Bar (Clean unboxed metadata) */}
          <div
            className={`flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600 ${
              isCenter ? 'justify-center' : ''
            }`}
          >
            {personalInfo.location && isCenter && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                <span>{personalInfo.location}</span>
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3 h-3 text-slate-400" />
                <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
              </span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{personalInfo.phone}</span>
              </span>
            )}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3 h-3 text-slate-400" />
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.website.replace(/^https?:\/\//, '')}</a>
              </span>
            )}
            {personalInfo.linkedin && (
              <span className="flex items-center gap-1">
                <Linkedin className="w-3 h-3 text-slate-400" />
                <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</a>
              </span>
            )}
            {personalInfo.github && (
              <span className="flex items-center gap-1">
                <Github className="w-3 h-3 text-slate-400" />
                <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</a>
              </span>
            )}
          </div>

          {/* Country Demographics if populated */}
          {(personalInfo.nationality || personalInfo.dateOfBirth || personalInfo.visaStatus || personalInfo.maritalStatus) && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500">
              {personalInfo.nationality && <span>Nationality: <b>{personalInfo.nationality}</b></span>}
              {personalInfo.dateOfBirth && (
                <>
                  <span>·</span>
                  <span>DOB: <b>{personalInfo.dateOfBirth}</b></span>
                </>
              )}
              {personalInfo.visaStatus && (
                <>
                  <span>·</span>
                  <span>Visa: <b>{personalInfo.visaStatus}</b></span>
                </>
              )}
              {personalInfo.maritalStatus && (
                <>
                  <span>·</span>
                  <span>Status: <b>{personalInfo.maritalStatus}</b></span>
                </>
              )}
            </div>
          )}
        </header>
      )}

      {/* Summary */}
      {sectionVisibility.summary !== false && summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: themeColor }}>
            <span>{getHeading('summary', 'Professional Summary')}</span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </h2>
          <p className="text-xs text-slate-700 leading-normal text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Career Objective */}
      <CvSectionRenderer cv={cv} sectionKey="careerObjective" themeColor={themeColor} />

      {/* Experience */}
      {sectionVisibility.experience !== false && experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: themeColor }}>
            <span>{getHeading('experience', 'Work Experience')}</span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="relative pl-3 border-l-2 border-slate-200">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                  <span className="text-xs font-medium text-slate-500">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mb-1.5">
                  <span>{exp.company}</span>
                  {exp.location && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-normal text-slate-500">{exp.location}</span>
                    </>
                  )}
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-700 mb-1.5">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                    {exp.highlights.map((item, idx) => (
                      <li key={idx} className="leading-normal">{item}</li>
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
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: themeColor }}>
            <span>{getHeading('skills', 'Core Competencies & Skills')}</span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skills.map((cat) => (
              <div key={cat.id} className="text-slate-700">
                <span className="font-bold text-slate-900">{cat.category}: </span>
                <span>{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {sectionVisibility.projects !== false && projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: themeColor }}>
            <span>{getHeading('projects', 'Key Projects')}</span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </h2>
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="text-xs">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-900">{proj.name}</h3>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs hover:underline" style={{ color: themeColor }}>
                        [View Project]
                      </a>
                    )}
                  </div>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <span className="text-[11px] text-slate-500 font-mono">
                      {proj.technologies.join(' · ')}
                    </span>
                  )}
                </div>
                <p className="text-slate-700 mt-1">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {sectionVisibility.education !== false && education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: themeColor }}>
            <span>{getHeading('education', 'Education')}</span>
            <div className="h-[1px] flex-1 bg-slate-200" />
          </h2>
          <div className="space-y-2.5">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-bold text-slate-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <span className="text-slate-500 font-medium">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <span>{edu.institution}</span>
                  {edu.location && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-500">{edu.location}</span>
                    </>
                  )}
                  {edu.gpa && (
                    <>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="font-medium text-slate-700">GPA: {edu.gpa}</span>
                    </>
                  )}
                </div>
                {edu.description && <p className="text-slate-600 mt-1">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: themeColor }}>
              <span>{getHeading('certifications', 'Certifications')}</span>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-semibold text-slate-900">{c.name}</span>
                  <div className="text-[11px] text-slate-500">
                    {c.issuer} · {c.issueDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.languages !== false && languages && languages.length > 0 && (
          <section className="mb-4">
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: themeColor }}>
              <span>{getHeading('languages', 'Languages')}</span>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </h2>
            <div className="space-y-1 text-xs text-slate-700">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span className="font-semibold text-slate-900">{l.language}</span>
                  <span className="text-slate-500">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Custom Sections */}
      {sectionVisibility.customSections !== false && customSections && customSections.length > 0 && (
        <div className="space-y-4">
          {customSections.map((sect) => (
            <section key={sect.id} className="mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: themeColor }}>
                <span>{sect.title}</span>
                <div className="h-[1px] flex-1 bg-slate-200" />
              </h2>
              {sect.subtitle && (
                <div className="text-[11px] font-semibold text-slate-600 mb-0.5">
                  {sect.subtitle} {sect.date && <span className="font-normal text-slate-400">({sect.date})</span>}
                </div>
              )}
              {sect.content && <p className="text-xs text-slate-700 leading-normal mb-1">{sect.content}</p>}
              {sect.items && sect.items.length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-xs text-slate-700">
                  {sect.items.filter(Boolean).map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      )}

      {/* Expanded Sections */}
      <CvSectionRenderer cv={cv} sectionKey="awards" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="publications" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="memberships" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="volunteering" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="trainings" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="references" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="interests" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="drivingLicence" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="personalDetails" themeColor={themeColor} />
      <CvSectionRenderer cv={cv} sectionKey="additionalInfo" themeColor={themeColor} />
    </div>
  );
};
