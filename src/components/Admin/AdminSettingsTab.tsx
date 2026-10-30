import React, { useState, useEffect } from 'react';
import {
  Settings,
  Save,
  Check,
  Globe2,
  Mail,
  ShieldAlert,
  AlertTriangle,
  RefreshCw,
  Sliders,
  Image,
} from 'lucide-react';
import { adminTemplateService } from '../../services/adminService.ts';
import { WebsiteSettingsItem } from '../../types/admin.ts';

export const AdminSettingsTab: React.FC = () => {
  const [settings, setSettings] = useState<WebsiteSettingsItem>({
    siteName: 'CVCraft',
    siteTagline: 'Free Professional CV & Resume Generator',
    siteDescription: 'Build professional, ATS-friendly CVs and resumes for free.',
    logoUrl: '',
    faviconUrl: '',
    contactEmail: 'support@cvcraft.com',
    supportEmail: 'admin@cvcraft.com',
    defaultCountry: 'usa',
    defaultLanguage: 'en',
    maintenanceMode: false,
    maintenanceNotice: 'CVCraft is currently undergoing scheduled optimization. Normal service will resume shortly.',
    allowPublicRegistration: true,
    maxUploadSizeBytes: 10485760,
  });

  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await adminTemplateService.getSettings();
      if (data) setSettings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await adminTemplateService.updateSettings(settings);
      setStatusMessage('Website settings successfully saved and applied.');
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-xs text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Global Website Configuration &amp; Branding</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Configure site identity, default localization, contact coordinates, and maintenance mode status.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Save className="w-3.5 h-3.5" />
          <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{statusMessage}</span>
          </div>
          <button type="button" onClick={() => setStatusMessage(null)} className="text-emerald-700 font-bold">
            Dismiss
          </button>
        </div>
      )}

      {/* Maintenance Mode Emergency Box */}
      <div
        className={`p-5 rounded-2xl border transition-all ${
          settings.maintenanceMode
            ? 'bg-rose-50 border-rose-200 text-rose-950'
            : 'bg-white border-slate-200 text-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-lg ${settings.maintenanceMode ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'}`}>
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Maintenance Mode Status</h3>
              <p className="text-xs opacity-80">
                When enabled, regular user access is intercepted with a maintenance banner. Super Admins retain full access.
              </p>
            </div>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer font-bold text-xs select-none">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-4 h-4 rounded text-rose-600"
            />
            <span className={settings.maintenanceMode ? 'text-rose-700 font-extrabold' : 'text-slate-600'}>
              {settings.maintenanceMode ? 'MAINTENANCE ACTIVE' : 'Disabled (Normal Operation)'}
            </span>
          </label>
        </div>

        {settings.maintenanceMode && (
          <div className="mt-3 space-y-1">
            <label className="block text-[11px] font-bold text-rose-900">Maintenance Notice Displayed to Users:</label>
            <textarea
              rows={2}
              value={settings.maintenanceNotice || ''}
              onChange={(e) => setSettings({ ...settings, maintenanceNotice: e.target.value })}
              className="w-full p-2.5 bg-white border border-rose-300 rounded-lg text-xs text-slate-900"
            />
          </div>
        )}
      </div>

      {/* Site Identity & Metadata */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Website Identity &amp; SEO
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Site Brand Name *</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Brand Tagline</label>
            <input
              type="text"
              value={settings.siteTagline}
              onChange={(e) => setSettings({ ...settings, siteTagline: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Meta Description</label>
          <textarea
            rows={3}
            value={settings.siteDescription}
            onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Logo Image URL</label>
            <input
              type="text"
              value={settings.logoUrl || ''}
              onChange={(e) => setSettings({ ...settings, logoUrl: e.target.value })}
              placeholder="e.g. /assets/logo.svg"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Favicon URL</label>
            <input
              type="text"
              value={settings.faviconUrl || ''}
              onChange={(e) => setSettings({ ...settings, faviconUrl: e.target.value })}
              placeholder="e.g. /favicon.ico"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
            />
          </div>
        </div>
      </div>

      {/* Localization & Support Coordinates */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Defaults &amp; Support Contact
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Default Market / Country</label>
            <select
              value={settings.defaultCountry}
              onChange={(e) => setSettings({ ...settings, defaultCountry: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
            >
              <option value="usa">🇺🇸 United States</option>
              <option value="japan">🇯🇵 Japan</option>
              <option value="germany">🇩🇪 Germany</option>
              <option value="uk">🇬🇧 United Kingdom</option>
              <option value="eu">🇪🇺 European Union</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Default Platform Language</label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) => setSettings({ ...settings, defaultLanguage: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
            >
              <option value="en">English (en)</option>
              <option value="ja">Japanese (ja)</option>
              <option value="de">German (de)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Public Support Email</label>
            <input
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Admin Notification Email</label>
            <input
              type="email"
              value={settings.supportEmail || ''}
              onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900"
            />
          </div>
        </div>
      </div>
    </form>
  );
};

export default AdminSettingsTab;
