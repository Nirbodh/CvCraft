import React from 'react';
import { CV } from '../../types/cv.ts';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility, customHeadings = {} } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  const getHeading = (key: string, fallback: string) => customHeadings[key] || fallback;

  return (
    <div className="w-full bg-white text-slate-800 leading-normal font-sans">
      {/* Executive Dark/Tinted Banner Header */}
      {sectionVisibility.personalInfo !== false && (
        <header className="p-6 text-white rounded-t-sm" style={{ backgroundColor: themeColor }}>
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5">
            {/* Left: Candidate Identity */}
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-extrabold tracking-tight uppercase">
                {personalInfo.fullName || 'Candidate Name'}
              </h1>
              <p className="text-sm font-semibold tracking-widest uppercase opacity-90 mt-1">
                {personalInfo.jobTitle || 'Executive Leadership'}
              </p>

              {/* Contact Coordinates */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-3 text-xs opacity-95">
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 opacity-80" />
                    <span>{personalInfo.location}</span>
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 opacity-80" />
                    <span>{personalInfo.phone}</span>
                  </span>
                )}
                {personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 opacity-80" />
                    <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5 opacity-80" />
                    <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                  </span>
                )}
                {personalInfo.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 opacity-80" />
                    <span>{personalInfo.website.replace(/^https?:\/\//, '')}</span>
                  </span>
                )}
              </div>

              {/* Optional Country Demographics */}
              {(personalInfo.nationality || personalInfo.visaStatus || personalInfo.dateOfBirth) && (
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 mt-2 text-[11px] opacity-80">
                  {personalInfo.nationality && <span>Nationality: {personalInfo.nationality}</span>}
                  {personalInfo.visaStatus && (
                    <>
                      <span>·</span>
                      <span>Status: {personalInfo.visaStatus}</span>
                    </>
                  )}
                  {personalInfo.dateOfBirth && (
                    <>
                      <span>·</span>
                      <span>DOB: {personalInfo.dateOfBirth}</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Profile Photo if enabled */}
            <div className="shrink-0">
              <CvPhotoRenderer personalInfo={personalInfo} themeColor="#ffffff" />
            </div>
          </div>
        </header>
      )}

      {/* Main Body */}
      <div className="p-6 space-y-5">
        {/* Executive Profile / Summary */}
        {sectionVisibility.summary !== false && summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 flex items-center gap-2" style={{ borderColor: themeColor, color: themeColor }}>
              <span>{getHeading('summary', 'Executive Profile & Strategic Vision')}</span>
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Core Competencies Matrix */}
        {sectionVisibility.skills !== false && skills && skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b-2 flex items-center gap-2" style={{ borderColor: themeColor, color: themeColor }}>
              <span>{getHeading('skills', 'Core Competencies & Executive Capabilities')}</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded border border-slate-200">
              {skills.map((cat) => (
                <div key={cat.id}>
                  <span className="font-bold text-slate-900">{cat.category}: </span>
                  <span className="text-slate-700">{cat.items.join(' · ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Executive Experience */}
        {sectionVisibility.experience !== false && experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-3 border-b-2 flex items-center gap-2" style={{ borderColor: themeColor, color: themeColor }}>
              <span>{getHeading('experience', 'Leadership & Professional Experience')}</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-3 border-l-2 border-slate-300">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-950">{exp.role}</h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mb-1" style={{ color: themeColor }}>
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-700 mb-1.5">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="leading-relaxed">{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Projects & Strategic Initiatives */}
        {sectionVisibility.projects !== false && projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b-2 flex items-center gap-2" style={{ borderColor: themeColor, color: themeColor }}>
              <span>{getHeading('projects', 'Key Strategic Initiatives & Programs')}</span>
            </h2>
            <div className="space-y-2.5 text-xs">
              {projects.map((proj) => (
                <div key={proj.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{proj.name}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs hover:underline" style={{ color: themeColor }}>
                        Initiative Link ↗
                      </a>
                    )}
                  </div>
                  <p className="text-slate-700 mt-1">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[11px] text-slate-500 mt-1">
                      {proj.technologies.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        {sectionVisibility.education !== false && education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2.5 border-b-2 flex items-center gap-2" style={{ borderColor: themeColor, color: themeColor }}>
              <span>{getHeading('education', 'Education & Board Credentials')}</span>
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</span>
                    <div className="text-slate-600">{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</div>
                  </div>
                  <span className="text-slate-500 font-medium">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications and Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 flex items-center gap-2" style={{ borderColor: themeColor, color: themeColor }}>
                <span>{getHeading('certifications', 'Executive Certifications')}</span>
              </h2>
              <div className="space-y-1.5 text-xs text-slate-700">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-semibold text-slate-900">{c.name}</span>
                    <div className="text-[11px] text-slate-500">{c.issuer} · {c.issueDate}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {sectionVisibility.languages !== false && languages && languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2 flex items-center gap-2" style={{ borderColor: themeColor, color: themeColor }}>
                <span>{getHeading('languages', 'Languages & Cross-Border Fluency')}</span>
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
          <div className="space-y-3">
            {customSections.map((sect) => (
              <section key={sect.id}>
                <h2 className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b-2" style={{ borderColor: themeColor, color: themeColor }}>
                  {sect.title}
                </h2>
                {sect.subtitle && (
                  <div className="text-[11px] font-semibold text-slate-800 mb-0.5">
                    {sect.subtitle} {sect.date && <span className="font-normal text-slate-500">({sect.date})</span>}
                  </div>
                )}
                {sect.content && <p className="text-xs text-slate-700 leading-relaxed mb-1">{sect.content}</p>}
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

        {/* Extended Sections */}
        <CvSectionRenderer cv={cv} sectionKey="careerObjective" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="awards" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="publications" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="memberships" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="volunteering" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="trainings" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="references" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="interests" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="drivingLicence" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="personalDetails" themeColor={themeColor} variant="executive" />
        <CvSectionRenderer cv={cv} sectionKey="additionalInfo" themeColor={themeColor} variant="executive" />
      </div>
    </div>
  );
};
