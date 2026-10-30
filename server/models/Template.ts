import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  id: string;
  name: string;
  countryId: string;
  category: string;
  description: string;
  defaultLanguage: string;
  version: string;
  isCustomHtml: boolean;
  htmlContent?: string;
  cssContent?: string;
  enabled: boolean;
  isSystem?: boolean;
  thumbnailColor?: string;
  tags?: string[];
  fieldConfig?: any;
  createdAt: Date;
  updatedAt: Date;
}

export const TemplateSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    countryId: {
      type: String,
      required: true,
      index: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: String,
      required: true,
      default: 'modern',
    },
    description: {
      type: String,
      default: '',
    },
    defaultLanguage: {
      type: String,
      default: 'en',
    },
    version: {
      type: String,
      default: '1.0.0',
    },
    isCustomHtml: {
      type: Boolean,
      default: false,
    },
    htmlContent: {
      type: String,
      default: '',
    },
    cssContent: {
      type: String,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    isSystem: {
      type: Boolean,
      default: false,
    },
    thumbnailColor: {
      type: String,
      default: '#2563eb',
    },
    tags: {
      type: [String],
      default: [],
    },
    fieldConfig: {
      type: Schema.Types.Mixed,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const TemplateModel =
  mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);
