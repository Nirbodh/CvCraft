import mongoose, { Document, Schema } from 'mongoose';

export interface ISystemSettings extends Document {
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl?: string;
  faviconUrl?: string;
  contactEmail: string;
  supportEmail?: string;
  defaultCountry: string;
  defaultLanguage: string;
  maintenanceMode: boolean;
  maintenanceNotice?: string;
  allowPublicRegistration: boolean;
  maxUploadSizeBytes: number;
  updatedBy?: string;
  updatedAt: Date;
}

export const SystemSettingsSchema: Schema = new Schema(
  {
    siteName: {
      type: String,
      default: 'CVCraft',
      trim: true,
    },
    siteTagline: {
      type: String,
      default: 'Free Professional CV & Resume Generator',
      trim: true,
    },
    siteDescription: {
      type: String,
      default:
        'Build professional, ATS-friendly CVs and resumes for free. Import documents, customize 5+ designer templates, use the deterministic writing engine, and export print-ready A4 PDFs without watermarks.',
    },
    logoUrl: {
      type: String,
      default: '',
    },
    faviconUrl: {
      type: String,
      default: '',
    },
    contactEmail: {
      type: String,
      default: 'support@cvcraft.com',
      trim: true,
    },
    supportEmail: {
      type: String,
      default: 'admin@cvcraft.com',
      trim: true,
    },
    defaultCountry: {
      type: String,
      default: 'usa',
    },
    defaultLanguage: {
      type: String,
      default: 'en',
    },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    maintenanceNotice: {
      type: String,
      default: 'CVCraft is currently undergoing scheduled system optimization. Normal service will resume shortly.',
    },
    allowPublicRegistration: {
      type: Boolean,
      default: true,
    },
    maxUploadSizeBytes: {
      type: Number,
      default: 10485760, // 10MB
    },
    updatedBy: {
      type: String,
      default: 'system',
    },
  },
  {
    timestamps: true,
  }
);

export const SystemSettingsModel =
  mongoose.models.SystemSettings || mongoose.model<ISystemSettings>('SystemSettings', SystemSettingsSchema);
