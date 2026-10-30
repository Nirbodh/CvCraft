import React from 'react';
import { CV } from '../../types/cv.ts';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility, customHeadings = {} } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  const getHeading = (key: string, fallback: string) => customHeadings[key] || fallback;

  return (
    <div className="w-full bg-white text-zinc-800 leading-normal font-sans flex flex-col sm:flex-row min-h-full">
      {/* Creative Left Accent Column (34% width) */}
      <aside className="w-full sm:w-[34%] bg-zinc-900 text-zinc-200 p-6 flex flex-col justify-between shrink-0 gap-6">
        <div className="space-y-6">
          {/* Profile Photo */}
          <div className="flex justify-center sm:justify-start">
            <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
          </div>

          {/* Contact Details */}
          {sectionVisibility.personalInfo !== false && (
            <div className="space-y-2.5">
              <h3 className="text-[11px] font-bold tracking-widest uppercase pb-1 border-b border-zinc-700" style={{ color: themeColor }}>
                Contact
              </h3>
              <div className="space-y-2 text-xs text-zinc-300">
                {personalInfo.email && (
                  <div className="flex items-start gap-2 break-all">
                    <Mail className="w-3.5 h-3.5 shrink-0 text-zinc-400 mt-0.5" />
                    <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                  </div>
                )}
                {personalInfo.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 shrink-0 text-zinc-400" />
                    <span>{personalInfo.phone}</span>
                  </div>
                )}
                {personalInfo.location && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-3.5 h-3.5 shrink-0 text-zinc-400 mt-0.5" />
                    <span>{personalInfo.location}</span>
                  </div>
                )}
                {personalInfo.website && (
                  <div className="flex items-start gap-2 break-all">
                    <Globe className="w-3.5 h-3.5 shrink-0 text-zinc-400 mt-0.5" />
                    <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                      {personalInfo.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
                {personalInfo.linkedin && (
                  <div className="flex items-start gap-2 break-all">
                    <Linkedin className="w-3.5 h-3.5 shrink-0 text-zinc-400 mt-0.5" />
                    <span>{personalInfo.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
                  </div>
                )}
                {personalInfo.github && (
                  <div className="flex items-start gap-2 break-all">
                    <Github className="w-3.5 h-3.5 shrink-0 text-zinc-400 mt-0.5" />
                    <span>{personalInfo.github.replace(/^https?:\/\/(www\.)?github\.com\//, '')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Demographic details if available */}
          {(personalInfo.nationality || personalInfo.dateOfBirth || personalInfo.visaStatus) && (
            <div className="space-y-1.5 text-[11px] text-zinc-400 border-t border-zinc-800 pt-3">
              {personalInfo.nationality && <div>Nationality: <span className="text-zinc-200">{personalInfo.nationality}</span></div>}
              {personalInfo.dateOfBirth && <div>Birth Date: <span className="text-zinc-200">{personalInfo.dateOfBirth}</span></div>}
              {personalInfo.visaStatus && <div>Visa Status: <span className="text-zinc-200">{personalInfo.visaStatus}</span></div>}
            </div>
          )}

          {/* Skills in Sidebar */}
          {sectionVisibility.skills !== false && skills && skills.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-[11px] font-bold tracking-widest uppercase pb-1 border-b border-zinc-700" style={{ color: themeColor }}>
                {getHeading('skills', 'Creative Toolkit')}
              </h3>
              <div className="space-y-3 text-xs">
                {skills.map((cat) => (
                  <div key={cat.id}>
                    <div className="font-semibold text-zinc-200 text-xs mb-1">{cat.category}</div>
                    <div className="flex flex-wrap gap-1">
                      {cat.items.map((skill, sIdx) => (
                        <span key={sIdx} className="px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded text-[11px]">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages in Sidebar */}
          {sectionVisibility.languages !== false && languages && languages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold tracking-widest uppercase pb-1 border-b border-zinc-700" style={{ color: themeColor }}>
                {getHeading('languages', 'Languages')}
              </h3>
              <div className="space-y-1.5 text-xs text-zinc-300">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-[11px]">
                    <span className="font-medium text-zinc-200">{l.language}</span>
                    <span className="text-zinc-400">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Right Content Area (66% width) */}
      <main className="w-full sm:w-[66%] p-7 space-y-6">
        {/* Main Title Banner */}
        {sectionVisibility.personalInfo !== false && (
          <header className="border-b-2 pb-4" style={{ borderColor: themeColor }}>
            <h1 className="text-3xl font-black tracking-tight text-zinc-950 uppercase">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-base font-bold tracking-wide mt-1" style={{ color: themeColor }}>
              {personalInfo.jobTitle || 'Creative Director & Designer'}
            </p>
          </header>
        )}

        {/* Profile Bio */}
        {sectionVisibility.summary !== false && summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: themeColor }} />
              <span>{getHeading('summary', 'About & Creative Philosophy')}</span>
            </h2>
            <p className="text-xs text-zinc-700 leading-relaxed text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Work Experience */}
        {sectionVisibility.experience !== false && experience && experience.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: themeColor }} />
              <span>{getHeading('experience', 'Professional Experience')}</span>
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-bold text-zinc-900">{exp.role}</h3>
                    <span className="text-xs text-zinc-500 font-medium">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mb-1" style={{ color: themeColor }}>
                    {exp.company} {exp.location && `· ${exp.location}`}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-zinc-700 mb-1.5">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-xs text-zinc-700">
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

        {/* Featured Projects / Portfolio */}
        {sectionVisibility.projects !== false && projects && projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: themeColor }} />
              <span>{getHeading('projects', 'Featured Work & Portfolio')}</span>
            </h2>
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg">
                  <div className="flex justify-between items-baseline font-bold text-xs text-zinc-900">
                    <span>{proj.name}</span>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs hover:underline" style={{ color: themeColor }}>
                        View Portfolio ↗
                      </a>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[11px] text-zinc-500 mt-1.5">
                      Tools: {proj.technologies.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {sectionVisibility.education !== false && education && education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: themeColor }} />
              <span>{getHeading('education', 'Education & Design Degrees')}</span>
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between">
                  <div>
                    <div className="font-bold text-zinc-900">{edu.degree} {edu.field && `in ${edu.field}`}</div>
                    <div className="text-zinc-500">{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</div>
                  </div>
                  <span className="text-zinc-500">{edu.startDate} – {edu.endDate}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: themeColor }} />
              <span>{getHeading('certifications', 'Accreditations & Awards')}</span>
            </h2>
            <div className="space-y-1.5 text-xs text-zinc-700">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-semibold text-zinc-900">{c.name}</span>
                  <span className="text-zinc-500 text-[11px]"> — {c.issuer} ({c.issueDate})</span>
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
                <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950 mb-1.5 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: themeColor }} />
                  <span>{sect.title}</span>
                </h2>
                <p className="text-xs text-zinc-700 leading-normal">{sect.content}</p>
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
