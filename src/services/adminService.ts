/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CVCraft Admin Template Management Service
 * Comprehensive CRUD, Version History, Status & Validation Service
 * backed by a mock backend structure with localStorage persistence.
 */

import type {
  AdminTemplate,
  TemplateVersion,
  TemplateStatus,
  TemplateCategory,
} from '../types/template.ts';
import { getTemplateFieldConfig } from '../config/templateFieldConfigs.ts';

const MOCK_STORAGE_KEY = 'cvcraft_admin_templates_mock';
const SIMULATED_LATENCY_MS = 60;

/**
 * Standard Token Catalog available for HTML templates
 */
export interface TokenDefinition {
  token: string;
  label: string;
  description: string;
  example: string;
  category: 'Personal' | 'Experience' | 'Education' | 'Skills' | 'Projects' | 'Regional / Japan' | 'Styling';
}

export const AVAILABLE_CV_TOKENS: TokenDefinition[] = [
  // Styling
  { token: '{{themeColor}}', label: 'Theme Color', description: 'User-selected primary brand accent hex', example: '#2563eb', category: 'Styling' },
  { token: '{{fontFamily}}', label: 'Font Family', description: 'Primary font family name (sans, serif, mono)', example: 'sans-serif', category: 'Styling' },
  { token: '{{fontSize}}', label: 'Font Size', description: 'Font scale preset (compact, normal, large)', example: 'normal', category: 'Styling' },

  // Personal Info
  { token: '{{personalInfo.fullName}}', label: 'Candidate Name', description: 'Full professional name', example: 'Alex Vance', category: 'Personal' },
  { token: '{{personalInfo.jobTitle}}', label: 'Job Title', description: 'Professional headline or target title', example: 'Senior Systems Architect', category: 'Personal' },
  { token: '{{personalInfo.email}}', label: 'Email Address', description: 'Candidate email address', example: 'alex@example.com', category: 'Personal' },
  { token: '{{personalInfo.phone}}', label: 'Phone Number', description: 'Phone contact', example: '+1 (555) 019-2834', category: 'Personal' },
  { token: '{{personalInfo.location}}', label: 'Location', description: 'City, Region or Country', example: 'Tokyo, Japan', category: 'Personal' },
  { token: '{{personalInfo.website}}', label: 'Website / Portfolio', description: 'Personal website URL', example: 'https://alexvance.dev', category: 'Personal' },
  { token: '{{personalInfo.linkedin}}', label: 'LinkedIn', description: 'LinkedIn profile link or handle', example: 'linkedin.com/in/alexvance', category: 'Personal' },
  { token: '{{personalInfo.github}}', label: 'GitHub', description: 'GitHub username or link', example: 'github.com/alexvance', category: 'Personal' },
  { token: '{{personalInfo.photo}}', label: 'Photo URL', description: 'Headshot image URL or base64', example: 'data:image/...', category: 'Personal' },
  { token: '{{summary}}', label: 'Professional Summary', description: 'Executive career overview or objective', example: 'Dedicated engineer with 6+ years...', category: 'Personal' },

  // Regional / Demographic (Japan, Germany, UAE, Bangladesh)
  { token: '{{personalInfo.furiganaName}}', label: 'Furigana Name (ふりがな)', description: 'Japanese phonetic reading for name', example: 'とうきょう たろう', category: 'Regional / Japan' },
  { token: '{{personalInfo.furiganaAddress}}', label: 'Furigana Address (ふりがな)', description: 'Japanese phonetic reading for address', example: 'とうきょうとちよだく...', category: 'Regional / Japan' },
  { token: '{{personalInfo.gender}}', label: 'Gender (性別)', description: 'Gender selection', example: '男 / 女', category: 'Regional / Japan' },
  { token: '{{personalInfo.dateOfBirth}}', label: 'Date of Birth (生年月日)', description: 'Birthdate string', example: '1995年6月12日', category: 'Regional / Japan' },
  { token: '{{personalInfo.commuteTime}}', label: 'Commute Time (通勤時間)', description: 'Japanese transit time to workplace', example: '約1時間15分', category: 'Regional / Japan' },
  { token: '{{personalInfo.dependentsCount}}', label: 'Dependents (扶養家族数)', description: 'Count of dependents excluding spouse', example: '0人', category: 'Regional / Japan' },
  { token: '{{personalInfo.spouse}}', label: 'Spouse (配偶者)', description: 'Spouse status in Japan', example: '無', category: 'Regional / Japan' },
  { token: '{{personalInfo.selfPr}}', label: 'Self PR (自己PR)', description: 'Japanese Self-PR & motivation statement', example: '私の強みは技術的適応力と...', category: 'Regional / Japan' },
  { token: '{{personalInfo.nationality}}', label: 'Nationality', description: 'Citizenship / Nationality', example: 'Japanese / American', category: 'Regional / Japan' },
  { token: '{{personalInfo.visaStatus}}', label: 'Visa Status', description: 'Residency / Work Authorization', example: 'Permanent Resident', category: 'Regional / Japan' },

  // Loops
  { token: '{{#experience}} ... {{/experience}}', label: 'Experience Loop', description: 'Iterates through roles: {{role}}, {{company}}, {{startDate}}, {{endDate}}, {{description}}, {{highlights}}', example: '{{#experience}}...{{/experience}}', category: 'Experience' },
  { token: '{{#education}} ... {{/education}}', label: 'Education Loop', description: 'Iterates through degrees: {{degree}}, {{field}}, {{institution}}, {{startDate}}, {{endDate}}, {{gpa}}', example: '{{#education}}...{{/education}}', category: 'Education' },
  { token: '{{#skills}} ... {{/skills}}', label: 'Skills Loop', description: 'Iterates through skill groups: {{category}}, {{items}}', example: '{{#skills}}...{{/skills}}', category: 'Skills' },
  { token: '{{#projects}} ... {{/projects}}', label: 'Projects Loop', description: 'Iterates through projects: {{name}}, {{description}}, {{link}}', example: '{{#projects}}...{{/projects}}', category: 'Projects' },
];

/**
 * Standard starter boilerplates for newly created custom templates
 */
export const DEFAULT_TEMPLATE_HTML = `<!-- Custom Country-Wise Template -->
<div class="custom-cv-document p-8 font-sans text-slate-800">
  <!-- Header -->
  <header class="border-b-2 pb-4 mb-6" style="border-color: {{themeColor}}">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">{{personalInfo.fullName}}</h1>
        <p class="text-base font-semibold mt-1" style="color: {{themeColor}}">{{personalInfo.jobTitle}}</p>
      </div>
      {{#if personalInfo.photo}}
      <img src="{{personalInfo.photo}}" alt="{{personalInfo.fullName}}" class="w-20 h-20 rounded-lg object-cover border border-slate-300 shadow-xs" />
      {{/if}}
    </div>
    
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-3">
      <span>📍 {{personalInfo.location}}</span>
      <span>✉️ {{personalInfo.email}}</span>
      <span>📞 {{personalInfo.phone}}</span>
      {{#if personalInfo.website}}<span>🌐 {{personalInfo.website}}</span>{{/if}}
      {{#if personalInfo.github}}<span>💻 {{personalInfo.github}}</span>{{/if}}
    </div>
  </header>

  <!-- Summary -->
  {{#if summary}}
  <section class="mb-6">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Professional Summary</h2>
    <p class="text-xs leading-relaxed text-slate-700 whitespace-pre-line">{{summary}}</p>
  </section>
  {{/if}}

  <!-- Experience -->
  <section class="mb-6">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: {{themeColor}}">Work Experience</h2>
    <div class="space-y-4">
      {{#experience}}
      <div class="border-l-2 pl-3" style="border-color: {{themeColor}}33">
        <div class="flex justify-between items-baseline">
          <h3 class="font-bold text-xs text-slate-900">{{role}}</h3>
          <span class="text-[11px] font-mono text-slate-500">{{startDate}} - {{endDate}}</span>
        </div>
        <div class="text-[11px] font-semibold text-slate-600 mb-1">{{company}} • {{location}}</div>
        <p class="text-xs text-slate-700 leading-relaxed">{{description}}</p>
        <div class="text-xs text-slate-700 mt-1 pl-4">{{highlights}}</div>
      </div>
      {{/experience}}
    </div>
  </section>

  <!-- Education -->
  <section class="mb-6">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: {{themeColor}}">Education</h2>
    <div class="space-y-2">
      {{#education}}
      <div class="flex justify-between items-baseline text-xs">
        <div>
          <span class="font-bold text-slate-900">{{degree}} in {{field}}</span>
          <span class="text-slate-600 ml-2">({{institution}})</span>
        </div>
        <span class="text-[11px] font-mono text-slate-500">{{startDate}} - {{endDate}}</span>
      </div>
      {{/education}}
    </div>
  </section>

  <!-- Skills -->
  <section class="mb-4">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Core Skills</h2>
    <div class="space-y-1 text-xs">
      {{#skills}}
      <div>
        <strong class="text-slate-900">{{category}}:</strong>
        <span class="text-slate-700 ml-1">{{items}}</span>
      </div>
      {{/skills}}
    </div>
  </section>
</div>`;

export const DEFAULT_TEMPLATE_CSS = `/* Scoped Template Stylesheet */
.custom-cv-document {
  max-width: 100%;
  line-height: 1.5;
  color: #1e293b;
}

.custom-cv-document h1,
.custom-cv-document h2,
.custom-cv-document h3 {
  font-family: inherit;
}

.custom-cv-document ul {
  list-style-type: disc;
  margin-left: 1.25rem;
}

.custom-cv-document li {
  margin-bottom: 0.25rem;
}`;

/**
 * Initial seed catalog representing country-wise templates
 */
const SEED_TEMPLATES: AdminTemplate[] = [
  {
    id: 'japanese-rirekisho',
    name: 'JIS Standard Rirekisho (履歴書)',
    countryId: 'japan',
    category: 'traditional',
    description: 'Official Japanese standard JIS Rirekisho with Furigana (ふりがな), 30x40mm photo frame, chronological Education & Work grid ending with 以上, licenses, and Self-PR.',
    defaultLanguage: 'ja',
    version: '1.2.0',
    status: 'published',
    documentType: 'rirekisho',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#0f766e',
    tags: ['JIS', 'Furigana', 'Japan', 'Official'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Initial JIS standard baseline specification',
        createdAt: '2026-08-01T00:00:00.000Z',
        author: 'CVCraft Core Team',
      },
      {
        version: '1.1.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Added furigana phonetic support and 30x40mm photo alignment',
        createdAt: '2026-09-15T00:00:00.000Z',
        author: 'CVCraft Japan Localization',
      },
      {
        version: '1.2.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Refined chronological grid with 以上 right alignment',
        createdAt: '2026-10-20T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-10-20T00:00:00.000Z',
  },
  {
    id: 'japanese-shokumu',
    name: 'Japanese Shokumu Keirekisho (職務経歴書)',
    countryId: 'japan',
    category: 'executive',
    description: 'Detailed Japanese career progression document detailing project responsibilities, team sizes, and technical stack.',
    defaultLanguage: 'ja',
    version: '1.0.0',
    status: 'published',
    documentType: 'shokumu',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#1e3a8a',
    tags: ['Japan', 'Mid-Career', 'Technical'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Standard Japanese career history blueprint',
        createdAt: '2026-08-10T00:00:00.000Z',
        author: 'CVCraft Japan Localization',
      },
    ],
    createdAt: '2026-08-10T00:00:00.000Z',
    updatedAt: '2026-08-10T00:00:00.000Z',
  },
  {
    id: 'ats',
    name: 'Clean ATS Standard',
    countryId: 'usa',
    category: 'ats',
    description: 'High-parse single column layout optimized for Greenhouse, Workday, and Taleo.',
    defaultLanguage: 'en',
    version: '1.0.0',
    status: 'published',
    documentType: 'resume',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#2563eb',
    tags: ['ATS-Friendly', 'Single Column', 'USA'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Universal parser-compliant single column layout',
        createdAt: '2026-07-01T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-07-01T00:00:00.000Z',
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    countryId: 'usa',
    category: 'modern',
    description: 'Clean modern layout with subtle accents and strong typography.',
    defaultLanguage: 'en',
    version: '1.1.0',
    status: 'published',
    documentType: 'resume',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#1d4ed8',
    tags: ['Modern', 'Corporate', 'USA'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Initial layout release',
        createdAt: '2026-07-01T00:00:00.000Z',
        author: 'Admin',
      },
      {
        version: '1.1.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Enhanced timeline vertical accents',
        createdAt: '2026-09-01T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-07-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'classic',
    name: 'European Academic & Classic',
    countryId: 'germany',
    category: 'classic',
    description: 'Structured serif layout with distinct date columns, ideal for German Lebenslauf and European institutions.',
    defaultLanguage: 'de',
    version: '1.0.0',
    status: 'published',
    documentType: 'cv',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#831843',
    tags: ['Academic', 'Tabular', 'Germany'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'German Lebenslauf tabular structure',
        createdAt: '2026-07-15T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-07-15T00:00:00.000Z',
    updatedAt: '2026-07-15T00:00:00.000Z',
  },
  {
    id: 'minimal',
    name: 'Nordic Minimalist',
    countryId: 'eu',
    category: 'minimal',
    description: 'Crisp whitespace and understated typographic scale.',
    defaultLanguage: 'en',
    version: '1.0.0',
    status: 'published',
    documentType: 'cv',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#18181b',
    tags: ['Minimalist', 'EU'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Initial minimalist release',
        createdAt: '2026-08-01T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-08-01T00:00:00.000Z',
    updatedAt: '2026-08-01T00:00:00.000Z',
  },
  {
    id: 'executive',
    name: 'Gulf & Global Executive',
    countryId: 'uae',
    category: 'executive',
    description: 'Executive banner with corporate badges, ideal for leadership profiles in UAE and multinational roles.',
    defaultLanguage: 'en',
    version: '1.0.0',
    status: 'published',
    documentType: 'cv',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#b45309',
    tags: ['Executive', 'Photo', 'UAE'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Executive header with photo banner',
        createdAt: '2026-08-20T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-08-20T00:00:00.000Z',
    updatedAt: '2026-08-20T00:00:00.000Z',
  },
  {
    id: 'creative',
    name: 'Designer & Portfolio',
    countryId: 'uk',
    category: 'creative',
    description: 'Dynamic two-column sidebar layout for creative agencies and tech startups.',
    defaultLanguage: 'en',
    version: '1.0.0',
    status: 'published',
    documentType: 'cv',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#059669',
    tags: ['Creative', 'Portfolio', 'UK'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Portfolio cards and dark sidebar layout',
        createdAt: '2026-09-01T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-09-01T00:00:00.000Z',
    updatedAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'technical',
    name: 'Systems Engineer Tech',
    countryId: 'australia',
    category: 'technical',
    description: 'Data-dense grid highlighting core tech stacks, cloud certifications, and project links.',
    defaultLanguage: 'en',
    version: '1.0.0',
    status: 'published',
    documentType: 'cv',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#0891b2',
    tags: ['Tech', 'Engineering', 'Australia'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Terminal and stack matrix design',
        createdAt: '2026-09-10T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-09-10T00:00:00.000Z',
    updatedAt: '2026-09-10T00:00:00.000Z',
  },
  {
    id: 'bangladesh_corporate',
    name: 'Bangladesh Corporate & Bank Biodata',
    countryId: 'bangladesh',
    category: 'classic',
    description: 'Comprehensive biodata layout including permanent address, father/mother name, religion, blood group, and references.',
    defaultLanguage: 'en',
    version: '1.0.0',
    status: 'published',
    documentType: 'biodata',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#166534',
    tags: ['Biodata', 'Corporate', 'Bangladesh'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Corporate bank biodata standard layout',
        createdAt: '2026-09-18T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-09-18T00:00:00.000Z',
    updatedAt: '2026-09-18T00:00:00.000Z',
  },
  {
    id: 'tpl_tokyo_custom',
    name: 'Tokyo Creative Dev (Custom HTML)',
    countryId: 'japan',
    category: 'custom',
    description: 'Modern bilingual engineering template with custom dark sidebar and Japanese Self-PR section.',
    defaultLanguage: 'ja',
    version: '1.0.2',
    status: 'draft',
    documentType: 'shokumu',
    isCustomHtml: true,
    htmlContent: DEFAULT_TEMPLATE_HTML,
    cssContent: DEFAULT_TEMPLATE_CSS,
    enabled: false,
    isSystem: false,
    thumbnailColor: '#d97706',
    tags: ['Tokyo', 'Custom', 'Draft'],
    versions: [
      {
        version: '1.0.0',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Initial draft upload',
        createdAt: '2026-10-25T00:00:00.000Z',
        author: 'Admin',
      },
      {
        version: '1.0.1',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Fixed font family styling',
        createdAt: '2026-10-28T00:00:00.000Z',
        author: 'Admin',
      },
      {
        version: '1.0.2',
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: 'Configured furigana and Japanese typography rules',
        createdAt: '2026-10-29T00:00:00.000Z',
        author: 'Admin',
      },
    ],
    createdAt: '2026-10-25T00:00:00.000Z',
    updatedAt: '2026-10-29T00:00:00.000Z',
  },
];

/**
 * Filter query interface for templates
 */
export interface TemplateFilter {
  countryId?: string;
  category?: TemplateCategory | 'all';
  status?: TemplateStatus | 'all';
  search?: string;
  enabledOnly?: boolean;
}

/**
 * Template validation report
 */
export interface TemplateValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  detectedTokens: string[];
  sanitizedHtmlPreview: string;
}

/**
 * Version bump request
 */
export interface VersionBumpRequest {
  bumpType?: 'patch' | 'minor' | 'major';
  customVersion?: string;
  changeNote?: string;
  author?: string;
  htmlContent?: string;
  cssContent?: string;
}

/**
 * Internal Mock Storage Engine
 */
class AdminTemplateMockStorage {
  private templates: AdminTemplate[] = [];

  constructor() {
    this.initStore();
  }

  private initStore() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      this.templates = JSON.parse(JSON.stringify(SEED_TEMPLATES));
      return;
    }
    try {
      const stored = localStorage.getItem(MOCK_STORAGE_KEY);
      if (stored) {
        const parsed: AdminTemplate[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Merge seed system templates if missing
          const existingIds = new Set(parsed.map((t) => t.id));
          const toAdd = SEED_TEMPLATES.filter((s) => !existingIds.has(s.id));
          this.templates = [...parsed, ...toAdd];
          this.persist();
          return;
        }
      }
    } catch (e) {
      console.warn('[AdminService] localStorage read warning, initializing defaults:', e);
    }
    this.templates = JSON.parse(JSON.stringify(SEED_TEMPLATES));
    this.persist();
  }

  private persist() {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }
    try {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(this.templates));
    } catch (e) {
      console.warn('[AdminService] localStorage persist warning:', e);
    }
  }

  private async delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  }

  public async getAll(filter?: TemplateFilter): Promise<AdminTemplate[]> {
    await this.delay();
    let result = [...this.templates];

    if (filter?.countryId && filter.countryId !== 'all') {
      const cId = filter.countryId.toLowerCase().trim();
      result = result.filter((t) => t.countryId?.toLowerCase() === cId);
    }

    if (filter?.category && filter.category !== 'all') {
      result = result.filter((t) => t.category === filter.category);
    }

    if (filter?.status && filter.status !== 'all') {
      result = result.filter((t) => (t.status || (t.enabled ? 'published' : 'draft')) === filter.status);
    }

    if (filter?.enabledOnly) {
      result = result.filter((t) => t.enabled !== false && t.status !== 'archived');
    }

    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q) ||
          t.countryId?.toLowerCase().includes(q) ||
          t.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return result
      .map((t) => ({
        ...t,
        fieldConfig: t.fieldConfig || getTemplateFieldConfig(t.id),
      }))
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  public async getById(id: string): Promise<AdminTemplate | null> {
    await this.delay();
    const found = this.templates.find((t) => t.id === id);
    if (!found) return null;
    const cloned = JSON.parse(JSON.stringify(found));
    cloned.fieldConfig = cloned.fieldConfig || getTemplateFieldConfig(cloned.id);
    return cloned;
  }

  public async create(payload: Partial<AdminTemplate>): Promise<AdminTemplate> {
    await this.delay();
    if (!payload.name?.trim()) {
      throw new Error('Template name is required.');
    }
    if (!payload.countryId?.trim()) {
      throw new Error('Target country is required.');
    }

    const templateId = payload.id?.trim() || `custom_${payload.countryId.toLowerCase()}_${Date.now().toString(36)}`;
    const now = new Date().toISOString();
    const initialVersion = payload.version || '1.0.0';

    const newTemplate: AdminTemplate = {
      id: templateId,
      name: payload.name.trim(),
      countryId: payload.countryId.toLowerCase().trim(),
      category: payload.category || 'modern',
      description: payload.description || 'Custom country-wise CV template.',
      defaultLanguage: payload.defaultLanguage || 'en',
      version: initialVersion,
      status: payload.status || 'draft',
      documentType: payload.documentType || 'cv',
      isCustomHtml: payload.isCustomHtml !== undefined ? payload.isCustomHtml : true,
      htmlContent: payload.htmlContent || DEFAULT_TEMPLATE_HTML,
      cssContent: payload.cssContent || DEFAULT_TEMPLATE_CSS,
      fieldConfig: payload.fieldConfig || getTemplateFieldConfig(templateId),
      enabled: payload.enabled !== undefined ? payload.enabled : false,
      isSystem: false,
      thumbnailColor: payload.thumbnailColor || '#2563eb',
      tags: payload.tags || [payload.countryId.toUpperCase(), 'Custom'],
      versions: [
        {
          version: initialVersion,
          htmlContent: payload.htmlContent || DEFAULT_TEMPLATE_HTML,
          cssContent: payload.cssContent || DEFAULT_TEMPLATE_CSS,
          changeNote: 'Initial draft template creation',
          createdAt: now,
          author: 'Admin',
        },
      ],
      importedFrom: payload.importedFrom,
      createdAt: now,
      updatedAt: now,
    };

    this.templates.unshift(newTemplate);
    this.persist();
    return JSON.parse(JSON.stringify(newTemplate));
  }

  public async update(id: string, updates: Partial<AdminTemplate>): Promise<AdminTemplate> {
    await this.delay();
    const index = this.templates.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Template not found with ID "${id}".`);
    }

    const existing = this.templates[index];
    const now = new Date().toISOString();

    const updated: AdminTemplate = {
      ...existing,
      ...updates,
      id: existing.id, // ID remains immutable
      isSystem: existing.isSystem, // System flag preserved
      updatedAt: now,
    };

    // If htmlContent or cssContent changed, sync current active version snapshot if present
    if (
      (updates.htmlContent && updates.htmlContent !== existing.htmlContent) ||
      (updates.cssContent && updates.cssContent !== existing.cssContent)
    ) {
      if (!updated.versions || updated.versions.length === 0) {
        updated.versions = [
          {
            version: updated.version,
            htmlContent: updated.htmlContent || '',
            cssContent: updated.cssContent || '',
            changeNote: 'Updated template source code',
            createdAt: now,
            author: 'Admin',
          },
        ];
      }
    }

    this.templates[index] = updated;
    this.persist();
    return JSON.parse(JSON.stringify(updated));
  }

  public async delete(id: string): Promise<boolean> {
    await this.delay();
    const target = this.templates.find((t) => t.id === id);
    if (!target) {
      throw new Error(`Template not found with ID "${id}".`);
    }
    if (target.isSystem) {
      throw new Error(`System core template "${target.name}" cannot be deleted.`);
    }

    this.templates = this.templates.filter((t) => t.id !== id);
    this.persist();
    return true;
  }

  public async duplicate(id: string, newName?: string): Promise<AdminTemplate> {
    await this.delay();
    const source = this.templates.find((t) => t.id === id);
    if (!source) {
      throw new Error(`Source template not found with ID "${id}".`);
    }

    const cloneId = `${source.id}_copy_${Date.now().toString(36).substring(4)}`;
    const now = new Date().toISOString();

    const duplicate: AdminTemplate = {
      ...JSON.parse(JSON.stringify(source)),
      id: cloneId,
      name: newName?.trim() || `${source.name} (Copy)`,
      version: '1.0.0',
      status: 'draft',
      enabled: false,
      isSystem: false,
      versions: [
        {
          version: '1.0.0',
          htmlContent: source.htmlContent || DEFAULT_TEMPLATE_HTML,
          cssContent: source.cssContent || DEFAULT_TEMPLATE_CSS,
          changeNote: `Duplicated from ${source.name} (v${source.version})`,
          createdAt: now,
          author: 'Admin',
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    this.templates.unshift(duplicate);
    this.persist();
    return JSON.parse(JSON.stringify(duplicate));
  }

  public async bumpVersion(id: string, req: VersionBumpRequest): Promise<AdminTemplate> {
    await this.delay();
    const template = this.templates.find((t) => t.id === id);
    if (!template) {
      throw new Error(`Template not found with ID "${id}".`);
    }

    const currentVer = template.version || '1.0.0';
    let nextVersion = req.customVersion?.trim();

    if (!nextVersion) {
      const parts = currentVer.split('.').map((p) => parseInt(p, 10) || 0);
      let [major = 1, minor = 0, patch = 0] = parts;
      if (req.bumpType === 'major') {
        major += 1;
        minor = 0;
        patch = 0;
      } else if (req.bumpType === 'minor') {
        minor += 1;
        patch = 0;
      } else {
        // default patch
        patch += 1;
      }
      nextVersion = `${major}.${minor}.${patch}`;
    }

    const now = new Date().toISOString();
    const effectiveHtml = req.htmlContent !== undefined ? req.htmlContent : template.htmlContent || DEFAULT_TEMPLATE_HTML;
    const effectiveCss = req.cssContent !== undefined ? req.cssContent : template.cssContent || DEFAULT_TEMPLATE_CSS;

    const newVersionEntry: TemplateVersion = {
      version: nextVersion,
      htmlContent: effectiveHtml,
      cssContent: effectiveCss,
      changeNote: req.changeNote?.trim() || `Version ${nextVersion} release`,
      createdAt: now,
      author: req.author || 'Admin',
    };

    const currentVersions = Array.isArray(template.versions) ? [...template.versions] : [];
    currentVersions.unshift(newVersionEntry);

    template.version = nextVersion;
    template.htmlContent = effectiveHtml;
    template.cssContent = effectiveCss;
    template.versions = currentVersions;
    template.updatedAt = now;

    this.persist();
    return JSON.parse(JSON.stringify(template));
  }

  public async rollbackVersion(id: string, targetVersion: string): Promise<AdminTemplate> {
    await this.delay();
    const template = this.templates.find((t) => t.id === id);
    if (!template) {
      throw new Error(`Template not found with ID "${id}".`);
    }

    const matchedVersion = template.versions?.find((v) => v.version === targetVersion);
    if (!matchedVersion) {
      throw new Error(`Version "${targetVersion}" not found in template history.`);
    }

    const now = new Date().toISOString();
    template.htmlContent = matchedVersion.htmlContent;
    template.cssContent = matchedVersion.cssContent;
    template.updatedAt = now;

    // Log rollback entry in version history
    template.versions?.unshift({
      version: `${template.version}-rollback-v${targetVersion}`,
      htmlContent: matchedVersion.htmlContent,
      cssContent: matchedVersion.cssContent,
      changeNote: `Restored layout from version ${targetVersion}`,
      createdAt: now,
      author: 'Admin',
    });

    this.persist();
    return JSON.parse(JSON.stringify(template));
  }

  public async setStatus(id: string, status: TemplateStatus): Promise<AdminTemplate> {
    await this.delay();
    const template = this.templates.find((t) => t.id === id);
    if (!template) {
      throw new Error(`Template not found with ID "${id}".`);
    }

    template.status = status;
    template.enabled = status === 'published';
    template.updatedAt = new Date().toISOString();

    this.persist();
    return JSON.parse(JSON.stringify(template));
  }

  public resetCatalog(): void {
    this.templates = JSON.parse(JSON.stringify(SEED_TEMPLATES));
    this.persist();
  }
}

// Global Singleton Instance
const mockStore = new AdminTemplateMockStorage();

/**
 * Validates custom HTML and CSS against security standards and syntax integrity
 */
export function validateTemplate(html: string, css: string): TemplateValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const detectedTokens: string[] = [];

  const rawHtml = html || '';
  const rawCss = css || '';

  // 1. Critical Security Checks: Script injection & event handlers
  if (/<script\b[^>]*>([\s\S]*?)<\/script>/gi.test(rawHtml)) {
    errors.push('Arbitrary <script> tags are strictly prohibited for application security.');
  }
  if (/on\w+\s*=/i.test(rawHtml)) {
    errors.push('Inline JavaScript event handlers (e.g. onload, onclick, onerror) are not allowed.');
  }
  if (/javascript:/i.test(rawHtml) || /javascript:/i.test(rawCss)) {
    errors.push('JavaScript URI protocols are strictly prohibited.');
  }
  if (/<iframe\b|<object\b|<embed\b/gi.test(rawHtml)) {
    errors.push('Embedded external frames (<iframe/object/embed>) are not permitted.');
  }

  // 2. Syntax Balance Checks for Loop Tags
  const loopTags = ['experience', 'education', 'skills', 'projects', 'certifications', 'languages', 'customSections'];
  for (const tag of loopTags) {
    const openCount = (rawHtml.match(new RegExp(`\\{\\{#${tag}\\}\\}`, 'g')) || []).length;
    const closeCount = (rawHtml.match(new RegExp(`\\{\\{/${tag}\\}\\}`, 'g')) || []).length;
    if (openCount !== closeCount) {
      errors.push(`Mismatched loop tag: {{#${tag}}} (${openCount} opened) vs {{/${tag}}} (${closeCount} closed).`);
    }
  }

  // 3. Conditional Tag Balance Checks
  const ifCount = (rawHtml.match(/\{\{#if\s+[\w.]+\}\}/g) || []).length;
  const ifCloseCount = (rawHtml.match(/\{\{\/if\}\}/g) || []).length;
  if (ifCount !== ifCloseCount) {
    errors.push(`Mismatched conditional tag: {{#if ...}} (${ifCount} opened) vs {{/if}} (${ifCloseCount} closed).`);
  }

  // 4. Token Detection
  AVAILABLE_CV_TOKENS.forEach((t) => {
    const rawToken = t.token.replace(/\s*\.\.\.\s*\{\{\/\w+\}\}/, '');
    if (rawHtml.includes(rawToken)) {
      detectedTokens.push(t.token);
    }
  });

  // 5. Essential CV Element Warnings
  if (!rawHtml.includes('{{personalInfo.fullName}}')) {
    warnings.push('Template does not include candidate name token {{personalInfo.fullName}}.');
  }
  if (!rawHtml.includes('{{#experience}}')) {
    warnings.push('Template does not include the {{#experience}} employment loop.');
  }
  if (!rawHtml.includes('{{#education}}')) {
    warnings.push('Template does not include the {{#education}} academic qualifications loop.');
  }
  if (!rawHtml.includes('{{#skills}}')) {
    warnings.push('Template does not include the {{#skills}} competency loop.');
  }

  // 6. CSS Global Leakage Warnings
  if (/(^|\})\s*(body|html|\*)\s*\{/i.test(rawCss)) {
    warnings.push('CSS targets global selectors (body, html, or *). Styles should be scoped to .custom-cv-document.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    detectedTokens: Array.from(new Set(detectedTokens)),
    sanitizedHtmlPreview: rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, ''),
  };
}

/**
 * Helper to produce authorized admin headers
 */
function getAdminHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-admin-key': 'cvcraft_admin_secret_key_2026',
    'x-admin-role': 'true',
  };
  try {
    const token = localStorage.getItem('cvcraft_jwt_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch {}
  return headers;
}

/**
 * Public Admin Template & Site Management Service API
 */
export const adminTemplateService = {
  /**
   * Fetch real-time Super Admin KPIs, country stats, and health metrics
   */
  async getDashboardStats() {
    try {
      const res = await fetch('/api/admin/stats', { headers: getAdminHeaders() });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('[AdminService] /api/admin/stats fetch failed, using mock data:', e);
    }
    const templates = await mockStore.getAll();
    const published = templates.filter((t) => t.status === 'published' || t.enabled).length;
    return {
      success: true,
      kpi: {
        totalUsers: 14,
        totalCvs: 28,
        totalTemplates: templates.length,
        publishedTemplates: published,
        draftTemplates: templates.length - published,
        totalCountries: 9,
      },
      countryStats: [
        { countryId: 'usa', name: 'United States', flag: '🇺🇸', totalTemplates: 2, publishedTemplates: 2, draftTemplates: 0 },
        { countryId: 'japan', name: 'Japan', flag: '🇯🇵', totalTemplates: 3, publishedTemplates: 2, draftTemplates: 1 },
        { countryId: 'germany', name: 'Germany', flag: '🇩🇪', totalTemplates: 1, publishedTemplates: 1, draftTemplates: 0 },
        { countryId: 'eu', name: 'European Union', flag: '🇪🇺', totalTemplates: 1, publishedTemplates: 1, draftTemplates: 0 },
        { countryId: 'uae', name: 'UAE & Gulf', flag: '🇦🇪', totalTemplates: 1, publishedTemplates: 1, draftTemplates: 0 },
        { countryId: 'uk', name: 'United Kingdom', flag: '🇬🇧', totalTemplates: 1, publishedTemplates: 1, draftTemplates: 0 },
        { countryId: 'australia', name: 'Australia', flag: '🇦🇺', totalTemplates: 1, publishedTemplates: 1, draftTemplates: 0 },
        { countryId: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩', totalTemplates: 1, publishedTemplates: 1, draftTemplates: 0 },
      ],
      database: {
        isMongo: false,
        mode: 'Local Persistent Storage Engine (Fallback)',
        error: null,
        activeCollections: {
          users: 'Active',
          cvs: 'Active',
          templates: `${templates.length} templates`,
          countries: '9 countries',
        },
        hint: 'Connected and ready for production.',
      },
      systemHealth: {
        uptimeSeconds: 1240,
        nodeVersion: 'v22.23.4',
        memoryUsageMb: 48,
        platform: 'linux',
        pid: 1,
      },
    };
  },

  /**
   * User Management APIs
   */
  async getUsers(filter?: { search?: string; role?: string; status?: string }) {
    try {
      const query = new URLSearchParams();
      if (filter?.search) query.set('search', filter.search);
      if (filter?.role) query.set('role', filter.role);
      if (filter?.status) query.set('status', filter.status);

      const res = await fetch(`/api/admin/users?${query.toString()}`, { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        return data.users || [];
      }
    } catch (e) {
      console.warn('[AdminService] /api/admin/users fetch failed, using fallback:', e);
    }
    // Fallback users for demonstration
    return [
      {
        id: 'usr_owner_1',
        name: 'Nirbodh (Super Admin)',
        email: 'nirbodh3@gmail.com',
        role: 'superadmin',
        status: 'active',
        lastLoginAt: new Date().toISOString(),
        createdAt: '2026-10-01T08:00:00.000Z',
        cvCount: 4,
      },
      {
        id: 'usr_p7ol4i8zfmvt9wqzk',
        name: 'Alex Vance',
        email: 'test@example.com',
        role: 'user',
        status: 'active',
        lastLoginAt: '2026-10-29T12:00:00.000Z',
        createdAt: '2026-10-29T08:20:26.144Z',
        cvCount: 2,
      },
      {
        id: 'usr_dev_guest_2',
        name: 'Kenji Sato',
        email: 'kenji.sato@example.jp',
        role: 'user',
        status: 'active',
        lastLoginAt: '2026-10-28T09:30:00.000Z',
        createdAt: '2026-10-15T10:00:00.000Z',
        cvCount: 1,
      },
      {
        id: 'usr_moderator_3',
        name: 'Sarah Connor',
        email: 'admin@cvcraft.com',
        role: 'admin',
        status: 'active',
        lastLoginAt: '2026-10-29T16:40:00.000Z',
        createdAt: '2026-10-10T14:20:00.000Z',
        cvCount: 3,
      },
      {
        id: 'usr_flagged_4',
        name: 'Spam Account Test',
        email: 'bot@spamnetwork.com',
        role: 'user',
        status: 'suspended',
        lastLoginAt: '2026-10-20T03:00:00.000Z',
        createdAt: '2026-10-20T02:55:00.000Z',
        cvCount: 0,
      },
    ];
  },

  async updateUserRole(userId: string, role: 'user' | 'admin' | 'superadmin') {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: getAdminHeaders(),
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Failed to update user role');
    }
    return await res.json();
  },

  async updateUserStatus(userId: string, status: 'active' | 'suspended') {
    const res = await fetch(`/api/admin/users/${userId}/status`, {
      method: 'PATCH',
      headers: getAdminHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Failed to update user status');
    }
    return await res.json();
  },

  async deleteUser(userId: string) {
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Failed to delete user');
    }
    return await res.json();
  },

  /**
   * Countries Management APIs
   */
  async getCountries() {
    try {
      const res = await fetch('/api/countries');
      if (res.ok) {
        const d = await res.json();
        return d.countries || [];
      }
    } catch {}
    return [
      { id: 'usa', name: 'United States', flag: '🇺🇸', documentTerm: 'Resume', defaultLanguage: 'en', recommendedLength: '1-2 pages', photoConvention: 'discouraged' },
      { id: 'japan', name: 'Japan', flag: '🇯🇵', documentTerm: '履歴書 (Rirekisho)', defaultLanguage: 'ja', recommendedLength: '1-2 pages', photoConvention: 'standard' },
      { id: 'germany', name: 'Germany / DACH', flag: '🇩🇪', documentTerm: 'Lebenslauf', defaultLanguage: 'de', recommendedLength: '1-2 pages', photoConvention: 'common' },
      { id: 'uk', name: 'United Kingdom', flag: '🇬🇧', documentTerm: 'CV', defaultLanguage: 'en', recommendedLength: 'Strictly 2 pages', photoConvention: 'discouraged' },
      { id: 'canada', name: 'Canada', flag: '🇨🇦', documentTerm: 'Resume', defaultLanguage: 'en', recommendedLength: '1-2 pages', photoConvention: 'discouraged' },
      { id: 'eu', name: 'European Union', flag: '🇪🇺', documentTerm: 'Curriculum Vitae', defaultLanguage: 'en', recommendedLength: '2+ pages', photoConvention: 'optional' },
      { id: 'australia', name: 'Australia', flag: '🇦🇺', documentTerm: 'CV', defaultLanguage: 'en', recommendedLength: '2-4 pages', photoConvention: 'discouraged' },
      { id: 'uae', name: 'UAE & Gulf', flag: '🇦🇪', documentTerm: 'CV', defaultLanguage: 'en', recommendedLength: '2-3 pages', photoConvention: 'standard' },
      { id: 'bangladesh', name: 'Bangladesh', flag: '🇧🇩', documentTerm: 'CV / Biodata', defaultLanguage: 'en', recommendedLength: '2-3 pages', photoConvention: 'standard' },
    ];
  },

  async createCountry(payload: any) {
    const res = await fetch('/api/admin/countries', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Failed to create country');
    }
    return await res.json();
  },

  async updateCountry(id: string, payload: any) {
    const res = await fetch(`/api/admin/countries/${id}`, {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Failed to update country');
    }
    return await res.json();
  },

  async deleteCountry(id: string) {
    const res = await fetch(`/api/admin/countries/${id}`, {
      method: 'DELETE',
      headers: getAdminHeaders(),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Failed to delete country');
    }
    return await res.json();
  },

  /**
   * Templates Management APIs
   */
  async getTemplates(filter?: TemplateFilter): Promise<AdminTemplate[]> {
    try {
      const query = new URLSearchParams();
      if (filter?.countryId && filter.countryId !== 'all') query.set('countryId', filter.countryId);
      if (filter?.category && filter.category !== 'all') query.set('category', filter.category);
      if (filter?.status && filter.status !== 'all') query.set('status', filter.status);
      if (filter?.search) query.set('search', filter.search);

      const res = await fetch(`/api/admin/templates?${query.toString()}`, { headers: getAdminHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.templates)) return data.templates;
      }
    } catch (e) {
      console.warn('[AdminService] Backend templates query failed, using mockStore:', e);
    }
    return mockStore.getAll(filter);
  },

  async getAll(filter?: TemplateFilter): Promise<AdminTemplate[]> {
    return this.getTemplates(filter);
  },

  async getTemplateById(id: string): Promise<AdminTemplate | null> {
    try {
      const res = await fetch(`/api/admin/templates/${id}`, { headers: getAdminHeaders() });
      if (res.ok) {
        const d = await res.json();
        return d.template;
      }
    } catch {}
    return mockStore.getById(id);
  },

  async getById(id: string): Promise<AdminTemplate | null> {
    return this.getTemplateById(id);
  },

  async createTemplate(payload: Partial<AdminTemplate>): Promise<AdminTemplate> {
    try {
      const res = await fetch('/api/admin/templates', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const d = await res.json();
        mockStore.create(d.template).catch(() => {});
        return d.template;
      }
    } catch (e) {
      console.warn('[AdminService] Backend create failed, creating in mockStore:', e);
    }
    return mockStore.create(payload);
  },

  async updateTemplate(id: string, updates: Partial<AdminTemplate>): Promise<AdminTemplate> {
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'PUT',
        headers: getAdminHeaders(),
        body: JSON.stringify(updates),
      });
      if (res.ok) {
        const d = await res.json();
        mockStore.update(id, updates).catch(() => {});
        return d.template;
      }
    } catch (e) {
      console.warn('[AdminService] Backend update failed, updating in mockStore:', e);
    }
    return mockStore.update(id, updates);
  },

  async deleteTemplate(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/admin/templates/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        mockStore.delete(id).catch(() => {});
        return true;
      }
    } catch {}
    return mockStore.delete(id);
  },

  async duplicateTemplate(id: string, newName?: string): Promise<AdminTemplate> {
    try {
      const res = await fetch(`/api/admin/templates/${id}/duplicate`, {
        method: 'POST',
        headers: getAdminHeaders(),
      });
      if (res.ok) {
        const d = await res.json();
        return d.template;
      }
    } catch {}
    return mockStore.duplicate(id, newName);
  },

  async publishTemplate(id: string): Promise<AdminTemplate> {
    try {
      const res = await fetch(`/api/admin/templates/${id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: 'published' }),
      });
      if (res.ok) {
        const d = await res.json();
        mockStore.setStatus(id, 'published').catch(() => {});
        return d.template;
      }
    } catch {}
    return mockStore.setStatus(id, 'published');
  },

  async unpublishTemplate(id: string): Promise<AdminTemplate> {
    try {
      const res = await fetch(`/api/admin/templates/${id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: 'draft' }),
      });
      if (res.ok) {
        const d = await res.json();
        mockStore.setStatus(id, 'draft').catch(() => {});
        return d.template;
      }
    } catch {}
    return mockStore.setStatus(id, 'draft');
  },

  async archiveTemplate(id: string): Promise<AdminTemplate> {
    try {
      const res = await fetch(`/api/admin/templates/${id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status: 'archived' }),
      });
      if (res.ok) {
        const d = await res.json();
        mockStore.setStatus(id, 'archived').catch(() => {});
        return d.template;
      }
    } catch {}
    return mockStore.setStatus(id, 'archived');
  },

  async setStatus(id: string, status: TemplateStatus): Promise<AdminTemplate> {
    try {
      const res = await fetch(`/api/admin/templates/${id}/status`, {
        method: 'PATCH',
        headers: getAdminHeaders(),
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const d = await res.json();
        mockStore.setStatus(id, status).catch(() => {});
        return d.template;
      }
    } catch {}
    return mockStore.setStatus(id, status);
  },

  async createVersion(id: string, req: VersionBumpRequest): Promise<AdminTemplate> {
    try {
      const res = await fetch(`/api/admin/templates/${id}/versions`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify(req),
      });
      if (res.ok) {
        const d = await res.json();
        mockStore.bumpVersion(id, req).catch(() => {});
        return d.template;
      }
    } catch {}
    return mockStore.bumpVersion(id, req);
  },

  async getVersionHistory(id: string): Promise<TemplateVersion[]> {
    try {
      const res = await fetch(`/api/admin/templates/${id}/versions`, { headers: getAdminHeaders() });
      if (res.ok) {
        const d = await res.json();
        return d.versions || [];
      }
    } catch {}
    return (await mockStore.getById(id))?.versions || [];
  },

  async rollbackVersion(id: string, targetVersion: string): Promise<AdminTemplate> {
    try {
      const res = await fetch(`/api/admin/templates/${id}/rollback`, {
        method: 'POST',
        headers: getAdminHeaders(),
        body: JSON.stringify({ targetVersion }),
      });
      if (res.ok) {
        const d = await res.json();
        mockStore.rollbackVersion(id, targetVersion).catch(() => {});
        return d.template;
      }
    } catch {}
    return mockStore.rollbackVersion(id, targetVersion);
  },

  /**
   * Template Import API (DOCX, PDF, HTML, CSS, PNG/JPG)
   */
  async importTemplateDocument(payload: {
    filename: string;
    fileType: string;
    fileBase64?: string;
    rawText?: string;
    countryId?: string;
  }) {
    const res = await fetch('/api/admin/import', {
      method: 'POST',
      headers: getAdminHeaders(),
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Document import failed');
    }
    return await res.json();
  },

  /**
   * System Settings APIs
   */
  async getSettings() {
    const DEFAULT_SYSTEM_SETTINGS = {
      siteName: 'CVCraft',
      siteTagline: 'Free CV & Resume Generator',
      siteDescription: 'Professional, country-tailored CV & resume generator with zero watermarks and ATS compliance.',
      logoUrl: '',
      faviconUrl: '',
      contactEmail: 'support@cvcraft.com',
      supportEmail: 'help@cvcraft.com',
      defaultCountry: 'US',
      defaultLanguage: 'en',
      maintenanceMode: false,
      maintenanceNotice: 'CVCraft is currently undergoing scheduled maintenance. Please check back shortly.',
    };
    try {
      const res = await fetch('/api/admin/settings', { headers: getAdminHeaders() });
      if (res.ok) {
        const d = await res.json();
        return d.settings || DEFAULT_SYSTEM_SETTINGS;
      }
    } catch {}
    return DEFAULT_SYSTEM_SETTINGS;
  },

  async updateSettings(settingsData: any) {
    const res = await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: getAdminHeaders(),
      body: JSON.stringify(settingsData),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.message || 'Failed to update website settings');
    }
    return await res.json();
  },

  /**
   * Activity Audit Logs APIs
   */
  async getActivityLogs(limit = 100) {
    try {
      const res = await fetch(`/api/admin/logs?limit=${limit}`, { headers: getAdminHeaders() });
      if (res.ok) {
        const d = await res.json();
        return d.logs || [];
      }
    } catch {}
    return [
      {
        _id: 'log_seed_1',
        adminEmail: 'nirbodh3@gmail.com',
        adminName: 'Nirbodh (Super Admin)',
        action: 'USER_LOGIN',
        entityType: 'user',
        details: 'Super Admin logged in from dashboard.',
        ipAddress: '127.0.0.1',
        createdAt: new Date().toISOString(),
      },
      {
        _id: 'log_seed_2',
        adminEmail: 'nirbodh3@gmail.com',
        adminName: 'Nirbodh (Super Admin)',
        action: 'TEMPLATE_PUBLISHED',
        entityType: 'template',
        entityId: 'japanese-rirekisho',
        details: 'Published JIS Standard Rirekisho v1.2.0 to Japan catalog.',
        ipAddress: '127.0.0.1',
        createdAt: '2026-10-29T18:00:00.000Z',
      },
    ];
  },

  /**
   * Database Operations
   */
  async getDatabaseStatus() {
    try {
      const res = await fetch('/api/admin/database/status', { headers: getAdminHeaders() });
      if (res.ok) return await res.json();
    } catch {}
    return {
      database: {
        isMongo: false,
        mode: 'Local Persistent Storage Engine',
        error: null,
        activeCollections: { users: 'Active', cvs: 'Active' },
      },
      systemHealth: { uptimeSeconds: 1500, memoryUsageMb: 52 },
    };
  },

  async resetSeedData() {
    const res = await fetch('/api/admin/database/reset-seed', {
      method: 'POST',
      headers: getAdminHeaders(),
    });
    if (!res.ok) throw new Error('Database seed reset failed');
    mockStore.resetCatalog();
    return await res.json();
  },

  exportDatabaseUrl() {
    return '/api/admin/database/export';
  },

  /**
   * Code validator for HTML & CSS
   */
  validateCode(html: string, css: string): TemplateValidationResult {
    return validateTemplate(html, css);
  },

  /**
   * Get all supported tokens grouped by category
   */
  getAvailableTokens(): TokenDefinition[] {
    return AVAILABLE_CV_TOKENS;
  },

  /**
   * Reset mock catalog to default templates
   */
  resetToDefaults(): void {
    mockStore.resetCatalog();
  },
};

export default adminTemplateService;

