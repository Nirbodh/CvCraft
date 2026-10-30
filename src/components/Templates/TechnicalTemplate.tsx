import React from 'react';
import { CV } from '../../types/cv.ts';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Terminal, GitBranch, Cpu, Code2 } from 'lucide-react';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const TechnicalTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility, customHeadings = {} } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  const getHeading = (key: string, fallback: string) => customHeadings[key] || fallback;
  const photoPos = personalInfo.photoConfig?.position || 'right';

  return (
    <div className="w-full bg-white text-slate-900 leading-normal font-sans">
      {/* Technical Header */}
      {sectionVisibility.personalInfo !== false && (
        <header className="border-b-2 pb-4 mb-5" style={{ borderColor: themeColor }}>
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            {photoPos === 'left' && (
              <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs px-1.5 py-0.5 rounded text-white font-bold" style={{ backgroundColor: themeColor }}>
                  &gt;_
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950 font-mono">
                  {personalInfo.fullName || 'Candidate Name'}
                </h1>
              </div>

              <p className="text-sm font-semibold tracking-wide mt-1" style={{ color: themeColor }}>
                {personalInfo.jobTitle || 'Lead Systems Architect &amp; Software Engineer'}
              </p>

              {/* Developer coordinates */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-2.5 text-xs text-slate-600 font-mono">
                {personalInfo.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{personalInfo.location}</span>
                  </span>
                )}
                {personalInfo.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                  </span>
                )}
                {personalInfo.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{personalInfo.phone}</span>
                  </span>
                )}
                {personalInfo.github && (
                  <span className="flex items-center gap-1">
                    <Github className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                    </a>
                  </span>
                )}
                {personalInfo.linkedin && (
                  <span className="flex items-center gap-1">
                    <Linkedin className="w-3.5 h-3.5 text-slate-400" />
                    <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                      {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                    </a>
                  </span>
                )}
                {personalInfo.website && (
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                      {personalInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                  </span>
                )}
              </div>

              {/* Optional Country Demographics */}
              {(personalInfo.nationality || personalInfo.visaStatus || personalInfo.dateOfBirth) && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-[11px] text-slate-500 font-mono">
                  {personalInfo.nationality && <span>[Nationality: {personalInfo.nationality}]</span>}
                  {personalInfo.visaStatus && <span>[Visa: {personalInfo.visaStatus}]</span>}
                  {personalInfo.dateOfBirth && <span>[DOB: {personalInfo.dateOfBirth}]</span>}
                </div>
              )}
            </div>

            {/* Profile Photo if right or center */}
            {photoPos !== 'left' && (
              <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
            )}
          </div>
        </header>
      )}

      {/* Technical Summary */}
      {sectionVisibility.summary !== false && summary && (
        <section className="mb-5">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: themeColor }}>
            <Terminal className="w-3.5 h-3.5" />
            <span>{getHeading('summary', 'System Architecture & Engineering Summary')}</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Categorized Technical Skills Matrix */}
      {sectionVisibility.skills !== false && skills && skills.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
            <Code2 className="w-3.5 h-3.5" />
            <span>{getHeading('skills', 'Technical Stacks & Infrastructure')}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {skills.map((cat) => (
              <div key={cat.id} className="p-2 bg-slate-50 border border-slate-200 rounded font-mono text-[11px]">
                <span className="font-bold text-slate-900 block mb-0.5">{cat.category}</span>
                <span className="text-slate-600">{cat.items.join(' · ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Engineering Experience */}
      {sectionVisibility.experience !== false && experience && experience.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider mb-3" style={{ color: themeColor }}>
            <Cpu className="w-3.5 h-3.5" />
            <span>{getHeading('experience', 'Engineering & Development Experience')}</span>
          </div>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="border-l-2 pl-3" style={{ borderColor: themeColor }}>
                <div className="flex justify-between items-baseline font-mono text-xs">
                  <span className="font-bold text-slate-950 text-sm">{exp.role}</span>
                  <span className="text-slate-500 font-medium">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="text-xs font-semibold text-slate-700 mb-1">
                  <span>{exp.company}</span>
                  {exp.location && <span className="text-slate-400 font-normal"> · {exp.location}</span>}
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

      {/* Technical Projects / Repositories */}
      {sectionVisibility.projects !== false && projects && projects.length > 0 && (
        <section className="mb-5">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: themeColor }}>
            <GitBranch className="w-3.5 h-3.5" />
            <span>{getHeading('projects', 'Key Engineering Systems & Open Source')}</span>
          </div>
          <div className="space-y-2.5 text-xs">
            {projects.map((proj) => (
              <div key={proj.id} className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <div className="flex justify-between items-baseline font-bold text-slate-900 font-mono">
                  <span>{proj.name}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-[11px] hover:underline" style={{ color: themeColor }}>
                      [repo / demo] ↗
                    </a>
                  )}
                </div>
                <p className="text-slate-700 mt-1">{proj.description}</p>
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="text-[11px] font-mono text-slate-500 mt-1">
                    stack: [{proj.technologies.join(', ')}]
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {sectionVisibility.education !== false && education && education.length > 0 && (
          <section>
            <div className="font-mono text-xs font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
              {getHeading('education', 'Education & Degrees')}
            </div>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-bold text-slate-900">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                  <div className="text-slate-600">{edu.institution} {edu.location ? `· ${edu.location}` : ''}</div>
                  <div className="text-[11px] font-mono text-slate-400">{edu.startDate} – {edu.endDate} {edu.gpa ? `· GPA: ${edu.gpa}` : ''}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
          <section>
            <div className="font-mono text-xs font-bold uppercase tracking-wider mb-2" style={{ color: themeColor }}>
              {getHeading('certifications', 'Cloud & Architecture Certifications')}
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-bold text-slate-900">{c.name}</div>
                  <div className="text-[11px] font-mono text-slate-500">{c.issuer} ({c.issueDate}){c.credentialId ? ` · ID: ${c.credentialId}` : ''}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Languages & Custom Sections */}
      {sectionVisibility.languages !== false && languages && languages.length > 0 && (
        <section className="mb-4">
          <div className="font-mono text-xs font-bold uppercase tracking-wider mb-1" style={{ color: themeColor }}>
            {getHeading('languages', 'Languages')}
          </div>
          <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-700">
            {languages.map((l) => (
              <span key={l.id}>
                <b>{l.language}:</b> {l.proficiency}
              </span>
            ))}
          </div>
        </section>
      )}

      {sectionVisibility.customSections !== false && customSections && customSections.length > 0 && (
        <div className="space-y-3">
          {customSections.map((sect) => (
            <section key={sect.id}>
              <div className="font-mono text-xs font-bold uppercase tracking-wider mb-1" style={{ color: themeColor }}>
                {sect.title}
              </div>
              <p className="text-xs text-slate-700 leading-normal">{sect.content}</p>
            </section>
          ))}
        </div>
      )}

      {/* Extended Sections */}
      <CvSectionRenderer cv={cv} sectionKey="objective" themeColor={themeColor} />
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
