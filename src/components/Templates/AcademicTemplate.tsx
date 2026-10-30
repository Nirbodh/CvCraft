import React from 'react';
import { CV } from '../../types/cv.ts';
import { Mail, Phone, MapPin, Globe, BookOpen, GraduationCap, Award, FileText } from 'lucide-react';
import { CvPhotoRenderer } from './CvPhotoRenderer.tsx';
import { CvSectionRenderer } from './CvSectionRenderer.tsx';

interface TemplateProps {
  cv: CV;
}

export const AcademicTemplate: React.FC<TemplateProps> = ({ cv }) => {
  const { data, themeColor, sectionVisibility, customHeadings = {} } = cv;
  const { personalInfo, summary, experience, education, skills, projects, certifications, languages, customSections } = data;

  const getHeading = (key: string, fallback: string) => customHeadings[key] || fallback;

  return (
    <div className="w-full bg-white text-stone-900 leading-relaxed font-serif">
      {/* Formal Academic Header */}
      {sectionVisibility.personalInfo !== false && (
        <header className="text-center pb-5 mb-5 border-b-2 border-stone-800">
          <div className="flex flex-col items-center">
            {/* Optional Photo */}
            <div className="mb-3">
              <CvPhotoRenderer personalInfo={personalInfo} themeColor={themeColor} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-normal tracking-wide uppercase text-stone-950 font-serif">
              {personalInfo.fullName || 'Candidate Name'}
            </h1>
            <p className="text-xs sm:text-sm italic text-stone-700 mt-1">
              {personalInfo.jobTitle || 'Assistant Professor / Senior Researcher'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-2 text-xs text-stone-600 font-sans">
              {personalInfo.location && <span>{personalInfo.location}</span>}
              {personalInfo.email && (
                <>
                  <span>·</span>
                  <a href={`mailto:${personalInfo.email}`} className="hover:underline">{personalInfo.email}</a>
                </>
              )}
              {personalInfo.phone && (
                <>
                  <span>·</span>
                  <span>{personalInfo.phone}</span>
                </>
              )}
              {personalInfo.website && (
                <>
                  <span>·</span>
                  <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                    {personalInfo.website.replace(/^https?:\/\//, '')}
                  </a>
                </>
              )}
            </div>

            {/* Demographic details if provided */}
            {(personalInfo.nationality || personalInfo.dateOfBirth || personalInfo.permanentAddress) && (
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mt-1.5 text-[11px] text-stone-500 font-sans italic">
                {personalInfo.nationality && <span>Nationality: {personalInfo.nationality}</span>}
                {personalInfo.dateOfBirth && <span>· Born: {personalInfo.dateOfBirth}</span>}
                {personalInfo.permanentAddress && <span>· Address: {personalInfo.permanentAddress}</span>}
              </div>
            )}
          </div>
        </header>
      )}

      {/* Research Statement / Academic Summary */}
      {sectionVisibility.summary !== false && summary && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2 font-sans flex items-center gap-1.5" style={{ color: themeColor }}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>{getHeading('summary', 'Research Statement & Academic Focus')}</span>
          </h2>
          <p className="text-xs text-stone-800 leading-relaxed text-justify">
            {summary}
          </p>
        </section>
      )}

      {/* Education First (Standard in Academic CVs) */}
      {sectionVisibility.education !== false && education && education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2.5 font-sans flex items-center gap-1.5" style={{ color: themeColor }}>
            <GraduationCap className="w-3.5 h-3.5" />
            <span>{getHeading('education', 'Academic Qualifications')}</span>
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="text-xs">
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-stone-950">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </span>
                  <span className="italic text-stone-600">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
                <div className="italic text-stone-700">
                  {edu.institution}{edu.location ? `, ${edu.location}` : ''}
                </div>
                {edu.gpa && <div className="text-[11px] text-stone-600 font-sans">Honors: {edu.gpa}</div>}
                {edu.description && <p className="text-stone-700 mt-0.5">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic Appointments & Research Experience */}
      {sectionVisibility.experience !== false && experience && experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-3 font-sans flex items-center gap-1.5" style={{ color: themeColor }}>
            <FileText className="w-3.5 h-3.5" />
            <span>{getHeading('experience', 'Academic Appointments & Research Experience')}</span>
          </h2>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline font-sans">
                  <span className="font-bold text-stone-950 text-sm">{exp.role}</span>
                  <span className="italic text-stone-600">
                    {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                  </span>
                </div>
                <div className="italic text-stone-700 mb-1 font-serif">
                  {exp.company}{exp.location ? `, ${exp.location}` : ''}
                </div>
                {exp.description && (
                  <p className="text-stone-800 mb-1">{exp.description}</p>
                )}
                {exp.highlights && exp.highlights.length > 0 && (
                  <ul className="list-disc list-outside ml-4 space-y-1 text-stone-800 font-serif">
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

      {/* Publications / Scholarly Projects */}
      {sectionVisibility.projects !== false && projects && projects.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2.5 font-sans flex items-center gap-1.5" style={{ color: themeColor }}>
            <Award className="w-3.5 h-3.5" />
            <span>{getHeading('projects', 'Research Projects, Publications & Grants')}</span>
          </h2>
          <div className="space-y-2.5 text-xs">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="flex justify-between">
                  <span className="font-bold text-stone-900">{proj.name}</span>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-xs underline italic font-sans" style={{ color: themeColor }}>
                      DOI / Link
                    </a>
                  )}
                </div>
                <p className="text-stone-700 mt-0.5">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Scholarly Areas of Expertise */}
      {sectionVisibility.skills !== false && skills && skills.length > 0 && (
        <section className="mb-5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2 font-sans" style={{ color: themeColor }}>
            {getHeading('skills', 'Areas of Academic & Methodological Expertise')}
          </h2>
          <div className="space-y-1.5 text-xs">
            {skills.map((cat) => (
              <div key={cat.id}>
                <span className="font-bold text-stone-900 font-sans">{cat.category}: </span>
                <span className="text-stone-800">{cat.items.join(', ')}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {sectionVisibility.certifications !== false && certifications && certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2 font-sans" style={{ color: themeColor }}>
              {getHeading('certifications', 'Professional Fellowships & Licenses')}
            </h2>
            <div className="space-y-1 text-xs text-stone-800">
              {certifications.map((c) => (
                <div key={c.id}>
                  <span className="font-semibold">{c.name}</span>
                  <span className="text-stone-500 text-[11px] font-sans"> — {c.issuer} ({c.issueDate})</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {sectionVisibility.languages !== false && languages && languages.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-2 font-sans" style={{ color: themeColor }}>
              {getHeading('languages', 'Languages & Translation')}
            </h2>
            <div className="space-y-1 text-xs text-stone-800">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span className="font-semibold">{l.language}</span>
                  <span className="italic text-stone-600">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Custom Sections (e.g. Teaching, Referees) */}
      {sectionVisibility.customSections !== false && customSections && customSections.length > 0 && (
        <div className="space-y-3">
          {customSections.map((sect) => (
            <section key={sect.id}>
              <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900 border-b border-stone-300 pb-1 mb-1.5 font-sans" style={{ color: themeColor }}>
                {sect.title}
              </h2>
              <p className="text-xs text-stone-800 leading-normal">{sect.content}</p>
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
