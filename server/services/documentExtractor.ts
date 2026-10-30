import mammoth from 'mammoth';

export interface ExtractedCvData {
  isScanned?: boolean;
  scannedWarning?: string;
  rawTextPreview: string;
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    role: string;
    company: string;
    location?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
    highlights?: string[];
  }>;
  education: Array<{
    id: string;
    degree: string;
    field: string;
    institution: string;
    location?: string;
    startDate: string;
    endDate: string;
    gpa?: string;
    description?: string;
  }>;
  skills: Array<{
    id: string;
    category: string;
    items: string[];
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    link?: string;
    technologies: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    credentialId?: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
}

// Extract plain text from DOCX buffer using mammoth
export async function extractTextFromDocx(buffer: Buffer): Promise<string> {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || '';
}

// Deterministic parser for CV structure from plain text
export function parseCvText(text: string): ExtractedCvData {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  // Scanned / empty check
  if (lines.length < 3 || text.replace(/[^a-zA-Z0-9]/g, '').length < 35) {
    return {
      isScanned: true,
      scannedWarning:
        'This document appears to be a scanned image or flattened graphic. No selectable text was detected. To import this CV, please use a text-based PDF, DOCX, or TXT file, or transcribe your details manually.',
      rawTextPreview: text.slice(0, 300),
      personalInfo: {
        fullName: '',
        jobTitle: '',
        email: '',
        phone: '',
        location: '',
      },
      summary: '',
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: [],
    };
  }

  // Contact details regexes
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  const email = emailMatch ? emailMatch[0] : '';

  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : '';

  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : '';

  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? githubMatch[0] : '';

  const websiteMatch = text.match(/(?:https?:\/\/)(?!linkedin|github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
  const website = websiteMatch ? websiteMatch[0] : '';

  // Name heuristic: First non-contact, prominent line in the top 5 lines
  let fullName = '';
  let jobTitle = '';
  let headerIndex = 0;

  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    // skip line if it's an email or url or phone
    if (line.includes('@') || line.includes('http') || line.includes('www.') || line.includes('+')) {
      continue;
    }
    // Name check: 1 to 4 words, under 40 chars, no section keywords
    if (!fullName && line.length < 40 && /^[A-Z][a-zA-Z.\s'-]+$/.test(line)) {
      fullName = line;
      headerIndex = i;
      continue;
    }
    // Job title check
    if (fullName && !jobTitle && line.length < 50 && !line.includes(':')) {
      jobTitle = line;
      break;
    }
  }

  // Section heading detection
  interface SectionBlock {
    type: 'summary' | 'experience' | 'education' | 'skills' | 'projects' | 'certifications' | 'languages' | 'other';
    heading: string;
    lines: string[];
  }

  const sectionMatchers: Array<{ regex: RegExp; type: SectionBlock['type'] }> = [
    { regex: /^(?:summary|profile|about\s*me|objective|professional\s*summary)$/i, type: 'summary' },
    { regex: /^(?:experience|work\s*experience|employment|professional\s*experience|work\s*history)$/i, type: 'experience' },
    { regex: /^(?:education|academic\s*background|academics|qualifications)$/i, type: 'education' },
    { regex: /^(?:skills|technical\s*skills|core\s*competencies|expertise|tools)$/i, type: 'skills' },
    { regex: /^(?:projects|key\s*projects|personal\s*projects)$/i, type: 'projects' },
    { regex: /^(?:certifications|certificates|licenses|accreditations)$/i, type: 'certifications' },
    { regex: /^(?:languages|language\s*proficiency)$/i, type: 'languages' },
  ];

  const sections: SectionBlock[] = [];
  let currentSection: SectionBlock = { type: 'other', heading: 'Header', lines: [] };

  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    // Strip trailing colons or underline symbols
    const cleanHeader = line.replace(/[:\-=_]+$/, '').trim();

    let matchedType: SectionBlock['type'] | null = null;
    for (const sm of sectionMatchers) {
      if (sm.regex.test(cleanHeader)) {
        matchedType = sm.type;
        break;
      }
    }

    if (matchedType) {
      sections.push(currentSection);
      currentSection = { type: matchedType, heading: cleanHeader, lines: [] };
    } else {
      currentSection.lines.push(line);
    }
  }
  sections.push(currentSection);

  // Parse Summary
  const summaryBlock = sections.find((s) => s.type === 'summary');
  const summary = summaryBlock ? summaryBlock.lines.join(' ') : '';

  // Parse Experience
  const expBlock = sections.find((s) => s.type === 'experience');
  const experience: ExtractedCvData['experience'] = [];

  if (expBlock && expBlock.lines.length > 0) {
    let currentRole: any = null;
    const dateRegex = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}\s*[-–—to]+\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}|Present|Current)/i;

    for (const line of expBlock.lines) {
      const isBullet = line.startsWith('•') || line.startsWith('-') || line.startsWith('*');
      const hasDate = dateRegex.test(line);

      if (hasDate || (!isBullet && line.length < 80 && line.includes('|'))) {
        if (currentRole) experience.push(currentRole);

        const dateMatch = line.match(dateRegex);
        let dates = dateMatch ? dateMatch[0].split(/[-–—]|to/i).map((d) => d.trim()) : ['', ''];
        let role = line.replace(dateRegex, '').replace(/[|•\(\)]/g, ' ').trim();
        let company = 'Company Name';

        if (role.includes(' at ')) {
          const parts = role.split(' at ');
          role = parts[0].trim();
          company = parts[1].trim();
        } else if (role.includes(',')) {
          const parts = role.split(',');
          role = parts[0].trim();
          company = parts[1].trim();
        }

        currentRole = {
          id: 'exp_' + Math.random().toString(36).substring(2, 9),
          role: role || 'Professional Role',
          company: company,
          startDate: dates[0] || '2022',
          endDate: dates[1] || 'Present',
          current: (dates[1] || '').toLowerCase().includes('present'),
          description: '',
          highlights: [],
        };
      } else if (currentRole) {
        const cleanLine = line.replace(/^[•\-\*]\s*/, '').trim();
        if (cleanLine) {
          if (!currentRole.description) {
            currentRole.description = cleanLine;
          }
          currentRole.highlights.push(cleanLine);
        }
      }
    }
    if (currentRole) experience.push(currentRole);
  }

  // Parse Education
  const eduBlock = sections.find((s) => s.type === 'education');
  const education: ExtractedCvData['education'] = [];

  if (eduBlock && eduBlock.lines.length > 0) {
    let currentEdu: any = null;
    for (const line of eduBlock.lines) {
      if (line.match(/(?:Bachelor|Master|BSc|BA|MSc|MBA|Ph\.?D|Associate|High School|Diploma|Degree)/i)) {
        if (currentEdu) education.push(currentEdu);
        const yearMatch = line.match(/(?:19|20)\d{2}/g);
        currentEdu = {
          id: 'edu_' + Math.random().toString(36).substring(2, 9),
          degree: line.replace(/[-–—|]/g, ' ').trim(),
          field: '',
          institution: 'University / Institution',
          startDate: yearMatch ? yearMatch[0] : '2018',
          endDate: yearMatch && yearMatch[1] ? yearMatch[1] : yearMatch ? yearMatch[0] : '2022',
          description: '',
        };
      } else if (currentEdu && !currentEdu.institution && line.length < 70) {
        currentEdu.institution = line.trim();
      }
    }
    if (currentEdu) education.push(currentEdu);
  }

  // Parse Skills
  const skillsBlock = sections.find((s) => s.type === 'skills');
  const skills: ExtractedCvData['skills'] = [];

  if (skillsBlock && skillsBlock.lines.length > 0) {
    const rawSkillsText = skillsBlock.lines.join(', ');
    const items = rawSkillsText
      .split(/[,•|·\n]/)
      .map((s) => s.replace(/^[•\-*]\s*/, '').trim())
      .filter((s) => s.length > 1 && s.length < 35);

    if (items.length > 0) {
      skills.push({
        id: 'skill_main',
        category: 'Core Competencies',
        items: Array.from(new Set(items)).slice(0, 24),
      });
    }
  }

  // Parse Languages
  const langBlock = sections.find((s) => s.type === 'languages');
  const languages: ExtractedCvData['languages'] = [];

  if (langBlock && langBlock.lines.length > 0) {
    for (const line of langBlock.lines) {
      const items = line.split(/[,|•]/);
      for (const item of items) {
        const clean = item.trim();
        if (clean.length > 1) {
          const parts = clean.split(/[-–:\(]/);
          languages.push({
            id: 'lang_' + Math.random().toString(36).substring(2, 9),
            language: parts[0].trim(),
            proficiency: parts[1] ? parts[1].replace(/\)/g, '').trim() : 'Professional',
          });
        }
      }
    }
  }

  // Parse Certifications
  const certBlock = sections.find((s) => s.type === 'certifications');
  const certifications: ExtractedCvData['certifications'] = [];

  if (certBlock && certBlock.lines.length > 0) {
    for (const line of certBlock.lines) {
      const clean = line.replace(/^[•\-\*]\s*/, '').trim();
      if (clean.length > 3) {
        certifications.push({
          id: 'cert_' + Math.random().toString(36).substring(2, 9),
          name: clean,
          issuer: 'Accredited Provider',
          issueDate: '2023',
        });
      }
    }
  }

  return {
    isScanned: false,
    rawTextPreview: text.slice(0, 300),
    personalInfo: {
      fullName: fullName || 'Candidate Name',
      jobTitle: jobTitle || 'Professional Title',
      email,
      phone,
      location: '',
      linkedin,
      github,
      website,
    },
    summary,
    experience,
    education,
    skills,
    projects: [],
    certifications,
    languages,
  };
}
