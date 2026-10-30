import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';
import { CV } from '../types/cv.ts';

export async function exportCvToDocx(cv: CV): Promise<void> {
  const { data, title, themeColor = '#2563eb', customHeadings = {}, sectionVisibility = {} } = cv;
  const {
    personalInfo,
    summary,
    careerObjective,
    personalDetails,
    experience,
    education,
    skills,
    projects,
    certifications,
    languages,
    awards,
    publications,
    memberships,
    volunteering,
    trainings,
    references,
    interests,
    drivingLicence,
    additionalInfo,
    customSections,
  } = data;

  // Convert hex color to 6-digit hex without #
  const hexColor = (themeColor.startsWith('#') ? themeColor.slice(1) : themeColor).padEnd(6, '0').slice(0, 6);

  const children: (Paragraph | Table)[] = [];

  // Helper for Section Heading
  const createSectionHeading = (defaultTitle: string, key: string) => {
    const headingText = (customHeadings[key] || defaultTitle).toUpperCase();
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 120 },
      border: {
        bottom: {
          color: hexColor,
          space: 2,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      children: [
        new TextRun({
          text: headingText,
          bold: true,
          color: hexColor,
          size: 22, // 11pt
          font: 'Arial',
        }),
      ],
    });
  };

  // 1. CANDIDATE HEADER
  if (sectionVisibility.personalInfo !== false) {
    // Name
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { before: 0, after: 60 },
        children: [
          new TextRun({
            text: personalInfo.fullName || 'Candidate Name',
            bold: true,
            size: 36, // 18pt
            font: 'Arial',
            color: '111827',
          }),
        ],
      })
    );

    // Job Title
    if (personalInfo.jobTitle) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 80 },
          children: [
            new TextRun({
              text: personalInfo.jobTitle,
              bold: true,
              size: 24, // 12pt
              font: 'Arial',
              color: hexColor,
            }),
          ],
        })
      );
    }

    // Contact Details Line
    const contactParts: string[] = [];
    if (personalInfo.location) contactParts.push(personalInfo.location);
    if (personalInfo.phone) contactParts.push(personalInfo.phone);
    if (personalInfo.email) contactParts.push(personalInfo.email);
    if (personalInfo.website) contactParts.push(personalInfo.website.replace(/^https?:\/\//, ''));
    if (personalInfo.linkedin) contactParts.push(personalInfo.linkedin.replace(/^https?:\/\//, ''));
    if (personalInfo.github) contactParts.push(personalInfo.github.replace(/^https?:\/\//, ''));

    if (contactParts.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 180 },
          children: [
            new TextRun({
              text: contactParts.join('  |  '),
              size: 19, // 9.5pt
              font: 'Arial',
              color: '4B5563',
            }),
          ],
        })
      );
    }

    // Additional Demographic fields (if provided by user)
    const extraDetails: string[] = [];
    if (personalInfo.dateOfBirth) extraDetails.push(`Date of Birth: ${personalInfo.dateOfBirth}`);
    if (personalInfo.nationality) extraDetails.push(`Nationality: ${personalInfo.nationality}`);
    if (personalInfo.maritalStatus) extraDetails.push(`Marital Status: ${personalInfo.maritalStatus}`);
    if (personalInfo.visaStatus) extraDetails.push(`Visa / Work Rights: ${personalInfo.visaStatus}`);
    if (personalInfo.religion) extraDetails.push(`Religion: ${personalInfo.religion}`);
    if (personalInfo.bloodGroup) extraDetails.push(`Blood Group: ${personalInfo.bloodGroup}`);
    if (personalInfo.fatherName) extraDetails.push(`Father's Name: ${personalInfo.fatherName}`);
    if (personalInfo.motherName) extraDetails.push(`Mother's Name: ${personalInfo.motherName}`);
    if (personalInfo.permanentAddress) extraDetails.push(`Permanent Address: ${personalInfo.permanentAddress}`);

    if (extraDetails.length > 0) {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 0, after: 180 },
          children: [
            new TextRun({
              text: extraDetails.join('  ·  '),
              size: 18,
              font: 'Arial',
              color: '6B7280',
              italics: true,
            }),
          ],
        })
      );
    }
  }

  // 2. PROFESSIONAL SUMMARY
  if (sectionVisibility.summary !== false && summary) {
    children.push(createSectionHeading('Professional Summary', 'summary'));
    children.push(
      new Paragraph({
        spacing: { before: 60, after: 120 },
        children: [
          new TextRun({
            text: summary,
            size: 20, // 10pt
            font: 'Arial',
            color: '1F2937',
          }),
        ],
      })
    );
  }

  // 3. WORK EXPERIENCE
  if (sectionVisibility.experience !== false && experience && experience.length > 0) {
    children.push(createSectionHeading('Work Experience', 'experience'));
    experience.forEach((exp) => {
      // Role & Date
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 40 },
          children: [
            new TextRun({
              text: exp.role,
              bold: true,
              size: 21,
              font: 'Arial',
              color: '111827',
            }),
            new TextRun({
              text: `   (${exp.startDate} – ${exp.current ? 'Present' : exp.endDate})`,
              size: 19,
              font: 'Arial',
              color: '4B5563',
              italics: true,
            }),
          ],
        })
      );

      // Company & Location
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: `${exp.company}${exp.location ? ` · ${exp.location}` : ''}`,
              bold: true,
              size: 19,
              font: 'Arial',
              color: hexColor,
            }),
          ],
        })
      );

      // Overview description
      if (exp.description) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: exp.description,
                size: 20,
                font: 'Arial',
                color: '374151',
              }),
            ],
          })
        );
      }

      // Achievement Highlights (bullets)
      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach((bullet) => {
          if (!bullet.trim()) return;
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 20, after: 40 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: 'Arial',
                  color: '374151',
                }),
              ],
            })
          );
        });
      }
    });
  }

  // 4. EDUCATION
  if (sectionVisibility.education !== false && education && education.length > 0) {
    children.push(createSectionHeading('Education & Credentials', 'education'));
    education.forEach((edu) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({
              text: `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`,
              bold: true,
              size: 21,
              font: 'Arial',
              color: '111827',
            }),
            new TextRun({
              text: `   (${edu.startDate} – ${edu.endDate})`,
              size: 19,
              font: 'Arial',
              color: '4B5563',
              italics: true,
            }),
          ],
        })
      );

      children.push(
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: `${edu.institution}${edu.location ? ` · ${edu.location}` : ''}${edu.gpa ? ` (GPA: ${edu.gpa})` : ''}`,
              size: 19,
              font: 'Arial',
              color: '374151',
            }),
          ],
        })
      );

      if (edu.description) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: edu.description,
                size: 19,
                font: 'Arial',
                color: '6B7280',
                italics: true,
              }),
            ],
          })
        );
      }
    });
  }

  // 5. SKILLS
  if (sectionVisibility.skills !== false && skills && skills.length > 0) {
    children.push(createSectionHeading('Skills & Competencies', 'skills'));
    skills.forEach((cat) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({
              text: `${cat.category}: `,
              bold: true,
              size: 20,
              font: 'Arial',
              color: '111827',
            }),
            new TextRun({
              text: cat.items.join(', '),
              size: 20,
              font: 'Arial',
              color: '374151',
            }),
          ],
        })
      );
    });
  }

  // 6. PROJECTS
  if (sectionVisibility.projects !== false && projects && projects.length > 0) {
    children.push(createSectionHeading('Key Projects', 'projects'));
    projects.forEach((proj) => {
      children.push(
        new Paragraph({
          spacing: { before: 80, after: 30 },
          children: [
            new TextRun({
              text: proj.name,
              bold: true,
              size: 20,
              font: 'Arial',
              color: '111827',
            }),
            proj.link
              ? new TextRun({
                  text: ` (${proj.link})`,
                  size: 18,
                  font: 'Arial',
                  color: hexColor,
                })
              : new TextRun({ text: '' }),
          ],
        })
      );

      if (proj.technologies && proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 30 },
            children: [
              new TextRun({
                text: `Technologies: ${proj.technologies.join(', ')}`,
                size: 18,
                font: 'Arial',
                color: '6B7280',
                italics: true,
              }),
            ],
          })
        );
      }

      children.push(
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [
            new TextRun({
              text: proj.description,
              size: 19,
              font: 'Arial',
              color: '374151',
            }),
          ],
        })
      );
    });
  }

  // 7. CERTIFICATIONS & LANGUAGES
  if (
    (sectionVisibility.certifications !== false && certifications && certifications.length > 0) ||
    (sectionVisibility.languages !== false && languages && languages.length > 0)
  ) {
    children.push(createSectionHeading('Certifications & Languages', 'certifications'));

    if (certifications && certifications.length > 0) {
      certifications.forEach((c) => {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({
                text: `${c.name} `,
                bold: true,
                size: 19,
                font: 'Arial',
              }),
              new TextRun({
                text: `— ${c.issuer} (${c.issueDate}${c.credentialId ? `, ID: ${c.credentialId}` : ''})`,
                size: 19,
                font: 'Arial',
                color: '4B5563',
              }),
            ],
          })
        );
      });
    }

    if (languages && languages.length > 0) {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({
              text: 'Languages: ',
              bold: true,
              size: 19,
              font: 'Arial',
            }),
            new TextRun({
              text: languages.map((l) => `${l.language} (${l.proficiency})`).join(', '),
              size: 19,
              font: 'Arial',
              color: '374151',
            }),
          ],
        })
      );
    }
  }

  // 8. CAREER OBJECTIVE
  if (sectionVisibility.careerObjective !== false && careerObjective && careerObjective.trim() !== '') {
    children.push(createSectionHeading('Career Objective', 'careerObjective'));
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 120 },
        children: [
          new TextRun({
            text: careerObjective,
            size: 20,
            font: 'Arial',
            color: '374151',
          }),
        ],
      })
    );
  }

  // 9. AWARDS & ACHIEVEMENTS
  if (sectionVisibility.awards !== false && awards && awards.length > 0) {
    children.push(createSectionHeading('Awards & Achievements', 'awards'));
    awards.forEach((award) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [
            new TextRun({ text: award.title, bold: true, size: 20, font: 'Arial', color: '111827' }),
            award.issuer ? new TextRun({ text: ` — ${award.issuer}`, size: 20, font: 'Arial', color: '4B5563' }) : new TextRun(''),
            award.date ? new TextRun({ text: ` (${award.date})`, size: 18, font: 'Arial', color: '6B7280' }) : new TextRun(''),
          ],
        })
      );
      if (award.description) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: award.description, size: 19, font: 'Arial', color: '374151' })],
          })
        );
      }
    });
  }

  // 10. PUBLICATIONS & RESEARCH
  if (sectionVisibility.publications !== false && publications && publications.length > 0) {
    children.push(createSectionHeading('Publications & Research', 'publications'));
    publications.forEach((pub) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [
            new TextRun({ text: pub.title, bold: true, size: 20, font: 'Arial', color: '111827' }),
            pub.date ? new TextRun({ text: ` (${pub.date})`, size: 18, font: 'Arial', color: '6B7280' }) : new TextRun(''),
          ],
        })
      );
      if (pub.publisher || pub.authors) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 20 },
            children: [
              new TextRun({ text: [pub.publisher, pub.authors].filter(Boolean).join(' · '), italics: true, size: 19, font: 'Arial', color: '4B5563' }),
            ],
          })
        );
      }
      if (pub.description) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [new TextRun({ text: pub.description, size: 19, font: 'Arial', color: '374151' })],
          })
        );
      }
    });
  }

  // 11. PROFESSIONAL MEMBERSHIPS
  if (sectionVisibility.memberships !== false && memberships && memberships.length > 0) {
    children.push(createSectionHeading('Professional Memberships', 'memberships'));
    memberships.forEach((mem) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: mem.organization, bold: true, size: 20, font: 'Arial', color: '111827' }),
            mem.role ? new TextRun({ text: ` — ${mem.role}`, size: 20, font: 'Arial', color: '4B5563' }) : new TextRun(''),
            (mem.startDate || mem.endDate) ? new TextRun({ text: ` (${mem.startDate} - ${mem.endDate || 'Present'})`, size: 18, font: 'Arial', color: '6B7280' }) : new TextRun(''),
          ],
        })
      );
    });
  }

  // 12. VOLUNTEER EXPERIENCE
  if (sectionVisibility.volunteering !== false && volunteering && volunteering.length > 0) {
    children.push(createSectionHeading('Volunteer Experience', 'volunteering'));
    volunteering.forEach((vol) => {
      children.push(
        new Paragraph({
          spacing: { before: 60, after: 20 },
          children: [
            new TextRun({ text: vol.role, bold: true, size: 20, font: 'Arial', color: '111827' }),
            new TextRun({ text: ` | ${vol.organization}`, size: 20, font: 'Arial', color: '4B5563' }),
            new TextRun({ text: ` (${vol.startDate} - ${vol.endDate || 'Present'})`, size: 18, font: 'Arial', color: '6B7280' }),
          ],
        })
      );
      if (vol.description) {
        children.push(
          new Paragraph({
            spacing: { before: 0, after: 40 },
            children: [new TextRun({ text: vol.description, size: 19, font: 'Arial', color: '374151' })],
          })
        );
      }
    });
  }

  // 13. TRAINING & WORKSHOPS
  if (sectionVisibility.trainings !== false && trainings && trainings.length > 0) {
    children.push(createSectionHeading('Training & Workshops', 'trainings'));
    trainings.forEach((trn) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: trn.name, bold: true, size: 20, font: 'Arial', color: '111827' }),
            trn.provider ? new TextRun({ text: ` — ${trn.provider}`, size: 20, font: 'Arial', color: '4B5563' }) : new TextRun(''),
            trn.completionDate ? new TextRun({ text: ` (${trn.completionDate})`, size: 18, font: 'Arial', color: '6B7280' }) : new TextRun(''),
          ],
        })
      );
    });
  }

  // 14. REFERENCES
  if (sectionVisibility.references !== false && references && references.length > 0) {
    children.push(createSectionHeading('References', 'references'));
    references.forEach((ref) => {
      if (ref.availableOnRequest) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 60 },
            children: [new TextRun({ text: 'References available upon request.', italics: true, size: 20, font: 'Arial', color: '4B5563' })],
          })
        );
      } else {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 20 },
            children: [
              new TextRun({ text: ref.name, bold: true, size: 20, font: 'Arial', color: '111827' }),
              new TextRun({ text: ` — ${ref.position ? `${ref.position}, ` : ''}${ref.company}`, size: 20, font: 'Arial', color: '4B5563' }),
            ],
          })
        );
        if (ref.email || ref.phone) {
          children.push(
            new Paragraph({
              spacing: { before: 0, after: 60 },
              children: [new TextRun({ text: [ref.email, ref.phone].filter(Boolean).join(' | '), size: 18, font: 'Arial', color: '6B7280' })],
            })
          );
        }
      }
    });
  }

  // 15. INTERESTS & HOBBIES
  if (sectionVisibility.interests !== false && interests && interests.length > 0) {
    children.push(createSectionHeading('Interests & Hobbies', 'interests'));
    const interestLine = interests.map((i) => i.name).join(' · ');
    children.push(
      new Paragraph({
        spacing: { before: 40, after: 80 },
        children: [new TextRun({ text: interestLine, size: 20, font: 'Arial', color: '374151' })],
      })
    );
  }

  // 16. DRIVING LICENCE
  if (sectionVisibility.drivingLicence !== false && drivingLicence && drivingLicence.length > 0) {
    children.push(createSectionHeading('Driving Licence', 'drivingLicence'));
    drivingLicence.forEach((dl) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 40 },
          children: [
            new TextRun({ text: dl.category, bold: true, size: 20, font: 'Arial', color: '111827' }),
            dl.issuedBy ? new TextRun({ text: ` (${dl.issuedBy})`, size: 19, font: 'Arial', color: '4B5563' }) : new TextRun(''),
            dl.hasOwnVehicle ? new TextRun({ text: ' — Own vehicle available', italics: true, size: 18, font: 'Arial', color: '6B7280' }) : new TextRun(''),
          ],
        })
      );
    });
  }

  // 17. PERSONAL DETAILS
  if (sectionVisibility.personalDetails !== false && personalDetails && Object.values(personalDetails).some(Boolean)) {
    children.push(createSectionHeading('Personal Details', 'personalDetails'));
    const details = [
      personalDetails.nationality ? `Nationality: ${personalDetails.nationality}` : '',
      personalDetails.dateOfBirth ? `Date of Birth: ${personalDetails.dateOfBirth}` : '',
      personalDetails.placeOfBirth ? `Place of Birth: ${personalDetails.placeOfBirth}` : '',
      personalDetails.visaStatus ? `Visa: ${personalDetails.visaStatus}` : '',
      personalDetails.maritalStatus ? `Marital Status: ${personalDetails.maritalStatus}` : '',
    ].filter(Boolean);

    children.push(
      new Paragraph({
        spacing: { before: 40, after: 80 },
        children: [new TextRun({ text: details.join(' | '), size: 20, font: 'Arial', color: '374151' })],
      })
    );
  }

  // 18. ADDITIONAL INFORMATION
  if (sectionVisibility.additionalInfo !== false && additionalInfo && additionalInfo.length > 0) {
    children.push(createSectionHeading('Additional Information', 'additionalInfo'));
    additionalInfo.forEach((ai) => {
      children.push(
        new Paragraph({
          spacing: { before: 40, after: 20 },
          children: [new TextRun({ text: ai.title, bold: true, size: 20, font: 'Arial', color: '111827' })],
        })
      );
      children.push(
        new Paragraph({
          spacing: { before: 0, after: 60 },
          children: [new TextRun({ text: ai.content, size: 19, font: 'Arial', color: '374151' })],
        })
      );
    });
  }

  // 19. CUSTOM SECTIONS
  if (sectionVisibility.customSections !== false && customSections && customSections.length > 0) {
    customSections.forEach((cSec) => {
      children.push(createSectionHeading(cSec.title || 'Additional Information', cSec.id));
      if (cSec.subtitle) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 20 },
            children: [
              new TextRun({ text: cSec.subtitle, bold: true, size: 20, font: 'Arial', color: '374151' }),
              cSec.date ? new TextRun({ text: ` (${cSec.date})`, size: 18, font: 'Arial', color: '6B7280' }) : new TextRun(''),
            ],
          })
        );
      }
      if (cSec.content) {
        children.push(
          new Paragraph({
            spacing: { before: 20, after: 60 },
            children: [
              new TextRun({
                text: cSec.content,
                size: 20,
                font: 'Arial',
                color: '374151',
              }),
            ],
          })
        );
      }
      if (cSec.items && cSec.items.length > 0) {
        cSec.items.filter(Boolean).forEach((bullet) => {
          children.push(
            new Paragraph({
              bullet: { level: 0 },
              spacing: { before: 20, after: 20 },
              children: [
                new TextRun({
                  text: bullet,
                  size: 20,
                  font: 'Arial',
                  color: '374151',
                }),
              ],
            })
          );
        });
      }
    });
  }

  // Construct Word Document
  const doc = new Document({
    creator: 'CVCraft Professional Resume Generator',
    title: title || `${personalInfo.fullName || 'Candidate'} CV`,
    description: `Generated by CVCraft for ${personalInfo.fullName}`,
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              right: 1000,
              bottom: 1000,
              left: 1000,
            },
          },
        },
        children,
      },
    ],
  });

  // Generate blob and trigger browser download
  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const sanitizedFilename = (title || `${personalInfo.fullName || 'Candidate'}_CV`)
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase();
  a.download = `${sanitizedFilename}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
