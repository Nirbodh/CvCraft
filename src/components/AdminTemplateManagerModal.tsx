import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Copy,
  Trash2,
  Edit2,
  Eye,
  Check,
  Code,
  Globe,
  Layout,
  Layers,
  Sparkles,
  RefreshCw,
  AlertCircle,
  FileCode,
  Tag,
  Palette,
  ChevronRight,
} from 'lucide-react';
import { CV } from '../types/cv.ts';
import { TemplateMetadata, CountryItem } from '../types/template.ts';
import { CustomHtmlTemplateEngine } from './Templates/CustomHtmlTemplateEngine.tsx';

interface AdminTemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cv: CV;
  onSelectTemplate: (templateId: string, customHtml?: string, customCss?: string) => void;
}

const BOILERPLATE_HTML = `<!-- Custom Country-Wise CV Template -->
<div class="custom-cv-document p-8 font-sans text-slate-800">
  <!-- Header -->
  <header class="border-b-2 pb-4 mb-6" style="border-color: {{themeColor}}">
    <h1 class="text-3xl font-extrabold tracking-tight text-slate-900">{{personalInfo.fullName}}</h1>
    <p class="text-base font-semibold mt-1" style="color: {{themeColor}}">{{personalInfo.jobTitle}}</p>
    
    <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 mt-3">
      <span>📍 {{personalInfo.location}}</span>
      <span>✉️ {{personalInfo.email}}</span>
      <span>📞 {{personalInfo.phone}}</span>
      <span>🌐 {{personalInfo.website}}</span>
    </div>
  </header>

  <!-- Summary -->
  <section class="mb-6">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Professional Summary</h2>
    <p class="text-xs leading-relaxed text-slate-700 whitespace-pre-line">{{summary}}</p>
  </section>

  <!-- Work Experience -->
  <section class="mb-6">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: {{themeColor}}">Employment Experience</h2>
    <div class="space-y-4">
      {{#experience}}
      <div class="border-l-2 pl-3" style="border-color: {{themeColor}}20">
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
    <h2 class="text-xs font-bold uppercase tracking-wider mb-3" style="color: {{themeColor}}">Education & Qualifications</h2>
    <div class="space-y-2">
      {{#education}}
      <div class="flex justify-between items-baseline">
        <div>
          <span class="font-bold text-xs text-slate-900">{{degree}} in {{field}}</span>
          <span class="text-xs text-slate-600 ml-2">({{institution}})</span>
        </div>
        <span class="text-[11px] font-mono text-slate-500">{{startDate}} - {{endDate}}</span>
      </div>
      {{/education}}
    </div>
  </section>

  <!-- Skills -->
  <section class="mb-4">
    <h2 class="text-xs font-bold uppercase tracking-wider mb-2" style="color: {{themeColor}}">Skills & Expertise</h2>
    <div class="space-y-1">
      {{#skills}}
      <div class="text-xs">
        <strong class="text-slate-900">{{category}}:</strong>
        <span class="text-slate-700 ml-1">{{items}}</span>
      </div>
      {{/skills}}
    </div>
  </section>
</div>`;

const BOILERPLATE_CSS = `/* Custom Template Scoped Stylesheet */
.custom-cv-document {
  max-width: 100%;
  line-height: 1.5;
}
.custom-cv-document h1 {
  font-family: inherit;
}
.custom-cv-document ul {
  list-style-type: disc;
  margin-left: 1.25rem;
}`;

export const AdminTemplateManagerModal: React.FC<AdminTemplateManagerModalProps> = ({
  isOpen,
  onClose,
  cv,
  onSelectTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'templates' | 'editor' | 'countries'>('templates');
  const [templates, setTemplates] = useState<TemplateMetadata[]>([]);
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [selectedCountryFilter, setSelectedCountryFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<TemplateMetadata | null>(null);

  // Editor State
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [templateForm, setTemplateForm] = useState({
    name: '',
    countryId: 'japan',
    category: 'traditional' as any,
    defaultLanguage: 'ja',
    version: '1.0.0',
    description: '',
    enabled: true,
    htmlContent: BOILERPLATE_HTML,
    cssContent: BOILERPLATE_CSS,
  });

  // Country Form State
  const [countryForm, setCountryForm] = useState({
    id: '',
    name: '',
    flag: '',
    documentTerm: 'CV',
    defaultLanguage: 'en',
    recommendedLength: '1 to 2 pages',
  });

  // Load Templates & Countries from Backend
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [tplRes, ctryRes] = await Promise.all([
        fetch('/api/templates'),
        fetch('/api/countries'),
      ]);

      if (tplRes.ok) {
        const tplData = await tplRes.json();
        if (tplData.templates) setTemplates(tplData.templates);
      }
      if (ctryRes.ok) {
        const ctryData = await ctryRes.json();
        if (ctryData.countries) setCountries(ctryData.countries);
      }
    } catch (err: any) {
      console.error('[Admin Templates Fetch Error]:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Filter templates
  const filteredTemplates = templates.filter((t) => {
    if (selectedCountryFilter === 'all') return true;
    return t.countryId?.toLowerCase() === selectedCountryFilter.toLowerCase();
  });

  // Start creating new template
  const handleOpenCreate = () => {
    setEditingTemplateId(null);
    setTemplateForm({
      name: '',
      countryId: selectedCountryFilter !== 'all' ? selectedCountryFilter : 'japan',
      category: 'modern',
      defaultLanguage: 'en',
      version: '1.0.0',
      description: '',
      enabled: true,
      htmlContent: BOILERPLATE_HTML,
      cssContent: BOILERPLATE_CSS,
    });
    setActiveTab('editor');
  };

  // Edit existing template
  const handleOpenEdit = (t: TemplateMetadata) => {
    setEditingTemplateId(t.id);
    setTemplateForm({
      name: t.name,
      countryId: t.countryId,
      category: t.category,
      defaultLanguage: t.defaultLanguage || 'en',
      version: t.version || '1.0.0',
      description: t.description || '',
      enabled: t.enabled !== false,
      htmlContent: t.htmlContent || BOILERPLATE_HTML,
      cssContent: t.cssContent || BOILERPLATE_CSS,
    });
    setActiveTab('editor');
  };

  // Duplicate template
  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`/api/templates/${id}/duplicate`, { method: 'POST' });
      if (res.ok) {
        setStatusMessage('Template duplicated successfully.');
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete template
  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom template?')) return;
    try {
      const res = await fetch(`/api/templates/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setStatusMessage('Template deleted successfully.');
        loadData();
      } else {
        const d = await res.json();
        alert(d.message || 'Cannot delete system templates.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle template enabled/disabled
  const handleToggleEnabled = async (t: TemplateMetadata) => {
    try {
      await fetch(`/api/templates/${t.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !t.enabled }),
      });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  // Save template from Editor
  const handleSaveTemplate = async () => {
    if (!templateForm.name.trim()) {
      alert('Please enter a template name.');
      return;
    }

    try {
      if (editingTemplateId) {
        // Update
        const res = await fetch(`/api/templates/${editingTemplateId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...templateForm,
            isCustomHtml: true,
          }),
        });
        if (res.ok) {
          setStatusMessage('Template updated successfully.');
          loadData();
          setActiveTab('templates');
        }
      } else {
        // Create new
        const newId = `custom_${templateForm.countryId}_${Date.now().toString(36)}`;
        const res = await fetch('/api/templates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...templateForm,
            id: newId,
            isCustomHtml: true,
          }),
        });
        if (res.ok) {
          setStatusMessage('New template created successfully.');
          loadData();
          setActiveTab('templates');
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Insert token helper
  const insertToken = (token: string) => {
    setTemplateForm((prev) => ({
      ...prev,
      htmlContent: prev.htmlContent + token,
    }));
  };

  // Add new country
  const handleAddCountry = async () => {
    if (!countryForm.name.trim() || !countryForm.flag.trim()) {
      alert('Please enter country name and flag emoji.');
      return;
    }
    const id = countryForm.id.trim() || countryForm.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    try {
      const res = await fetch('/api/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...countryForm,
          id,
          enabled: true,
        }),
      });
      if (res.ok) {
        setCountryForm({
          id: '',
          name: '',
          flag: '',
          documentTerm: 'CV',
          defaultLanguage: 'en',
          recommendedLength: '1 to 2 pages',
        });
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete country
  const handleDeleteCountry = async (id: string) => {
    if (!confirm(`Delete country "${id}"?`)) return;
    try {
      await fetch(`/api/countries/${id}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 text-blue-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Template Studio & Country Library</h2>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 text-[10px] font-semibold rounded-full border border-blue-500/30 uppercase tracking-wider">
                  Admin Workspace
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Design custom HTML/CSS templates country-by-country with live preview, versioning, and duplication
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 bg-slate-100 border-b border-slate-200 flex justify-between items-center shrink-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('templates')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'templates'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layout className="w-4 h-4" />
              Template Library ({templates.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'editor'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code className="w-4 h-4" />
              {editingTemplateId ? 'Edit Template' : 'Design / HTML Studio'}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('countries')}
              className={`px-4 py-3 text-xs font-semibold border-b-2 flex items-center gap-2 transition-all ${
                activeTab === 'countries'
                  ? 'border-blue-600 text-blue-700 bg-white shadow-xs'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Globe className="w-4 h-4" />
              Manage Countries ({countries.length})
            </button>
          </div>

          {activeTab === 'templates' && (
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              New Template
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {statusMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex justify-between items-center">
              <span>{statusMessage}</span>
              <button
                type="button"
                onClick={() => setStatusMessage(null)}
                className="text-emerald-700 hover:underline font-semibold"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* TAB 1: TEMPLATE LIBRARY */}
          {activeTab === 'templates' && (
            <div className="space-y-5">
              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Filter by Country:</span>
                  <select
                    value={selectedCountryFilter}
                    onChange={(e) => setSelectedCountryFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 outline-hidden"
                  >
                    <option value="all">🌍 All Countries ({templates.length})</option>
                    {countries.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-xs text-slate-500">
                  Showing {filteredTemplates.length} templates
                </div>
              </div>

              {/* Template Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((t) => {
                  const countryObj = countries.find(
                    (c) => c.id.toLowerCase() === t.countryId?.toLowerCase()
                  );
                  return (
                    <div
                      key={t.id}
                      className={`border rounded-xl p-4 flex flex-col justify-between transition-all bg-white hover:shadow-md ${
                        t.enabled ? 'border-slate-200' : 'border-slate-200 opacity-60 bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xl">{countryObj?.flag || '🌐'}</span>
                            <span className="text-xs font-bold text-slate-900 leading-snug">
                              {t.name}
                            </span>
                          </div>
                          <span
                            className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${
                              t.enabled
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-200 text-slate-600 border-slate-300'
                            }`}
                          >
                            {t.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 mb-3 min-h-[32px]">
                          {t.description || 'Custom country template.'}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mb-3 text-[10px]">
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono">
                            v{t.version || '1.0.0'}
                          </span>
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded capitalize">
                            {t.category}
                          </span>
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded uppercase">
                            Lang: {t.defaultLanguage || 'en'}
                          </span>
                          {t.isCustomHtml && (
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded font-medium">
                              HTML/CSS
                            </span>
                          )}
                          {t.isSystem && (
                            <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded">
                              System
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="border-t border-slate-100 pt-3 flex items-center justify-between gap-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            onSelectTemplate(t.id, t.htmlContent, t.cssContent);
                            onClose();
                          }}
                          className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium rounded-lg transition-colors flex items-center gap-1 text-[11px]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Apply to CV
                        </button>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            title="Duplicate Template"
                            onClick={() => handleDuplicate(t.id)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-slate-900 rounded-lg"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            title="Edit Template Source"
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            title={t.enabled ? 'Disable Template' : 'Enable Template'}
                            onClick={() => handleToggleEnabled(t)}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 rounded-lg text-[10px] font-mono"
                          >
                            {t.enabled ? 'ON' : 'OFF'}
                          </button>

                          {!t.isSystem && (
                            <button
                              type="button"
                              title="Delete Custom Template"
                              onClick={() => handleDeleteTemplate(t.id)}
                              className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATE EDITOR / HTML STUDIO */}
          {activeTab === 'editor' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
              {/* Left Column: Metadata & Code Inputs */}
              <div className="lg:col-span-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      value={templateForm.name}
                      onChange={(e) =>
                        setTemplateForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="e.g. Japanese Modern Rirekisho"
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-hidden focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Country *
                    </label>
                    <select
                      value={templateForm.countryId}
                      onChange={(e) =>
                        setTemplateForm((p) => ({ ...p, countryId: e.target.value }))
                      }
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-hidden focus:border-blue-600"
                    >
                      {countries.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.flag} {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Category
                    </label>
                    <select
                      value={templateForm.category}
                      onChange={(e) =>
                        setTemplateForm((p) => ({ ...p, category: e.target.value as any }))
                      }
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-hidden"
                    >
                      <option value="traditional">Traditional</option>
                      <option value="ats">ATS-Friendly</option>
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="executive">Executive</option>
                      <option value="minimal">Minimal</option>
                      <option value="creative">Creative</option>
                      <option value="technical">Technical</option>
                      <option value="academic">Academic</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Language
                    </label>
                    <select
                      value={templateForm.defaultLanguage}
                      onChange={(e) =>
                        setTemplateForm((p) => ({ ...p, defaultLanguage: e.target.value }))
                      }
                      className="w-full text-xs p-2 border border-slate-300 rounded-lg outline-hidden"
                    >
                      <option value="ja">Japanese (ja)</option>
                      <option value="en">English (en)</option>
                      <option value="de">German (de)</option>
                      <option value="fr">French (fr)</option>
                      <option value="es">Spanish (es)</option>
                      <option value="bn">Bengali (bn)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Version
                    </label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={templateForm.version}
                        onChange={(e) =>
                          setTemplateForm((p) => ({ ...p, version: e.target.value }))
                        }
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg font-mono outline-hidden"
                      />
                    </div>
                  </div>
                </div>

                {/* Field Placeholders Quick Toolbar */}
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                  <span className="text-[11px] font-semibold text-slate-600 block">
                    Quick Insert Dynamic CV Field Tags:
                  </span>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {[
                      '{{personalInfo.fullName}}',
                      '{{personalInfo.jobTitle}}',
                      '{{personalInfo.email}}',
                      '{{personalInfo.location}}',
                      '{{personalInfo.furiganaName}}',
                      '{{personalInfo.furiganaAddress}}',
                      '{{personalInfo.selfPr}}',
                      '{{summary}}',
                      '{{#experience}}...{{/experience}}',
                      '{{#education}}...{{/education}}',
                      '{{#skills}}...{{/skills}}',
                      '{{themeColor}}',
                    ].map((token) => (
                      <button
                        key={token}
                        type="button"
                        onClick={() => insertToken(token)}
                        className="px-2 py-0.5 bg-white border border-slate-300 hover:border-blue-500 hover:text-blue-600 rounded text-slate-700 font-mono shadow-2xs"
                      >
                        + {token}
                      </button>
                    ))}
                  </div>
                </div>

                {/* HTML Source Textarea */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-slate-700">
                      HTML Template Source
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setTemplateForm((p) => ({ ...p, htmlContent: BOILERPLATE_HTML }))
                      }
                      className="text-[11px] text-blue-600 hover:underline"
                    >
                      Reset Boilerplate
                    </button>
                  </div>
                  <textarea
                    rows={12}
                    value={templateForm.htmlContent}
                    onChange={(e) =>
                      setTemplateForm((p) => ({ ...p, htmlContent: e.target.value }))
                    }
                    className="w-full text-xs font-mono p-3 bg-slate-900 text-emerald-400 rounded-xl border border-slate-700 focus:outline-hidden"
                  />
                </div>

                {/* CSS Textarea */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Custom Scoped CSS
                  </label>
                  <textarea
                    rows={4}
                    value={templateForm.cssContent}
                    onChange={(e) =>
                      setTemplateForm((p) => ({ ...p, cssContent: e.target.value }))
                    }
                    className="w-full text-xs font-mono p-2.5 bg-slate-900 text-sky-300 rounded-xl border border-slate-700 focus:outline-hidden"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('templates')}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveTemplate}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    {editingTemplateId ? 'Update Template' : 'Publish New Template'}
                  </button>
                </div>
              </div>

              {/* Right Column: Live Interactive Preview */}
              <div className="lg:col-span-6 flex flex-col border border-slate-200 rounded-2xl p-4 bg-slate-100 overflow-hidden">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-300">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">
                      Live A4 Sandbox Preview
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Compiled dynamically with user's current CV data
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-inner p-4 border border-slate-200">
                  <CustomHtmlTemplateEngine
                    cv={cv}
                    htmlTemplate={templateForm.htmlContent}
                    cssTemplate={templateForm.cssContent}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE COUNTRIES */}
          {activeTab === 'countries' && (
            <div className="space-y-6">
              {/* Add Country Form */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Add New Country to Library
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Country Name *
                    </label>
                    <input
                      type="text"
                      value={countryForm.name}
                      onChange={(e) =>
                        setCountryForm((p) => ({ ...p, name: e.target.value }))
                      }
                      placeholder="e.g. South Korea"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Flag Emoji *
                    </label>
                    <input
                      type="text"
                      value={countryForm.flag}
                      onChange={(e) =>
                        setCountryForm((p) => ({ ...p, flag: e.target.value }))
                      }
                      placeholder="e.g. 🇰🇷"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Document Term
                    </label>
                    <input
                      type="text"
                      value={countryForm.documentTerm}
                      onChange={(e) =>
                        setCountryForm((p) => ({ ...p, documentTerm: e.target.value }))
                      }
                      placeholder="e.g. 이력서 / Resume"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Default Language
                    </label>
                    <input
                      type="text"
                      value={countryForm.defaultLanguage}
                      onChange={(e) =>
                        setCountryForm((p) => ({ ...p, defaultLanguage: e.target.value }))
                      }
                      placeholder="e.g. ko or en"
                      className="w-full text-xs p-2 bg-white border border-slate-300 rounded-lg outline-hidden"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddCountry}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Country
                  </button>
                </div>
              </div>

              {/* Countries Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-4">Country</th>
                      <th className="py-2.5 px-4">Document Title</th>
                      <th className="py-2.5 px-4">Default Lang</th>
                      <th className="py-2.5 px-4">Associated Templates</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {countries.map((c) => {
                      const count = templates.filter(
                        (t) => t.countryId?.toLowerCase() === c.id.toLowerCase()
                      ).length;
                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80">
                          <td className="py-2.5 px-4 font-semibold text-slate-900 flex items-center gap-2">
                            <span className="text-xl">{c.flag}</span>
                            <span>{c.name}</span>
                            <span className="font-mono text-[10px] text-slate-400">({c.id})</span>
                          </td>
                          <td className="py-2.5 px-4 text-slate-700 font-medium">
                            {c.documentTerm}
                          </td>
                          <td className="py-2.5 px-4 font-mono uppercase text-slate-600">
                            {c.defaultLanguage}
                          </td>
                          <td className="py-2.5 px-4 text-slate-700">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded font-semibold text-[11px]">
                              {count} templates
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleDeleteCountry(c.id)}
                              className="text-rose-600 hover:text-rose-800 text-[11px] font-semibold hover:underline"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
