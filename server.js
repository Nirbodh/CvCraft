// server.ts
import express4 from "express";
import cors from "cors";
import path2 from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// server/routes/auth.ts
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt2 from "jsonwebtoken";

// server/db/connection.ts
import mongoose7 from "mongoose";
import fs from "fs";
import path from "path";

// server/models/User.ts
import mongoose, { Schema } from "mongoose";
var UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"]
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"]
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"]
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user"
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active"
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);
var UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

// server/models/CV.ts
import mongoose2, { Schema as Schema2 } from "mongoose";
var CVSchema = new Schema2(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      index: true
    },
    title: {
      type: String,
      required: [true, "CV title is required"],
      default: "Untitled CV",
      trim: true,
      maxlength: [120, "Title cannot exceed 120 characters"]
    },
    countryId: {
      type: String,
      default: "usa"
    },
    templateId: {
      type: String,
      default: "modern"
    },
    activeLanguage: {
      type: String,
      default: "en"
    },
    translations: {
      type: Schema2.Types.Mixed,
      default: () => ({})
    },
    isCustomTemplate: {
      type: Boolean,
      default: false
    },
    customTemplateHtml: {
      type: String,
      default: ""
    },
    customTemplateCss: {
      type: String,
      default: ""
    },
    themeColor: {
      type: String,
      default: "#2563eb"
    },
    fontFamily: {
      type: String,
      enum: ["sans", "serif", "mono"],
      default: "sans"
    },
    spacing: {
      type: String,
      enum: ["compact", "normal", "relaxed"],
      default: "normal"
    },
    fontSize: {
      type: String,
      enum: ["compact", "normal", "large"],
      default: "normal"
    },
    margins: {
      type: String,
      enum: ["compact", "normal", "relaxed"],
      default: "normal"
    },
    customHeadings: {
      type: Map,
      of: String,
      default: () => ({})
    },
    sectionOrder: {
      type: [String],
      default: [
        "personalInfo",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
        "awards",
        "publications",
        "memberships",
        "volunteering",
        "trainings",
        "references",
        "interests",
        "drivingLicence",
        "personalDetails",
        "additionalInfo",
        "customSections"
      ]
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
        customSections: true
      })
    },
    data: {
      type: Schema2.Types.Mixed,
      required: true,
      default: () => ({
        personalInfo: {
          fullName: "",
          jobTitle: "",
          email: "",
          phone: "",
          location: "",
          website: "",
          linkedin: "",
          github: ""
        },
        summary: "",
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        customSections: []
      })
    }
  },
  {
    timestamps: true
  }
);
var CVModel = mongoose2.models.CV || mongoose2.model("CV", CVSchema);

// server/models/Template.ts
import mongoose3, { Schema as Schema3 } from "mongoose";
var TemplateSchema = new Schema3(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    countryId: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true
    },
    category: {
      type: String,
      required: true,
      default: "modern"
    },
    description: {
      type: String,
      default: ""
    },
    defaultLanguage: {
      type: String,
      default: "en"
    },
    version: {
      type: String,
      default: "1.0.0"
    },
    isCustomHtml: {
      type: Boolean,
      default: false
    },
    htmlContent: {
      type: String,
      default: ""
    },
    cssContent: {
      type: String,
      default: ""
    },
    enabled: {
      type: Boolean,
      default: true
    },
    isSystem: {
      type: Boolean,
      default: false
    },
    thumbnailColor: {
      type: String,
      default: "#2563eb"
    },
    tags: {
      type: [String],
      default: []
    },
    fieldConfig: {
      type: Schema3.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);
var TemplateModel = mongoose3.models.Template || mongoose3.model("Template", TemplateSchema);

// server/models/Country.ts
import mongoose4, { Schema as Schema4 } from "mongoose";
var CountrySchema = new Schema4(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    flag: {
      type: String,
      required: true,
      trim: true
    },
    documentTerm: {
      type: String,
      required: true,
      default: "CV"
    },
    defaultLanguage: {
      type: String,
      required: true,
      default: "en"
    },
    recommendedLength: {
      type: String,
      default: "1-2 pages"
    },
    photoConvention: {
      type: String,
      enum: ["discouraged", "optional", "common", "standard"],
      default: "optional"
    },
    photoExplanation: {
      type: String,
      default: ""
    },
    atsGuidance: {
      type: String,
      default: ""
    },
    enabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);
var CountryModel = mongoose4.models.Country || mongoose4.model("Country", CountrySchema);

// server/models/ActivityLog.ts
import mongoose5, { Schema as Schema5 } from "mongoose";
var ActivityLogSchema = new Schema5(
  {
    adminEmail: {
      type: String,
      required: true,
      index: true
    },
    adminName: {
      type: String,
      default: "Administrator"
    },
    action: {
      type: String,
      required: true,
      index: true
    },
    entityType: {
      type: String,
      required: true,
      index: true
    },
    entityId: {
      type: String,
      default: ""
    },
    details: {
      type: String,
      required: true
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1"
    },
    metadata: {
      type: Schema5.Types.Mixed,
      default: () => ({})
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);
var ActivityLogModel = mongoose5.models.ActivityLog || mongoose5.model("ActivityLog", ActivityLogSchema);

// server/models/SystemSettings.ts
import mongoose6, { Schema as Schema6 } from "mongoose";
var SystemSettingsSchema = new Schema6(
  {
    siteName: {
      type: String,
      default: "CVCraft",
      trim: true
    },
    siteTagline: {
      type: String,
      default: "Free Professional CV & Resume Generator",
      trim: true
    },
    siteDescription: {
      type: String,
      default: "Build professional, ATS-friendly CVs and resumes for free. Import documents, customize 5+ designer templates, use the deterministic writing engine, and export print-ready A4 PDFs without watermarks."
    },
    logoUrl: {
      type: String,
      default: ""
    },
    faviconUrl: {
      type: String,
      default: ""
    },
    contactEmail: {
      type: String,
      default: "support@cvcraft.com",
      trim: true
    },
    supportEmail: {
      type: String,
      default: "admin@cvcraft.com",
      trim: true
    },
    defaultCountry: {
      type: String,
      default: "usa"
    },
    defaultLanguage: {
      type: String,
      default: "en"
    },
    maintenanceMode: {
      type: Boolean,
      default: false
    },
    maintenanceNotice: {
      type: String,
      default: "CVCraft is currently undergoing scheduled system optimization. Normal service will resume shortly."
    },
    allowPublicRegistration: {
      type: Boolean,
      default: true
    },
    maxUploadSizeBytes: {
      type: Number,
      default: 10485760
      // 10MB
    },
    updatedBy: {
      type: String,
      default: "system"
    }
  },
  {
    timestamps: true
  }
);
var SystemSettingsModel = mongoose6.models.SystemSettings || mongoose6.model("SystemSettings", SystemSettingsSchema);

// server/db/connection.ts
var mongoConnected = false;
var mongoError = null;
var DATA_DIR = path.resolve(process.cwd(), ".data");
var DATA_FILE = path.join(DATA_DIR, "cvcraft_store.json");
var SEED_COUNTRIES = [
  {
    id: "usa",
    name: "United States",
    flag: "\u{1F1FA}\u{1F1F8}",
    documentTerm: "Resume",
    defaultLanguage: "en",
    recommendedLength: "1 page (early/mid-career) or 2 pages (10+ years)",
    photoConvention: "discouraged",
    photoExplanation: "Photos are discouraged in the US due to EEOC anti-discrimination regulations.",
    atsGuidance: "High ATS priority. Single-column layouts ensure 100% parse rates.",
    enabled: true
  },
  {
    id: "canada",
    name: "Canada",
    flag: "\u{1F1E8}\u{1F1E6}",
    documentTerm: "Resume",
    defaultLanguage: "en",
    recommendedLength: "1 to 2 pages maximum",
    photoConvention: "discouraged",
    photoExplanation: "Photos are typically omitted in Canada to comply with human rights standards.",
    atsGuidance: "Clean bullet hierarchy is paramount for Taleo, Workday, and BambooHR.",
    enabled: true
  },
  {
    id: "uk",
    name: "United Kingdom",
    flag: "\u{1F1EC}\u{1F1E7}",
    documentTerm: "CV",
    defaultLanguage: "en",
    recommendedLength: "Strictly 2 pages standard",
    photoConvention: "discouraged",
    photoExplanation: "UK recruiters discourage photos under UK Equality Act 2010 regulations.",
    atsGuidance: 'Standard British headings: "Personal Profile", "Employment History".',
    enabled: true
  },
  {
    id: "germany",
    name: "Germany / DACH",
    flag: "\u{1F1E9}\u{1F1EA}",
    documentTerm: "Lebenslauf",
    defaultLanguage: "de",
    recommendedLength: "1 to 2 pages (tabular format)",
    photoConvention: "common",
    photoExplanation: "A professional headshot (Bewerbungsfoto) is traditional in Germany.",
    atsGuidance: "Clear table-like tabular structure with distinct date columns.",
    enabled: true
  },
  {
    id: "eu",
    name: "European Union / Europass",
    flag: "\u{1F1EA}\u{1F1FA}",
    documentTerm: "Curriculum Vitae",
    defaultLanguage: "en",
    recommendedLength: "2 or more pages",
    photoConvention: "optional",
    photoExplanation: "Photos are accepted across continental Europe, though optional.",
    atsGuidance: "Recognized by EU-wide job portals including EURES.",
    enabled: true
  },
  {
    id: "australia",
    name: "Australia",
    flag: "\u{1F1E6}\u{1F1FA}",
    documentTerm: "CV",
    defaultLanguage: "en",
    recommendedLength: "2 to 4 pages",
    photoConvention: "discouraged",
    photoExplanation: "Australian employers prefer no photo to align with fair work practices.",
    atsGuidance: "Strong ATS emphasis on explicit skill keywords mapped directly to the PD.",
    enabled: true
  },
  {
    id: "uae",
    name: "UAE & Gulf Region",
    flag: "\u{1F1E6}\u{1F1EA}",
    documentTerm: "CV",
    defaultLanguage: "en",
    recommendedLength: "2 to 3 pages",
    photoConvention: "standard",
    photoExplanation: "A crisp professional headshot in business attire is customary in the Gulf.",
    atsGuidance: "Leading GCC enterprises use Taleo, SAP SuccessFactors, and Bayt.",
    enabled: true
  },
  {
    id: "bangladesh",
    name: "Bangladesh",
    flag: "\u{1F1E7}\u{1F1E9}",
    documentTerm: "CV / Biodata",
    defaultLanguage: "en",
    recommendedLength: "2 to 3 pages",
    photoConvention: "standard",
    photoExplanation: "A formal passport-size photo is standard convention for corporate & bank CVs.",
    atsGuidance: "Standard headings: Career Objective, Experience, Education, Referees.",
    enabled: true
  },
  {
    id: "japan",
    name: "Japan",
    flag: "\u{1F1EF}\u{1F1F5}",
    documentTerm: "\u5C65\u6B74\u66F8 (Rirekisho)",
    defaultLanguage: "ja",
    recommendedLength: "1 to 2 pages (Standard JIS Japanese format)",
    photoConvention: "standard",
    photoExplanation: "A formal 30mm x 40mm studio photo (\u30B9\u30FC\u30C4\u7740\u7528 \u8A3C\u660E\u5199\u771F) is strictly required.",
    atsGuidance: "Japanese employers parse structured chronological tables and Furigana headers.",
    enabled: true
  }
];
var SEED_TEMPLATES = [
  {
    id: "japanese-rirekisho",
    name: "JIS Standard Rirekisho (\u5C65\u6B74\u66F8)",
    countryId: "japan",
    category: "traditional",
    description: "Official Japanese standard JIS Rirekisho with Furigana (\u3075\u308A\u304C\u306A), 30x40mm photo frame, chronological Education & Work grid ending with \u4EE5\u4E0A, licenses, and Self-PR.",
    defaultLanguage: "ja",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#0f766e",
    tags: ["JIS", "Furigana", "Japan", "Official"]
  },
  {
    id: "japanese-shokumu",
    name: "Japanese Shokumu Keirekisho (\u8077\u52D9\u7D4C\u6B74\u66F8)",
    countryId: "japan",
    category: "executive",
    description: "Detailed Japanese career progression document detailing project responsibilities, team sizes, and technical stack.",
    defaultLanguage: "ja",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#1e3a8a",
    tags: ["Japan", "Mid-Career", "Technical"]
  },
  {
    id: "ats",
    name: "Clean ATS Standard",
    countryId: "usa",
    category: "ats",
    description: "High-parse single column layout optimized for Greenhouse, Workday, and Taleo.",
    defaultLanguage: "en",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#2563eb",
    tags: ["ATS-Friendly", "Single Column", "USA"]
  },
  {
    id: "modern",
    name: "Modern Executive",
    countryId: "usa",
    category: "modern",
    description: "Clean modern layout with subtle accents and strong typography.",
    defaultLanguage: "en",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#1d4ed8",
    tags: ["Modern", "Corporate", "USA"]
  },
  {
    id: "classic",
    name: "European Academic & Classic",
    countryId: "germany",
    category: "classic",
    description: "Structured serif layout with distinct date columns, ideal for German Lebenslauf and European institutions.",
    defaultLanguage: "de",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#831843",
    tags: ["Academic", "Tabular", "Germany"]
  },
  {
    id: "minimal",
    name: "Nordic Minimalist",
    countryId: "eu",
    category: "minimal",
    description: "Crisp whitespace and understated typographic scale.",
    defaultLanguage: "en",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#18181b",
    tags: ["Minimalist", "EU"]
  },
  {
    id: "executive",
    name: "Gulf & Global Executive",
    countryId: "uae",
    category: "executive",
    description: "Executive banner with corporate badges, ideal for leadership profiles in UAE and multinational roles.",
    defaultLanguage: "en",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#b45309",
    tags: ["Executive", "Photo", "UAE"]
  },
  {
    id: "creative",
    name: "Designer & Portfolio",
    countryId: "uk",
    category: "creative",
    description: "Dynamic two-column sidebar layout for creative agencies and tech startups.",
    defaultLanguage: "en",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#059669",
    tags: ["Creative", "Portfolio", "UK"]
  },
  {
    id: "technical",
    name: "Systems Engineer Tech",
    countryId: "australia",
    category: "technical",
    description: "Data-dense grid highlighting core tech stacks, cloud certifications, and project links.",
    defaultLanguage: "en",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#0891b2",
    tags: ["Tech", "Engineering", "Australia"]
  },
  {
    id: "bangladesh_corporate",
    name: "Bangladesh Corporate & Bank Biodata",
    countryId: "bangladesh",
    category: "classic",
    description: "Comprehensive biodata layout including permanent address, father/mother name, religion, blood group, and references.",
    defaultLanguage: "en",
    version: "1.0.0",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#166534",
    tags: ["Biodata", "Corporate", "Bangladesh"]
  }
];
var DEFAULT_SYSTEM_SETTINGS = {
  siteName: "CVCraft",
  siteTagline: "Free Professional CV & Resume Generator",
  siteDescription: "Build professional, ATS-friendly CVs and resumes for free. Import documents, customize 5+ designer templates, use the deterministic writing engine, and export print-ready A4 PDFs without watermarks.",
  logoUrl: "",
  faviconUrl: "",
  contactEmail: "support@cvcraft.com",
  supportEmail: "admin@cvcraft.com",
  defaultCountry: "usa",
  defaultLanguage: "en",
  maintenanceMode: false,
  maintenanceNotice: "CVCraft is currently undergoing scheduled system optimization. Normal service will resume shortly.",
  allowPublicRegistration: true,
  maxUploadSizeBytes: 10485760,
  updatedAt: (/* @__PURE__ */ new Date()).toISOString()
};
var memoryStore = {
  users: [],
  cvs: [],
  countries: [...SEED_COUNTRIES],
  templates: [...SEED_TEMPLATES],
  activityLogs: [],
  systemSettings: { ...DEFAULT_SYSTEM_SETTINGS }
};
function initLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      const loaded = JSON.parse(content);
      memoryStore = {
        users: loaded.users || [],
        cvs: loaded.cvs || [],
        countries: loaded.countries && loaded.countries.length > 0 ? loaded.countries : [...SEED_COUNTRIES],
        templates: loaded.templates && loaded.templates.length > 0 ? loaded.templates : [...SEED_TEMPLATES],
        activityLogs: loaded.activityLogs || [],
        systemSettings: loaded.systemSettings || { ...DEFAULT_SYSTEM_SETTINGS }
      };
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
  } catch (err) {
    console.warn("[DB] Local store init warning, using in-memory fallback:", err?.message);
  }
}
function persistLocalStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(memoryStore, null, 2));
  } catch (err) {
    console.warn("[DB] Local store persist warning:", err?.message);
  }
}
async function seedMongoIfEmpty() {
  try {
    const countryCount = await CountryModel.countDocuments();
    if (countryCount === 0) {
      console.log("[DB] Seeding default countries into MongoDB Atlas...");
      for (const country of SEED_COUNTRIES) {
        await CountryModel.findOneAndUpdate({ id: country.id }, country, { upsert: true });
      }
    }
    const templateCount = await TemplateModel.countDocuments();
    if (templateCount === 0) {
      console.log("[DB] Seeding default templates into MongoDB Atlas...");
      for (const tpl of SEED_TEMPLATES) {
        await TemplateModel.findOneAndUpdate({ id: tpl.id }, tpl, { upsert: true });
      }
    }
  } catch (err) {
    console.warn("[DB] Seed error (non-fatal):", err?.message);
  }
}
async function connectDatabase() {
  initLocalStore();
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log("[DB] No MONGODB_URI detected in environment. Running with local persistent data engine.");
    mongoConnected = false;
    mongoError = "No MONGODB_URI configured. Running in local zero-config persistent mode.";
    return;
  }
  try {
    await mongoose7.connect(uri, {
      serverSelectionTimeoutMS: 5e3
    });
    mongoConnected = true;
    mongoError = null;
    console.log("[DB] Successfully connected to MongoDB Atlas Free cluster.");
    await seedMongoIfEmpty();
  } catch (err) {
    mongoConnected = false;
    mongoError = err?.message || "MongoDB connection failed";
    console.error("[DB] Failed to connect to MongoDB Atlas:", mongoError);
    console.log("[DB] Seamlessly failing over to local persistent data engine.");
  }
}
function getDbStatus() {
  return {
    isMongo: mongoConnected,
    mode: mongoConnected ? "MongoDB Atlas (Mongoose)" : "Local Persistent Engine (Active Fallback)",
    error: mongoError,
    activeCollections: {
      users: mongoConnected ? "MongoDB: users" : `${memoryStore.users.length} users in local store`,
      cvs: mongoConnected ? "MongoDB: cvs" : `${memoryStore.cvs.length} cvs in local store`,
      countries: mongoConnected ? "MongoDB: countries" : `${memoryStore.countries.length} countries in local store`,
      templates: mongoConnected ? "MongoDB: templates" : `${memoryStore.templates.length} templates in local store`
    },
    hint: !mongoConnected ? "To connect real MongoDB Atlas Free: Set MONGODB_URI in your environment or Render dashboard." : "Connected and ready for production."
  };
}
var dbRepository = {
  // USER METHODS
  async findUserByEmail(email) {
    const normalized = email.toLowerCase().trim();
    if (mongoConnected) {
      return await UserModel.findOne({ email: normalized });
    }
    const found = memoryStore.users.find((u) => u.email.toLowerCase() === normalized);
    return found ? { ...found } : null;
  },
  async findUserById(id) {
    if (mongoConnected) {
      return await UserModel.findById(id).select("-passwordHash");
    }
    const found = memoryStore.users.find((u) => u._id === id);
    if (!found) return null;
    const { passwordHash, ...rest } = found;
    return rest;
  },
  async createUser(data) {
    const role = data.role || "user";
    const status = data.status || "active";
    if (mongoConnected) {
      const doc = new UserModel({
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        passwordHash: data.passwordHash,
        role,
        status
      });
      return await doc.save();
    }
    const newUser = {
      _id: "usr_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      passwordHash: data.passwordHash,
      role,
      status,
      lastLoginAt: void 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    memoryStore.users.push(newUser);
    persistLocalStore();
    return newUser;
  },
  async updateUserLastLogin(userId) {
    const now = /* @__PURE__ */ new Date();
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
  async getUsers(filter) {
    if (mongoConnected) {
      const query = {};
      if (filter?.role && filter.role !== "all") {
        query.role = filter.role;
      }
      if (filter?.status && filter.status !== "all") {
        query.status = filter.status;
      }
      if (filter?.search && filter.search.trim()) {
        const regex = new RegExp(filter.search.trim(), "i");
        query.$or = [{ name: regex }, { email: regex }];
      }
      return await UserModel.find(query).select("-passwordHash").sort({ createdAt: -1 });
    }
    let list = memoryStore.users.map(({ passwordHash, ...rest }) => rest);
    if (filter?.role && filter.role !== "all") {
      list = list.filter((u) => (u.role || "user") === filter.role);
    }
    if (filter?.status && filter.status !== "all") {
      list = list.filter((u) => (u.status || "active") === filter.status);
    }
    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      list = list.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },
  async updateUserRole(userId, role) {
    if (mongoConnected) {
      return await UserModel.findByIdAndUpdate(userId, { role }, { new: true }).select("-passwordHash");
    }
    const idx = memoryStore.users.findIndex((u) => u._id === userId);
    if (idx === -1) return null;
    memoryStore.users[idx].role = role;
    persistLocalStore();
    const { passwordHash, ...rest } = memoryStore.users[idx];
    return rest;
  },
  async updateUserStatus(userId, status) {
    if (mongoConnected) {
      return await UserModel.findByIdAndUpdate(userId, { status }, { new: true }).select("-passwordHash");
    }
    const idx = memoryStore.users.findIndex((u) => u._id === userId);
    if (idx === -1) return null;
    memoryStore.users[idx].status = status;
    persistLocalStore();
    const { passwordHash, ...rest } = memoryStore.users[idx];
    return rest;
  },
  async deleteUser(userId) {
    if (mongoConnected) {
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
  async getCvsByUser(userId) {
    if (mongoConnected) {
      return await CVModel.find({ userId }).sort({ updatedAt: -1 });
    }
    return memoryStore.cvs.filter((cv) => cv.userId === userId).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  },
  async getCvByIdAndUser(id, userId) {
    if (mongoConnected) {
      return await CVModel.findOne({ _id: id, userId });
    }
    return memoryStore.cvs.find((cv) => cv._id === id && cv.userId === userId) || null;
  },
  async createCv(userId, cvData) {
    if (mongoConnected) {
      const doc = new CVModel({
        ...cvData,
        userId
      });
      return await doc.save();
    }
    const newCv = {
      _id: "cv_" + Math.random().toString(36).substring(2, 11) + Date.now().toString(36),
      userId,
      title: cvData.title || "Untitled CV",
      countryId: cvData.countryId || "usa",
      templateId: cvData.templateId || "modern",
      themeColor: cvData.themeColor || "#2563eb",
      fontFamily: cvData.fontFamily || "sans",
      spacing: cvData.spacing || "normal",
      fontSize: cvData.fontSize || "normal",
      margins: cvData.margins || "normal",
      customHeadings: cvData.customHeadings || {},
      sectionOrder: cvData.sectionOrder || [
        "personalInfo",
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
        "customSections"
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
        customSections: true
      },
      data: cvData.data || {},
      activeLanguage: cvData.activeLanguage || "en",
      translations: cvData.translations || {},
      isCustomTemplate: !!cvData.isCustomTemplate,
      customTemplateHtml: cvData.customTemplateHtml || "",
      customTemplateCss: cvData.customTemplateCss || "",
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    memoryStore.cvs.push(newCv);
    persistLocalStore();
    return newCv;
  },
  async updateCv(id, userId, updateData) {
    if (mongoConnected) {
      return await CVModel.findOneAndUpdate(
        { _id: id, userId },
        { ...updateData, updatedAt: /* @__PURE__ */ new Date() },
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
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    memoryStore.cvs[idx] = updated;
    persistLocalStore();
    return updated;
  },
  async deleteCv(id, userId) {
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
  async getCountryById(id) {
    const normalized = id.toLowerCase().trim();
    if (mongoConnected) {
      return await CountryModel.findOne({ id: normalized });
    }
    return memoryStore.countries.find((c) => c.id.toLowerCase() === normalized) || null;
  },
  async createCountry(countryData) {
    const normalizedId = (countryData.id || countryData.name).toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const newCountry = {
      ...countryData,
      id: normalizedId,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
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
  async updateCountry(id, updateData) {
    const normalized = id.toLowerCase().trim();
    if (mongoConnected) {
      return await CountryModel.findOneAndUpdate(
        { id: normalized },
        { ...updateData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true }
      );
    }
    const idx = memoryStore.countries.findIndex((c) => c.id === normalized);
    if (idx === -1) return null;
    memoryStore.countries[idx] = {
      ...memoryStore.countries[idx],
      ...updateData,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    persistLocalStore();
    return memoryStore.countries[idx];
  },
  async deleteCountry(id) {
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
  async getTemplates(filter) {
    if (mongoConnected) {
      const query = {};
      if (filter?.countryId && filter.countryId !== "all") {
        query.countryId = filter.countryId.toLowerCase();
      }
      if (filter?.category && filter.category !== "all") {
        query.category = filter.category;
      }
      if (filter?.enabledOnly) {
        query.enabled = true;
      }
      return await TemplateModel.find(query).sort({ updatedAt: -1 });
    }
    let list = [...memoryStore.templates];
    if (filter?.countryId && filter.countryId !== "all") {
      const cid = filter.countryId.toLowerCase();
      list = list.filter((t) => t.countryId?.toLowerCase() === cid);
    }
    if (filter?.category && filter.category !== "all") {
      list = list.filter((t) => t.category === filter.category);
    }
    if (filter?.enabledOnly) {
      list = list.filter((t) => t.enabled !== false);
    }
    return list;
  },
  async getTemplateById(id) {
    if (mongoConnected) {
      return await TemplateModel.findOne({ id });
    }
    return memoryStore.templates.find((t) => t.id === id) || null;
  },
  async createTemplate(templateData) {
    const templateId = templateData.id || "tpl_" + Math.random().toString(36).substring(2, 9);
    const newTemplate = {
      ...templateData,
      id: templateId,
      version: templateData.version || "1.0.0",
      enabled: templateData.enabled !== false,
      isSystem: !!templateData.isSystem,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
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
  async updateTemplate(id, updateData) {
    if (mongoConnected) {
      return await TemplateModel.findOneAndUpdate(
        { id },
        { ...updateData, updatedAt: /* @__PURE__ */ new Date() },
        { new: true }
      );
    }
    const idx = memoryStore.templates.findIndex((t) => t.id === id);
    if (idx === -1) return null;
    memoryStore.templates[idx] = {
      ...memoryStore.templates[idx],
      ...updateData,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    persistLocalStore();
    return memoryStore.templates[idx];
  },
  async duplicateTemplate(id) {
    const original = await this.getTemplateById(id);
    if (!original) return null;
    const base = original.toObject ? original.toObject() : { ...original };
    const newId = `${base.id}_copy_${Date.now().toString(36).substring(4)}`;
    const duplicateData = {
      ...base,
      id: newId,
      name: `${base.name} (Copy)`,
      version: "1.0.0",
      isSystem: false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    delete duplicateData._id;
    return await this.createTemplate(duplicateData);
  },
  async deleteTemplate(id) {
    if (mongoConnected) {
      const res = await TemplateModel.findOneAndDelete({ id, isSystem: { $ne: true } });
      return !!res;
    }
    const target = memoryStore.templates.find((t) => t.id === id);
    if (target?.isSystem) {
      throw new Error("System-defined core templates cannot be deleted.");
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
    let templatesList = [];
    let countriesList = [];
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
      (t) => t.status === "published" || t.enabled && t.status !== "archived"
    ).length;
    const draftTemplates = templatesList.length - publishedTemplates;
    const countryStats = countriesList.map((country) => {
      const countryTemplates = templatesList.filter(
        (t) => t.countryId?.toLowerCase() === country.id.toLowerCase()
      );
      const published = countryTemplates.filter(
        (t) => t.status === "published" || t.enabled && t.status !== "archived"
      ).length;
      return {
        countryId: country.id,
        name: country.name,
        flag: country.flag,
        totalTemplates: countryTemplates.length,
        publishedTemplates: published,
        draftTemplates: countryTemplates.length - published
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
        totalCountries: countriesList.length
      },
      countryStats,
      database: dbHealth,
      systemHealth: {
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        platform: process.platform,
        pid: process.pid
      }
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
  async updateSystemSettings(updates) {
    if (mongoConnected) {
      return await SystemSettingsModel.findOneAndUpdate(
        {},
        { ...updates, updatedAt: /* @__PURE__ */ new Date() },
        { upsert: true, new: true }
      );
    }
    memoryStore.systemSettings = {
      ...memoryStore.systemSettings,
      ...updates,
      updatedAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    persistLocalStore();
    return { ...memoryStore.systemSettings };
  },
  // ACTIVITY LOG METHODS
  async logActivity(data) {
    const entry = {
      ...data,
      adminName: data.adminName || "Admin",
      ipAddress: data.ipAddress || "127.0.0.1",
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    if (mongoConnected) {
      try {
        const doc = new ActivityLogModel(entry);
        await doc.save();
      } catch (err) {
        console.warn("[DB] Failed to persist activity log in MongoDB:", err.message);
      }
    }
    if (!Array.isArray(memoryStore.activityLogs)) {
      memoryStore.activityLogs = [];
    }
    memoryStore.activityLogs.unshift({
      _id: "log_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      ...entry
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
      users = await UserModel.find().select("-passwordHash").lean();
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
      backupTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      exportEngine: mongoConnected ? "MongoDB Atlas" : "Local Persistent Storage Engine",
      counts: {
        users: users.length,
        cvs: cvs.length,
        templates: templates.length,
        countries: countries.length,
        logs: logs.length
      },
      collections: {
        users,
        cvs,
        templates,
        countries,
        logs
      }
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
  }
};

// server/middleware/auth.ts
import jwt from "jsonwebtoken";
var JWT_SECRET = process.env.JWT_SECRET || "cvcraft_super_secret_jwt_key_change_in_production_2026";
function authenticateJwt(req, res, next) {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)(?:token|cvcraft_token)=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }
  if (!token) {
    res.status(401).json({
      success: false,
      message: "Authentication required. Please log in or provide a valid Bearer token."
    });
    return;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Session expired. Please log in again."
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: "Invalid authorization token."
    });
  }
}

// server/routes/auth.ts
var router = Router();
var JWT_SECRET2 = process.env.JWT_SECRET || "cvcraft_super_secret_jwt_key_change_in_production_2026";
var loginAttempts = /* @__PURE__ */ new Map();
function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1e3;
  const maxAttempts = 20;
  const userRecord = loginAttempts.get(ip);
  if (!userRecord) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  if (now - userRecord.firstAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return true;
  }
  if (userRecord.count >= maxAttempts) {
    return false;
  }
  userRecord.count += 1;
  return true;
}
router.post("/register", async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!checkRateLimit(ip)) {
      res.status(429).json({
        success: false,
        message: "Too many authentication attempts. Please try again in 15 minutes."
      });
      return;
    }
    const { name, email, password } = req.body;
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters."
      });
      return;
    }
    if (!email || typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email.trim())) {
      res.status(400).json({
        success: false,
        message: "Please provide a valid email address."
      });
      return;
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long."
      });
      return;
    }
    const existing = await dbRepository.findUserByEmail(email);
    if (existing) {
      res.status(409).json({
        success: false,
        message: "An account with this email already exists. Please log in."
      });
      return;
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const normalizedEmail = email.toLowerCase().trim();
    const isSuperAdminEmail = normalizedEmail === "nirbodh3@gmail.com" || normalizedEmail === "admin@cvcraft.com";
    const role = isSuperAdminEmail ? "superadmin" : "user";
    const user = await dbRepository.createUser({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      role,
      status: "active"
    });
    const token = jwt2.sign(
      {
        id: user._id?.toString() || user.id,
        email: user.email,
        name: user.name,
        role: user.role || role,
        status: user.status || "active"
      },
      JWT_SECRET2,
      { expiresIn: "7d" }
    );
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1e3
    });
    res.status(201).json({
      success: true,
      message: "Account created successfully!",
      user: {
        id: user._id?.toString() || user.id,
        name: user.name,
        email: user.email,
        role: user.role || role,
        status: user.status || "active",
        createdAt: user.createdAt
      },
      token
    });
  } catch (err) {
    console.error("[Auth Register Error]:", err);
    res.status(500).json({
      success: false,
      message: "Failed to create account. Please try again."
    });
  }
});
router.post("/login", async (req, res) => {
  try {
    const ip = req.ip || req.socket.remoteAddress || "unknown";
    if (!checkRateLimit(ip)) {
      res.status(429).json({
        success: false,
        message: "Too many authentication attempts. Please try again in 15 minutes."
      });
      return;
    }
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "Please provide both email and password."
      });
      return;
    }
    const user = await dbRepository.findUserByEmail(email);
    if (!user) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
      return;
    }
    if (user.status === "suspended") {
      res.status(403).json({
        success: false,
        message: "Your account has been suspended by an administrator. Please contact support@cvcraft.com."
      });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
      return;
    }
    const normalizedEmail = user.email.toLowerCase().trim();
    let userRole = user.role || "user";
    if (normalizedEmail === "nirbodh3@gmail.com" || normalizedEmail === "admin@cvcraft.com") {
      userRole = "superadmin";
    }
    const token = jwt2.sign(
      {
        id: user._id?.toString() || user.id,
        email: user.email,
        name: user.name,
        role: userRole,
        status: user.status || "active"
      },
      JWT_SECRET2,
      { expiresIn: "7d" }
    );
    try {
      await dbRepository.updateUserLastLogin(user._id?.toString() || user.id);
    } catch {
    }
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "lax" : "none",
      maxAge: 7 * 24 * 60 * 60 * 1e3
    });
    res.json({
      success: true,
      message: "Login successful!",
      user: {
        id: user._id?.toString() || user.id,
        name: user.name,
        email: user.email,
        role: userRole,
        status: user.status || "active",
        createdAt: user.createdAt
      },
      token
    });
  } catch (err) {
    console.error("[Auth Login Error]:", err);
    res.status(500).json({
      success: false,
      message: "Login failed due to a server error. Please try again."
    });
  }
});
router.post("/logout", (_req, res) => {
  const isProduction = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "lax" : "none"
  });
  res.json({
    success: true,
    message: "Logged out successfully."
  });
});
router.get("/me", authenticateJwt, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }
    const user = await dbRepository.findUserById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: "User not found." });
      return;
    }
    const normalizedEmail = (user.email || "").toLowerCase().trim();
    let role = user.role || "user";
    if (normalizedEmail === "nirbodh3@gmail.com" || normalizedEmail === "admin@cvcraft.com") {
      role = "superadmin";
    }
    res.json({
      success: true,
      user: {
        id: user._id?.toString() || user.id,
        name: user.name,
        email: user.email,
        role,
        status: user.status || "active",
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error("[Auth Me Error]:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve profile."
    });
  }
});
var auth_default = router;

// server/routes/cvs.ts
import { Router as Router2 } from "express";
var router2 = Router2();
router2.use(authenticateJwt);
router2.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const cvs = await dbRepository.getCvsByUser(userId);
    res.json({
      success: true,
      count: cvs.length,
      cvs
    });
  } catch (err) {
    console.error("[Get CVs Error]:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve your CVs."
    });
  }
});
router2.get("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const cv = await dbRepository.getCvByIdAndUser(id, userId);
    if (!cv) {
      res.status(404).json({
        success: false,
        message: "CV not found or you do not have permission to access it."
      });
      return;
    }
    res.json({
      success: true,
      cv
    });
  } catch (err) {
    console.error("[Get Single CV Error]:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve CV."
    });
  }
});
router2.post("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      title,
      countryId,
      templateId,
      themeColor,
      fontFamily,
      spacing,
      fontSize,
      margins,
      customHeadings,
      sectionOrder,
      sectionVisibility,
      data
    } = req.body;
    const sanitizedTitle = title && typeof title === "string" && title.trim() || "Untitled CV";
    const created = await dbRepository.createCv(userId, {
      title: sanitizedTitle,
      countryId: countryId || "usa",
      templateId: templateId || "modern",
      themeColor: themeColor || "#2563eb",
      fontFamily: fontFamily || "sans",
      spacing: spacing || "normal",
      fontSize: fontSize || "normal",
      margins: margins || "normal",
      customHeadings: customHeadings || {},
      sectionOrder: Array.isArray(sectionOrder) ? sectionOrder : void 0,
      sectionVisibility: sectionVisibility && typeof sectionVisibility === "object" ? sectionVisibility : void 0,
      data: data || {}
    });
    res.status(201).json({
      success: true,
      message: "CV saved successfully!",
      cv: created
    });
  } catch (err) {
    console.error("[Create CV Error]:", err);
    res.status(500).json({
      success: false,
      message: "Failed to save CV."
    });
  }
});
router2.put("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const {
      title,
      countryId,
      templateId,
      themeColor,
      fontFamily,
      spacing,
      fontSize,
      margins,
      customHeadings,
      sectionOrder,
      sectionVisibility,
      data
    } = req.body;
    const existing = await dbRepository.getCvByIdAndUser(id, userId);
    if (!existing) {
      res.status(404).json({
        success: false,
        message: "CV not found or you do not have permission to update it."
      });
      return;
    }
    const updatePayload = {};
    if (title !== void 0) updatePayload.title = title.trim();
    if (countryId !== void 0) updatePayload.countryId = countryId;
    if (templateId !== void 0) updatePayload.templateId = templateId;
    if (themeColor !== void 0) updatePayload.themeColor = themeColor;
    if (fontFamily !== void 0) updatePayload.fontFamily = fontFamily;
    if (spacing !== void 0) updatePayload.spacing = spacing;
    if (fontSize !== void 0) updatePayload.fontSize = fontSize;
    if (margins !== void 0) updatePayload.margins = margins;
    if (customHeadings !== void 0) updatePayload.customHeadings = customHeadings;
    if (sectionOrder !== void 0) updatePayload.sectionOrder = sectionOrder;
    if (sectionVisibility !== void 0) updatePayload.sectionVisibility = sectionVisibility;
    if (data !== void 0) updatePayload.data = data;
    const updated = await dbRepository.updateCv(id, userId, updatePayload);
    res.json({
      success: true,
      message: "CV updated successfully!",
      cv: updated
    });
  } catch (err) {
    console.error("[Update CV Error]:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update CV."
    });
  }
});
router2.delete("/:id", async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const deleted = await dbRepository.deleteCv(id, userId);
    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "CV not found or you do not have permission to delete it."
      });
      return;
    }
    res.json({
      success: true,
      message: "CV deleted successfully."
    });
  } catch (err) {
    console.error("[Delete CV Error]:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete CV."
    });
  }
});
var cvs_default = router2;

// server/routes/extract.ts
import { Router as Router3 } from "express";

// server/services/documentExtractor.ts
import mammoth from "mammoth";
async function extractTextFromDocx(buffer) {
  const result = await mammoth.extractRawText({ buffer });
  return result.value || "";
}
function parseCvText(text) {
  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length < 3 || text.replace(/[^a-zA-Z0-9]/g, "").length < 35) {
    return {
      isScanned: true,
      scannedWarning: "This document appears to be a scanned image or flattened graphic. No selectable text was detected. To import this CV, please use a text-based PDF, DOCX, or TXT file, or transcribe your details manually.",
      rawTextPreview: text.slice(0, 300),
      personalInfo: {
        fullName: "",
        jobTitle: "",
        email: "",
        phone: "",
        location: ""
      },
      summary: "",
      experience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
      languages: []
    };
  }
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i);
  const email = emailMatch ? emailMatch[0] : "";
  const phoneMatch = text.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "";
  const linkedinMatch = text.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/([a-zA-Z0-9_-]+)/i);
  const linkedin = linkedinMatch ? linkedinMatch[0] : "";
  const githubMatch = text.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  const github = githubMatch ? githubMatch[0] : "";
  const websiteMatch = text.match(/(?:https?:\/\/)(?!linkedin|github)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?/i);
  const website = websiteMatch ? websiteMatch[0] : "";
  let fullName = "";
  let jobTitle = "";
  let headerIndex = 0;
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    if (line.includes("@") || line.includes("http") || line.includes("www.") || line.includes("+")) {
      continue;
    }
    if (!fullName && line.length < 40 && /^[A-Z][a-zA-Z.\s'-]+$/.test(line)) {
      fullName = line;
      headerIndex = i;
      continue;
    }
    if (fullName && !jobTitle && line.length < 50 && !line.includes(":")) {
      jobTitle = line;
      break;
    }
  }
  const sectionMatchers = [
    { regex: /^(?:summary|profile|about\s*me|objective|professional\s*summary)$/i, type: "summary" },
    { regex: /^(?:experience|work\s*experience|employment|professional\s*experience|work\s*history)$/i, type: "experience" },
    { regex: /^(?:education|academic\s*background|academics|qualifications)$/i, type: "education" },
    { regex: /^(?:skills|technical\s*skills|core\s*competencies|expertise|tools)$/i, type: "skills" },
    { regex: /^(?:projects|key\s*projects|personal\s*projects)$/i, type: "projects" },
    { regex: /^(?:certifications|certificates|licenses|accreditations)$/i, type: "certifications" },
    { regex: /^(?:languages|language\s*proficiency)$/i, type: "languages" }
  ];
  const sections = [];
  let currentSection = { type: "other", heading: "Header", lines: [] };
  for (let i = headerIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    const cleanHeader = line.replace(/[:\-=_]+$/, "").trim();
    let matchedType = null;
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
  const summaryBlock = sections.find((s) => s.type === "summary");
  const summary = summaryBlock ? summaryBlock.lines.join(" ") : "";
  const expBlock = sections.find((s) => s.type === "experience");
  const experience = [];
  if (expBlock && expBlock.lines.length > 0) {
    let currentRole = null;
    const dateRegex = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}\s*[-–—to]+\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}|Present|Current)/i;
    for (const line of expBlock.lines) {
      const isBullet = line.startsWith("\u2022") || line.startsWith("-") || line.startsWith("*");
      const hasDate = dateRegex.test(line);
      if (hasDate || !isBullet && line.length < 80 && line.includes("|")) {
        if (currentRole) experience.push(currentRole);
        const dateMatch = line.match(dateRegex);
        let dates = dateMatch ? dateMatch[0].split(/[-–—]|to/i).map((d) => d.trim()) : ["", ""];
        let role = line.replace(dateRegex, "").replace(/[|•\(\)]/g, " ").trim();
        let company = "Company Name";
        if (role.includes(" at ")) {
          const parts = role.split(" at ");
          role = parts[0].trim();
          company = parts[1].trim();
        } else if (role.includes(",")) {
          const parts = role.split(",");
          role = parts[0].trim();
          company = parts[1].trim();
        }
        currentRole = {
          id: "exp_" + Math.random().toString(36).substring(2, 9),
          role: role || "Professional Role",
          company,
          startDate: dates[0] || "2022",
          endDate: dates[1] || "Present",
          current: (dates[1] || "").toLowerCase().includes("present"),
          description: "",
          highlights: []
        };
      } else if (currentRole) {
        const cleanLine = line.replace(/^[•\-\*]\s*/, "").trim();
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
  const eduBlock = sections.find((s) => s.type === "education");
  const education = [];
  if (eduBlock && eduBlock.lines.length > 0) {
    let currentEdu = null;
    for (const line of eduBlock.lines) {
      if (line.match(/(?:Bachelor|Master|BSc|BA|MSc|MBA|Ph\.?D|Associate|High School|Diploma|Degree)/i)) {
        if (currentEdu) education.push(currentEdu);
        const yearMatch = line.match(/(?:19|20)\d{2}/g);
        currentEdu = {
          id: "edu_" + Math.random().toString(36).substring(2, 9),
          degree: line.replace(/[-–—|]/g, " ").trim(),
          field: "",
          institution: "University / Institution",
          startDate: yearMatch ? yearMatch[0] : "2018",
          endDate: yearMatch && yearMatch[1] ? yearMatch[1] : yearMatch ? yearMatch[0] : "2022",
          description: ""
        };
      } else if (currentEdu && !currentEdu.institution && line.length < 70) {
        currentEdu.institution = line.trim();
      }
    }
    if (currentEdu) education.push(currentEdu);
  }
  const skillsBlock = sections.find((s) => s.type === "skills");
  const skills = [];
  if (skillsBlock && skillsBlock.lines.length > 0) {
    const rawSkillsText = skillsBlock.lines.join(", ");
    const items = rawSkillsText.split(/[,•|·\n]/).map((s) => s.replace(/^[•\-*]\s*/, "").trim()).filter((s) => s.length > 1 && s.length < 35);
    if (items.length > 0) {
      skills.push({
        id: "skill_main",
        category: "Core Competencies",
        items: Array.from(new Set(items)).slice(0, 24)
      });
    }
  }
  const langBlock = sections.find((s) => s.type === "languages");
  const languages = [];
  if (langBlock && langBlock.lines.length > 0) {
    for (const line of langBlock.lines) {
      const items = line.split(/[,|•]/);
      for (const item of items) {
        const clean = item.trim();
        if (clean.length > 1) {
          const parts = clean.split(/[-–:\(]/);
          languages.push({
            id: "lang_" + Math.random().toString(36).substring(2, 9),
            language: parts[0].trim(),
            proficiency: parts[1] ? parts[1].replace(/\)/g, "").trim() : "Professional"
          });
        }
      }
    }
  }
  const certBlock = sections.find((s) => s.type === "certifications");
  const certifications = [];
  if (certBlock && certBlock.lines.length > 0) {
    for (const line of certBlock.lines) {
      const clean = line.replace(/^[•\-\*]\s*/, "").trim();
      if (clean.length > 3) {
        certifications.push({
          id: "cert_" + Math.random().toString(36).substring(2, 9),
          name: clean,
          issuer: "Accredited Provider",
          issueDate: "2023"
        });
      }
    }
  }
  return {
    isScanned: false,
    rawTextPreview: text.slice(0, 300),
    personalInfo: {
      fullName: fullName || "Candidate Name",
      jobTitle: jobTitle || "Professional Title",
      email,
      phone,
      location: "",
      linkedin,
      github,
      website
    },
    summary,
    experience,
    education,
    skills,
    projects: [],
    certifications,
    languages
  };
}

// server/routes/extract.ts
var router3 = Router3();
var MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;
router3.post("/", async (req, res) => {
  try {
    const { filename, fileType, fileBase64, rawText } = req.body;
    if (fileBase64 && fileBase64.length > MAX_FILE_SIZE_BYTES * 4 / 3) {
      res.status(400).json({
        success: false,
        message: "File size exceeds maximum permitted limit of 5MB."
      });
      return;
    }
    let parsedText = "";
    if (rawText && typeof rawText === "string") {
      parsedText = rawText;
    } else if (fileBase64) {
      const buffer = Buffer.from(fileBase64, "base64");
      if (fileType === "docx" || filename && filename.toLowerCase().endsWith(".docx")) {
        parsedText = await extractTextFromDocx(buffer);
      } else if (fileType === "txt" || filename && filename.toLowerCase().endsWith(".txt")) {
        parsedText = buffer.toString("utf-8");
      } else if (fileType === "pdf" || filename && filename.toLowerCase().endsWith(".pdf")) {
        parsedText = buffer.toString("utf-8");
      } else {
        res.status(400).json({
          success: false,
          message: "Unsupported file type. Please upload a PDF, DOCX, or TXT file."
        });
        return;
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Please provide either document rawText or base64 encoded document."
      });
      return;
    }
    const extracted = parseCvText(parsedText);
    res.json({
      success: true,
      extracted,
      source: filename || "Direct Text Input"
    });
  } catch (err) {
    console.error("[Document Extraction Error]:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process document. Please ensure the file is not corrupted."
    });
  }
});
var extract_default = router3;

// server/routes/templates.ts
import express from "express";
var router4 = express.Router();
router4.get("/", async (req, res) => {
  try {
    const { countryId, category, enabledOnly } = req.query;
    const templates = await dbRepository.getTemplates({
      countryId: countryId ? String(countryId) : void 0,
      category: category ? String(category) : void 0,
      enabledOnly: enabledOnly === "true"
    });
    res.json({ success: true, count: templates.length, templates });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch templates" });
  }
});
router4.get("/:id", async (req, res) => {
  try {
    const template = await dbRepository.getTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.json({ success: true, template });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch template" });
  }
});
router4.post("/", async (req, res) => {
  try {
    const { name, countryId, category, defaultLanguage, htmlContent, cssContent, description, isCustomHtml } = req.body;
    if (!name || !countryId) {
      return res.status(400).json({ success: false, message: "Template name and countryId are required" });
    }
    const created = await dbRepository.createTemplate({
      ...req.body,
      isCustomHtml: isCustomHtml !== void 0 ? isCustomHtml : Boolean(htmlContent)
    });
    res.status(201).json({ success: true, template: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to create template" });
  }
});
router4.put("/:id", async (req, res) => {
  try {
    const updated = await dbRepository.updateTemplate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.json({ success: true, template: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to update template" });
  }
});
router4.post("/:id/duplicate", async (req, res) => {
  try {
    const duplicated = await dbRepository.duplicateTemplate(req.params.id);
    if (!duplicated) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.status(201).json({ success: true, template: duplicated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to duplicate template" });
  }
});
router4.delete("/:id", async (req, res) => {
  try {
    const deleted = await dbRepository.deleteTemplate(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Template not found or cannot be deleted" });
    }
    res.json({ success: true, message: "Template deleted successfully" });
  } catch (err) {
    res.status(400).json({ success: false, message: err?.message || "Failed to delete template" });
  }
});
var templates_default = router4;

// server/routes/countries.ts
import express2 from "express";
var router5 = express2.Router();
router5.get("/", async (_req, res) => {
  try {
    const countries = await dbRepository.getCountries();
    res.json({ success: true, count: countries.length, countries });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch countries" });
  }
});
router5.get("/:id", async (req, res) => {
  try {
    const country = await dbRepository.getCountryById(req.params.id);
    if (!country) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.json({ success: true, country });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch country" });
  }
});
router5.post("/", async (req, res) => {
  try {
    const { name, flag } = req.body;
    if (!name || !flag) {
      return res.status(400).json({ success: false, message: "Country name and flag are required" });
    }
    const created = await dbRepository.createCountry(req.body);
    res.status(201).json({ success: true, country: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to create country" });
  }
});
router5.put("/:id", async (req, res) => {
  try {
    const updated = await dbRepository.updateCountry(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.json({ success: true, country: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to update country" });
  }
});
router5.delete("/:id", async (req, res) => {
  try {
    const deleted = await dbRepository.deleteCountry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Country not found" });
    }
    res.json({ success: true, message: "Country deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to delete country" });
  }
});
var countries_default = router5;

// server/routes/translate.ts
import express3 from "express";
import { GoogleGenAI } from "@google/genai";
var router6 = express3.Router();
var CV_DICTIONARY = {
  ja: {
    "Full-Stack Engineer": "\u30D5\u30EB\u30B9\u30BF\u30C3\u30AF\u30A8\u30F3\u30B8\u30CB\u30A2",
    "Senior Software Engineer": "\u30B7\u30CB\u30A2\u30BD\u30D5\u30C8\u30A6\u30A7\u30A2\u30A8\u30F3\u30B8\u30CB\u30A2",
    "Staff Systems Architect": "\u30B9\u30BF\u30C3\u30D5\u30B7\u30B9\u30C6\u30E0\u30A2\u30FC\u30AD\u30C6\u30AF\u30C8",
    "Software Engineer": "\u30BD\u30D5\u30C8\u30A6\u30A7\u30A2\u30A8\u30F3\u30B8\u30CB\u30A2",
    "Product Manager": "\u30D7\u30ED\u30C0\u30AF\u30C8\u30DE\u30CD\u30FC\u30B8\u30E3\u30FC",
    "Bachelor of Science": "\u5B66\u58EB\uFF08\u7406\u5B66\uFF09",
    "Master of Science": "\u4FEE\u58EB\uFF08\u7406\u5B66\uFF09",
    "Computer Science": "\u30B3\u30F3\u30D4\u30E5\u30FC\u30BF\u30B5\u30A4\u30A8\u30F3\u30B9\u5C02\u653B",
    "University": "\u5927\u5B66",
    "Present": "\u73FE\u5728",
    "Languages & Frameworks": "\u30D7\u30ED\u30B0\u30E9\u30DF\u30F3\u30B0\u8A00\u8A9E\u30FB\u30D5\u30EC\u30FC\u30E0\u30EF\u30FC\u30AF",
    "Cloud & Infrastructure": "\u30AF\u30E9\u30A6\u30C9\u30FB\u30A4\u30F3\u30D5\u30E9\u30B9\u30C8\u30E9\u30AF\u30C1\u30E3",
    "Professional Working": "\u30D3\u30B8\u30CD\u30B9\u30EC\u30D9\u30EB",
    "Native / Bilingual": "\u6BCD\u56FD\u8A9E / \u30CD\u30A4\u30C6\u30A3\u30D6",
    "Publications & Speaking": "\u767B\u58C7\u30FB\u57F7\u7B46\u5B9F\u7E3E",
    "Career Objective": "\u5FD7\u671B\u52D5\u6A5F\u30FB\u76EE\u7684",
    "Summary": "\u8077\u52D9\u8981\u7D04\u30FB\u81EA\u5DF1PR",
    "Experience": "\u8077\u6B74",
    "Education": "\u5B66\u6B74",
    "Skills": "\u7279\u6280\u30FB\u30B9\u30AD\u30EB",
    "Certifications": "\u514D\u8A31\u30FB\u8CC7\u683C",
    "Projects": "\u4E3B\u306A\u958B\u767A\u5B9F\u7E3E",
    "Languages": "\u8A9E\u5B66\u529B"
  },
  de: {
    "Full-Stack Engineer": "Full-Stack-Entwickler",
    "Senior Software Engineer": "Senior Softwareentwickler",
    "Bachelor of Science": "Bachelor of Science (B.Sc.)",
    "Computer Science": "Informatik",
    "Present": "Heute",
    "Languages & Frameworks": "Programmiersprachen & Frameworks",
    "Professional Working": "Verhandlungssicher",
    "Native / Bilingual": "Muttersprache",
    "Summary": "Kurzprofil",
    "Experience": "Berufserfahrung",
    "Education": "Ausbildung & Studium",
    "Skills": "Kenntnisse & F\xE4higkeiten",
    "Certifications": "Zertifikate",
    "Projects": "Projekte",
    "Languages": "Sprachen"
  },
  fr: {
    "Full-Stack Engineer": "Ing\xE9nieur Full-Stack",
    "Senior Software Engineer": "Ing\xE9nieur Logiciel Senior",
    "Bachelor of Science": "Licence en Sciences",
    "Computer Science": "Informatique",
    "Present": "Pr\xE9sent",
    "Languages & Frameworks": "Langages et Frameworks",
    "Summary": "Profil Professionnel",
    "Experience": "Exp\xE9rience Professionnelle",
    "Education": "Formation & Dipl\xF4mes",
    "Skills": "Comp\xE9tences",
    "Certifications": "Certifications",
    "Languages": "Langues"
  },
  es: {
    "Full-Stack Engineer": "Ingeniero Full-Stack",
    "Senior Software Engineer": "Ingeniero de Software Senior",
    "Bachelor of Science": "Licenciatura en Ciencias",
    "Computer Science": "Ciencias de la Computaci\xF3n",
    "Present": "Actualidad",
    "Languages & Frameworks": "Lenguajes y Frameworks",
    "Summary": "Resumen Profesional",
    "Experience": "Experiencia Laboral",
    "Education": "Educaci\xF3n",
    "Skills": "Habilidades",
    "Certifications": "Certificaciones",
    "Languages": "Idiomas"
  },
  bn: {
    "Full-Stack Engineer": "\u09AB\u09C1\u09B2-\u09B8\u09CD\u099F\u09CD\u09AF\u09BE\u0995 \u0987\u099E\u09CD\u099C\u09BF\u09A8\u09BF\u09DF\u09BE\u09B0",
    "Senior Software Engineer": "\u09B8\u09BF\u09A8\u09BF\u09DF\u09B0 \u09B8\u09AB\u099F\u0993\u09DF\u09CD\u09AF\u09BE\u09B0 \u0987\u099E\u09CD\u099C\u09BF\u09A8\u09BF\u09DF\u09BE\u09B0",
    "Bachelor of Science": "\u09AC\u09CD\u09AF\u09BE\u099A\u09C7\u09B2\u09B0 \u0985\u09AC \u09B8\u09BE\u09DF\u09C7\u09A8\u09CD\u09B8 (\u09AC\u09BF\u098F\u09B8\u09B8\u09BF)",
    "Computer Science": "\u0995\u09AE\u09CD\u09AA\u09BF\u0989\u099F\u09BE\u09B0 \u09B8\u09BE\u09DF\u09C7\u09A8\u09CD\u09B8 \u0985\u09CD\u09AF\u09BE\u09A8\u09CD\u09A1 \u0987\u099E\u09CD\u099C\u09BF\u09A8\u09BF\u09DF\u09BE\u09B0\u09BF\u0982",
    "Present": "\u09AC\u09B0\u09CD\u09A4\u09AE\u09BE\u09A8",
    "Summary": "\u09AA\u09C7\u09B6\u09BE\u09A6\u09BE\u09B0 \u09B8\u09BE\u09B0\u09B8\u0982\u0995\u09CD\u09B7\u09C7\u09AA",
    "Experience": "\u0995\u09BE\u099C\u09C7\u09B0 \u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE",
    "Education": "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u0997\u09A4 \u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE",
    "Skills": "\u09A6\u0995\u09CD\u09B7\u09A4\u09BE \u0993 \u0995\u09BE\u09B0\u09BF\u0997\u09B0\u09BF \u099C\u09CD\u099E\u09BE\u09A8",
    "Certifications": "\u09B8\u09BE\u09B0\u09CD\u099F\u09BF\u09AB\u09BF\u0995\u09C7\u09B6\u09A8",
    "Languages": "\u09AD\u09BE\u09B7\u09BE\u099C\u09CD\u099E\u09BE\u09A8"
  }
};
function fallbackTranslate(text, targetLang) {
  if (!text || text.trim() === "") return text;
  const dict = CV_DICTIONARY[targetLang];
  if (!dict) return text;
  let result = text;
  for (const [key, val] of Object.entries(dict)) {
    const regex = new RegExp(`\\b${key}\\b`, "gi");
    result = result.replace(regex, val);
  }
  return result;
}
router6.post("/", async (req, res) => {
  const { items, sourceLang = "en", targetLang = "ja", context } = req.body;
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid or empty items array" });
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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });
      const responseText = response.text || "";
      const parsed = JSON.parse(responseText);
      if (parsed && Array.isArray(parsed.translations)) {
        return res.json({
          success: true,
          provider: "Gemini AI (Context-Aware)",
          translations: parsed.translations,
          notice: `Translated ${parsed.translations.length} fields accurately into ${targetLang}.`
        });
      }
    } catch (aiErr) {
      console.warn("[Translate] Gemini API call failed or quota reached, falling back to local dictionary:", aiErr?.message);
    }
  }
  const fallbackResults = items.map((item) => ({
    id: item.id,
    translatedText: fallbackTranslate(item.text, targetLang)
  }));
  return res.json({
    success: true,
    provider: "Standard CV Localization Engine (Deterministic)",
    translations: fallbackResults,
    notice: `Translated using standard ${targetLang.toUpperCase()} terminology. You can review and refine all fields before applying.`
  });
});
var translate_default = router6;

// src/routes/adminRoutes.ts
import { Router as Router4 } from "express";
import jwt3 from "jsonwebtoken";
import mammoth2 from "mammoth";

// src/config/templateFieldConfigs.ts
var DEFAULT_TEMPLATE_FIELD_CONFIGS = {
  // 1. JIS Japanese Rirekisho (履歴書)
  "japanese-rirekisho": {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: "3:4",
    allowCustomSections: false,
    notes: "Official JIS standard format. Displays Furigana, standard Japanese personal details, chronological education/work table, licenses, and motivation/self-PR.",
    sections: [
      "personalInfo",
      "education",
      "experience",
      "certifications",
      "summary",
      "additionalInfo"
    ],
    fields: [
      {
        id: "furiganaName",
        label: "\u3075\u308A\u304C\u306A (\u6C0F\u540D) Furigana Name",
        section: "personalInfo",
        type: "text",
        placeholder: "e.g. \u3084\u307E\u3060 \u305F\u308D\u3046 / \u30E4\u30DE\u30C0 \u30BF\u30ED\u30A6",
        helpText: "Phonetic Japanese kana reading for full candidate name",
        required: true,
        order: 1
      },
      {
        id: "gender",
        label: "\u6027\u5225 Gender",
        section: "personalInfo",
        type: "select",
        options: [
          { value: "\u7537", label: "\u7537 (Male)" },
          { value: "\u5973", label: "\u5973 (Female)" },
          { value: "\u8A18\u8F09\u306A\u3057", label: "\u8A18\u8F09\u306A\u3057 (Prefer not to say)" }
        ],
        helpText: "Optional on modern JIS forms",
        required: false,
        order: 2
      },
      {
        id: "dateOfBirth",
        label: "\u751F\u5E74\u6708\u65E5 Date of Birth",
        section: "personalInfo",
        type: "date",
        helpText: "Used to calculate official age on Japanese JIS forms",
        required: true,
        order: 3
      },
      {
        id: "furiganaAddress",
        label: "\u3075\u308A\u304C\u306A (\u4F4F\u6240) Furigana Address",
        section: "personalInfo",
        type: "text",
        placeholder: "e.g. \u3068\u3046\u304D\u3087\u3046\u3068\u3057\u3076\u3084\u304F...",
        helpText: "Phonetic Japanese kana reading for current address",
        order: 4
      },
      {
        id: "commuteTime",
        label: "\u901A\u52E4\u6642\u9593 Commute Time",
        section: "personalInfo",
        type: "text",
        placeholder: "e.g. \u7D0445\u5206 / 1\u6642\u959315\u5206",
        helpText: "Expected travel duration from home to workplace in Japan",
        order: 5
      },
      {
        id: "dependentsCount",
        label: "\u6276\u990A\u5BB6\u65CF\u6570 (\u914D\u5076\u8005\u3092\u9664\u304F) Dependents",
        section: "personalInfo",
        type: "text",
        placeholder: "e.g. 0\u4EBA / 1\u4EBA",
        helpText: "Number of legal dependents excluding spouse",
        order: 6
      },
      {
        id: "spouse",
        label: "\u914D\u5076\u8005 Spouse",
        section: "personalInfo",
        type: "select",
        options: [
          { value: "\u7121", label: "\u7121 (No)" },
          { value: "\u6709", label: "\u6709 (Yes)" }
        ],
        order: 7
      },
      {
        id: "spouseSupport",
        label: "\u914D\u5076\u8005\u306E\u6276\u990A\u7FA9\u52D9 Spouse Support Obligation",
        section: "personalInfo",
        type: "select",
        options: [
          { value: "\u7121", label: "\u7121 (No)" },
          { value: "\u6709", label: "\u6709 (Yes)" }
        ],
        order: 8
      },
      {
        id: "reasonForApplying",
        label: "\u5FD7\u671B\u52D5\u6A5F\u30FB\u7279\u6280\u30FB\u30A2\u30D4\u30FC\u30EB\u30DD\u30A4\u30F3\u30C8 Motivation & Reason for Applying",
        section: "summary",
        type: "textarea",
        placeholder: "\u8CB4\u793E\u306E\u7406\u5FF5\u304A\u3088\u3073\u4E8B\u696D\u5C55\u958B\u306B\u5F37\u304F\u5171\u9CF4\u3057\u3001\u3053\u308C\u307E\u3067\u306E\u958B\u767A\u7D4C\u9A13\u3092\u751F\u304B\u3057\u3066...",
        helpText: "Official motivation for applying to this specific company",
        required: true,
        order: 9
      },
      {
        id: "selfPr",
        label: "\u672C\u4EBA\u5E0C\u671B\u8A18\u5165\u6B04 Personal Requests / Conditions",
        section: "additionalInfo",
        type: "textarea",
        placeholder: "\u7D66\u4E0E\u30FB\u8077\u7A2E\u30FB\u52E4\u52D9\u6642\u9593\u30FB\u52E4\u52D9\u5730\u7B49\uFF08\u8CB4\u793E\u898F\u5B9A\u306B\u5F93\u3044\u307E\u3059\uFF09",
        helpText: 'Job conditions or "\u8CB4\u793E\u898F\u5B9A\u306B\u5F93\u3044\u307E\u3059" if standard',
        order: 10
      }
    ]
  },
  // 2. Japanese Shokumu Keirekisho (職務経歴書)
  "japanese-shokumu": {
    photoSupported: false,
    photoRecommended: false,
    allowCustomSections: true,
    notes: "Mid-career Japanese work history detailing projects, tech stack, achievements, and self-PR.",
    sections: [
      "personalInfo",
      "summary",
      "skills",
      "experience",
      "certifications",
      "additionalInfo"
    ],
    fields: [
      {
        id: "summary",
        label: "\u8077\u52D9\u8981\u7D04 Career Summary",
        section: "summary",
        type: "textarea",
        placeholder: "\u5927\u5B66\u5352\u696D\u5F8C\u3001Web\u30B7\u30B9\u30C6\u30E0\u958B\u767A\u304A\u3088\u3073\u30AF\u30E9\u30A6\u30C9\u57FA\u76E4\u69CB\u7BC9\u306B\u5F93\u4E8B...",
        required: true,
        order: 1
      },
      {
        id: "selfPr",
        label: "\u81EA\u5DF1PR Self PR & Strengths",
        section: "additionalInfo",
        type: "textarea",
        placeholder: "\u79C1\u306E\u5F37\u307F\u306F\u6280\u8853\u7684\u9069\u5FDC\u529B\u3068\u30AA\u30FC\u30CA\u30FC\u30B7\u30C3\u30D7\u3067\u3059...",
        required: true,
        order: 2
      }
    ]
  },
  // 3. Classic / European DACH Lebenslauf (Germany)
  classic: {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: "3:4",
    allowCustomSections: true,
    notes: "Traditional European tabular structure (German Lebenslauf) with formal date columns and optional demographic details.",
    sections: [
      "personalInfo",
      "personalDetails",
      "summary",
      "experience",
      "education",
      "skills",
      "languages",
      "certifications",
      "interests",
      "drivingLicence",
      "customSections"
    ],
    fields: [
      {
        id: "dateOfBirth",
        label: "Date of Birth (Geburtsdatum)",
        section: "personalDetails",
        type: "date",
        order: 1
      },
      {
        id: "placeOfBirth",
        label: "Place of Birth (Geburtsort)",
        section: "personalDetails",
        type: "text",
        placeholder: "e.g. Frankfurt am Main",
        order: 2
      },
      {
        id: "nationality",
        label: "Nationality (Staatsangeh\xF6rigkeit)",
        section: "personalDetails",
        type: "text",
        placeholder: "e.g. German / EU Citizen",
        order: 3
      },
      {
        id: "maritalStatus",
        label: "Marital Status (Familienstand)",
        section: "personalDetails",
        type: "select",
        options: [
          { value: "single", label: "Single (Ledig)" },
          { value: "married", label: "Married (Verheiratet)" },
          { value: "unspecified", label: "Prefer not to say" }
        ],
        order: 4
      }
    ]
  },
  // 4. Clean ATS Standard (US / UK / Canada)
  ats: {
    photoSupported: false,
    photoRecommended: false,
    allowCustomSections: true,
    notes: "Strict single-column text hierarchy formatted for 100% parse accuracy on Workday, Taleo, Greenhouse. Demographic fields and photos are omitted to prevent bias and parsing errors.",
    sections: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "customSections"
    ],
    fields: []
    // Uses pure standard contact and career fields
  },
  // 5. Modern Executive
  modern: {
    photoSupported: true,
    photoRecommended: false,
    photoAspect: "1:1",
    allowCustomSections: true,
    notes: "Versatile contemporary layout with clean typography and balanced whitespace.",
    sections: [
      "personalInfo",
      "summary",
      "objective",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "languages",
      "awards",
      "volunteering",
      "customSections"
    ],
    fields: []
  },
  // 6. Minimal Swiss
  minimal: {
    photoSupported: true,
    photoRecommended: false,
    photoAspect: "1:1",
    allowCustomSections: true,
    notes: "Clean two-column grid emphasizing whitespace and typographic clarity.",
    sections: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "languages",
      "customSections"
    ],
    fields: []
  },
  // 7. Executive Leadership (UAE & Global)
  executive: {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: "1:1",
    allowCustomSections: true,
    notes: "Executive banner with corporate badges, ideal for leadership and director profiles in UAE and multinational firms.",
    sections: [
      "personalInfo",
      "summary",
      "experience",
      "education",
      "skills",
      "projects",
      "certifications",
      "memberships",
      "awards",
      "languages",
      "customSections"
    ],
    fields: [
      {
        id: "nationality",
        label: "Nationality / Citizenship",
        section: "personalDetails",
        type: "text",
        placeholder: "e.g. British / UAE Resident",
        order: 1
      },
      {
        id: "visaStatus",
        label: "Visa / Residency Status",
        section: "personalDetails",
        type: "text",
        placeholder: "e.g. Golden Visa Holder / Employment Visa",
        order: 2
      }
    ]
  },
  // 8. Creative Designer
  creative: {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: "1:1",
    allowCustomSections: true,
    notes: "High-contrast portfolio sidebar layout for designers, art directors, and creative technologists.",
    sections: [
      "personalInfo",
      "summary",
      "projects",
      "experience",
      "education",
      "skills",
      "certifications",
      "awards",
      "customSections"
    ],
    fields: []
  },
  // 9. Engineering & Technical
  technical: {
    photoSupported: true,
    photoRecommended: false,
    photoAspect: "1:1",
    allowCustomSections: true,
    notes: "Monospace terminal accents, categorized tech stacks, and direct repository demo links.",
    sections: [
      "personalInfo",
      "summary",
      "skills",
      "experience",
      "projects",
      "certifications",
      "education",
      "languages",
      "customSections"
    ],
    fields: []
  },
  // 10. Academic / Research
  academic: {
    photoSupported: true,
    photoRecommended: false,
    photoAspect: "1:1",
    allowCustomSections: true,
    notes: "Formal scholarly format prioritizing publications, citations, grants, teaching, and fellowships.",
    sections: [
      "personalInfo",
      "summary",
      "education",
      "publications",
      "awards",
      "experience",
      "trainings",
      "memberships",
      "languages",
      "references",
      "customSections"
    ],
    fields: []
  },
  // 11. Bangladesh Corporate Biodata
  bangladesh_corporate: {
    photoSupported: true,
    photoRecommended: true,
    photoAspect: "1:1",
    allowCustomSections: true,
    notes: "Standard biodata format for Bangladeshi corporate and banking institutions.",
    sections: [
      "personalInfo",
      "personalDetails",
      "summary",
      "education",
      "experience",
      "skills",
      "languages",
      "references",
      "customSections"
    ],
    fields: [
      {
        id: "fatherName",
        label: "Father's Name",
        section: "personalDetails",
        type: "text",
        placeholder: "Father's Full Name",
        order: 1
      },
      {
        id: "motherName",
        label: "Mother's Name",
        section: "personalDetails",
        type: "text",
        placeholder: "Mother's Full Name",
        order: 2
      },
      {
        id: "religion",
        label: "Religion",
        section: "personalDetails",
        type: "text",
        placeholder: "e.g. Islam / Hinduism / Christianity",
        order: 3
      },
      {
        id: "bloodGroup",
        label: "Blood Group",
        section: "personalDetails",
        type: "select",
        options: [
          { value: "A+", label: "A+" },
          { value: "A-", label: "A-" },
          { value: "B+", label: "B+" },
          { value: "B-", label: "B-" },
          { value: "O+", label: "O+" },
          { value: "O-", label: "O-" },
          { value: "AB+", label: "AB+" },
          { value: "AB-", label: "AB-" }
        ],
        order: 4
      },
      {
        id: "permanentAddress",
        label: "Permanent Address (Village/District)",
        section: "personalDetails",
        type: "text",
        placeholder: "Permanent Address in Bangladesh",
        order: 5
      },
      {
        id: "nationalId",
        label: "National ID (NID) / Smart Card",
        section: "personalDetails",
        type: "text",
        placeholder: "10 or 17 digit NID number",
        order: 6
      }
    ]
  }
};
function getTemplateFieldConfig(templateId, customTemplates) {
  if (customTemplates && customTemplates.length > 0) {
    const custom = customTemplates.find((t) => t.id === templateId);
    if (custom && custom.fieldConfig) {
      return custom.fieldConfig;
    }
  }
  const builtIn = DEFAULT_TEMPLATE_FIELD_CONFIGS[templateId];
  if (builtIn) {
    return builtIn;
  }
  return DEFAULT_TEMPLATE_FIELD_CONFIGS.modern;
}

// src/services/adminService.ts
var MOCK_STORAGE_KEY = "cvcraft_admin_templates_mock";
var SIMULATED_LATENCY_MS = 60;
var AVAILABLE_CV_TOKENS = [
  // Styling
  { token: "{{themeColor}}", label: "Theme Color", description: "User-selected primary brand accent hex", example: "#2563eb", category: "Styling" },
  { token: "{{fontFamily}}", label: "Font Family", description: "Primary font family name (sans, serif, mono)", example: "sans-serif", category: "Styling" },
  { token: "{{fontSize}}", label: "Font Size", description: "Font scale preset (compact, normal, large)", example: "normal", category: "Styling" },
  // Personal Info
  { token: "{{personalInfo.fullName}}", label: "Candidate Name", description: "Full professional name", example: "Alex Vance", category: "Personal" },
  { token: "{{personalInfo.jobTitle}}", label: "Job Title", description: "Professional headline or target title", example: "Senior Systems Architect", category: "Personal" },
  { token: "{{personalInfo.email}}", label: "Email Address", description: "Candidate email address", example: "alex@example.com", category: "Personal" },
  { token: "{{personalInfo.phone}}", label: "Phone Number", description: "Phone contact", example: "+1 (555) 019-2834", category: "Personal" },
  { token: "{{personalInfo.location}}", label: "Location", description: "City, Region or Country", example: "Tokyo, Japan", category: "Personal" },
  { token: "{{personalInfo.website}}", label: "Website / Portfolio", description: "Personal website URL", example: "https://alexvance.dev", category: "Personal" },
  { token: "{{personalInfo.linkedin}}", label: "LinkedIn", description: "LinkedIn profile link or handle", example: "linkedin.com/in/alexvance", category: "Personal" },
  { token: "{{personalInfo.github}}", label: "GitHub", description: "GitHub username or link", example: "github.com/alexvance", category: "Personal" },
  { token: "{{personalInfo.photo}}", label: "Photo URL", description: "Headshot image URL or base64", example: "data:image/...", category: "Personal" },
  { token: "{{summary}}", label: "Professional Summary", description: "Executive career overview or objective", example: "Dedicated engineer with 6+ years...", category: "Personal" },
  // Regional / Demographic (Japan, Germany, UAE, Bangladesh)
  { token: "{{personalInfo.furiganaName}}", label: "Furigana Name (\u3075\u308A\u304C\u306A)", description: "Japanese phonetic reading for name", example: "\u3068\u3046\u304D\u3087\u3046 \u305F\u308D\u3046", category: "Regional / Japan" },
  { token: "{{personalInfo.furiganaAddress}}", label: "Furigana Address (\u3075\u308A\u304C\u306A)", description: "Japanese phonetic reading for address", example: "\u3068\u3046\u304D\u3087\u3046\u3068\u3061\u3088\u3060\u304F...", category: "Regional / Japan" },
  { token: "{{personalInfo.gender}}", label: "Gender (\u6027\u5225)", description: "Gender selection", example: "\u7537 / \u5973", category: "Regional / Japan" },
  { token: "{{personalInfo.dateOfBirth}}", label: "Date of Birth (\u751F\u5E74\u6708\u65E5)", description: "Birthdate string", example: "1995\u5E746\u670812\u65E5", category: "Regional / Japan" },
  { token: "{{personalInfo.commuteTime}}", label: "Commute Time (\u901A\u52E4\u6642\u9593)", description: "Japanese transit time to workplace", example: "\u7D041\u6642\u959315\u5206", category: "Regional / Japan" },
  { token: "{{personalInfo.dependentsCount}}", label: "Dependents (\u6276\u990A\u5BB6\u65CF\u6570)", description: "Count of dependents excluding spouse", example: "0\u4EBA", category: "Regional / Japan" },
  { token: "{{personalInfo.spouse}}", label: "Spouse (\u914D\u5076\u8005)", description: "Spouse status in Japan", example: "\u7121", category: "Regional / Japan" },
  { token: "{{personalInfo.selfPr}}", label: "Self PR (\u81EA\u5DF1PR)", description: "Japanese Self-PR & motivation statement", example: "\u79C1\u306E\u5F37\u307F\u306F\u6280\u8853\u7684\u9069\u5FDC\u529B\u3068...", category: "Regional / Japan" },
  { token: "{{personalInfo.nationality}}", label: "Nationality", description: "Citizenship / Nationality", example: "Japanese / American", category: "Regional / Japan" },
  { token: "{{personalInfo.visaStatus}}", label: "Visa Status", description: "Residency / Work Authorization", example: "Permanent Resident", category: "Regional / Japan" },
  // Loops
  { token: "{{#experience}} ... {{/experience}}", label: "Experience Loop", description: "Iterates through roles: {{role}}, {{company}}, {{startDate}}, {{endDate}}, {{description}}, {{highlights}}", example: "{{#experience}}...{{/experience}}", category: "Experience" },
  { token: "{{#education}} ... {{/education}}", label: "Education Loop", description: "Iterates through degrees: {{degree}}, {{field}}, {{institution}}, {{startDate}}, {{endDate}}, {{gpa}}", example: "{{#education}}...{{/education}}", category: "Education" },
  { token: "{{#skills}} ... {{/skills}}", label: "Skills Loop", description: "Iterates through skill groups: {{category}}, {{items}}", example: "{{#skills}}...{{/skills}}", category: "Skills" },
  { token: "{{#projects}} ... {{/projects}}", label: "Projects Loop", description: "Iterates through projects: {{name}}, {{description}}, {{link}}", example: "{{#projects}}...{{/projects}}", category: "Projects" }
];
var DEFAULT_TEMPLATE_HTML = `<!-- Custom Country-Wise Template -->
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
      <span>\u{1F4CD} {{personalInfo.location}}</span>
      <span>\u2709\uFE0F {{personalInfo.email}}</span>
      <span>\u{1F4DE} {{personalInfo.phone}}</span>
      {{#if personalInfo.website}}<span>\u{1F310} {{personalInfo.website}}</span>{{/if}}
      {{#if personalInfo.github}}<span>\u{1F4BB} {{personalInfo.github}}</span>{{/if}}
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
        <div class="text-[11px] font-semibold text-slate-600 mb-1">{{company}} \u2022 {{location}}</div>
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
var DEFAULT_TEMPLATE_CSS = `/* Scoped Template Stylesheet */
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
var SEED_TEMPLATES2 = [
  {
    id: "japanese-rirekisho",
    name: "JIS Standard Rirekisho (\u5C65\u6B74\u66F8)",
    countryId: "japan",
    category: "traditional",
    description: "Official Japanese standard JIS Rirekisho with Furigana (\u3075\u308A\u304C\u306A), 30x40mm photo frame, chronological Education & Work grid ending with \u4EE5\u4E0A, licenses, and Self-PR.",
    defaultLanguage: "ja",
    version: "1.2.0",
    status: "published",
    documentType: "rirekisho",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#0f766e",
    tags: ["JIS", "Furigana", "Japan", "Official"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Initial JIS standard baseline specification",
        createdAt: "2026-08-01T00:00:00.000Z",
        author: "CVCraft Core Team"
      },
      {
        version: "1.1.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Added furigana phonetic support and 30x40mm photo alignment",
        createdAt: "2026-09-15T00:00:00.000Z",
        author: "CVCraft Japan Localization"
      },
      {
        version: "1.2.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Refined chronological grid with \u4EE5\u4E0A right alignment",
        createdAt: "2026-10-20T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-10-20T00:00:00.000Z"
  },
  {
    id: "japanese-shokumu",
    name: "Japanese Shokumu Keirekisho (\u8077\u52D9\u7D4C\u6B74\u66F8)",
    countryId: "japan",
    category: "executive",
    description: "Detailed Japanese career progression document detailing project responsibilities, team sizes, and technical stack.",
    defaultLanguage: "ja",
    version: "1.0.0",
    status: "published",
    documentType: "shokumu",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#1e3a8a",
    tags: ["Japan", "Mid-Career", "Technical"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Standard Japanese career history blueprint",
        createdAt: "2026-08-10T00:00:00.000Z",
        author: "CVCraft Japan Localization"
      }
    ],
    createdAt: "2026-08-10T00:00:00.000Z",
    updatedAt: "2026-08-10T00:00:00.000Z"
  },
  {
    id: "ats",
    name: "Clean ATS Standard",
    countryId: "usa",
    category: "ats",
    description: "High-parse single column layout optimized for Greenhouse, Workday, and Taleo.",
    defaultLanguage: "en",
    version: "1.0.0",
    status: "published",
    documentType: "resume",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#2563eb",
    tags: ["ATS-Friendly", "Single Column", "USA"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Universal parser-compliant single column layout",
        createdAt: "2026-07-01T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-07-01T00:00:00.000Z"
  },
  {
    id: "modern",
    name: "Modern Executive",
    countryId: "usa",
    category: "modern",
    description: "Clean modern layout with subtle accents and strong typography.",
    defaultLanguage: "en",
    version: "1.1.0",
    status: "published",
    documentType: "resume",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#1d4ed8",
    tags: ["Modern", "Corporate", "USA"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Initial layout release",
        createdAt: "2026-07-01T00:00:00.000Z",
        author: "Admin"
      },
      {
        version: "1.1.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Enhanced timeline vertical accents",
        createdAt: "2026-09-01T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z"
  },
  {
    id: "classic",
    name: "European Academic & Classic",
    countryId: "germany",
    category: "classic",
    description: "Structured serif layout with distinct date columns, ideal for German Lebenslauf and European institutions.",
    defaultLanguage: "de",
    version: "1.0.0",
    status: "published",
    documentType: "cv",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#831843",
    tags: ["Academic", "Tabular", "Germany"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "German Lebenslauf tabular structure",
        createdAt: "2026-07-15T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-07-15T00:00:00.000Z",
    updatedAt: "2026-07-15T00:00:00.000Z"
  },
  {
    id: "minimal",
    name: "Nordic Minimalist",
    countryId: "eu",
    category: "minimal",
    description: "Crisp whitespace and understated typographic scale.",
    defaultLanguage: "en",
    version: "1.0.0",
    status: "published",
    documentType: "cv",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#18181b",
    tags: ["Minimalist", "EU"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Initial minimalist release",
        createdAt: "2026-08-01T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-08-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "executive",
    name: "Gulf & Global Executive",
    countryId: "uae",
    category: "executive",
    description: "Executive banner with corporate badges, ideal for leadership profiles in UAE and multinational roles.",
    defaultLanguage: "en",
    version: "1.0.0",
    status: "published",
    documentType: "cv",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#b45309",
    tags: ["Executive", "Photo", "UAE"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Executive header with photo banner",
        createdAt: "2026-08-20T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-08-20T00:00:00.000Z",
    updatedAt: "2026-08-20T00:00:00.000Z"
  },
  {
    id: "creative",
    name: "Designer & Portfolio",
    countryId: "uk",
    category: "creative",
    description: "Dynamic two-column sidebar layout for creative agencies and tech startups.",
    defaultLanguage: "en",
    version: "1.0.0",
    status: "published",
    documentType: "cv",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#059669",
    tags: ["Creative", "Portfolio", "UK"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Portfolio cards and dark sidebar layout",
        createdAt: "2026-09-01T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z"
  },
  {
    id: "technical",
    name: "Systems Engineer Tech",
    countryId: "australia",
    category: "technical",
    description: "Data-dense grid highlighting core tech stacks, cloud certifications, and project links.",
    defaultLanguage: "en",
    version: "1.0.0",
    status: "published",
    documentType: "cv",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#0891b2",
    tags: ["Tech", "Engineering", "Australia"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Terminal and stack matrix design",
        createdAt: "2026-09-10T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-09-10T00:00:00.000Z",
    updatedAt: "2026-09-10T00:00:00.000Z"
  },
  {
    id: "bangladesh_corporate",
    name: "Bangladesh Corporate & Bank Biodata",
    countryId: "bangladesh",
    category: "classic",
    description: "Comprehensive biodata layout including permanent address, father/mother name, religion, blood group, and references.",
    defaultLanguage: "en",
    version: "1.0.0",
    status: "published",
    documentType: "biodata",
    isCustomHtml: false,
    enabled: true,
    isSystem: true,
    thumbnailColor: "#166534",
    tags: ["Biodata", "Corporate", "Bangladesh"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Corporate bank biodata standard layout",
        createdAt: "2026-09-18T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-09-18T00:00:00.000Z",
    updatedAt: "2026-09-18T00:00:00.000Z"
  },
  {
    id: "tpl_tokyo_custom",
    name: "Tokyo Creative Dev (Custom HTML)",
    countryId: "japan",
    category: "custom",
    description: "Modern bilingual engineering template with custom dark sidebar and Japanese Self-PR section.",
    defaultLanguage: "ja",
    version: "1.0.2",
    status: "draft",
    documentType: "shokumu",
    isCustomHtml: true,
    htmlContent: DEFAULT_TEMPLATE_HTML,
    cssContent: DEFAULT_TEMPLATE_CSS,
    enabled: false,
    isSystem: false,
    thumbnailColor: "#d97706",
    tags: ["Tokyo", "Custom", "Draft"],
    versions: [
      {
        version: "1.0.0",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Initial draft upload",
        createdAt: "2026-10-25T00:00:00.000Z",
        author: "Admin"
      },
      {
        version: "1.0.1",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Fixed font family styling",
        createdAt: "2026-10-28T00:00:00.000Z",
        author: "Admin"
      },
      {
        version: "1.0.2",
        htmlContent: DEFAULT_TEMPLATE_HTML,
        cssContent: DEFAULT_TEMPLATE_CSS,
        changeNote: "Configured furigana and Japanese typography rules",
        createdAt: "2026-10-29T00:00:00.000Z",
        author: "Admin"
      }
    ],
    createdAt: "2026-10-25T00:00:00.000Z",
    updatedAt: "2026-10-29T00:00:00.000Z"
  }
];
var AdminTemplateMockStorage = class {
  constructor() {
    this.templates = [];
    this.initStore();
  }
  initStore() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      this.templates = JSON.parse(JSON.stringify(SEED_TEMPLATES2));
      return;
    }
    try {
      const stored = localStorage.getItem(MOCK_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((t) => t.id));
          const toAdd = SEED_TEMPLATES2.filter((s) => !existingIds.has(s.id));
          this.templates = [...parsed, ...toAdd];
          this.persist();
          return;
        }
      }
    } catch (e) {
      console.warn("[AdminService] localStorage read warning, initializing defaults:", e);
    }
    this.templates = JSON.parse(JSON.stringify(SEED_TEMPLATES2));
    this.persist();
  }
  persist() {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }
    try {
      localStorage.setItem(MOCK_STORAGE_KEY, JSON.stringify(this.templates));
    } catch (e) {
      console.warn("[AdminService] localStorage persist warning:", e);
    }
  }
  async delay() {
    return new Promise((resolve) => setTimeout(resolve, SIMULATED_LATENCY_MS));
  }
  async getAll(filter) {
    await this.delay();
    let result = [...this.templates];
    if (filter?.countryId && filter.countryId !== "all") {
      const cId = filter.countryId.toLowerCase().trim();
      result = result.filter((t) => t.countryId?.toLowerCase() === cId);
    }
    if (filter?.category && filter.category !== "all") {
      result = result.filter((t) => t.category === filter.category);
    }
    if (filter?.status && filter.status !== "all") {
      result = result.filter((t) => (t.status || (t.enabled ? "published" : "draft")) === filter.status);
    }
    if (filter?.enabledOnly) {
      result = result.filter((t) => t.enabled !== false && t.status !== "archived");
    }
    if (filter?.search && filter.search.trim()) {
      const q = filter.search.toLowerCase().trim();
      result = result.filter(
        (t) => t.name.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.countryId?.toLowerCase().includes(q) || t.tags?.some((tag) => tag.toLowerCase().includes(q))
      );
    }
    return result.map((t) => ({
      ...t,
      fieldConfig: t.fieldConfig || getTemplateFieldConfig(t.id)
    })).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }
  async getById(id) {
    await this.delay();
    const found = this.templates.find((t) => t.id === id);
    if (!found) return null;
    const cloned = JSON.parse(JSON.stringify(found));
    cloned.fieldConfig = cloned.fieldConfig || getTemplateFieldConfig(cloned.id);
    return cloned;
  }
  async create(payload) {
    await this.delay();
    if (!payload.name?.trim()) {
      throw new Error("Template name is required.");
    }
    if (!payload.countryId?.trim()) {
      throw new Error("Target country is required.");
    }
    const templateId = payload.id?.trim() || `custom_${payload.countryId.toLowerCase()}_${Date.now().toString(36)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const initialVersion = payload.version || "1.0.0";
    const newTemplate = {
      id: templateId,
      name: payload.name.trim(),
      countryId: payload.countryId.toLowerCase().trim(),
      category: payload.category || "modern",
      description: payload.description || "Custom country-wise CV template.",
      defaultLanguage: payload.defaultLanguage || "en",
      version: initialVersion,
      status: payload.status || "draft",
      documentType: payload.documentType || "cv",
      isCustomHtml: payload.isCustomHtml !== void 0 ? payload.isCustomHtml : true,
      htmlContent: payload.htmlContent || DEFAULT_TEMPLATE_HTML,
      cssContent: payload.cssContent || DEFAULT_TEMPLATE_CSS,
      fieldConfig: payload.fieldConfig || getTemplateFieldConfig(templateId),
      enabled: payload.enabled !== void 0 ? payload.enabled : false,
      isSystem: false,
      thumbnailColor: payload.thumbnailColor || "#2563eb",
      tags: payload.tags || [payload.countryId.toUpperCase(), "Custom"],
      versions: [
        {
          version: initialVersion,
          htmlContent: payload.htmlContent || DEFAULT_TEMPLATE_HTML,
          cssContent: payload.cssContent || DEFAULT_TEMPLATE_CSS,
          changeNote: "Initial draft template creation",
          createdAt: now,
          author: "Admin"
        }
      ],
      importedFrom: payload.importedFrom,
      createdAt: now,
      updatedAt: now
    };
    this.templates.unshift(newTemplate);
    this.persist();
    return JSON.parse(JSON.stringify(newTemplate));
  }
  async update(id, updates) {
    await this.delay();
    const index = this.templates.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new Error(`Template not found with ID "${id}".`);
    }
    const existing = this.templates[index];
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const updated = {
      ...existing,
      ...updates,
      id: existing.id,
      // ID remains immutable
      isSystem: existing.isSystem,
      // System flag preserved
      updatedAt: now
    };
    if (updates.htmlContent && updates.htmlContent !== existing.htmlContent || updates.cssContent && updates.cssContent !== existing.cssContent) {
      if (!updated.versions || updated.versions.length === 0) {
        updated.versions = [
          {
            version: updated.version,
            htmlContent: updated.htmlContent || "",
            cssContent: updated.cssContent || "",
            changeNote: "Updated template source code",
            createdAt: now,
            author: "Admin"
          }
        ];
      }
    }
    this.templates[index] = updated;
    this.persist();
    return JSON.parse(JSON.stringify(updated));
  }
  async delete(id) {
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
  async duplicate(id, newName) {
    await this.delay();
    const source = this.templates.find((t) => t.id === id);
    if (!source) {
      throw new Error(`Source template not found with ID "${id}".`);
    }
    const cloneId = `${source.id}_copy_${Date.now().toString(36).substring(4)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const duplicate = {
      ...JSON.parse(JSON.stringify(source)),
      id: cloneId,
      name: newName?.trim() || `${source.name} (Copy)`,
      version: "1.0.0",
      status: "draft",
      enabled: false,
      isSystem: false,
      versions: [
        {
          version: "1.0.0",
          htmlContent: source.htmlContent || DEFAULT_TEMPLATE_HTML,
          cssContent: source.cssContent || DEFAULT_TEMPLATE_CSS,
          changeNote: `Duplicated from ${source.name} (v${source.version})`,
          createdAt: now,
          author: "Admin"
        }
      ],
      createdAt: now,
      updatedAt: now
    };
    this.templates.unshift(duplicate);
    this.persist();
    return JSON.parse(JSON.stringify(duplicate));
  }
  async bumpVersion(id, req) {
    await this.delay();
    const template = this.templates.find((t) => t.id === id);
    if (!template) {
      throw new Error(`Template not found with ID "${id}".`);
    }
    const currentVer = template.version || "1.0.0";
    let nextVersion = req.customVersion?.trim();
    if (!nextVersion) {
      const parts = currentVer.split(".").map((p) => parseInt(p, 10) || 0);
      let [major = 1, minor = 0, patch = 0] = parts;
      if (req.bumpType === "major") {
        major += 1;
        minor = 0;
        patch = 0;
      } else if (req.bumpType === "minor") {
        minor += 1;
        patch = 0;
      } else {
        patch += 1;
      }
      nextVersion = `${major}.${minor}.${patch}`;
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const effectiveHtml = req.htmlContent !== void 0 ? req.htmlContent : template.htmlContent || DEFAULT_TEMPLATE_HTML;
    const effectiveCss = req.cssContent !== void 0 ? req.cssContent : template.cssContent || DEFAULT_TEMPLATE_CSS;
    const newVersionEntry = {
      version: nextVersion,
      htmlContent: effectiveHtml,
      cssContent: effectiveCss,
      changeNote: req.changeNote?.trim() || `Version ${nextVersion} release`,
      createdAt: now,
      author: req.author || "Admin"
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
  async rollbackVersion(id, targetVersion) {
    await this.delay();
    const template = this.templates.find((t) => t.id === id);
    if (!template) {
      throw new Error(`Template not found with ID "${id}".`);
    }
    const matchedVersion = template.versions?.find((v) => v.version === targetVersion);
    if (!matchedVersion) {
      throw new Error(`Version "${targetVersion}" not found in template history.`);
    }
    const now = (/* @__PURE__ */ new Date()).toISOString();
    template.htmlContent = matchedVersion.htmlContent;
    template.cssContent = matchedVersion.cssContent;
    template.updatedAt = now;
    template.versions?.unshift({
      version: `${template.version}-rollback-v${targetVersion}`,
      htmlContent: matchedVersion.htmlContent,
      cssContent: matchedVersion.cssContent,
      changeNote: `Restored layout from version ${targetVersion}`,
      createdAt: now,
      author: "Admin"
    });
    this.persist();
    return JSON.parse(JSON.stringify(template));
  }
  async setStatus(id, status) {
    await this.delay();
    const template = this.templates.find((t) => t.id === id);
    if (!template) {
      throw new Error(`Template not found with ID "${id}".`);
    }
    template.status = status;
    template.enabled = status === "published";
    template.updatedAt = (/* @__PURE__ */ new Date()).toISOString();
    this.persist();
    return JSON.parse(JSON.stringify(template));
  }
  resetCatalog() {
    this.templates = JSON.parse(JSON.stringify(SEED_TEMPLATES2));
    this.persist();
  }
};
var mockStore = new AdminTemplateMockStorage();
function validateTemplate(html, css) {
  const errors = [];
  const warnings = [];
  const detectedTokens = [];
  const rawHtml = html || "";
  const rawCss = css || "";
  if (/<script\b[^>]*>([\s\S]*?)<\/script>/gi.test(rawHtml)) {
    errors.push("Arbitrary <script> tags are strictly prohibited for application security.");
  }
  if (/on\w+\s*=/i.test(rawHtml)) {
    errors.push("Inline JavaScript event handlers (e.g. onload, onclick, onerror) are not allowed.");
  }
  if (/javascript:/i.test(rawHtml) || /javascript:/i.test(rawCss)) {
    errors.push("JavaScript URI protocols are strictly prohibited.");
  }
  if (/<iframe\b|<object\b|<embed\b/gi.test(rawHtml)) {
    errors.push("Embedded external frames (<iframe/object/embed>) are not permitted.");
  }
  const loopTags = ["experience", "education", "skills", "projects", "certifications", "languages", "customSections"];
  for (const tag of loopTags) {
    const openCount = (rawHtml.match(new RegExp(`\\{\\{#${tag}\\}\\}`, "g")) || []).length;
    const closeCount = (rawHtml.match(new RegExp(`\\{\\{/${tag}\\}\\}`, "g")) || []).length;
    if (openCount !== closeCount) {
      errors.push(`Mismatched loop tag: {{#${tag}}} (${openCount} opened) vs {{/${tag}}} (${closeCount} closed).`);
    }
  }
  const ifCount = (rawHtml.match(/\{\{#if\s+[\w.]+\}\}/g) || []).length;
  const ifCloseCount = (rawHtml.match(/\{\{\/if\}\}/g) || []).length;
  if (ifCount !== ifCloseCount) {
    errors.push(`Mismatched conditional tag: {{#if ...}} (${ifCount} opened) vs {{/if}} (${ifCloseCount} closed).`);
  }
  AVAILABLE_CV_TOKENS.forEach((t) => {
    const rawToken = t.token.replace(/\s*\.\.\.\s*\{\{\/\w+\}\}/, "");
    if (rawHtml.includes(rawToken)) {
      detectedTokens.push(t.token);
    }
  });
  if (!rawHtml.includes("{{personalInfo.fullName}}")) {
    warnings.push("Template does not include candidate name token {{personalInfo.fullName}}.");
  }
  if (!rawHtml.includes("{{#experience}}")) {
    warnings.push("Template does not include the {{#experience}} employment loop.");
  }
  if (!rawHtml.includes("{{#education}}")) {
    warnings.push("Template does not include the {{#education}} academic qualifications loop.");
  }
  if (!rawHtml.includes("{{#skills}}")) {
    warnings.push("Template does not include the {{#skills}} competency loop.");
  }
  if (/(^|\})\s*(body|html|\*)\s*\{/i.test(rawCss)) {
    warnings.push("CSS targets global selectors (body, html, or *). Styles should be scoped to .custom-cv-document.");
  }
  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    detectedTokens: Array.from(new Set(detectedTokens)),
    sanitizedHtmlPreview: rawHtml.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  };
}

// src/routes/adminRoutes.ts
var router7 = Router4();
var JWT_SECRET3 = process.env.JWT_SECRET || "cvcraft_super_secret_jwt_key_change_in_production_2026";
var ADMIN_KEY = process.env.ADMIN_KEY || "cvcraft_admin_secret_key_2026";
var ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "nirbodh3@gmail.com,admin@cvcraft.com,admin@example.com").toLowerCase().split(",").map((e) => e.trim()).filter(Boolean);
function requireAdminAuth(req, res, next) {
  const adminKeyHeader = req.headers["x-admin-key"];
  if (adminKeyHeader && adminKeyHeader === ADMIN_KEY) {
    req.isAdmin = true;
    req.user = {
      id: "admin_sys",
      email: "nirbodh3@gmail.com",
      name: "Super Administrator",
      role: "superadmin"
    };
    return next();
  }
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    if (process.env.NODE_ENV !== "production" && req.headers["x-admin-role"] === "true") {
      req.isAdmin = true;
      req.user = {
        id: "dev_admin",
        email: "nirbodh3@gmail.com",
        name: "Dev Super Admin",
        role: "superadmin"
      };
      return next();
    }
    res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a valid admin token or secret key."
    });
    return;
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt3.verify(token, JWT_SECRET3);
    if (decoded.status === "suspended") {
      res.status(403).json({
        success: false,
        message: "Your administrator account has been suspended."
      });
      return;
    }
    req.user = decoded;
    const userEmail = (decoded.email || "").toLowerCase().trim();
    const hasAdminEmail = ADMIN_EMAILS.includes(userEmail) || userEmail.endsWith("@admin.cvcraft.com");
    const isSuperAdminRole = decoded.role === "superadmin" || decoded.role === "admin";
    if (hasAdminEmail || isSuperAdminRole || process.env.NODE_ENV !== "production") {
      req.isAdmin = true;
      return next();
    }
    res.status(403).json({
      success: false,
      message: "Forbidden: Super Administrator privileges required."
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json({
        success: false,
        message: "Admin session expired. Please log in again."
      });
      return;
    }
    res.status(401).json({
      success: false,
      message: "Invalid authorization token."
    });
  }
}
router7.use(requireAdminAuth);
router7.get("/stats", async (req, res) => {
  try {
    const stats = await dbRepository.getAdminStats();
    res.json({ success: true, ...stats });
  } catch (err) {
    console.error("[Admin Stats Error]:", err);
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch admin stats" });
  }
});
router7.get("/users", async (req, res) => {
  try {
    const { search, role, status } = req.query;
    const users = await dbRepository.getUsers({
      search: search ? String(search) : void 0,
      role: role ? String(role) : void 0,
      status: status ? String(status) : void 0
    });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch users" });
  }
});
router7.patch("/users/:id/role", async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    if (!["user", "admin", "superadmin"].includes(role)) {
      res.status(400).json({ success: false, message: "Invalid role specified." });
      return;
    }
    const updated = await dbRepository.updateUserRole(id, role);
    if (!updated) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "USER_ROLE_CHANGED",
      entityType: "user",
      entityId: id,
      details: `Changed role of user "${updated.name}" (${updated.email}) to "${role}".`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: `User role updated to ${role}`, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to update user role" });
  }
});
router7.patch("/users/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["active", "suspended"].includes(status)) {
      res.status(400).json({ success: false, message: 'Status must be "active" or "suspended".' });
      return;
    }
    const updated = await dbRepository.updateUserStatus(id, status);
    if (!updated) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: status === "suspended" ? "USER_SUSPENDED" : "USER_REACTIVATED",
      entityType: "user",
      entityId: id,
      details: `${status === "suspended" ? "Suspended" : "Reactivated"} account for user "${updated.name}" (${updated.email}).`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: `User account is now ${status}`, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to update user status" });
  }
});
router7.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbRepository.deleteUser(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "USER_DELETED",
      entityType: "user",
      entityId: id,
      details: `Permanently deleted user ID ${id} and associated CV records.`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: "User account and data deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to delete user" });
  }
});
router7.get("/countries", async (_req, res) => {
  try {
    const countries = await dbRepository.getCountries();
    res.json({ success: true, count: countries.length, countries });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch countries" });
  }
});
router7.post("/countries", async (req, res) => {
  try {
    const { name, flag } = req.body;
    if (!name || !flag) {
      res.status(400).json({ success: false, message: "Country name and flag emoji are required." });
      return;
    }
    const created = await dbRepository.createCountry(req.body);
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "COUNTRY_CREATED",
      entityType: "country",
      entityId: created.id,
      details: `Added new country "${created.name}" (${created.flag}) to country library.`,
      ipAddress: req.ip
    });
    res.status(201).json({ success: true, country: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to create country" });
  }
});
router7.put("/countries/:id", async (req, res) => {
  try {
    const updated = await dbRepository.updateCountry(req.params.id, req.body);
    if (!updated) {
      res.status(404).json({ success: false, message: "Country not found" });
      return;
    }
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "COUNTRY_UPDATED",
      entityType: "country",
      entityId: req.params.id,
      details: `Updated conventions for country "${updated.name}".`,
      ipAddress: req.ip
    });
    res.json({ success: true, country: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to update country" });
  }
});
router7.delete("/countries/:id", async (req, res) => {
  try {
    const deleted = await dbRepository.deleteCountry(req.params.id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Country not found" });
      return;
    }
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "COUNTRY_DELETED",
      entityType: "country",
      entityId: req.params.id,
      details: `Deleted country "${req.params.id}" from library.`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: "Country removed successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to delete country" });
  }
});
router7.get("/templates", async (req, res) => {
  try {
    const { countryId, category, status, search } = req.query;
    const templates = await dbRepository.getTemplates({
      countryId: countryId ? String(countryId) : void 0,
      category: category ? String(category) : void 0,
      enabledOnly: false
    });
    let list = templates.map((t) => t.toObject ? t.toObject() : { ...t });
    if (status && status !== "all") {
      list = list.filter((t) => (t.status || (t.enabled ? "published" : "draft")) === status);
    }
    if (search && typeof search === "string" && search.trim()) {
      const q = search.toLowerCase().trim();
      list = list.filter(
        (t) => t.name.toLowerCase().includes(q) || t.countryId?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q)
      );
    }
    res.json({ success: true, count: list.length, templates: list });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch templates" });
  }
});
router7.get("/templates/:id", async (req, res) => {
  try {
    const template = await dbRepository.getTemplateById(req.params.id);
    if (!template) {
      res.status(404).json({ success: false, message: "Template not found" });
      return;
    }
    const data = template.toObject ? template.toObject() : { ...template };
    res.json({ success: true, template: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch template" });
  }
});
router7.post("/templates", async (req, res) => {
  try {
    const {
      name,
      countryId,
      category = "modern",
      defaultLanguage = "en",
      documentType = "cv",
      htmlContent = "",
      cssContent = "",
      description = "",
      tags = [],
      status = "draft"
    } = req.body;
    if (!name?.trim() || !countryId?.trim()) {
      res.status(400).json({ success: false, message: "Template name and target countryId are required." });
      return;
    }
    const validation = validateTemplate(htmlContent, cssContent);
    if (!validation.isValid) {
      res.status(400).json({
        success: false,
        message: "Template code failed security or syntax validation.",
        errors: validation.errors
      });
      return;
    }
    const templateId = req.body.id || `tpl_${countryId.toLowerCase()}_${Date.now().toString(36)}`;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const version = req.body.version || "1.0.0";
    const created = await dbRepository.createTemplate({
      id: templateId,
      name: name.trim(),
      countryId: countryId.toLowerCase().trim(),
      category,
      defaultLanguage,
      documentType,
      description,
      version,
      status,
      enabled: status === "published",
      isCustomHtml: true,
      htmlContent,
      cssContent,
      tags,
      isSystem: false,
      versions: [
        {
          version,
          htmlContent,
          cssContent,
          changeNote: "Initial draft template creation",
          createdAt: now,
          author: req.user?.name || "Admin"
        }
      ]
    });
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "TEMPLATE_CREATED",
      entityType: "template",
      entityId: created.id,
      details: `Created new ${documentType.toUpperCase()} template "${created.name}" for country "${countryId}".`,
      ipAddress: req.ip
    });
    res.status(201).json({ success: true, message: "Template created successfully in draft status.", template: created });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to create template" });
  }
});
router7.put("/templates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbRepository.getTemplateById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Template not found" });
      return;
    }
    const { htmlContent, cssContent } = req.body;
    if (htmlContent !== void 0 || cssContent !== void 0) {
      const validation = validateTemplate(
        htmlContent !== void 0 ? htmlContent : existing.htmlContent || "",
        cssContent !== void 0 ? cssContent : existing.cssContent || ""
      );
      if (!validation.isValid) {
        res.status(400).json({ success: false, message: "Code validation failed.", errors: validation.errors });
        return;
      }
    }
    const updated = await dbRepository.updateTemplate(id, req.body);
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "TEMPLATE_UPDATED",
      entityType: "template",
      entityId: id,
      details: `Updated source code or metadata for template "${existing.name}".`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: "Template updated successfully.", template: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to update template" });
  }
});
router7.patch("/templates/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["draft", "published", "archived"].includes(status)) {
      res.status(400).json({ success: false, message: 'Invalid status. Must be "draft", "published", or "archived".' });
      return;
    }
    const updated = await dbRepository.updateTemplate(id, {
      status,
      enabled: status === "published"
    });
    if (!updated) {
      res.status(404).json({ success: false, message: "Template not found" });
      return;
    }
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: status === "published" ? "TEMPLATE_PUBLISHED" : "TEMPLATE_UNPUBLISHED",
      entityType: "template",
      entityId: id,
      details: `Set status to "${status}" (enabled: ${status === "published"}) for template "${updated.name}".`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: `Template status changed to "${status}".`, template: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to change template status" });
  }
});
router7.post("/templates/:id/versions", async (req, res) => {
  try {
    const { id } = req.params;
    const { bumpType = "patch", customVersion, changeNote, htmlContent, cssContent } = req.body;
    const existing = await dbRepository.getTemplateById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Template not found" });
      return;
    }
    const currentVer = existing.version || "1.0.0";
    let nextVersion = customVersion?.trim();
    if (!nextVersion) {
      const parts = currentVer.split(".").map((p) => parseInt(p, 10) || 0);
      let [major = 1, minor = 0, patch = 0] = parts;
      if (bumpType === "major") {
        major += 1;
        minor = 0;
        patch = 0;
      } else if (bumpType === "minor") {
        minor += 1;
        patch = 0;
      } else {
        patch += 1;
      }
      nextVersion = `${major}.${minor}.${patch}`;
    }
    const effectiveHtml = htmlContent !== void 0 ? htmlContent : existing.htmlContent;
    const effectiveCss = cssContent !== void 0 ? cssContent : existing.cssContent;
    const newVersionEntry = {
      version: nextVersion,
      htmlContent: effectiveHtml,
      cssContent: effectiveCss,
      changeNote: changeNote?.trim() || `Version ${nextVersion} release`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      author: req.user?.name || "Admin"
    };
    const existingVersions = Array.isArray(existing.versions) ? [...existing.versions] : [];
    existingVersions.unshift(newVersionEntry);
    const updated = await dbRepository.updateTemplate(id, {
      version: nextVersion,
      htmlContent: effectiveHtml,
      cssContent: effectiveCss,
      versions: existingVersions
    });
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "TEMPLATE_VERSION_BUMPED",
      entityType: "template",
      entityId: id,
      details: `Released version v${nextVersion} for template "${existing.name}". Note: ${newVersionEntry.changeNote}`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: `Created new version v${nextVersion}.`, template: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to create version" });
  }
});
router7.post("/templates/:id/rollback", async (req, res) => {
  try {
    const { id } = req.params;
    const { targetVersion } = req.body;
    if (!targetVersion) {
      res.status(400).json({ success: false, message: "targetVersion is required." });
      return;
    }
    const existing = await dbRepository.getTemplateById(id);
    if (!existing) {
      res.status(404).json({ success: false, message: "Template not found" });
      return;
    }
    const versions = existing.versions || [];
    const matched = versions.find((v) => v.version === targetVersion);
    if (!matched) {
      res.status(404).json({ success: false, message: `Version ${targetVersion} not found in template history.` });
      return;
    }
    const rollbackVersionEntry = {
      version: `${existing.version}-rollback-v${targetVersion}`,
      htmlContent: matched.htmlContent,
      cssContent: matched.cssContent,
      changeNote: `Rolled back to layout from version ${targetVersion}`,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      author: req.user?.name || "Admin"
    };
    const updated = await dbRepository.updateTemplate(id, {
      htmlContent: matched.htmlContent,
      cssContent: matched.cssContent,
      versions: [rollbackVersionEntry, ...versions]
    });
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "TEMPLATE_ROLLBACK",
      entityType: "template",
      entityId: id,
      details: `Rolled back template "${existing.name}" to historical version v${targetVersion}.`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: `Successfully restored layout from v${targetVersion}.`, template: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to rollback version" });
  }
});
router7.post("/templates/:id/duplicate", async (req, res) => {
  try {
    const duplicated = await dbRepository.duplicateTemplate(req.params.id);
    if (!duplicated) {
      res.status(404).json({ success: false, message: "Template not found" });
      return;
    }
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "TEMPLATE_CREATED",
      entityType: "template",
      entityId: duplicated.id,
      details: `Duplicated template into new draft copy "${duplicated.name}".`,
      ipAddress: req.ip
    });
    res.status(201).json({ success: true, message: "Template duplicated successfully.", template: duplicated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to duplicate template" });
  }
});
router7.delete("/templates/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await dbRepository.deleteTemplate(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Template not found or cannot be deleted." });
      return;
    }
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "TEMPLATE_DELETED",
      entityType: "template",
      entityId: id,
      details: `Deleted custom template ID "${id}".`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: "Template deleted successfully." });
  } catch (err) {
    res.status(400).json({ success: false, message: err?.message || "Failed to delete template" });
  }
});
router7.post("/templates/validate", (req, res) => {
  const { html = "", css = "" } = req.body;
  const result = validateTemplate(html, css);
  res.json({ success: true, ...result });
});
router7.post("/import", async (req, res) => {
  try {
    const { filename, fileType, fileBase64, rawText, countryId = "usa" } = req.body;
    if (!fileBase64 && !rawText) {
      res.status(400).json({ success: false, message: "Provide fileBase64 or rawText to import." });
      return;
    }
    let convertedHtml = "";
    let extractedCss = `/* Scoped styles extracted from ${filename || "imported document"} */
.custom-cv-document {
  max-width: 100%;
  line-height: 1.5;
}`;
    const detectedTokens = ["{{personalInfo.fullName}}", "{{personalInfo.jobTitle}}", "{{personalInfo.email}}"];
    let conversionNote = "Converted successfully.";
    const ext = (fileType || (filename ? filename.split(".").pop() : "txt")).toLowerCase();
    if (ext === "docx" && fileBase64) {
      const buffer = Buffer.from(fileBase64, "base64");
      const mammothResult = await mammoth2.convertToHtml({ buffer });
      const rawHtml = mammothResult.value;
      convertedHtml = `<div class="custom-cv-document p-8 font-sans text-slate-800">
  <header class="border-b-2 pb-4 mb-6" style="border-color: {{themeColor}}">
    <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">{{personalInfo.fullName}}</h1>
    <p class="text-base font-semibold mt-1" style="color: {{themeColor}}">{{personalInfo.jobTitle}}</p>
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-3">
      <span>\u{1F4CD} {{personalInfo.location}}</span>
      <span>\u2709\uFE0F {{personalInfo.email}}</span>
      <span>\u{1F4DE} {{personalInfo.phone}}</span>
      {{#if personalInfo.website}}<span>\u{1F310} {{personalInfo.website}}</span>{{/if}}
    </div>
  </header>

  <!-- Summary -->
  {{#if summary}}
  <section class="mb-6">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Summary</h2>
    <p class="text-xs text-slate-700 leading-relaxed">{{summary}}</p>
  </section>
  {{/if}}

  <!-- Document Sections Converted from Word -->
  <div class="space-y-4 text-xs text-slate-800">
    ${rawHtml}
  </div>

  <!-- Dynamic Loops Ready for Binding -->
  <section class="mt-6 pt-4 border-t border-slate-200">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: {{themeColor}}">Experience</h2>
    <div class="space-y-3">
      {{#experience}}
      <div class="border-l-2 pl-3" style="border-color: {{themeColor}}33">
        <div class="flex justify-between font-bold text-xs text-slate-900">
          <span>{{role}}</span>
          <span class="font-mono text-[11px] text-slate-500">{{startDate}} - {{endDate}}</span>
        </div>
        <div class="text-[11px] font-semibold text-slate-600">{{company}} \u2022 {{location}}</div>
        <p class="text-xs text-slate-700 mt-1">{{description}}</p>
        <div class="text-xs text-slate-700 mt-1 pl-4">{{highlights}}</div>
      </div>
      {{/experience}}
    </div>
  </section>
</div>`;
      conversionNote = "Extracted headings, paragraphs, and lists from Microsoft Word (.docx). Tokens mapped automatically.";
    } else if (ext === "html" || ext === "htm") {
      const source = fileBase64 ? Buffer.from(fileBase64, "base64").toString("utf-8") : rawText || "";
      const sanitized = source.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
      convertedHtml = sanitized.includes("custom-cv-document") ? sanitized : `<div class="custom-cv-document p-8 font-sans text-slate-800">
${sanitized}
</div>`;
      conversionNote = "Imported raw HTML document. Blocked scripts and sanitized for security.";
    } else if (ext === "css") {
      extractedCss = fileBase64 ? Buffer.from(fileBase64, "base64").toString("utf-8") : rawText || "";
      convertedHtml = `<div class="custom-cv-document p-8 font-sans text-slate-800">
  <header class="border-b pb-4 mb-4">
    <h1 class="text-2xl font-bold">{{personalInfo.fullName}}</h1>
    <p class="text-sm font-semibold">{{personalInfo.jobTitle}}</p>
  </header>
  <p>{{summary}}</p>
</div>`;
      conversionNote = "Imported CSS stylesheet template.";
    } else {
      convertedHtml = `<div class="custom-cv-document p-8 font-sans text-slate-800">
  <header class="border-b-2 pb-4 mb-6" style="border-color: {{themeColor}}">
    <h1 class="text-3xl font-extrabold text-slate-900">{{personalInfo.fullName}}</h1>
    <p class="text-base font-semibold mt-1" style="color: {{themeColor}}">{{personalInfo.jobTitle}}</p>
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-2">
      <span>\u{1F4CD} {{personalInfo.location}}</span>
      <span>\u2709\uFE0F {{personalInfo.email}}</span>
      <span>\u{1F4DE} {{personalInfo.phone}}</span>
    </div>
  </header>

  {{#if summary}}
  <section class="mb-5">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Executive Profile</h2>
    <p class="text-xs leading-relaxed text-slate-700">{{summary}}</p>
  </section>
  {{/if}}

  <section class="mb-5">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: {{themeColor}}">Professional Experience</h2>
    <div class="space-y-3">
      {{#experience}}
      <div class="border-l-2 pl-3" style="border-color: {{themeColor}}33">
        <div class="flex justify-between font-bold text-xs text-slate-900">
          <span>{{role}}</span>
          <span class="font-mono text-[11px] text-slate-500">{{startDate}} - {{endDate}}</span>
        </div>
        <div class="text-[11px] font-semibold text-slate-600">{{company}} \u2022 {{location}}</div>
        <p class="text-xs text-slate-700 mt-1">{{description}}</p>
        <div class="text-xs text-slate-700 mt-1 pl-4">{{highlights}}</div>
      </div>
      {{/experience}}
    </div>
  </section>

  <section class="mb-5">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Education &amp; Credentials</h2>
    <div class="space-y-2">
      {{#education}}
      <div class="flex justify-between text-xs font-medium">
        <span><b>{{degree}} in {{field}}</b> - {{institution}}</span>
        <span class="font-mono text-[11px] text-slate-500">{{startDate}} - {{endDate}}</span>
      </div>
      {{/education}}
    </div>
  </section>
</div>`;
      conversionNote = `Document layout extracted from ${ext.toUpperCase()} file. Review and refine field mappings before saving.`;
    }
    res.json({
      success: true,
      originalFilename: filename || "template_source",
      fileType: ext,
      conversionNote,
      htmlContent: convertedHtml,
      cssContent: extractedCss,
      detectedTokens
    });
  } catch (err) {
    console.error("[Admin Import Error]:", err);
    res.status(500).json({ success: false, message: err?.message || "Failed to import and convert document." });
  }
});
router7.get("/settings", async (_req, res) => {
  try {
    const settings = await dbRepository.getSystemSettings();
    res.json({ success: true, settings });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch settings" });
  }
});
router7.put("/settings", async (req, res) => {
  try {
    const updated = await dbRepository.updateSystemSettings({
      ...req.body,
      updatedBy: req.user?.email || "admin"
    });
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "SETTINGS_UPDATED",
      entityType: "settings",
      details: `Updated website settings (Maintenance mode: ${updated.maintenanceMode ? "ENABLED" : "DISABLED"}).`,
      ipAddress: req.ip
    });
    res.json({ success: true, message: "Website settings updated successfully.", settings: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to update settings" });
  }
});
router7.get("/logs", async (req, res) => {
  try {
    const limit = parseInt(String(req.query.limit || "100"), 10);
    const logs = await dbRepository.getActivityLogs(limit);
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch activity logs" });
  }
});
router7.get("/database/status", async (_req, res) => {
  try {
    const stats = await dbRepository.getAdminStats();
    res.json({ success: true, database: stats.database, systemHealth: stats.systemHealth });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to fetch database diagnostics" });
  }
});
router7.get("/database/export", async (req, res) => {
  try {
    const dump = await dbRepository.exportDatabaseBackup();
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "SYSTEM_BACKUP",
      entityType: "database",
      details: "Exported complete database JSON snapshot.",
      ipAddress: req.ip
    });
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="cvcraft_backup_${Date.now()}.json"`);
    res.send(JSON.stringify(dump, null, 2));
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to export database backup" });
  }
});
router7.post("/database/reset-seed", async (req, res) => {
  try {
    await dbRepository.resetSeedData();
    await dbRepository.logActivity({
      adminEmail: req.user?.email || "admin",
      adminName: req.user?.name,
      action: "DATABASE_MAINTENANCE",
      entityType: "database",
      details: "Restored core country profiles and system template baselines.",
      ipAddress: req.ip
    });
    res.json({ success: true, message: "Core seed countries and templates re-synchronized successfully." });
  } catch (err) {
    res.status(500).json({ success: false, message: err?.message || "Failed to re-seed data" });
  }
});
var adminRoutes_default = router7;

// server/routes/chat.ts
import { Router as Router5 } from "express";
import { GoogleGenAI as GoogleGenAI2 } from "@google/genai";
var router8 = Router5();
var SYSTEM_INSTRUCTIONS = {
  career_coach: `You are CVCraft AI Career Coach \u2014 an elite career advisor, executive recruiter, and professional CV strategist.
Your role:
- Guide candidates in structuring an interview-winning CV or resume.
- Help articulate career trajectory, strengths, and leadership impact.
- Ask insightful clarifying questions if the user's background is vague.
- Use the STAR framework (Situation, Task, Action, Result) for all accomplishments.
- Emphasize quantifiable metrics (percentages, dollar amounts, performance multipliers, team scale).
- Keep responses concise, well-structured, and ready to use on a CV.
- When you provide an improved summary or bullet points, format them clearly with bullet points so the user can easily copy or apply them to their CV.`,
  ats_specialist: `You are CVCraft ATS Optimization Specialist \u2014 an expert on Applicant Tracking Systems (Workday, Greenhouse, Taleo, Lever, BambooHR).
Your role:
- Analyze job titles, skills, and industry terminology to ensure 100% parser compatibility.
- Identify missing high-priority keywords, technical competencies, and industry certifications.
- Warn against non-standard headings, graphics, tables, or columns that break automated parsers.
- Recommend clean, linear single-column structure and standard industry vocabulary.
- Suggest keyword-dense bullet points tailored to the user's target job title.`,
  executive_writer: `You are CVCraft Executive Resume Writer \u2014 a master of persuasive professional prose and action verbs.
Your role:
- Transform weak, passive phrasing (e.g., "was responsible for", "worked on") into commanding executive achievements (e.g., "Spearheaded", "Architected", "Orchestrated", "Accelerated").
- Draft compelling 3-4 sentence professional summaries that hook recruiters in 6 seconds.
- Turn job duties into measurable achievements with business results.
- Keep bullets punchy: under 2 lines per bullet, leading with a bold action verb.`,
  regional_expert: `You are CVCraft Global CV & Recruitment Specialist \u2014 an expert on country-wise CV and resume conventions.
Your role:
- Advise on regional standards across USA, UK, Canada, Germany (Lebenslauf), Japan (JIS Rirekisho & Shokumu Keirekisho), UAE/Gulf, and Bangladesh (Corporate Biodata).
- Detail when photos are required vs. strictly forbidden (e.g., standard in Japan and Germany, strictly discouraged in USA/UK due to EEOC/Equality Act).
- Guide Japanese Furigana phonetic readings, chronological grids ending with \u4EE5\u4E0A, and Self-PR etiquette.
- Provide country-accurate terminology and cultural expectations for hiring managers.`
};
function getFallbackResponse(message, role, cvContext) {
  const q = message.toLowerCase();
  const title = cvContext?.jobTitle || "Professional";
  if (q.includes("summary")) {
    return `Here is a strong, results-driven professional summary tailored for a **${title}**:

> "Dynamic and results-driven **${title}** with proven experience architecting scalable solutions and leading cross-functional initiatives. Recognized for driving operational efficiencies, optimizing workflows, and delivering high-impact business outcomes. Committed to technical rigor and team excellence."

*Tip: You can customize the bracketed metrics with your real years of experience and top technical competencies.*`;
  }
  if (q.includes("bullet") || q.includes("achievement") || q.includes("experience")) {
    return `Here are 3 high-impact accomplishment bullets using the STAR method for a **${title}**:

- **Spearheaded** the architectural redesign of core system infrastructure, decreasing response latency by 38% for over 50,000 active users.
- **Orchestrated** automated CI/CD deployment pipelines, cutting sprint release cycle times by 45% while maintaining 99.9% uptime.
- **Collaborated** cross-functionally with product and engineering stakeholders to deliver high-priority roadmap deliverables 2 weeks ahead of schedule.`;
  }
  if (q.includes("ats") || q.includes("keyword")) {
    return `### ATS Optimization Checklist for **${title}**:
1. **Header**: Ensure standard headers like "Work Experience", "Education", and "Skills" rather than creative phrasing.
2. **Metrics**: Every position should have at least 1-2 quantified bullets with numbers ($ saved, % speedup, users served).
3. **Format**: Single-column layout ensures 100% parse rates in Workday and Greenhouse.
4. **Keywords**: Include both acronyms and full terms (e.g. "AWS (Amazon Web Services)", "CI/CD").`;
  }
  if (q.includes("japan") || q.includes("rirekisho")) {
    return `### Japanese Recruitment Standards (JIS Rirekisho & Shokumu):
- **Photo**: Formal 30mm x 40mm studio portrait in dark business attire is strictly expected.
- **Furigana**: Phonetic Hiragana or Katakana must be present above your name and address.
- **Chronological Table**: Academic and work entries must end with a right-aligned **\u4EE5\u4E0A** (End).
- **Self-PR (\u81EA\u5DF1PR)**: Focus on concrete problem solving, adaptability, and harmony with corporate culture.`;
  }
  return `I am here to help you craft an outstanding CV for **${title}**!

You can ask me to:
1. **Polish your summary**: Paste your current summary or ask for an executive pitch.
2. **Enhance accomplishment bullets**: Turn daily duties into STAR-method achievements.
3. **Audit ATS compatibility**: Check formatting and keyword presence.
4. **Advise on country standards**: Guidance on USA, UK, Germany, Japan, UAE, or Bangladesh standards.

What section of your CV would you like to work on?`;
}
router8.post("/", async (req, res) => {
  try {
    const {
      messages,
      model = "gemini-3.8-flash",
      rolePreset = "career_coach",
      cvContext
    } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).json({
        success: false,
        message: "Messages array is required and must contain at least one message."
      });
      return;
    }
    let selectedModel = "gemini-3.8-flash";
    if (model === "gemini-4-argon" || model === "gemini-3.1-flash-lite" || model === "gemini-3.8-flash") {
      selectedModel = model;
    }
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.text || "";
      const fallbackText = getFallbackResponse(lastUserMsg, rolePreset, cvContext);
      res.json({
        success: true,
        provider: "CVCraft Career Engine (Offline / Deterministic)",
        model: selectedModel,
        reply: fallbackText,
        notice: "Tip: Add GEMINI_API_KEY in your environment for live model responses."
      });
      return;
    }
    const ai = new GoogleGenAI2({ apiKey });
    const baseInstruction = SYSTEM_INSTRUCTIONS[rolePreset] || SYSTEM_INSTRUCTIONS.career_coach;
    let fullSystemInstruction = baseInstruction;
    if (cvContext && typeof cvContext === "object") {
      fullSystemInstruction += `

CURRENT USER CV CONTEXT:
- Target Job Title: ${cvContext.jobTitle || "Not specified"}
- Target Country: ${cvContext.targetCountry || "USA"}
- Current Professional Summary: ${cvContext.summary ? `"${cvContext.summary}"` : "None yet"}
- Key Skills: ${Array.isArray(cvContext.skills) ? cvContext.skills.join(", ") : "Not specified"}
- Top Work Positions: ${Array.isArray(cvContext.experience) ? cvContext.experience.map((e) => `${e.role} at ${e.company}`).join("; ") : "None specified"}
Use this context to personalize your advice, bullet points, and suggestions.`;
    }
    const formattedContents = messages.map((m) => ({
      role: m.role === "model" ? "model" : "user",
      parts: [{ text: m.text }]
    }));
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: formattedContents,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: selectedModel === "gemini-4-argon" ? 0.3 : 0.7
      }
    });
    const replyText = response.text || "I analyzed your request. Let me know if you would like me to adjust any specific section.";
    res.json({
      success: true,
      provider: "Google Gemini AI",
      model: selectedModel,
      reply: replyText
    });
  } catch (err) {
    console.error("[Gemini Chat Error]:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Failed to generate response from Gemini AI.",
      fallbackReply: "Our AI Career Coach encountered a temporary service hiccup. Please try again or rephrase your question."
    });
  }
});
var chat_default = router8;

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path2.dirname(__filename);
var app = express4();
var PORT = parseInt(process.env.PORT || "3000", 10);
var isDev = process.env.NODE_ENV !== "production";
app.use(cors());
app.use(express4.json({ limit: "10mb" }));
app.use(express4.urlencoded({ extended: true, limit: "10mb" }));
app.get("/api/health", (_req, res) => {
  const dbStatus = getDbStatus();
  res.json({
    status: "healthy",
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    service: "CVCraft API",
    version: "1.0.0",
    database: dbStatus
  });
});
app.use("/api/auth", auth_default);
app.use("/api/cvs", cvs_default);
app.use("/api/extract", extract_default);
app.use("/api/templates", templates_default);
app.use("/api/countries", countries_default);
app.use("/api/translate", translate_default);
app.use("/api/chat", chat_default);
app.use("/api/admin/templates", adminRoutes_default);
app.use("/api/admin", adminRoutes_default);
app.use((err, _req, res, _next) => {
  console.error("[API Server Error]:", err?.message || err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred."
  });
});
async function startServer() {
  await connectDatabase();
  if (isDev) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== "true",
        watch: process.env.DISABLE_HMR === "true" ? null : {}
      },
      appType: "spa"
    });
    app.use(vite.middlewares);
    console.log("[Dev] Vite middleware integrated into Express.");
  } else {
    const distPath = path2.resolve(__dirname, "dist");
    app.use(express4.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path2.join(distPath, "index.html"));
    });
    console.log("[Prod] Serving static build from dist folder.");
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\u{1F680} CVCraft Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer().catch((err) => {
  console.error("Fatal server startup error:", err);
  process.exit(1);
});
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Template Field Configurations Catalog
 * The primary source of truth for template-driven CV fields and section layouts.
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CVCraft Admin Template Management Service
 * Comprehensive CRUD, Version History, Status & Validation Service
 * backed by a mock backend structure with localStorage persistence.
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Comprehensive Super Admin API Routes
 * Defined in src/routes/adminRoutes.ts
 *
 * Implements endpoints for:
 * 1. Overview KPIs & Stats (/stats)
 * 2. User Management (/users, /users/:id/role, /users/:id/status)
 * 3. Country Management (/countries)
 * 4. Template Management (/templates, /templates/:id/versions, /templates/:id/rollback, /templates/:id/duplicate)
 * 5. Template Import Manager (/import - DOCX, PDF, HTML, CSS, Images)
 * 6. Website Settings & Maintenance Mode (/settings)
 * 7. Activity Logs Audit Trail (/logs)
 * 8. Database Management & Diagnostics (/database)
 */
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CVCraft Gemini AI Chatbot Route
 * Handles multi-turn chat conversations using the official @google/genai SDK.
 */
