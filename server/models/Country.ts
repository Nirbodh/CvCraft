import mongoose, { Document, Schema } from 'mongoose';

export interface ICountry extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

export const CountrySchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    flag: {
      type: String,
      required: true,
      trim: true,
    },
    documentTerm: {
      type: String,
      required: true,
      default: 'CV',
    },
    defaultLanguage: {
      type: String,
      required: true,
      default: 'en',
    },
    recommendedLength: {
      type: String,
      default: '1-2 pages',
    },
    photoConvention: {
      type: String,
      enum: ['discouraged', 'optional', 'common', 'standard'],
      default: 'optional',
    },
    photoExplanation: {
      type: String,
      default: '',
    },
    atsGuidance: {
      type: String,
      default: '',
    },
    enabled: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const CountryModel =
  mongoose.models.Country || mongoose.model<ICountry>('Country', CountrySchema);
