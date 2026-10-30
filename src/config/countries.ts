import { CountryId, TemplateId, PersonalInfo } from '../types/cv.ts';

export interface CountryProfile {
  id: CountryId;
  name: string;
  flag: string;
  documentTerm: string;
  recommendedLength: string;
  photoConvention: 'discouraged' | 'optional' | 'common' | 'standard';
  photoExplanation: string;
  defaultDateFormat: string;
  recommendedTemplates: TemplateId[];
  relevantDemographicFields: Array<keyof PersonalInfo>;
  defaultSectionOrder: string[];
  countryTips: string[];
  atsGuidance: string;
  defaultLanguage?: string;
}

export const COUNTRY_PROFILES: Record<CountryId, CountryProfile> = {
  usa: {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    documentTerm: 'Resume',
    recommendedLength: '1 page (early/mid-career) or 2 pages (10+ years experience)',
    photoConvention: 'discouraged',
    photoExplanation:
      'Photos are strongly discouraged in the US due to Equal Employment Opportunity (EEOC) anti-discrimination compliance.',
    defaultDateFormat: 'MM/YYYY (e.g. 06/2023) or Month YYYY',
    recommendedTemplates: ['ats', 'modern', 'minimal', 'executive'],
    relevantDemographicFields: ['location'],
    defaultSectionOrder: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'customSections',
    ],
    countryTips: [
      'Keep it tight: 1 page is preferred unless you have 10+ years of senior experience.',
      'Never include date of birth, marital status, social security number, or photo.',
      'Quantify results using metrics (%, $, scale, users impacted).',
      'Lead with a strong Professional Summary, not an outdated Objective.',
    ],
    atsGuidance: 'High ATS priority. Single-column layouts and standard section headings ensure 100% parse rates in Workday, Greenhouse, and Lever.',
  },

  canada: {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    documentTerm: 'Resume',
    recommendedLength: '1 to 2 pages maximum',
    photoConvention: 'discouraged',
    photoExplanation:
      'Photos are typically omitted in Canada to comply with Canadian human rights and anti-bias recruitment standards.',
    defaultDateFormat: 'Month YYYY or YYYY-MM',
    recommendedTemplates: ['ats', 'modern', 'minimal', 'classic'],
    relevantDemographicFields: ['location', 'visaStatus'],
    defaultSectionOrder: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'certifications',
      'projects',
      'languages',
      'customSections',
    ],
    countryTips: [
      'Highlight Canadian equivalencies for international degrees if applicable (e.g. WES evaluated).',
      'If legally entitled to work (citizen, PR, or work permit), you may note work authorization.',
      'French language skills are highly valued across Quebec and nationwide federal roles.',
      'Omit personal details like age, gender, religion, and photographs.',
    ],
    atsGuidance: 'Most mid-to-large Canadian employers utilize Taleo, Workday, or BambooHR. Clean bullet hierarchy is paramount.',
  },

  uk: {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    documentTerm: 'CV',
    recommendedLength: 'Strictly 2 pages standard',
    photoConvention: 'discouraged',
    photoExplanation:
      'UK recruiters generally discourage photos to prevent unconscious bias under UK Equality Act 2010 regulations.',
    defaultDateFormat: 'DD/MM/YYYY or Month YYYY (e.g. Jan 2022 – Present)',
    recommendedTemplates: ['classic', 'modern', 'minimal', 'executive'],
    relevantDemographicFields: ['location', 'visaStatus'],
    defaultSectionOrder: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'certifications',
      'projects',
      'languages',
      'customSections',
    ],
    countryTips: [
      'The 2-page CV is the undisputed British gold standard.',
      'Start with a concise "Personal Profile" (3-4 lines outlining your value proposition).',
      'List educational credentials clearly (Degree class e.g. 2:1, A-Levels, GCSEs if early-career).',
      'Use British English spelling (e.g., "optimised", "analysed", "programmes").',
    ],
    atsGuidance: 'Standard British headings: "Personal Profile", "Employment History", "Education & Qualifications".',
  },

  germany: {
    id: 'germany',
    name: 'Germany / DACH',
    flag: '🇩🇪',
    documentTerm: 'Lebenslauf',
    recommendedLength: '1 to 2 pages (tabular format)',
    photoConvention: 'common',
    photoExplanation:
      'A professional headshot (Bewerbungsfoto) is traditional in Germany. While not legally mandatory under AGG, many hiring managers still expect it.',
    defaultDateFormat: 'MM/YYYY or DD.MM.YYYY (e.g. 01.03.2023)',
    recommendedTemplates: ['classic', 'minimal', 'modern', 'technical'],
    relevantDemographicFields: ['location', 'dateOfBirth', 'nationality'],
    defaultSectionOrder: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'languages',
      'certifications',
      'projects',
      'customSections',
    ],
    countryTips: [
      'The German "tabellarischer Lebenslauf" emphasizes chronological precision without unexplained career gaps.',
      'A professional studio photo is placed at top-right or centered in header.',
      'Date of birth (Geburtsdatum) and nationality (Staatsangehörigkeit) are common in traditional sectors.',
      'Language proficiency rated according to the CEFR scale (A1 to C2, Muttersprache).',
    ],
    atsGuidance: 'Clear table-like tabular structure with distinct date columns on the left or right ensures seamless German ATS parsing.',
  },

  eu: {
    id: 'eu',
    name: 'European Union / Europass',
    flag: '🇪🇺',
    documentTerm: 'Curriculum Vitae',
    recommendedLength: '2 or more pages',
    photoConvention: 'optional',
    photoExplanation:
      'Photos are accepted across continental Europe, though optional depending on the specific multinational employer.',
    defaultDateFormat: 'DD/MM/YYYY or Month YYYY',
    recommendedTemplates: ['modern', 'minimal', 'classic', 'academic'],
    relevantDemographicFields: ['location', 'nationality', 'dateOfBirth'],
    defaultSectionOrder: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'languages',
      'skills',
      'projects',
      'certifications',
      'customSections',
    ],
    countryTips: [
      'Emphasize cross-border mobility and multi-language capabilities.',
      'Use the Common European Framework of Reference for Languages (CEFR: A1, A2, B1, B2, C1, C2).',
      'European institutions prefer chronological precision with detailed project and institutional descriptions.',
      'Highlight Erasmus, international grants, or EU framework project participation.',
    ],
    atsGuidance: 'Recognized by EU-wide job portals including EURES and multinational ATS engines.',
  },

  australia: {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    documentTerm: 'CV',
    recommendedLength: '2 to 4 pages (more detailed than US/UK)',
    photoConvention: 'discouraged',
    photoExplanation:
      'Australian employers generally prefer no photo to align with fair work anti-bias practices.',
    defaultDateFormat: 'DD/MM/YYYY or Month YYYY',
    recommendedTemplates: ['modern', 'classic', 'executive', 'technical'],
    relevantDemographicFields: ['location', 'visaStatus'],
    defaultSectionOrder: [
      'personalInfo',
      'summary',
      'skills',
      'experience',
      'education',
      'certifications',
      'projects',
      'languages',
      'customSections',
    ],
    countryTips: [
      'Australian CVs are typically longer (2 to 4 pages) with detailed responsibilities and achievements.',
      'Clearly specify your work entitlement (e.g. Australian Citizen, Permanent Resident, or TSS 482 Visa).',
      'Include 2 professional referees or state "Referees available upon request" at the end.',
      'Use Australian spelling (e.g. "specialised", "liaised", "organisation").',
    ],
    atsGuidance: 'Strong ATS emphasis on explicit skill keywords mapped directly to the employer Position Description (PD).',
  },

  uae: {
    id: 'uae',
    name: 'UAE & Gulf Region',
    flag: '🇦🇪',
    documentTerm: 'CV',
    recommendedLength: '2 to 3 pages',
    photoConvention: 'standard',
    photoExplanation:
      'A crisp professional headshot in business attire is customary and widely expected across UAE and Gulf employers.',
    defaultDateFormat: 'DD/MM/YYYY or Month YYYY',
    recommendedTemplates: ['executive', 'modern', 'classic', 'technical'],
    relevantDemographicFields: ['location', 'nationality', 'visaStatus', 'maritalStatus', 'dateOfBirth'],
    defaultSectionOrder: [
      'personalInfo',
      'summary',
      'experience',
      'skills',
      'education',
      'languages',
      'certifications',
      'projects',
      'customSections',
    ],
    countryTips: [
      'High-quality professional passport-style photo is standard practice in Gulf recruitment.',
      'Specify Nationality, Current Visa Status (e.g. Employment Visa, Golden Visa, Visit Visa), and Notice Period.',
      'Mention GCC experience if you have worked in Saudi Arabia, UAE, Qatar, Oman, Kuwait, or Bahrain.',
      'Fluency in Arabic and English is a strong competitive differentiator.',
    ],
    atsGuidance: 'Leading GCC enterprises use Taleo, SAP SuccessFactors, and Bayt ATS. Keep contact coordinates prominent.',
  },

  bangladesh: {
    id: 'bangladesh',
    name: 'Bangladesh',
    flag: '🇧🇩',
    documentTerm: 'CV / Biodata',
    recommendedLength: '2 to 3 pages',
    photoConvention: 'standard',
    photoExplanation:
      'A formal passport-size photograph at the top is standard convention for corporate, bank, and institutional applications in Bangladesh.',
    defaultDateFormat: 'DD/MM/YYYY or Month YYYY',
    recommendedTemplates: ['classic', 'modern', 'academic', 'ats'],
    relevantDemographicFields: [
      'location',
      'fatherName',
      'motherName',
      'permanentAddress',
      'dateOfBirth',
      'nationality',
      'maritalStatus',
      'religion',
      'bloodGroup',
    ],
    defaultSectionOrder: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'languages',
      'projects',
      'certifications',
      'customSections',
    ],
    countryTips: [
      'Formal passport photograph placed at top-right is customary.',
      'Personal Profile details (Father\'s Name, Mother\'s Name, Permanent Address, Blood Group) are standard in corporate & bank CVs.',
      'List educational credentials with Division/GPA/CGPA and board/university (SSC, HSC, Bachelor, Master).',
      'Include two reputable professional referees (Name, Designation, Organization, Mobile, Email).',
    ],
    atsGuidance: 'Corporate portals such as Bdjobs and multinational banks parse standard headings: Career Objective, Experience, Education.',
  },

  japan: {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    documentTerm: '履歴書 (Rirekisho)',
    recommendedLength: '1 to 2 pages (Standard JIS Japanese format)',
    photoConvention: 'standard',
    photoExplanation:
      'A formal 30mm x 40mm studio photograph (スーツ着用 証明写真) is strictly expected in Japanese job applications.',
    defaultDateFormat: 'YYYY年M月 or 令和・平成 和暦 (Japanese Era)',
    recommendedTemplates: ['japanese-rirekisho', 'japanese-shokumu', 'modern', 'ats'],
    relevantDemographicFields: [
      'location',
      'furiganaName',
      'furiganaAddress',
      'gender',
      'dateOfBirth',
      'commuteTime',
      'dependentsCount',
      'spouse',
      'selfPr',
      'reasonForApplying',
      'personalPreferences',
    ],
    defaultSectionOrder: [
      'personalInfo',
      'education',
      'experience',
      'certifications',
      'skills',
      'summary',
      'customSections',
    ],
    countryTips: [
      'JIS-standard Rirekisho (履歴書) requires Furigana (ふりがな) above both your name and address.',
      'Education (学歴) and Work Experience (職歴) are presented sequentially in a tabular grid, ending with right-aligned "以上" (End).',
      'Attach a clean 30mm x 40mm formal portrait (証明写真) taken within the last 3 months.',
      'Highlight 志望動機 (Motivation for applying) and 自己PR (Self PR) tailored to the company.',
      'Fill in 本人希望記入欄 with personal preferences or the standard phrase "貴社の規定に従います" (According to company policy).',
    ],
    atsGuidance: 'Japanese employers and agencies (e.g. Rikunabi, Doda, BizReach) parse structured chronological tables and Furigana headers.',
    defaultLanguage: 'ja',
  },
};

export const COUNTRY_LIST: CountryProfile[] = Object.values(COUNTRY_PROFILES);
