/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * TypeScript types for Super Admin Dashboard & Operations
 */

import { TemplateStatus, TemplateCategory } from './template.ts';

export type AdminNavTab =
  | 'overview'
  | 'users'
  | 'countries'
  | 'templates'
  | 'editor'
  | 'preview'
  | 'studio'
  | 'translations'
  | 'import'
  | 'database'
  | 'settings'
  | 'logs';

export interface AdminKpiStats {
  totalUsers: number;
  totalCvs: number;
  totalTemplates: number;
  publishedTemplates: number;
  draftTemplates: number;
  totalCountries: number;
}

export interface CountryTemplateStats {
  countryId: string;
  name: string;
  flag: string;
  totalTemplates: number;
  publishedTemplates: number;
  draftTemplates: number;
}

export interface SystemHealthMetrics {
  uptimeSeconds: number;
  nodeVersion: string;
  memoryUsageMb: number;
  platform: string;
  pid: number;
}

export interface AdminDashboardOverviewData {
  kpi: AdminKpiStats;
  countryStats: CountryTemplateStats[];
  database: {
    isMongo: boolean;
    mode: string;
    error: string | null;
    activeCollections: Record<string, string>;
    hint: string;
  };
  systemHealth: SystemHealthMetrics;
}

export interface UserAdminItem {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'superadmin';
  status: 'active' | 'suspended';
  lastLoginAt?: string;
  createdAt: string;
  cvCount?: number;
}

export interface ActivityLogItem {
  _id?: string;
  id?: string;
  adminEmail: string;
  adminName?: string;
  action: string;
  entityType: 'user' | 'template' | 'country' | 'settings' | 'system' | 'cv' | 'database';
  entityId?: string;
  details: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface WebsiteSettingsItem {
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
  updatedAt?: string;
  updatedBy?: string;
}

export interface TemplateImportResult {
  success: boolean;
  originalFilename: string;
  fileType: string;
  conversionNote: string;
  htmlContent: string;
  cssContent: string;
  detectedTokens: string[];
}
