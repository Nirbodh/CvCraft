import mongoose, { Document, Schema } from 'mongoose';

export interface ICVData {
  personalInfo: {
    fullName: string;
    jobTitle: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    linkedin?: string;
    github?: string;
    photo?: string;
    showPhoto?: boolean;
    photoShape?: 'circle' | 'rounded' | 'square';
    photoConfig?: {
      url?: string;
      visible: boolean;
      shape: 'circle' | 'square' | 'rounded';
      size: 'small' | 'medium' | 'large';
      position: 'left' | 'center' | 'right';
      border: boolean;
      borderColor?: string;
      borderWidth?: number;
      zoom: number;
      rotate: number;
      aspectRatio: '1:1' | '3:4' | '4:5';
      offsetX?: number;
      offsetY?: number;
    };
    dateOfBirth?: string;
    nationality?: string;
    maritalStatus?: string;
    visaStatus?: string;
    religion?: string;
    bloodGroup?: string;
    fatherName?: string;
    motherName?: string;
    permanentAddress?: string;
  };
  summary: string;
  careerObjective?: string;
  personalDetails?: Record<string, any>;
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
    highlights?: string[];
  }>;
  certifications: Array<{
    id: string;
    name: string;
    issuer: string;
    issueDate: string;
    expiryDate?: string;
    credentialId?: string;
    url?: string;
  }>;
  languages: Array<{
    id: string;
    language: string;
    proficiency: string;
    level?: string;
  }>;
  awards?: Array<{
    id: string;
    title: string;
    issuer: string;
    date: string;
    description?: string;
  }>;
  publications?: Array<{
    id: string;
    title: string;
    publisher: string;
    date: string;
    url?: string;
    authors?: string;
    description?: string;
  }>;
  memberships?: Array<{
    id: string;
    organization: string;
    role?: string;
    startDate?: string;
    endDate?: string;
    current?: boolean;
    description?: string;
  }>;
  volunteering?: Array<{
    id: string;
    role: string;
    organization: string;
    location?: string;
    startDate: string;
    endDate: string;
    current?: boolean;
    description?: string;
    highlights?: string[];
  }>;
  trainings?: Array<{
    id: string;
    name: string;
    provider: string;
    completionDate: string;
    credentialUrl?: string;
    description?: string;
  }>;
  references?: Array<{
    id: string;
    name: string;
    company: string;
    position: string;
    email?: string;
    phone?: string;
    relationship?: string;
    availableOnRequest?: boolean;
  }>;
  interests?: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  drivingLicence?: Array<{
    id: string;
    category: string;
    issuedBy?: string;
    hasOwnVehicle?: boolean;
    notes?: string;
  }>;
  additionalInfo?: Array<{
    id: string;
    title: string;
    content: string;
  }>;
  customSections?: Array<{
    id: string;
    title: string;
    content: string;
    subtitle?: string;
    date?: string;
    items?: string[];
  }>;
}

export type TemplateCategoryId =
  | 'ats'
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'technical'
  | 'academic';

export type CountryId =
  | 'usa'
  | 'canada'
  | 'uk'
  | 'germany'
  | 'eu'
  | 'australia'
  | 'uae'
  | 'bangladesh';

export interface ICV extends Document {
  userId: string;
  title: string;
  countryId: CountryId;
  templateId: TemplateCategoryId;
  themeColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  spacing: 'compact' | 'normal' | 'relaxed';
  fontSize: 'compact' | 'normal' | 'large';
  margins: 'compact' | 'normal' | 'relaxed';
  customHeadings: Record<string, string>;
  sectionOrder: string[];
  sectionVisibility: Record<string, boolean>;
  data: ICVData;
  createdAt: Date;
  updatedAt: Date;
}

export const CVSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'CV title is required'],
      default: 'Untitled CV',
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    countryId: {
      type: String,
      default: 'usa',
    },
    templateId: {
      type: String,
      default: 'modern',
    },
    activeLanguage: {
      type: String,
      default: 'en',
    },
    translations: {
      type: Schema.Types.Mixed,
      default: () => ({}),
    },
    isCustomTemplate: {
      type: Boolean,
      default: false,
    },
    customTemplateHtml: {
      type: String,
      default: '',
    },
    customTemplateCss: {
      type: String,
      default: '',
    },
    themeColor: {
      type: String,
      default: '#2563eb',
    },
    fontFamily: {
      type: String,
      enum: ['sans', 'serif', 'mono'],
      default: 'sans',
    },
    spacing: {
      type: String,
      enum: ['compact', 'normal', 'relaxed'],
      default: 'normal',
    },
    fontSize: {
      type: String,
      enum: ['compact', 'normal', 'large'],
      default: 'normal',
    },
    margins: {
      type: String,
      enum: ['compact', 'normal', 'relaxed'],
      default: 'normal',
    },
    customHeadings: {
      type: Map,
      of: String,
      default: () => ({}),
    },
    sectionOrder: {
      type: [String],
      default: [
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
      ],
    },
    sectionVisibility: {
      type: Map,
      of: Boolean,
      default: () => ({
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
      }),
    },
    data: {
      type: Schema.Types.Mixed,
      required: true,
      default: () => ({
        personalInfo: {
          fullName: '',
          jobTitle: '',
          email: '',
          phone: '',
          location: '',
          website: '',
          linkedin: '',
          github: '',
        },
        summary: '',
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        customSections: [],
      }),
    },
  },
  {
    timestamps: true,
  }
);

export const CVModel = mongoose.models.CV || mongoose.model<ICV>('CV', CVSchema);
