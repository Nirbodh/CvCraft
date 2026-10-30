import { TemplateFieldConfig } from './template.ts';

export type TemplateId =
  | 'ats'
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'technical'
  | 'academic'
  | 'professional' // alias for modern executive
  | 'japanese-rirekisho'
  | 'japanese-shokumu'
  | string; // Allow custom user-created templates

export type CountryId =
  | 'usa'
  | 'canada'
  | 'uk'
  | 'germany'
  | 'eu'
  | 'australia'
  | 'uae'
  | 'bangladesh'
  | 'japan'
  | string; // Allow custom user-added countries

export type FontFamily = 'sans' | 'serif' | 'mono';
export type SpacingScale = 'compact' | 'normal' | 'relaxed';
export type FontSizeScale = 'compact' | 'normal' | 'large';
export type MarginScale = 'compact' | 'normal' | 'relaxed';

export type PhotoShape = 'circle' | 'square' | 'rounded';
export type PhotoPosition = 'left' | 'center' | 'right';
export type PhotoSize = 'small' | 'medium' | 'large';
export type PhotoAspectRatio = '1:1' | '3:4' | '4:5';

export interface PhotoConfig {
  url?: string;
  visible: boolean;
  shape: PhotoShape;
  size: PhotoSize;
  position: PhotoPosition;
  border: boolean;
  borderColor?: string;
  borderWidth?: number;
  zoom: number;
  rotate: number;
  aspectRatio: PhotoAspectRatio;
  offsetX?: number;
  offsetY?: number;
}

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  // Country & Profile Photo configuration
  photo?: string; // base64 or image URL
  showPhoto?: boolean;
  photoShape?: PhotoShape;
  photoConfig?: PhotoConfig;
  // Optional country profile fields
  dateOfBirth?: string;
  nationality?: string;
  maritalStatus?: string;
  visaStatus?: string;
  religion?: string;
  bloodGroup?: string;
  fatherName?: string;
  motherName?: string;
  permanentAddress?: string;
  // Japanese Rirekisho (履歴書) specific fields
  furiganaName?: string; // ふりがな (氏名)
  furiganaAddress?: string; // ふりがな (現住所)
  gender?: string; // 男 / 女 / 未記載
  commuteTime?: string; // 通勤時間 (e.g., 約1時間15分)
  dependentsCount?: string; // 扶養家族数 (配偶者を除く)
  spouse?: string; // 配偶者 (有・無)
  spouseSupport?: string; // 配偶者の扶養義務 (有・無)
  selfPr?: string; // 自己PR / 志望動機 / 特技
  reasonForApplying?: string; // 志望動機
  personalPreferences?: string; // 本人希望記入欄 (給与・職種・勤務時間等)
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights?: string[];
}

export interface EducationItem {
  id: string;
  degree: string;
  field: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface SkillCategory {
  id: string;
  category: string;
  items: string[];
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link?: string;
  technologies: string[];
  highlights?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface LanguageItem {
  id: string;
  language: string;
  proficiency: string; // e.g., Native, Fluent, Professional, Conversational, or CEFR (C2, C1, B2)
  level?: string; // CEFR Level: A1, A2, B1, B2, C1, C2
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  url?: string;
  authors?: string;
  description?: string;
}

export interface MembershipItem {
  id: string;
  organization: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
}

export interface VolunteerItem {
  id: string;
  role: string;
  organization: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description?: string;
  highlights?: string[];
}

export interface TrainingItem {
  id: string;
  name: string;
  provider: string;
  completionDate: string;
  credentialUrl?: string;
  description?: string;
}

export interface ReferenceItem {
  id: string;
  name: string;
  company: string;
  position: string;
  email?: string;
  phone?: string;
  relationship?: string;
  availableOnRequest?: boolean;
}

export interface InterestItem {
  id: string;
  name: string;
  description?: string;
}

export interface DrivingLicenceItem {
  id: string;
  category: string; // e.g. Category B, Clean UK/EU Driving Licence, Class C
  issuedBy?: string;
  hasOwnVehicle?: boolean;
  notes?: string;
}

export interface PersonalDetailsData {
  nationality?: string;
  dateOfBirth?: string;
  placeOfBirth?: string;
  gender?: string;
  maritalStatus?: string;
  visaStatus?: string;
  passportOrId?: string;
  militaryService?: string;
  additionalNotes?: string;
}

export interface AdditionalInfoItem {
  id: string;
  title: string;
  content: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
  subtitle?: string;
  date?: string;
  items?: string[];
}

export interface CvData {
  personalInfo: PersonalInfo;
  summary: string;
  careerObjective?: string;
  personalDetails?: PersonalDetailsData;
  experience: ExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  projects: ProjectItem[];
  certifications: CertificationItem[];
  languages: LanguageItem[];
  awards?: AwardItem[];
  publications?: PublicationItem[];
  memberships?: MembershipItem[];
  volunteering?: VolunteerItem[];
  trainings?: TrainingItem[];
  references?: ReferenceItem[];
  interests?: InterestItem[];
  drivingLicence?: DrivingLicenceItem[];
  additionalInfo?: AdditionalInfoItem[];
  customSections: CustomSectionItem[];
}

export interface CV {
  _id?: string;
  id?: string;
  userId?: string;
  title: string;
  countryId: CountryId;
  templateId: TemplateId;
  themeColor: string;
  fontFamily: FontFamily;
  spacing: SpacingScale;
  fontSize: FontSizeScale;
  margins: MarginScale;
  customHeadings: Record<string, string>;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  data: CvData;
  // Multi-language translation support
  activeLanguage?: string;
  translations?: Record<string, CvData>;
  originalData?: CvData;
  // Custom HTML/CSS Template Support
  isCustomTemplate?: boolean;
  customTemplateHtml?: string;
  customTemplateCss?: string;
  templateFieldConfig?: TemplateFieldConfig;
  createdAt?: string;
  updatedAt?: string;
}

export const COLOR_PALETTES = [
  { name: 'Executive Navy', value: '#1e3a8a', label: 'Navy' },
  { name: 'Modern Sapphire', value: '#2563eb', label: 'Blue' },
  { name: 'Emerald Forest', value: '#059669', label: 'Emerald' },
  { name: 'Burgundy Slate', value: '#831843', label: 'Wine' },
  { name: 'Anthracite Dark', value: '#18181b', label: 'Monochrome' },
  { name: 'Warm Amber', value: '#b45309', label: 'Amber' },
  { name: 'Cyan Tech', value: '#0891b2', label: 'Teal' },
  { name: 'Nordic Slate', value: '#475569', label: 'Slate' },
];

export const INITIAL_CV_DATA: CvData = {
  personalInfo: {
    fullName: 'Alex Vance',
    jobTitle: 'Senior Full-Stack Engineer',
    email: 'alex.vance@example.com',
    phone: '+1 (555) 234-5678',
    location: 'San Francisco, CA',
    website: 'https://alexvance.dev',
    linkedin: 'linkedin.com/in/alexvance',
    github: 'github.com/alexvance',
    showPhoto: false,
    photoShape: 'circle',
    nationality: 'American',
    dateOfBirth: '',
    maritalStatus: '',
    visaStatus: '',
  },
  summary:
    'Dedicated Full-Stack Engineer with 6+ years of expertise in architecting resilient distributed systems, modern React applications, and high-throughput microservices. Proven success leading cross-functional teams to modernize legacy pipelines, decreasing latency by 42% and accelerating release velocity.',
  experience: [
    {
      id: 'exp_1',
      role: 'Staff Systems Architect',
      company: 'Apex Cloud Solutions',
      location: 'San Francisco, CA',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description:
        'Spearheaded the redesign of core multi-tenant transaction infrastructure serving 1.2M+ daily active requests.',
      highlights: [
        'Architected real-time event streaming pipeline processing 45k events/sec with sub-20ms p99 latency.',
        'Mentored 8 mid-level engineers in distributed design patterns, automated testing, and CI/CD best practices.',
        'Reduced cloud computing overhead by $180,000 annually through containerized autoscaling optimizations.',
      ],
    },
    {
      id: 'exp_2',
      role: 'Senior Software Engineer',
      company: 'Nexus Software Labs',
      location: 'Austin, TX',
      startDate: '2019',
      endDate: '2022',
      current: false,
      description:
        'Developed mission-critical web applications utilizing React, Node.js, and PostgreSQL for enterprise fintech clients.',
      highlights: [
        'Streamlined client onboarding workflow, cutting document verification time by 60%.',
        'Implemented rigorous test automation suite achieving 92% code coverage across vital payment microservices.',
      ],
    },
  ],
  education: [
    {
      id: 'edu_1',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      institution: 'University of Washington',
      location: 'Seattle, WA',
      startDate: '2015',
      endDate: '2019',
      gpa: '3.85 / 4.0',
      description: 'Magna Cum Laude. Specialization in Distributed Computing and Algorithms.',
    },
  ],
  skills: [
    {
      id: 'sk_1',
      category: 'Languages & Frameworks',
      items: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Express', 'Python', 'Go', 'Tailwind CSS'],
    },
    {
      id: 'sk_2',
      category: 'Cloud & Infrastructure',
      items: ['Docker', 'Kubernetes', 'AWS', 'MongoDB', 'PostgreSQL', 'Redis', 'CI/CD Pipelines'],
    },
  ],
  projects: [
    {
      id: 'proj_1',
      name: 'OmniStream Analytics Engine',
      description:
        'High-performance distributed telemetry dashboard providing real-time anomalies detection and alerting.',
      link: 'https://github.com/alexvance/omnistream',
      technologies: ['TypeScript', 'React', 'Node.js', 'Tailwind CSS'],
      highlights: [
        'Processed over 10M records per day with zero data loss.',
        'Adopted by 4 open-source enterprise communities.',
      ],
    },
  ],
  certifications: [
    {
      id: 'cert_1',
      name: 'AWS Certified Solutions Architect – Professional',
      issuer: 'Amazon Web Services',
      issueDate: '2023',
      expiryDate: '2026',
      credentialId: 'AWS-PSA-99412',
    },
  ],
  languages: [
    { id: 'lang_1', language: 'English', proficiency: 'Native / Bilingual', level: 'C2' },
    { id: 'lang_2', language: 'Spanish', proficiency: 'Professional Working', level: 'B2' },
  ],
  awards: [
    {
      id: 'award_1',
      title: 'Global Tech Innovation Excellence Award',
      issuer: 'Silicon Valley Engineering Forum',
      date: '2023',
      description: 'Awarded for architecting distributed zero-data-loss streaming pipelines.',
    },
  ],
  publications: [
    {
      id: 'pub_1',
      title: 'Architecting Resilient Event Streaming Microservices at Hyperscale',
      publisher: 'IEEE Distributed Computing Conference',
      date: '2023',
      authors: 'Alex Vance, et al.',
      url: 'https://doi.org/10.1109/sample.2023',
      description: 'Empirical analysis on tail-latency reduction across cross-region clusters.',
    },
  ],
  memberships: [
    {
      id: 'mem_1',
      organization: 'Association for Computing Machinery (ACM)',
      role: 'Senior Member',
      startDate: '2020',
      current: true,
      description: 'Active contributor to Cloud and Distributed Systems special interest groups.',
    },
  ],
  volunteering: [
    {
      id: 'vol_1',
      role: 'Open-Source Mentor & Workshop Instructor',
      organization: 'Code For Humanity',
      location: 'San Francisco, CA',
      startDate: '2021',
      endDate: 'Present',
      current: true,
      description: 'Volunteered 120+ hours mentoring underprivileged students in full-stack web engineering and distributed systems.',
      highlights: ['Mentored 15 junior developers securing their first software engineering roles.'],
    },
  ],
  trainings: [
    {
      id: 'trn_1',
      name: 'Advanced Kubernetes Architecture & Security Masterclass',
      provider: 'Linux Foundation / CNCF',
      completionDate: '2023',
      credentialUrl: 'https://cncf.io/verify',
      description: 'In-depth mastery of service mesh, eBPF telemetry, and zero-trust container security.',
    },
  ],
  references: [
    {
      id: 'ref_1',
      name: 'Sarah Jenkins',
      company: 'Apex Cloud Solutions',
      position: 'VP of Engineering',
      email: 'sjenkins@apexcloud.example',
      phone: '+1 (555) 345-6789',
      relationship: 'Former Direct Engineering Manager',
      availableOnRequest: false,
    },
  ],
  interests: [
    { id: 'int_1', name: 'Distributed Systems & Open Source', description: 'Active contributor to Rust & Go tooling' },
    { id: 'int_2', name: 'Long-Distance Marathons & Trail Running', description: 'Completed Boston & Big Sur Marathons' },
  ],
  drivingLicence: [
    { id: 'dl_1', category: 'Class C (US Full Driver License)', issuedBy: 'California DMV', hasOwnVehicle: true },
  ],
  additionalInfo: [
    {
      id: 'add_1',
      title: 'Security Clearance & Availability',
      content: 'US Citizen. Immediate availability with standard 2-week transition window.',
    },
  ],
  customSections: [
    {
      id: 'cust_1',
      title: 'Patents & Inventions',
      content:
        'Patent US-984210B: Adaptive dynamic load balancing mechanism for geographically replicated key-value storage clusters.',
    },
  ],
};

export interface SectionMeta {
  key: string;
  name: string;
  category: 'core' | 'professional' | 'personal' | 'custom';
  description: string;
}

export const ALL_CV_SECTIONS: SectionMeta[] = [
  { key: 'personalInfo', name: 'Personal Information', category: 'core', description: 'Contact details, title, and profile photo' },
  { key: 'summary', name: 'Professional Summary', category: 'core', description: 'High-impact executive summary and career highlight' },
  { key: 'careerObjective', name: 'Career Objective', category: 'core', description: 'Target role, aspirations, and value proposition' },
  { key: 'experience', name: 'Work Experience', category: 'core', description: 'Employment history, roles, and accomplishments' },
  { key: 'education', name: 'Education', category: 'core', description: 'Degrees, universities, honors, and coursework' },
  { key: 'skills', name: 'Skills & Proficiencies', category: 'core', description: 'Categorized technical and interpersonal capabilities' },
  { key: 'projects', name: 'Projects', category: 'professional', description: 'Key initiatives, open-source work, and case studies' },
  { key: 'certifications', name: 'Certifications', category: 'professional', description: 'Industry credentials, licenses, and badges' },
  { key: 'languages', name: 'Languages', category: 'professional', description: 'Spoken languages and CEFR proficiency levels' },
  { key: 'awards', name: 'Awards & Achievements', category: 'professional', description: 'Honors, competitions, and corporate recognitions' },
  { key: 'publications', name: 'Publications & Research', category: 'professional', description: 'Academic papers, journal articles, and books' },
  { key: 'memberships', name: 'Professional Memberships', category: 'professional', description: 'Affiliations with industry bodies and societies' },
  { key: 'volunteering', name: 'Volunteer Experience', category: 'personal', description: 'Community service, non-profit, and pro-bono work' },
  { key: 'trainings', name: 'Training & Workshops', category: 'professional', description: 'Bootcamps, masterclasses, and executive education' },
  { key: 'references', name: 'References', category: 'professional', description: 'Professional endorsements or available upon request' },
  { key: 'interests', name: 'Interests & Hobbies', category: 'personal', description: 'Personal pursuits, sports, and creative interests' },
  { key: 'drivingLicence', name: 'Driving Licence', category: 'personal', description: 'Driver categories, clean record, and mobility' },
  { key: 'personalDetails', name: 'Personal Details', category: 'personal', description: 'Nationality, DOB, visa status, and biodata' },
  { key: 'additionalInfo', name: 'Additional Information', category: 'custom', description: 'Security clearances, notice period, or notes' },
  { key: 'customSections', name: 'Custom Sections', category: 'custom', description: 'Bespoke sections tailored to your industry' },
];

export const DEFAULT_SECTION_ORDER = [
  'personalInfo',
  'summary',
  'experience',
  'education',
  'skills',
  'projects',
  'certifications',
  'languages',
  'awards',
  'publications',
  'memberships',
  'volunteering',
  'trainings',
  'references',
  'interests',
  'drivingLicence',
  'personalDetails',
  'additionalInfo',
  'customSections',
];

export const DEFAULT_SECTION_VISIBILITY: Record<string, boolean> = {
  personalInfo: true,
  summary: true,
  careerObjective: false,
  experience: true,
  education: true,
  skills: true,
  projects: true,
  certifications: true,
  languages: true,
  awards: true,
  publications: true,
  memberships: true,
  volunteering: true,
  trainings: true,
  references: true,
  interests: true,
  drivingLicence: true,
  personalDetails: false,
  additionalInfo: true,
  customSections: true,
};

export const DEFAULT_CV: CV = {
  title: 'Senior Software Engineer CV',
  countryId: 'usa',
  templateId: 'modern',
  themeColor: '#2563eb',
  fontFamily: 'sans',
  spacing: 'normal',
  fontSize: 'normal',
  margins: 'normal',
  customHeadings: {},
  sectionOrder: DEFAULT_SECTION_ORDER,
  sectionVisibility: DEFAULT_SECTION_VISIBILITY,
  data: INITIAL_CV_DATA,
};

