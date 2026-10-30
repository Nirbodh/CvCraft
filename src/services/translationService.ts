import { CvData } from '../types/cv.ts';

export interface TranslatableField {
  id: string;
  label: string;
  category: string;
  originalText: string;
  translatedText?: string;
}

export interface TranslationResponse {
  success: boolean;
  provider: string;
  notice?: string;
  fields: TranslatableField[];
  error?: string;
}

export const SUPPORTED_LANGUAGES = [
  { code: 'ja', name: 'Japanese (日本語)', flag: '🇯🇵', sampleJob: 'ソフトウェアエンジニア' },
  { code: 'en', name: 'English (US / UK)', flag: '🇺🇸', sampleJob: 'Software Engineer' },
  { code: 'de', name: 'German (Deutsch)', flag: '🇩🇪', sampleJob: 'Softwareentwickler' },
  { code: 'fr', name: 'French (Français)', flag: '🇫🇷', sampleJob: 'Ingénieur Logiciel' },
  { code: 'es', name: 'Spanish (Español)', flag: '🇪🇸', sampleJob: 'Ingeniero de Software' },
  { code: 'bn', name: 'Bengali (বাংলা)', flag: '🇧🇩', sampleJob: 'সফটওয়্যার ইঞ্জিনিয়ার' },
  { code: 'ar', name: 'Arabic (العربية)', flag: '🇦🇪', sampleJob: 'مهندس برمجيات' },
];

/**
 * Extracts distinct translatable text fields from a CvData structure.
 * Preserves stable IDs for field-level matching and user review.
 */
export function extractTranslatableFields(data: CvData): TranslatableField[] {
  const fields: TranslatableField[] = [];

  // 1. Personal & Headline
  if (data.personalInfo.jobTitle) {
    fields.push({
      id: 'personalInfo.jobTitle',
      label: 'Professional Job Title',
      category: 'Profile',
      originalText: data.personalInfo.jobTitle,
    });
  }

  // 2. Summary
  if (data.summary) {
    fields.push({
      id: 'summary',
      label: 'Executive Summary',
      category: 'Summary',
      originalText: data.summary,
    });
  }

  // 3. Work Experience
  if (Array.isArray(data.experience)) {
    data.experience.forEach((exp, idx) => {
      if (exp.role) {
        fields.push({
          id: `experience.${idx}.role`,
          label: `Role: ${exp.role} (${exp.company})`,
          category: 'Experience',
          originalText: exp.role,
        });
      }
      if (exp.description) {
        fields.push({
          id: `experience.${idx}.description`,
          label: `Description: ${exp.company}`,
          category: 'Experience',
          originalText: exp.description,
        });
      }
      if (Array.isArray(exp.highlights)) {
        exp.highlights.forEach((hl, hIdx) => {
          if (hl) {
            fields.push({
              id: `experience.${idx}.highlights.${hIdx}`,
              label: `Achievement: ${exp.company} (#${hIdx + 1})`,
              category: 'Experience',
              originalText: hl,
            });
          }
        });
      }
    });
  }

  // 4. Education
  if (Array.isArray(data.education)) {
    data.education.forEach((edu, idx) => {
      if (edu.degree) {
        fields.push({
          id: `education.${idx}.degree`,
          label: `Degree: ${edu.institution}`,
          category: 'Education',
          originalText: edu.degree,
        });
      }
      if (edu.field) {
        fields.push({
          id: `education.${idx}.field`,
          label: `Field of Study: ${edu.institution}`,
          category: 'Education',
          originalText: edu.field,
        });
      }
      if (edu.description) {
        fields.push({
          id: `education.${idx}.description`,
          label: `Honors / Description: ${edu.institution}`,
          category: 'Education',
          originalText: edu.description,
        });
      }
    });
  }

  // 5. Skills Categories
  if (Array.isArray(data.skills)) {
    data.skills.forEach((sk, idx) => {
      if (sk.category) {
        fields.push({
          id: `skills.${idx}.category`,
          label: `Skill Group: ${sk.category}`,
          category: 'Skills',
          originalText: sk.category,
        });
      }
    });
  }

  // 6. Custom Sections
  if (Array.isArray(data.customSections)) {
    data.customSections.forEach((sec, idx) => {
      if (sec.title) {
        fields.push({
          id: `customSections.${idx}.title`,
          label: `Section Title: ${sec.title}`,
          category: 'Custom Sections',
          originalText: sec.title,
        });
      }
      if (sec.content) {
        fields.push({
          id: `customSections.${idx}.content`,
          label: `Content: ${sec.title}`,
          category: 'Custom Sections',
          originalText: sec.content,
        });
      }
    });
  }

  // 7. Japanese / Regional fields (if present)
  if (data.personalInfo.selfPr) {
    fields.push({
      id: 'personalInfo.selfPr',
      label: 'Self PR / Motivation',
      category: 'Self PR',
      originalText: data.personalInfo.selfPr,
    });
  }

  return fields;
}

/**
 * Applies a verified translation map onto a cloned CvData structure.
 * Guaranteed never to mutate the input original object.
 */
export function applyTranslationsToCvData(
  originalData: CvData,
  translationsMap: Record<string, string>
): CvData {
  // Deep clone to ensure original remains pristine
  const updated: CvData = JSON.parse(JSON.stringify(originalData));

  // Job title
  if (translationsMap['personalInfo.jobTitle']) {
    updated.personalInfo.jobTitle = translationsMap['personalInfo.jobTitle'];
  }
  // Summary
  if (translationsMap['summary']) {
    updated.summary = translationsMap['summary'];
  }
  // Self PR
  if (translationsMap['personalInfo.selfPr']) {
    updated.personalInfo.selfPr = translationsMap['personalInfo.selfPr'];
  }

  // Experience
  if (Array.isArray(updated.experience)) {
    updated.experience.forEach((exp, idx) => {
      if (translationsMap[`experience.${idx}.role`]) {
        exp.role = translationsMap[`experience.${idx}.role`];
      }
      if (translationsMap[`experience.${idx}.description`]) {
        exp.description = translationsMap[`experience.${idx}.description`];
      }
      if (Array.isArray(exp.highlights)) {
        exp.highlights.forEach((_, hIdx) => {
          if (translationsMap[`experience.${idx}.highlights.${hIdx}`]) {
            exp.highlights![hIdx] = translationsMap[`experience.${idx}.highlights.${hIdx}`];
          }
        });
      }
    });
  }

  // Education
  if (Array.isArray(updated.education)) {
    updated.education.forEach((edu, idx) => {
      if (translationsMap[`education.${idx}.degree`]) {
        edu.degree = translationsMap[`education.${idx}.degree`];
      }
      if (translationsMap[`education.${idx}.field`]) {
        edu.field = translationsMap[`education.${idx}.field`];
      }
      if (translationsMap[`education.${idx}.description`]) {
        edu.description = translationsMap[`education.${idx}.description`];
      }
    });
  }

  // Skills
  if (Array.isArray(updated.skills)) {
    updated.skills.forEach((sk, idx) => {
      if (translationsMap[`skills.${idx}.category`]) {
        sk.category = translationsMap[`skills.${idx}.category`];
      }
    });
  }

  // Custom Sections
  if (Array.isArray(updated.customSections)) {
    updated.customSections.forEach((sec, idx) => {
      if (translationsMap[`customSections.${idx}.title`]) {
        sec.title = translationsMap[`customSections.${idx}.title`];
      }
      if (translationsMap[`customSections.${idx}.content`]) {
        sec.content = translationsMap[`customSections.${idx}.content`];
      }
    });
  }

  return updated;
}

/**
 * Calls backend translation endpoint with provider fallback.
 */
export async function translateCvContent(
  fields: TranslatableField[],
  sourceLang: string,
  targetLang: string
): Promise<TranslationResponse> {
  const payload = {
    items: fields.map((f) => ({ id: f.id, text: f.originalText })),
    sourceLang,
    targetLang,
  };

  try {
    const response = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Server returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'Translation service failed.');
    }

    const resultMap: Record<string, string> = {};
    if (Array.isArray(data.translations)) {
      data.translations.forEach((item: { id: string; translatedText: string }) => {
        resultMap[item.id] = item.translatedText;
      });
    }

    const populatedFields = fields.map((f) => ({
      ...f,
      translatedText: resultMap[f.id] || f.originalText,
    }));

    return {
      success: true,
      provider: data.provider || 'CVCraft Translation Service',
      notice: data.notice,
      fields: populatedFields,
    };
  } catch (err: any) {
    console.error('[Translation API Error]:', err);
    return {
      success: false,
      provider: 'Error',
      error: err?.message || 'Failed to connect to translation server.',
      fields: fields.map((f) => ({ ...f, translatedText: f.originalText })),
    };
  }
}
