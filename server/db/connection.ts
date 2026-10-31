import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { UserModel, type IUser } from '../models/User.ts';
import { CVModel, type ICV } from '../models/CV.ts';
import { TemplateModel, type ITemplate } from '../models/Template.ts';
import { CountryModel, type ICountry } from '../models/Country.ts';
import { ActivityLogModel, type IActivityLog } from '../models/ActivityLog.ts';
import { SystemSettingsModel, type ISystemSettings } from '../models/SystemSettings.ts';

let mongoConnected = false;
let mongoError: string | null = null;
const DATA_DIR = path.resolve(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'cvcraft_store.json');

// Interface for local storage fallback
interface LocalStore {
  users: Array<{
    _id: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: 'user' | 'admin' | 'superadmin';
    status?: 'active' | 'suspended';
    lastLoginAt?: string;
    createdAt: string;
  }>;
  cvs: Array<any>;
  countries: Array<any>;
  templates: Array<any>;
  activityLogs: Array<any>;
  systemSettings: any;
}

export const SEED_COUNTRIES = [
  {
    id: 'usa',
    name: 'United States',
    flag: '🇺🇸',
    documentTerm: 'Resume',
    defaultLanguage: 'en',
    recommendedLength: '1 page (early/mid-career) or 2 pages (10+ years)',
    photoConvention: 'discouraged',
    photoExplanation: 'Photos are discouraged in the US due to EEOC anti-discrimination regulations.',
    atsGuidance: 'High ATS priority. Single-column layouts ensure 100% parse rates.',
    enabled: true,
  },
  {
    id: 'canada',
    name: 'Canada',
    flag: '🇨🇦',
    documentTerm: 'Resume',
    defaultLanguage: 'en',
    recommendedLength: '1 to 2 pages maximum',
    photoConvention: 'discouraged',
    photoExplanation: 'Photos are typically omitted in Canada to comply with human rights standards.',
    atsGuidance: 'Clean bullet hierarchy is paramount for Taleo, Workday, and BambooHR.',
    enabled: true,
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    flag: '🇬🇧',
    documentTerm: 'CV',
    defaultLanguage: 'en',
    recommendedLength: 'Strictly 2 pages standard',
    photoConvention: 'discouraged',
    photoExplanation: 'UK recruiters discourage photos under UK Equality Act 2010 regulations.',
    atsGuidance: 'Standard British headings: "Personal Profile", "Employment History".',
    enabled: true,
  },
  {
    id: 'germany',
    name: 'Germany / DACH',
    flag: '🇩🇪',
    documentTerm: 'Lebenslauf',
    defaultLanguage: 'de',
    recommendedLength: '1 to 2 pages (tabular format)',
    photoConvention: 'common',
    photoExplanation: 'A professional headshot (Bewerbungsfoto) is traditional in Germany.',
    atsGuidance: 'Clear table-like tabular structure with distinct date columns.',
    enabled: true,
  },
  {
    id: 'eu',
    name: 'European Union / Europass',
    flag: '🇪🇺',
    documentTerm: 'Curriculum Vitae',
    defaultLanguage: 'en',
    recommendedLength: '2 or more pages',
    photoConvention: 'optional',
    photoExplanation: 'Photos are accepted across continental Europe, though optional.',
    atsGuidance: 'Recognized by EU-wide job portals including EURES.',
    enabled: true,
  },
  {
    id: 'australia',
    name: 'Australia',
    flag: '🇦🇺',
    documentTerm: 'CV',
    defaultLanguage: 'en',
    recommendedLength: '2 to 4 pages',
    photoConvention: 'discouraged',
    photoExplanation: 'Australian employers prefer no photo to align with fair work practices.',
    atsGuidance: 'Strong ATS emphasis on explicit skill keywords mapped directly to the PD.',
    enabled: true,
  },
  {
    id: 'uae',
    name: 'UAE & Gulf Region',
    flag: '🇦🇪',
    documentTerm: 'CV',
    defaultLanguage: 'en',
    recommendedLength: '2 to 3 pages',
    photoConvention: 'standard',
    photoExplanation: 'A crisp professional headshot in business attire is customary in the Gulf.',
    atsGuidance: 'Leading GCC enterprises use Taleo, SAP SuccessFactors, and Bayt.',
    enabled: true,
  },
  {
    id: 'bangladesh',
    name: 'Bangladesh',
    flag: '🇧🇩',
    documentTerm: 'CV / Biodata',
    defaultLanguage: 'en',
    recommendedLength: '2 to 3 pages',
    photoConvention: 'standard',
    photoExplanation: 'A formal passport-size photo is standard convention for corporate & bank CVs.',
    atsGuidance: 'Standard headings: Career Objective, Experience, Education, Referees.',
    enabled: true,
  },
  {
    id: 'japan',
    name: 'Japan',
    flag: '🇯🇵',
    documentTerm: '履歴書 (Rirekisho)',
    defaultLanguage: 'ja',
    recommendedLength: '1 to 2 pages (Standard JIS Japanese format)',
    photoConvention: 'standard',
    photoExplanation: 'A formal 30mm x 40mm studio photo (スーツ着用 証明写真) is strictly required.',
    atsGuidance: 'Japanese employers parse structured chronological tables and Furigana headers.',
    enabled: true,
  },
];

export const SEED_TEMPLATES = [
  {
    id: 'japanese-rirekisho',
    name: 'JIS Standard Rirekisho (履歴書)',
    countryId: 'japan',
    category: 'traditional',
    description: 'Official Japanese standard JIS Rirekisho with Furigana (ふりがな), 30x40mm photo frame, chronological Education & Work grid ending with 以上, licenses, and Self-PR.',
    defaultLanguage: 'ja',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#0f766e',
    tags: ['JIS', 'Furigana', 'Japan', 'Official'],
  },
  {
    id: 'japanese-shokumu',
    name: 'Japanese Shokumu Keirekisho (職務経歴書)',
    countryId: 'japan',
    category: 'executive',
    description: 'Detailed Japanese career progression document detailing project responsibilities, team sizes, and technical stack.',
    defaultLanguage: 'ja',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#1e3a8a',
    tags: ['Japan', 'Mid-Career', 'Technical'],
  },
  {
    id: 'ats',
    name: 'Clean ATS Standard',
    countryId: 'usa',
    category: 'ats',
    description: 'High-parse single column layout optimized for Greenhouse, Workday, and Taleo.',
    defaultLanguage: 'en',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#2563eb',
    tags: ['ATS-Friendly', 'Single Column', 'USA'],
  },
  {
    id: 'modern',
    name: 'Modern Executive',
    countryId: 'usa',
    category: 'modern',
    description: 'Clean modern layout with subtle accents and strong typography.',
    defaultLanguage: 'en',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#1d4ed8',
    tags: ['Modern', 'Corporate', 'USA'],
  },
  {
    id: 'classic',
    name: 'European Academic & Classic',
    countryId: 'germany',
    category: 'classic',
    description: 'Structured serif layout with distinct date columns, ideal for German Lebenslauf and European institutions.',
    defaultLanguage: 'de',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#831843',
    tags: ['Academic', 'Tabular', 'Germany'],
  },
  {
    id: 'minimal',
    name: 'Nordic Minimalist',
    countryId: 'eu',
    category: 'minimal',
    description: 'Crisp whitespace and understated typographic scale.',
    defaultLanguage: 'en',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#18181b',
    tags: ['Minimalist', 'EU'],
  },
  {
    id: 'executive',
    name: 'Gulf & Global Executive',
    countryId: 'uae',
    category: 'executive',
    description: 'Executive banner with corporate badges, ideal for leadership profiles in UAE and multinational roles.',
    defaultLanguage: 'en',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#b45309',
    tags: ['Executive', 'Photo', 'UAE'],
  },
  {
    id: 'creative',
    name: 'Designer & Portfolio',
    countryId: 'uk',
    category: 'creative',
    description: 'Dynamic two-column sidebar layout for creative agencies and tech startups.',
    defaultLanguage: 'en',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#059669',
    tags: ['Creative', 'Portfolio', 'UK'],
  },
  {
    id: 'technical',
    name: 'Systems Engineer Tech',
    countryId: 'australia',
    category: 'technical',
    description: 'Data-dense grid highlighting core tech stacks, cloud certifications, and project links.',
    defaultLanguage: 'en',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#0891b2',
    tags: ['Tech', 'Engineering', 'Australia'],
  },
  {
    id: 'bangladesh_corporate',
    name: 'Bangladesh Corporate & Bank Biodata',
    countryId: 'bangladesh',
    category: 'classic',
    description: 'Comprehensive biodata layout including permanent address, father/mother name, religion, blood group, and references.',
    defaultLanguage: 'en',
    version: '1.0.0',
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: '#166534',
    tags: ['Biodata', 'Corporate', 'Bangladesh'],
  },
];

export const DEFAULT_SYSTEM_SETTINGS = {
  siteName: 'CVCraft',
  siteTagline: 'Free Professional CV & Resume Generator',
  siteDescription:
    'Build professional, ATS-friendly CVs and resumes for free. Import documents, customize 5+ designer templates, use the deterministic writing engine, and export print-ready A4 PDFs without watermarks.',
  logoUrl: '',
  faviconUrl: '',
  contactEmail: 'support@cvcraft.com',
  supportEmail: 'admin@cvcraft.com',
  defaultCountry: 'usa',
  defaultLanguage: 'en',
  maintenanceMode: false,
  maintenanceNotice: 'CVCraft is currently undergoing scheduled system optimization. Normal service will resume shortly.',
  allowPublicRegistration: true,
  maxUploadSizeBytes: 10485760,
  updatedAt: new Date().toISOString(),
};

let memoryStore: LocalStore = {
  users: [],
  cvs: [],
  countries: [...SEED_COUNTRIES],
  templates: [...SEED_TEMPLATES],
  activityLogs: [],
  systemSettings: { ...DEFAULT_SYSTEM_SETTINGS },
};

// Initialize fallback storage
function initLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const loaded = JSON.parse(content);
      memoryStore = {
        users: loaded.users || [],
        cvs: loaded.cvs || [],
        countries: loaded.countries && loaded.countries.length > 0 ? loaded.countries : [...SEED_COUNTRIES],
        templates: loaded.templates && loaded.templates.length > 0 ? loaded.templates : [...SEED_TEMPLATES],
        activityLogs: loaded.activityLogs || [],
        systemSettings: loaded.systemSettings || { ...DEFAULT_SYSTEM_SETTINGS },
      };
      // Ensure seed countries and templates are present
      SEED_COUNTRIES.forEach((c) => {
        if (!memoryStore.countries.some((item) => item.id === c.id)) {
          memoryStore.countries.push(c);
        }
      });
      SEED_TEMPLATES.forEach((t) => {
        if (!memoryStore.templates.some((item) => item.id === t.id)) {
          memoryStore.templates.push(t);
        }
      });
      persistLocalStore();
    } else {
      fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2));
    }
  } catch (err: any) {
    console.warn('[DB] Local store init warning, using in-memory fallback:', err?.message);
  }
}

function persistLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2));
  } catch (err: any) {
    console.warn('[DB] Local store persist warning:', err?.message);
  }
}

async function seedMongoIfEmpty() {
  try {
    const countryCount = await CountryModel.countDocuments();
    if (countryCount === 0) {
      console.log('[DB] Seeding default countries into MongoDB Atlas...');
      for (const country of SEED_COUNTRIES) {
        await CountryModel.findOneAndUpdate({ id: country.id }, country, { upsert: true });
      }
    }
    const templateCount = await TemplateModel.countDocuments();
    if (templateCount === 0) {
      console.log('[DB] Seeding default templates into MongoDB Atlas...');
      for (const tpl of SEED_TEMPLATES) {
        await TemplateModel.findOneAndUpdate({ id: tpl.id }, tpl, { upsert: true });
      }
    }
  } catch (err: any) {
    console.warn('[DB] Seed error (non-fatal):', err?.message);
  }
}

export async function connectDatabase() {
  initLocalStore();

  const uri = process.env.MONGODB_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  if (!uri) {
    if (isProduction) {
      console.warn('========================================================================');
      console.warn('[CRITICAL PRODUCTION DATABASE WARNING]');
      console.warn('MONGODB_URI is not set in your Render environment variables!');
      console.warn('Render uses an ephemeral filesystem that resets on every spin-down.');
      console.warn('Any user accounts or CVs saved to disk WILL BE LOST upon container restart.');
      console.warn('Please add MONGODB_URI (MongoDB Atlas free tier M0) in Render dashboard.');
      console.warn('========================================================================');
    } else {
      console.log('[DB] No MONGODB_URI detected in environment. Running with local persistent data engine.');
    }
    mongoConnected = false;
    mongoError = isProduction
      ? 'MONGODB_URI not set. Running on ephemeral storage. Connect MongoDB Atlas to ensure persistent data across Render restarts.'
      : 'No MONGODB_URI configured. Running in local zero-config persistent mode.';
    return;
  }

  try {
    // Setup connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error('[MongoDB Error]:', err?.message || err);
      mongoError = err?.message || 'MongoDB connection error';
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[MongoDB Atlas Disconnected]: Attempting automatic reconnection...');
      mongoConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[MongoDB Atlas Reconnected]: Resilient connection restored.');
      mongoConnected = true;
      mongoError = null;
    });

    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    });

    mongoConnected = true;
    mongoError = null;
    console.log('✅ [DB] Successfully connected to MongoDB Atlas production cluster.');
    await seedMongoIfEmpty();
  } catch (err: any) {
    mongoConnected = false;
    mongoError = err?.message || 'MongoDB connection failed';
    console.error('❌ [DB] Failed to connect to MongoDB Atlas:', mongoError);
    if (isProduction) {
      console.warn('[DB Warning] In production, database connection failure will cause data loss upon server restart.');
    }
    console.log('[DB] Seamlessly failing over to local persistent data engine.');
  }
}

export function getDbStatus() {
  return {
    isMongo: mongoConnected,
    mode: mongoConnected ? 'MongoDB Atlas (Mongoose)' : 'Local Persistent Engine (Active Fallback)',
    error: mongoError,
    activeCollections: {
      users: mongoConnected ? 'MongoDB: users' : `${memoryStore.users.length} users in local store`,
      cvs: mongoConnected ? 'MongoDB: cvs' : `${memoryStore.cvs.length} cvs in local store`,
      countries: mongoConnected ? 'MongoDB: countries' : `${memoryStore.countries.length} countries in local store`,
      templates: mongoConnected ? 'MongoDB: templates' : `${memoryStore.templates.length} templates in local store`,
    },
    hint: !mongoConnected
      ? (process.env.NODE_ENV === 'production'
          ? 'URGENT: Add MONGODB_URI in Render dashboard. Ephemeral disk resets on spin-down.'
          : 'To connect real MongoDB Atlas Free: Set MONGODB_URI in your environment.')
      : 'Connected to MongoDB Atlas and ready for production.',
  };
}

// Unified Database Repository Layer
export const dbRepository = {
  // USER METHODS
  async findUserByEmail(email: string) {
    const normalized = email.toLowerCase().trim();
    if (mongoConnected) {
      return await UserModel.findOne({ email: normalized });
    }
    const found = memoryStore.users.find((u) => u.email.toLowerCase() === normalized);
    return found ? { ...found } : null;
  },

  async findUserById(id: string) {
    if (mongoConnected) {
      return await UserModel.findById(id).select('-passwordHash');
    }
    const found = memoryStore.users.find((u) => u._id === id);
    if (!found) return null;
    const { passwordHash, ...rest } = found;
    return rest;
  },

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    role?: 'user' | 'admin' | 'superadmin';
    status?: 'active' | 'suspended';
  }) {
    const role = data.role || 'user';
    const status = data.status || 'active';

    if (mongoConnected) {
      const doc = new UserModel({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        role,
        status,
      });
      return await doc.save();
    }
    const newUser = {
      _id: 'usr_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      role,
      status,
      lastLoginAt: undefined,
      createdAt: new Date().toISOString(),
    };
    memoryStore.users.push(newUser);
    persistLocalStore();
    return newUser;
  },

  async updateUserLastLogin(userId: string) {
    const now = new Date();
    if (mongoConnected) {
      await UserModel.findByIdAndUpdate(userId, { lastLoginAt: now });
      return;
    }
    const user = memoryStore.users.find((u) => u._id === userId);
    if (user) {
      user.lastLoginAt = now.toISOString();
      persistLocalStore();
    }
  },

  async getUsers(filter?: { search?: string; role?: string; status?: string }) {
    if (mongoConnected) {
      const query: any = {};
      if (filter?.role && filter.role !== 'all') {
        query.role = filter.role;
      }
      if (filter?.status && filter.status !== 'all') {
        query.status = filter.status;
      }
      if (filter?.search && filter.search.trim()) {
        const regex = new RegExp(filter.search.trim(), 'i');
        query.$or = [{ name: regex }, { email: regex }];
      }
      return await UserModel.find(query).select('-passwordHash').sort({ createdAt: -1 });
    }

    let list = memoryStore.users.map(({ passwordHash, ...rest }) => rest);

    if (filter?.role && filter.role !== 'all') {
      list = list.filter((u) => (u.role || 'user') === filter.role);
    }
    if (filter?.status && filter.status !== 'all') {
      list = list.filter((u) => (u.status || 'active') === filter.status);
    }
    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  async updateUserRole(userId: string, role: 'user' | 'admin' | 'superadmin') {
    if (mongoConnected) {
      return await UserModel.findByIdAndUpdate(userId, { role }, { new: true }).select('-passwordHash');
    }
    const idx = memoryStore.users.findIndex((u) => u._id === userId);
    if (idx === -1) return null;
    memoryStore.users[idx].role = role;
    persistLocalStore();
    const { passwordHash, ...rest } = memoryStore.users[idx];
    return rest;
  },

  async updateUserStatus(userId: string, status: 'active' | 'suspended') {
    if (mongoConnected) {
      return await UserModel.findByIdAndUpdate(userId, { status }, { new: true }).select('-passwordHash');
    }
    const idx = memoryStore.users.findIndex((u) => u._id === userId);
    if (idx === -1) return null;
    memoryStore.users[idx].status = status;
    persistLocalStore();
    const { passwordHash, ...rest } = memoryStore.users[idx];
    return rest;
  },

  async deleteUser(userId: string) {
    if (mongoConnected) {
      // Cascade delete user's CVs as well
      await CVModel.deleteMany({ userId });
      const res = await UserModel.findByIdAndDelete(userId);
      return !!res;
    }
    const initLen = memoryStore.users.length;
    memoryStore.users = memoryStore.users.filter((u) => u._id !== userId);
    memoryStore.cvs = memoryStore.cvs.filter((c) => c.userId !== userId);
    const deleted = memoryStore.users.length < initLen;
    if (deleted) persistLocalStore();
    return deleted;
  },

  // CV METHODS (with strict user isolation)
  async getCvsByUser(userId: string) {
    if (mongoConnected) {
      return await CVModel.find({ userId }).sort({ updatedAt: -1 });
    }
    return memoryStore.cvs
      .filter((cv) => cv.userId === userId)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },

  async getCvByIdAndUser(id: string, userId: string) {
    if (mongoConnected) {
      return await CVModel.findOne({ _id: id, userId });
    }
    return memoryStore.cvs.find((cv) => cv._id === id && cv.userId === userId) || null;
  },

  async createCv(userId: string, cvData: Partial<ICV>) {
    if (mongoConnected) {
      const doc = new CVModel({
        ...cvData,
        userId,
      });
      return await doc.save();
    }
    const newCv = {
      _id: 'cv_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      userId,
      title: cvData.title || 'Untitled CV',
      countryId: (cvData as any).countryId || 'usa',
      templateId: cvData.templateId || 'modern',
      themeColor: cvData.themeColor || '#2563eb',
      fontFamily: cvData.fontFamily || 'sans',
      spacing: cvData.spacing || 'normal',
      fontSize: (cvData as any).fontSize || 'normal',
      margins: (cvData as any).margins || 'normal',
      customHeadings: (cvData as any).customHeadings || {},
      sectionOrder: cvData.sectionOrder || [
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
      sectionVisibility: cvData.sectionVisibility || {
        personalInfo: true,
        summary: true,
        experience: true,
        education: true,
        skills: true,
        projects: true,
        certifications: true,
        languages: true,
        customSections: true,
      },
      data: cvData.data || {},
      activeLanguage: (cvData as any).activeLanguage || 'en',
      translations: (cvData as any).translations || {},
      isCustomTemplate: !!(cvData as any).isCustomTemplate,
      customTemplateHtml: (cvData as any).customTemplateHtml || '',
      customTemplateCss: (cvData as any).customTemplateCss || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryStore.cvs.push(newCv);
    persistLocalStore();
    return newCv;
  },

  async updateCv(id: string, userId: string, updateData: Partial<ICV>) {
    if (mongoConnected) {
      return await CVModel.findOneAndUpdate(
        { _id: id, userId },
        { ...updateData, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
    }
    const idx = memoryStore.cvs.findIndex((cv) => cv._id === id && cv.userId === userId);
    if (idx === -1) return null;

    const existing = memoryStore.cvs[idx];
    const updated = {
      ...existing,
      ...updateData,
      _id: id,
      userId,
      updatedAt: new Date().toISOString(),
    };
    memoryStore.cvs[idx] = updated;
    persistLocalStore();
    return updated;
  },

  async deleteCv(id: string, userId: string) {
    if (mongoConnected) {
      const result = await CVModel.findOneAndDelete({ _id: id, userId });
      return !!result;
    }
    const initialLen = memoryStore.cvs.length;
    memoryStore.cvs = memoryStore.cvs.filter((cv) => !(cv._id === id && cv.userId === userId));
    const deleted = memoryStore.cvs.length < initialLen;
    if (deleted) {
      persistLocalStore();
    }
    return deleted;
  },

  // COUNTRY METHODS
  async getCountries() {
    if (mongoConnected) {
      return await CountryModel.find().sort({ name: 1 });
    }
    return [...memoryStore.countries];
  },

  async getCountryById(id: string) {
    const normalized = id.toLowerCase().trim();
    if (mongoConnected) {
      return await CountryModel.findOne({ id: normalized });
    }
    return memoryStore.countries.find((c) => c.id.toLowerCase() === normalized) || null;
  },

  async createCountry(countryData: any) {
    const normalizedId = (countryData.id || countryData.name).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newCountry = {
      ...countryData,
      id: normalizedId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (mongoConnected) {
      const doc = new CountryModel(newCountry);
      return await doc.save();
    }
    const existingIdx = memoryStore.countries.findIndex((c) => c.id === normalizedId);
    if (existingIdx >= 0) {
      memoryStore.countries[existingIdx] = { ...memoryStore.countries[existingIdx], ...newCountry };
    } else {
      memoryStore.countries.push(newCountry);
    }
    persistLocalStore();
    return newCountry;
  },

  async updateCountry(id: string, updateData: any) {
    const normalized = id.toLowerCase().trim();
    if (mongoConnected) {
      return await CountryModel.findOneAndUpdate(
        { id: normalized },
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
    }
    const idx = memoryStore.countries.findIndex((c) => c.id === normalized);
    if (idx === -1) return null;
    memoryStore.countries[idx] = {
      ...memoryStore.countries[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    persistLocalStore();
    return memoryStore.countries[idx];
  },

  async deleteCountry(id: string) {
    const normalized = id.toLowerCase().trim();
    if (mongoConnected) {
      const res = await CountryModel.findOneAndDelete({ id: normalized });
      return !!res;
    }
    const initialLen = memoryStore.countries.length;
    memoryStore.countries = memoryStore.countries.filter((c) => c.id !== normalized);
    const deleted = memoryStore.countries.length < initialLen;
    if (deleted) persistLocalStore();
    return deleted;
  },

  // TEMPLATE METHODS
  async getTemplates(filter?: { countryId?: string; category?: string; enabledOnly?: boolean }) {
    if (mongoConnected) {
      const query: any = {};
      if (filter?.countryId && filter.countryId !== 'all') {
        query.countryId = filter.countryId.toLowerCase();
      }
      if (filter?.category && filter.category !== 'all') {
        query.category = filter.category;
      }
      if (filter?.enabledOnly) {
        query.enabled = true;
      }
      return await TemplateModel.find(query).sort({ updatedAt: -1 });
    }
    let list = [...memoryStore.templates];
    if (filter?.countryId && filter.countryId !== 'all') {
      const cid = filter.countryId.toLowerCase();
      list = list.filter((t) => t.countryId?.toLowerCase() === cid);
    }
    if (filter?.category && filter.category !== 'all') {
      list = list.filter((t) => t.category === filter.category);
    }
    if (filter?.enabledOnly) {
      list = list.filter((t) => t.enabled !== false);
    }
    return list;
  },

  async getTemplateById(id: string) {
    if (mongoConnected) {
      return await TemplateModel.findOne({ id });
    }
    return memoryStore.templates.find((t) => t.id === id) || null;
  },

  async createTemplate(templateData: any) {
    const templateId = templateData.id || 'tpl_' + Math.random().toString(36).substring(2, 9);
    const newTemplate = {
      ...templateData,
      id: templateId,
      version: templateData.version || '1.0.0',
      enabled: templateData.enabled !== false,
      isSystem: !!templateData.isSystem,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (mongoConnected) {
      const doc = new TemplateModel(newTemplate);
      return await doc.save();
    }
    const existingIdx = memoryStore.templates.findIndex((t) => t.id === templateId);
    if (existingIdx >= 0) {
      memoryStore.templates[existingIdx] = { ...memoryStore.templates[existingIdx], ...newTemplate };
    } else {
      memoryStore.templates.push(newTemplate);
    }
    persistLocalStore();
    return newTemplate;
  },

  async updateTemplate(id: string, updateData: any) {
    if (mongoConnected) {
      return await TemplateModel.findOneAndUpdate(
        { id },
        { ...updateData, updatedAt: new Date() },
        { new: true }
      );
    }
    const idx = memoryStore.templates.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    memoryStore.templates[idx] = {
      ...memoryStore.templates[idx],
      ...updateData,
      updatedAt: new Date().toISOString(),
    };
    persistLocalStore();
    return memoryStore.templates[idx];
  },

  async duplicateTemplate(id: string) {
    const original = await this.getTemplateById(id);
    if (!original) return null;

    const base = original.toObject ? original.toObject() : { ...original };
    const newId = `${base.id}_copy_${Date.now().toString(36).substring(4)}`;
    const duplicateData = {
      ...base,
      id: newId,
      name: `${base.name} (Copy)`,
      version: '1.0.0',
      isSystem: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    delete (duplicateData as any)._id;

    return await this.createTemplate(duplicateData);
  },

  async deleteTemplate(id: string) {
    if (mongoConnected) {
      const res = await TemplateModel.findOneAndDelete({ id, isSystem: { $ne: true } });
      return !!res;
    }
    const target = memoryStore.templates.find((t) => t.id === id);
    if (target?.isSystem) {
      throw new Error('System-defined core templates cannot be deleted.');
    }
    const initialLen = memoryStore.templates.length;
    memoryStore.templates = memoryStore.templates.filter((t) => t.id !== id);
    const deleted = memoryStore.templates.length < initialLen;
    if (deleted) persistLocalStore();
    return deleted;
  },

  // ADMIN OVERVIEW & STATS
  async getAdminStats() {
    let totalUsers = 0;
    let totalCvs = 0;
    let templatesList: any[] = [];
    let countriesList: any[] = [];

    if (mongoConnected) {
      totalUsers = await UserModel.countDocuments();
      totalCvs = await CVModel.countDocuments();
      templatesList = await TemplateModel.find().lean();
      countriesList = await CountryModel.find().lean();
    } else {
      totalUsers = memoryStore.users.length;
      totalCvs = memoryStore.cvs.length;
      templatesList = [...memoryStore.templates];
      countriesList = [...memoryStore.countries];
    }

    const publishedTemplates = templatesList.filter(
      (t) => t.status === 'published' || (t.enabled && t.status !== 'archived')
    ).length;
    const draftTemplates = templatesList.length - publishedTemplates;

    // Country-wise template statistics
    const countryStats = countriesList.map((country) => {
      const countryTemplates = templatesList.filter(
        (t) => t.countryId?.toLowerCase() === country.id.toLowerCase()
      );
      const published = countryTemplates.filter(
        (t) => t.status === 'published' || (t.enabled && t.status !== 'archived')
      ).length;
      return {
        countryId: country.id,
        name: country.name,
        flag: country.flag,
        totalTemplates: countryTemplates.length,
        publishedTemplates: published,
        draftTemplates: countryTemplates.length - published,
      };
    });

    const dbHealth = getDbStatus();

    return {
      kpi: {
        totalUsers,
        totalCvs,
        totalTemplates: templatesList.length,
        publishedTemplates,
        draftTemplates,
        totalCountries: countriesList.length,
      },
      countryStats,
      database: dbHealth,
      systemHealth: {
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        platform: process.platform,
        pid: process.pid,
      },
    };
  },

  // SYSTEM SETTINGS METHODS
  async getSystemSettings() {
    if (mongoConnected) {
      let settings = await SystemSettingsModel.findOne();
      if (!settings) {
        settings = new SystemSettingsModel(DEFAULT_SYSTEM_SETTINGS);
        await settings.save();
      }
      return settings.toObject ? settings.toObject() : settings;
    }
    if (!memoryStore.systemSettings) {
      memoryStore.systemSettings = { ...DEFAULT_SYSTEM_SETTINGS };
      persistLocalStore();
    }
    return { ...memoryStore.systemSettings };
  },

  async updateSystemSettings(updates: any) {
    if (mongoConnected) {
      return await SystemSettingsModel.findOneAndUpdate(
        {},
        { ...updates, updatedAt: new Date() },
        { upsert: true, new: true }
      );
    }
    memoryStore.systemSettings = {
      ...memoryStore.systemSettings,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    persistLocalStore();
    return { ...memoryStore.systemSettings };
  },

  // ACTIVITY LOG METHODS
  async logActivity(data: {
    adminEmail: string;
    adminName?: string;
    action: string;
    entityType: string;
    entityId?: string;
    details: string;
    ipAddress?: string;
    metadata?: Record<string, any>;
  }) {
    const entry = {
      ...data,
      adminName: data.adminName || 'Admin',
      ipAddress: data.ipAddress || '127.0.0.1',
      createdAt: new Date().toISOString(),
    };

    if (mongoConnected) {
      try {
        const doc = new ActivityLogModel(entry);
        await doc.save();
      } catch (err: any) {
        console.warn('[DB] Failed to persist activity log in MongoDB:', err.message);
      }
    }

    // Keep in localStore as well for instant access
    if (!Array.isArray(memoryStore.activityLogs)) {
      memoryStore.activityLogs = [];
    }
    memoryStore.activityLogs.unshift({
      _id: 'log_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      ...entry,
    });
    if (memoryStore.activityLogs.length > 500) {
      memoryStore.activityLogs = memoryStore.activityLogs.slice(0, 500);
    }
    persistLocalStore();
    return entry;
  },

  async getActivityLogs(limit = 100) {
    if (mongoConnected) {
      const logs = await ActivityLogModel.find().sort({ createdAt: -1 }).limit(limit).lean();
      if (logs.length > 0) return logs;
    }
    return (memoryStore.activityLogs || []).slice(0, limit);
  },

  // DATABASE DIAGNOSTICS & BACKUP
  async exportDatabaseBackup() {
    let users = [];
    let cvs = [];
    let templates = [];
    let countries = [];
    let logs = [];

    if (mongoConnected) {
      users = await UserModel.find().select('-passwordHash').lean();
      cvs = await CVModel.find().lean();
      templates = await TemplateModel.find().lean();
      countries = await CountryModel.find().lean();
      logs = await ActivityLogModel.find().limit(200).lean();
    } else {
      users = memoryStore.users.map(({ passwordHash, ...rest }) => rest);
      cvs = memoryStore.cvs;
      templates = memoryStore.templates;
      countries = memoryStore.countries;
      logs = memoryStore.activityLogs;
    }

    return {
      backupTimestamp: new Date().toISOString(),
      exportEngine: mongoConnected ? 'MongoDB Atlas' : 'Local Persistent Storage Engine',
      counts: {
        users: users.length,
        cvs: cvs.length,
        templates: templates.length,
        countries: countries.length,
        logs: logs.length,
      },
      collections: {
        users,
        cvs,
        templates,
        countries,
        logs,
      },
    };
  },

  async resetSeedData() {
    if (!mongoConnected) {
      memoryStore.countries = [...SEED_COUNTRIES];
      memoryStore.templates = [...SEED_TEMPLATES];
      persistLocalStore();
      return true;
    }
    for (const country of SEED_COUNTRIES) {
      await CountryModel.findOneAndUpdate({ id: country.id }, country, { upsert: true });
    }
    for (const tpl of SEED_TEMPLATES) {
      await TemplateModel.findOneAndUpdate({ id: tpl.id }, tpl, { upsert: true });
    }
    return true;
  },
};
