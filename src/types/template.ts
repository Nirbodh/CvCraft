export type TemplateCategory =
  | 'ats'
  | 'modern'
  | 'classic'
  | 'minimal'
  | 'executive'
  | 'creative'
  | 'technical'
  | 'academic'
  | 'traditional'
  | 'custom';

export type TemplateStatus = 'draft' | 'published' | 'archived';

export interface TemplateVersion {
  version: string;
  htmlContent: string;
  cssContent: string;
  changeNote?: string;
  createdAt: string;
  author?: string;
}

export type TemplateFieldType =
  | 'text'
  | 'textarea'
  | 'date'
  | 'number'
  | 'select'
  | 'boolean'
  | 'email'
  | 'phone'
  | 'url'
  | 'tags';

export type TemplateSectionTarget =
  | 'personalInfo'
  | 'personalDetails'
  | 'summary'
  | 'objective'
  | 'experience'
  | 'education'
  | 'skills'
  | 'projects'
  | 'certifications'
  | 'languages'
  | 'awards'
  | 'publications'
  | 'memberships'
  | 'volunteering'
  | 'trainings'
  | 'references'
  | 'interests'
  | 'drivingLicence'
  | 'additionalInfo'
  | 'customSections';

export interface TemplateFieldOption {
  value: string;
  label: string;
}

export interface TemplateFieldDefinition {
  id: string; // e.g. "furiganaName", "commuteTime", "dependentsCount", "spouse", "selfPr", "nationality", "dateOfBirth", "maritalStatus"
  label: string;
  section: TemplateSectionTarget;
  type: TemplateFieldType;
  placeholder?: string;
  helpText?: string;
  required?: boolean;
  defaultVisibility?: boolean;
  order?: number;
  options?: TemplateFieldOption[];
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  supportedLanguages?: string[];
  countryCompatibility?: string[];
  conditionalVisibility?: {
    dependsOnFieldId?: string;
    expectedValue?: any;
  };
}

export interface TemplateFieldConfig {
  sections: TemplateSectionTarget[];
  fields: TemplateFieldDefinition[];
  photoSupported: boolean;
  photoRecommended?: boolean;
  photoAspect?: '1:1' | '3:4';
  allowCustomSections?: boolean;
  notes?: string;
}

export interface TemplateMetadata {
  id: string;
  name: string;
  countryId: string;
  category: TemplateCategory;
  description: string;
  defaultLanguage: string;
  version: string;
  status?: TemplateStatus;
  documentType?: 'cv' | 'resume' | 'biodata' | 'rirekisho' | 'shokumu' | 'portfolio' | string;
  isCustomHtml: boolean;
  htmlContent?: string;
  cssContent?: string;
  enabled: boolean;
  isSystem?: boolean;
  thumbnailColor?: string;
  tags?: string[];
  fieldConfig?: TemplateFieldConfig;
  versions?: TemplateVersion[];
  importedFrom?: {
    originalFilename?: string;
    fileType?: string;
    importedAt?: string;
    rawPreview?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type AdminTemplate = TemplateMetadata;

export interface CountryItem {
  id: string;
  name: string;
  flag: string;
  documentTerm: string;
  defaultLanguage: string;
  recommendedLength?: string;
  photoConvention?: 'discouraged' | 'optional' | 'common' | 'standard';
  photoExplanation?: string;
  atsGuidance?: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationFieldItem {
  key: string;
  label: string;
  category: string;
  originalText: string;
  translatedText: string;
}

export interface TranslationResult {
  sourceLanguage: string;
  targetLanguage: string;
  fields: TranslationFieldItem[];
  translatedAt: string;
  provider: string;
}
