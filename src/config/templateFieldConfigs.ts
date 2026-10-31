/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Template Field Configurations Catalog
 * The primary source of truth for template-driven CV fields and section layouts.
 */

import type { TemplateFieldConfig, TemplateFieldDefinition, TemplateSectionTarget, AdminTemplate } from '../types/template.ts';

export const ALL_STANDARD_SECTIONS: TemplateSectionTarget[] = [
  'personalInfo',
  'personalDetails',
  'summary',
  'objective',
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
  'additionalInfo',
  'customSections',
];

/**
 * Built-in default field configurations indexed by template ID.
 */
export const DEFAULT_TEMPLATE_FIELD_CONFIGS: Record<string, TemplateFieldConfig> = {
  // 1. JIS Japanese Rirekisho (履歴書)
  'japanese-rirekisho': {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: '3:4',
    allowCustomSections: false,
    notes: 'Official JIS standard format. Displays Furigana, standard Japanese personal details, chronological education/work table, licenses, and motivation/self-PR.',
    sections: [
      'personalInfo',
      'education',
      'experience',
      'certifications',
      'summary',
      'additionalInfo',
    ],
    fields: [
      {
        id: 'furiganaName',
        label: 'ふりがな (氏名) Furigana Name',
        section: 'personalInfo',
        type: 'text',
        placeholder: 'e.g. やまだ たろう / ヤマダ タロウ',
        helpText: 'Phonetic Japanese kana reading for full candidate name',
        required: true,
        order: 1,
      },
      {
        id: 'gender',
        label: '性別 Gender',
        section: 'personalInfo',
        type: 'select',
        options: [
          { value: '男', label: '男 (Male)' },
          { value: '女', label: '女 (Female)' },
          { value: '記載なし', label: '記載なし (Prefer not to say)' },
        ],
        helpText: 'Optional on modern JIS forms',
        required: false,
        order: 2,
      },
      {
        id: 'dateOfBirth',
        label: '生年月日 Date of Birth',
        section: 'personalInfo',
        type: 'date',
        helpText: 'Used to calculate official age on Japanese JIS forms',
        required: true,
        order: 3,
      },
      {
        id: 'furiganaAddress',
        label: 'ふりがな (住所) Furigana Address',
        section: 'personalInfo',
        type: 'text',
        placeholder: 'e.g. とうきょうとしぶやく...',
        helpText: 'Phonetic Japanese kana reading for current address',
        order: 4,
      },
      {
        id: 'commuteTime',
        label: '通勤時間 Commute Time',
        section: 'personalInfo',
        type: 'text',
        placeholder: 'e.g. 約45分 / 1時間15分',
        helpText: 'Expected travel duration from home to workplace in Japan',
        order: 5,
      },
      {
        id: 'dependentsCount',
        label: '扶養家族数 (配偶者を除く) Dependents',
        section: 'personalInfo',
        type: 'text',
        placeholder: 'e.g. 0人 / 1人',
        helpText: 'Number of legal dependents excluding spouse',
        order: 6,
      },
      {
        id: 'spouse',
        label: '配偶者 Spouse',
        section: 'personalInfo',
        type: 'select',
        options: [
          { value: '無', label: '無 (No)' },
          { value: '有', label: '有 (Yes)' },
        ],
        order: 7,
      },
      {
        id: 'spouseSupport',
        label: '配偶者の扶養義務 Spouse Support Obligation',
        section: 'personalInfo',
        type: 'select',
        options: [
          { value: '無', label: '無 (No)' },
          { value: '有', label: '有 (Yes)' },
        ],
        order: 8,
      },
      {
        id: 'reasonForApplying',
        label: '志望動機・特技・アピールポイント Motivation & Reason for Applying',
        section: 'summary',
        type: 'textarea',
        placeholder: '貴社の理念および事業展開に強く共鳴し、これまでの開発経験を生かして...',
        helpText: 'Official motivation for applying to this specific company',
        required: true,
        order: 9,
      },
      {
        id: 'selfPr',
        label: '本人希望記入欄 Personal Requests / Conditions',
        section: 'additionalInfo',
        type: 'textarea',
        placeholder: '給与・職種・勤務時間・勤務地等（貴社規定に従います）',
        helpText: 'Job conditions or "貴社規定に従います" if standard',
        order: 10,
      },
    ],
  },

  // 2. Japanese Shokumu Keirekisho (職務経歴書)
  'japanese-shokumu': {
    photoSupported: false,
    photoRecommended: false,
    allowCustomSections: true,
    notes: 'Mid-career Japanese work history detailing projects, tech stack, achievements, and self-PR.',
    sections: [
      'personalInfo',
      'summary',
      'skills',
      'experience',
      'certifications',
      'additionalInfo',
    ],
    fields: [
      {
        id: 'summary',
        label: '職務要約 Career Summary',
        section: 'summary',
        type: 'textarea',
        placeholder: '大学卒業後、Webシステム開発およびクラウド基盤構築に従事...',
        required: true,
        order: 1,
      },
      {
        id: 'selfPr',
        label: '自己PR Self PR & Strengths',
        section: 'additionalInfo',
        type: 'textarea',
        placeholder: '私の強みは技術的適応力とオーナーシップです...',
        required: true,
        order: 2,
      },
    ],
  },

  // 3. Classic / European DACH Lebenslauf (Germany)
  classic: {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: '3:4',
    allowCustomSections: true,
    notes: 'Traditional European tabular structure (German Lebenslauf) with formal date columns and optional demographic details.',
    sections: [
      'personalInfo',
      'personalDetails',
      'summary',
      'experience',
      'education',
      'skills',
      'languages',
      'certifications',
      'interests',
      'drivingLicence',
      'customSections',
    ],
    fields: [
      {
        id: 'dateOfBirth',
        label: 'Date of Birth (Geburtsdatum)',
        section: 'personalDetails',
        type: 'date',
        order: 1,
      },
      {
        id: 'placeOfBirth',
        label: 'Place of Birth (Geburtsort)',
        section: 'personalDetails',
        type: 'text',
        placeholder: 'e.g. Frankfurt am Main',
        order: 2,
      },
      {
        id: 'nationality',
        label: 'Nationality (Staatsangehörigkeit)',
        section: 'personalDetails',
        type: 'text',
        placeholder: 'e.g. German / EU Citizen',
        order: 3,
      },
      {
        id: 'maritalStatus',
        label: 'Marital Status (Familienstand)',
        section: 'personalDetails',
        type: 'select',
        options: [
          { value: 'single', label: 'Single (Ledig)' },
          { value: 'married', label: 'Married (Verheiratet)' },
          { value: 'unspecified', label: 'Prefer not to say' },
        ],
        order: 4,
      },
    ],
  },

  // 4. Clean ATS Standard (US / UK / Canada)
  ats: {
    photoSupported: false,
    photoRecommended: false,
    allowCustomSections: true,
    notes: 'Strict single-column text hierarchy formatted for 100% parse accuracy on Workday, Taleo, Greenhouse. Demographic fields and photos are omitted to prevent bias and parsing errors.',
    sections: [
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
    fields: [], // Uses pure standard contact and career fields
  },

  // 5. Modern Executive
  modern: {
    photoSupported: true,
    photoRecommended: false,
    photoAspect: '1:1',
    allowCustomSections: true,
    notes: 'Versatile contemporary layout with clean typography and balanced whitespace.',
    sections: [
      'personalInfo',
      'summary',
      'objective',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'languages',
      'awards',
      'volunteering',
      'customSections',
    ],
    fields: [],
  },

  // 6. Minimal Swiss
  minimal: {
    photoSupported: true,
    photoRecommended: false,
    photoAspect: '1:1',
    allowCustomSections: true,
    notes: 'Clean two-column grid emphasizing whitespace and typographic clarity.',
    sections: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'languages',
      'customSections',
    ],
    fields: [],
  },

  // 7. Executive Leadership (UAE & Global)
  executive: {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: '1:1',
    allowCustomSections: true,
    notes: 'Executive banner with corporate badges, ideal for leadership and director profiles in UAE and multinational firms.',
    sections: [
      'personalInfo',
      'summary',
      'experience',
      'education',
      'skills',
      'projects',
      'certifications',
      'memberships',
      'awards',
      'languages',
      'customSections',
    ],
    fields: [
      {
        id: 'nationality',
        label: 'Nationality / Citizenship',
        section: 'personalDetails',
        type: 'text',
        placeholder: 'e.g. British / UAE Resident',
        order: 1,
      },
      {
        id: 'visaStatus',
        label: 'Visa / Residency Status',
        section: 'personalDetails',
        type: 'text',
        placeholder: 'e.g. Golden Visa Holder / Employment Visa',
        order: 2,
      },
    ],
  },

  // 8. Creative Designer
  creative: {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: '1:1',
    allowCustomSections: true,
    notes: 'High-contrast portfolio sidebar layout for designers, art directors, and creative technologists.',
    sections: [
      'personalInfo',
      'summary',
      'projects',
      'experience',
      'education',
      'skills',
      'certifications',
      'awards',
      'customSections',
    ],
    fields: [],
  },

  // 9. Engineering & Technical
  technical: {
    photoSupported: true,
    photoRecommended: false,
    photoAspect: '1:1',
    allowCustomSections: true,
    notes: 'Monospace terminal accents, categorized tech stacks, and direct repository demo links.',
    sections: [
      'personalInfo',
      'summary',
      'skills',
      'experience',
      'projects',
      'certifications',
      'education',
      'languages',
      'customSections',
    ],
    fields: [],
  },

  // 10. Academic / Research
  academic: {
    photoSupported: true,
    photoRecommended: false,
    photoAspect: '1:1',
    allowCustomSections: true,
    notes: 'Formal scholarly format prioritizing publications, citations, grants, teaching, and fellowships.',
    sections: [
      'personalInfo',
      'summary',
      'education',
      'publications',
      'awards',
      'experience',
      'trainings',
      'memberships',
      'languages',
      'references',
      'customSections',
    ],
    fields: [],
  },

  // 11. Bangladesh Corporate Biodata
  bangladesh_corporate: {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: '1:1',
    allowCustomSections: true,
    notes: 'Standard biodata format for Bangladeshi corporate and banking institutions.',
    sections: [
      'personalInfo',
      'personalDetails',
      'summary',
      'education',
      'experience',
      'skills',
      'languages',
      'references',
      'customSections',
    ],
    fields: [
      {
        id: 'fatherName',
        label: "Father's Name",
        section: 'personalDetails',
        type: 'text',
        placeholder: "Father's Full Name",
        order: 1,
      },
      {
        id: 'motherName',
        label: "Mother's Name",
        section: 'personalDetails',
        type: 'text',
        placeholder: "Mother's Full Name",
        order: 2,
      },
      {
        id: 'religion',
        label: 'Religion',
        section: 'personalDetails',
        type: 'text',
        placeholder: 'e.g. Islam / Hinduism / Christianity',
        order: 3,
      },
      {
        id: 'bloodGroup',
        label: 'Blood Group',
        section: 'personalDetails',
        type: 'select',
        options: [
          { value: 'A+', label: 'A+' },
          { value: 'A-', label: 'A-' },
          { value: 'B+', label: 'B+' },
          { value: 'B-', label: 'B-' },
          { value: 'O+', label: 'O+' },
          { value: 'O-', label: 'O-' },
          { value: 'AB+', label: 'AB+' },
          { value: 'AB-', label: 'AB-' },
        ],
        order: 4,
      },
      {
        id: 'permanentAddress',
        label: 'Permanent Address (Village/District)',
        section: 'personalDetails',
        type: 'text',
        placeholder: 'Permanent Address in Bangladesh',
        order: 5,
      },
      {
        id: 'nationalId',
        label: 'National ID (NID) / Smart Card',
        section: 'personalDetails',
        type: 'text',
        placeholder: '10 or 17 digit NID number',
        order: 6,
      },
    ],
  },
};

/**
 * Retrieve the active field configuration for a given template ID.
 * Checks custom templates first, then built-in defaults, falling back to Modern.
 */
export function getTemplateFieldConfig(
  templateId: string,
  customTemplates?: AdminTemplate[]
): TemplateFieldConfig {
  if (customTemplates && customTemplates.length > 0) {
    const custom = customTemplates.find((t) => t.id === templateId);
    if (custom && custom.fieldConfig) {
      return custom.fieldConfig;
    }
  }

  // Fallback to built-in configs
  const builtIn = DEFAULT_TEMPLATE_FIELD_CONFIGS[templateId];
  if (builtIn) {
    return builtIn;
  }

  // Default fallback
  return DEFAULT_TEMPLATE_FIELD_CONFIGS.modern;
}

/**
 * Check if a section is supported and should be active for a given template.
 */
export function isSectionSupportedByTemplate(
  section: TemplateSectionTarget,
  config?: TemplateFieldConfig
): boolean {
  if (!config || !config.sections || config.sections.length === 0) return true;
  return config.sections.includes(section);
}

/**
 * Get dynamic fields defined by the template for a specific section.
 */
export function getFieldsForSection(
  section: TemplateSectionTarget,
  config?: TemplateFieldConfig
): TemplateFieldDefinition[] {
  if (!config || !config.fields) return [];
  return config.fields
    .filter((f) => f.section === section)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Return compatible template IDs for a given country.
 */
export function getCompatibleTemplatesForCountry(countryId: string): string[] {
  switch (countryId) {
    case 'japan':
      return ['japanese-rirekisho', 'japanese-shokumu', 'ats', 'modern'];
    case 'germany':
      return ['classic', 'modern', 'ats', 'academic'];
    case 'usa':
    case 'canada':
    case 'uk':
    case 'australia':
      return ['ats', 'modern', 'minimal', 'creative', 'technical', 'executive'];
    case 'uae':
      return ['executive', 'modern', 'classic', 'ats'];
    case 'bangladesh':
      return ['bangladesh_corporate', 'classic', 'modern', 'ats'];
    case 'eu':
      return ['classic', 'modern', 'minimal', 'academic', 'ats'];
    default:
      return ['ats', 'modern', 'classic', 'minimal', 'executive', 'creative', 'technical', 'academic'];
  }
}
