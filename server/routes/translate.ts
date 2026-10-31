import express, { type Request, type Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

// Common dictionary for standard CV keywords across languages
const CV_DICTIONARY: Record<string, Record<string, string>> = {
  ja: {
    'Full-Stack Engineer': 'フルスタックエンジニア',
    'Senior Software Engineer': 'シニアソフトウェアエンジニア',
    'Staff Systems Architect': 'スタッフシステムアーキテクト',
    'Software Engineer': 'ソフトウェアエンジニア',
    'Product Manager': 'プロダクトマネージャー',
    'Bachelor of Science': '学士（理学）',
    'Master of Science': '修士（理学）',
    'Computer Science': 'コンピュータサイエンス専攻',
    'University': '大学',
    'Present': '現在',
    'Languages & Frameworks': 'プログラミング言語・フレームワーク',
    'Cloud & Infrastructure': 'クラウド・インフラストラクチャ',
    'Professional Working': 'ビジネスレベル',
    'Native / Bilingual': '母国語 / ネイティブ',
    'Publications & Speaking': '登壇・執筆実績',
    'Career Objective': '志望動機・目的',
    'Summary': '職務要約・自己PR',
    'Experience': '職歴',
    'Education': '学歴',
    'Skills': '特技・スキル',
    'Certifications': '免許・資格',
    'Projects': '主な開発実績',
    'Languages': '語学力',
  },
  de: {
    'Full-Stack Engineer': 'Full-Stack-Entwickler',
    'Senior Software Engineer': 'Senior Softwareentwickler',
    'Bachelor of Science': 'Bachelor of Science (B.Sc.)',
    'Computer Science': 'Informatik',
    'Present': 'Heute',
    'Languages & Frameworks': 'Programmiersprachen & Frameworks',
    'Professional Working': 'Verhandlungssicher',
    'Native / Bilingual': 'Muttersprache',
    'Summary': 'Kurzprofil',
    'Experience': 'Berufserfahrung',
    'Education': 'Ausbildung & Studium',
    'Skills': 'Kenntnisse & Fähigkeiten',
    'Certifications': 'Zertifikate',
    'Projects': 'Projekte',
    'Languages': 'Sprachen',
  },
  fr: {
    'Full-Stack Engineer': 'Ingénieur Full-Stack',
    'Senior Software Engineer': 'Ingénieur Logiciel Senior',
    'Bachelor of Science': 'Licence en Sciences',
    'Computer Science': 'Informatique',
    'Present': 'Présent',
    'Languages & Frameworks': 'Langages et Frameworks',
    'Summary': 'Profil Professionnel',
    'Experience': 'Expérience Professionnelle',
    'Education': 'Formation & Diplômes',
    'Skills': 'Compétences',
    'Certifications': 'Certifications',
    'Languages': 'Langues',
  },
  es: {
    'Full-Stack Engineer': 'Ingeniero Full-Stack',
    'Senior Software Engineer': 'Ingeniero de Software Senior',
    'Bachelor of Science': 'Licenciatura en Ciencias',
    'Computer Science': 'Ciencias de la Computación',
    'Present': 'Actualidad',
    'Languages & Frameworks': 'Lenguajes y Frameworks',
    'Summary': 'Resumen Profesional',
    'Experience': 'Experiencia Laboral',
    'Education': 'Educación',
    'Skills': 'Habilidades',
    'Certifications': 'Certificaciones',
    'Languages': 'Idiomas',
  },
  bn: {
    'Full-Stack Engineer': 'ফুল-স্ট্যাক ইঞ্জিনিয়ার',
    'Senior Software Engineer': 'সিনিয়র সফটওয়্যার ইঞ্জিনিয়ার',
    'Bachelor of Science': 'ব্যাচেলর অব সায়েন্স (বিএসসি)',
    'Computer Science': 'কম্পিউটার সায়েন্স অ্যান্ড ইঞ্জিনিয়ারিং',
    'Present': 'বর্তমান',
    'Summary': 'পেশাদার সারসংক্ষেপ',
    'Experience': 'কাজের অভিজ্ঞতা',
    'Education': 'শিক্ষাগত যোগ্যতা',
    'Skills': 'দক্ষতা ও কারিগরি জ্ঞান',
    'Certifications': 'সার্টিফিকেশন',
    'Languages': 'ভাষাজ্ঞান',
  },
};

// Fallback rule-based translation preserving dates, numbers, and proper nouns
function fallbackTranslate(text: string, targetLang: string): string {
  if (!text || text.trim() === '') return text;

  const dict = CV_DICTIONARY[targetLang];
  if (!dict) return text;

  let result = text;
  for (const [key, val] of Object.entries(dict)) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    result = result.replace(regex, val);
  }
  return result;
}

// POST /api/translate
// Body: { items: Array<{ id: string; text: string }>, sourceLang: string, targetLang: string, context?: string }
router.post('/', async (req: Request, res: Response) => {
  const { items, sourceLang = 'en', targetLang = 'ja', context } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Invalid or empty items array' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a professional CV, resume, and biographical localization specialist.
Translate the following CV text items from ${sourceLang} into target language "${targetLang}".

Rules:
1. NEVER invent qualifications, companies, universities, or dates.
2. Maintain original proper nouns (like personal names, brand/company names, GitHub URLs, frameworks).
3. If target language is Japanese (ja), use natural business Japanese (Keigo/Teineigo or standard Rirekisho concise style).
4. Return a JSON object with a single property "translations" containing an array of objects: [{ "id": "<id>", "translatedText": "<translated>" }]. Match the exact input IDs.

Items to translate:
${JSON.stringify(items, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.2,
        },
      });

      const responseText = response.text || '';
      const parsed = JSON.parse(responseText);

      if (parsed && Array.isArray(parsed.translations)) {
        return res.json({
          success: true,
          provider: 'Gemini AI (Context-Aware)',
          translations: parsed.translations,
          notice: `Translated ${parsed.translations.length} fields accurately into ${targetLang}.`,
        });
      }
    } catch (aiErr: any) {
      console.warn('[Translate] Gemini API call failed or quota reached, falling back to local dictionary:', aiErr?.message);
    }
  }

  // Provider Fallback: Deterministic / Dictionary translation
  const fallbackResults = items.map((item: { id: string; text: string }) => ({
    id: item.id,
    translatedText: fallbackTranslate(item.text, targetLang),
  }));

  return res.json({
    success: true,
    provider: 'Standard CV Localization Engine (Deterministic)',
    translations: fallbackResults,
    notice: `Translated using standard ${targetLang.toUpperCase()} terminology. You can review and refine all fields before applying.`,
  });
});

export default router;
