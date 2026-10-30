import React from 'react';
import { CV } from '../../types/cv.ts';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  return (
    <div className="w-full bg-white text-slate-800 leading-normal flex flex-col sm:flex-row min-h-full">
      {/* Left Sidebar (32% width) */}
      <aside className="w-full sm:w-[32%] bg-slate-50 border-r border-slate-200 p-5 shrink-0 flex flex-col gap-5">
        {/* Photo */}
        <div className="flex justify-center sm:justify-start">
          <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
        </div>

        {/* Contact info */}
        {sectionVisibility.personalInfo !== false && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b text-slate-900" style={{ borderColor: themeColor }}>
              Contact
            </h2>
            <div className="space-y-2 text-xs text-slate-600">
              {personalInfo.location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <span>{personalInfo.location}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {personalInfo.email && (
                <div className="flex items-start gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-start gap-2 break-all">
                  <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                    {personalInfo.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-start gap-2 break-all">
                  <Linkedin className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <a href={`https://${personalInfo.linkedin.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}
                  </a>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-start gap-2 break-all">
                  <Github className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
                  <a href={`https://${personalInfo.github.replace(/^https?:\/\//, '')}`} target="_blank" rel="noreferrer" className="hover:underline">
                    {personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Skills in Sidebar */}
        {sectionVisibility.skills !== false && skills && skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b text-slate-900" style={{ borderColor: themeColor }}>
              Skills
            </h2>
            <div className="space-y-3 text-xs">
              {skills.map((cat) => (
                <div key={cat.id}>
                  <div className="font-semibold text-slate-800 mb-1">{cat.category}</div>
                  <div className="text-slate-600 leading-relaxed text-[11px]">
                    {cat.items.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in Sidebar */}
        {sectionVisibility.education !== false && education && education.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-1 border-b text-slate-900" style={{ borderColor: themeColor }}>
              Education
            </h2>
            <div className="space-y-3 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="font-semibold text-slate-900">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </div>
                  <div className="text-slate-600 text-[11px]">{edu.institution}</div>
                  <div className="text-slate-400 text-[11px]">
                    {edu.startDate} – {edu.endDate}
                  </div>
                  {edu.gpa && <div className="text-slate-600 text-[11px]">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications in Sidebar */}
        {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b text-slate-900" style={{ borderColor: themeColor }}>
              Certifications
            </h2>
            <div className="space-y-2 text-xs">
              {certifications.map((c) => (
                <div key={c.id}>
                  <div className="font-semibold text-slate-800 text-[11px]">{c.name}</div>
                  <div className="text-slate-500 text-[10px]">{c.issuer} · {c.issueDate}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages in Sidebar */}
        {sectionVisibility.languages !== false && languages && languages.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-1 border-b text-slate-900" style={{ borderColor: themeColor }}>
              Languages
            </h2>
            <div className="space-y-1.5 text-xs text-slate-700">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between text-[11px]">
                  <span className="font-medium text-slate-900">{l.language}</span>
                  <span className="text-slate-500">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Main Content (68% width) */}
      <main className="w-full sm:w-[68%] p-6 flex flex-col gap-5">
        {/* Main Header */}
        {sectionVisibility.personalInfo !== false && (
          <header className="border-b pb-4" style={{ borderColor: themeColor }}>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-base font-semibold mt-1 tracking-wide" style={{ color: themeColor }}>
              {personalInfo.jobTitle || 'Professional Title'}
            </p>
          </header>
        )}

        {/* Summary */}
        {sectionVisibility.summary !== false && summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-900 flex items-center gap-2">
              <span style={{ color: themeColor }}>■</span>
              <span>Executive Summary</span>
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {sectionVisibility.experience !== false && experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-3 text-slate-900 flex items-center gap-2">
              <span style={{ color: themeColor }}>■</span>
              <span>Professional Experience</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-slate-900">{exp.role}</h3>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mb-1">
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-700 mb-1.5">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-slate-700">
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

        {/* Projects */}
        {sectionVisibility.projects !== false && projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider mb-2 text-slate-900 flex items-center gap-2">
              <span style={{ color: themeColor }}>■</span>
              <span>Key Projects &amp; Initiatives</span>
            </h2>
            <div className="space-y-2.5 text-xs">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs hover:underline" style={{ color: themeColor }}>
                        View
                      </a>
                    )}
                  </div>
                  <p className="text-slate-700 mt-0.5">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Custom Sections */}
        {sectionVisibility.customSections !== false && customSections && customSections.length > 0 && (
          <div className="space-y-3">
            {customSections.map((sect) => (
              <section key={sect.id}>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 text-slate-900 flex items-center gap-2">
                  <span style={{ color: themeColor }}>■</span>
                  <span>{sect.title}</span>
                </h2>
                <p className="text-xs text-slate-700">{sect.content}</p>
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
      </main>
    </div>
  );
};
