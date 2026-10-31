import React, { useState, useEffect } from 'react';
import {
  Code,
  Save,
  Eye,
  History,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  RotateCcw,
  ShieldAlert,
  Tag,
  Layers,
  Check,
  FileCode,
  Sliders,
} from 'lucide-react';
import { adminTemplateService, AVAILABLE_CV_TOKENS, DEFAULT_TEMPLATE_HTML, DEFAULT_TEMPLATE_CSS } from '../../services/adminService.ts';
import { AdminTemplate, CountryItem, TemplateVersion, TemplateFieldConfig } from '../../types/template.ts';
import { CustomHtmlTemplateEngine } from '../Templates/CustomHtmlTemplateEngine.tsx';
import { TemplateFieldConfigEditor } from './TemplateFieldConfigEditor.tsx';
import { getTemplateFieldConfig } from '../../config/templateFieldConfigs.ts';
import { DEFAULT_CV } from '../../types/cv.ts';

interface AdminTemplateEditorTabProps {
  initialTemplate?: AdminTemplate | null;
  onSaved?: (saved: AdminTemplate) => void;
  onPreviewFull?: (tpl: AdminTemplate) => void;
}

export const AdminTemplateEditorTab: React.FC<AdminTemplateEditorTabProps> = ({
  initialTemplate,
  onSaved,
  onPreviewFull,
}) => {
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [form, setForm] = useState({
    id: initialTemplate?.id || '',
    name: initialTemplate?.name || '',
    countryId: initialTemplate?.countryId || 'japan',
    category: initialTemplate?.category || ('modern' as any),
    documentType: initialTemplate?.documentType || 'cv',
    defaultLanguage: initialTemplate?.defaultLanguage || 'ja',
    version: initialTemplate?.version || '1.0.0',
    description: initialTemplate?.description || '',
    status: initialTemplate?.status || 'draft',
    htmlContent: initialTemplate?.htmlContent || DEFAULT_TEMPLATE_HTML,
    cssContent: initialTemplate?.cssContent || DEFAULT_TEMPLATE_CSS,
    fieldConfig: initialTemplate?.fieldConfig || getTemplateFieldConfig(initialTemplate?.id || 'modern'),
  });

  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css' | 'fields'>('html');
  const [validationReport, setValidationReport] = useState<any>(null);
  const [versions, setVersions] = useState<TemplateVersion[]>(initialTemplate?.versions || []);
  const [isBumpModalOpen, setIsBumpModalOpen] = useState(false);
  const [bumpType, setBumpType] = useState<'patch' | 'minor' | 'major'>('patch');
  const [changeNote, setChangeNote] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    adminTemplateService.getCountries().then(setCountries).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialTemplate) {
      setForm({
        id: initialTemplate.id,
        name: initialTemplate.name,
        countryId: initialTemplate.countryId,
        category: initialTemplate.category,
        documentType: initialTemplate.documentType || 'cv',
        defaultLanguage: initialTemplate.defaultLanguage || 'en',
        version: initialTemplate.version,
        description: initialTemplate.description || '',
        status: initialTemplate.status || 'draft',
        htmlContent: initialTemplate.htmlContent || DEFAULT_TEMPLATE_HTML,
        cssContent: initialTemplate.cssContent || DEFAULT_TEMPLATE_CSS,
        fieldConfig: initialTemplate.fieldConfig || getTemplateFieldConfig(initialTemplate.id || 'modern'),
      });
      setVersions(initialTemplate.versions || []);
    }
  }, [initialTemplate]);

  // Real-time validation
  useEffect(() => {
    const report = adminTemplateService.validateCode(form.htmlContent, form.cssContent);
    setValidationReport(report);
  }, [form.htmlContent, form.cssContent]);

  const insertToken = (token: string) => {
    setForm((prev) => ({
      ...prev,
      htmlContent: prev.htmlContent + token,
    }));
  };

  const handleSave = async (publishImmediate = false) => {
    if (!form.name.trim()) {
      alert('Template name is required.');
      return;
    }

    if (validationReport && !validationReport.isValid) {
      alert(`Cannot save template: ${validationReport.errors.join(' ')}`);
      return;
    }

    try {
      let saved: AdminTemplate;
      const statusToSet = publishImmediate ? 'published' : form.status || 'draft';

      if (form.id) {
        saved = await adminTemplateService.updateTemplate(form.id, {
          ...form,
          status: statusToSet,
          enabled: statusToSet === 'published',
          isCustomHtml: true,
        });
      } else {
        saved = await adminTemplateService.createTemplate({
          ...form,
          status: statusToSet,
          enabled: statusToSet === 'published',
          isCustomHtml: true,
        });
        setForm((prev) => ({ ...prev, id: saved.id }));
      }

      setStatusMessage(`Template "${saved.name}" saved successfully (${saved.status}).`);
      if (onSaved) onSaved(saved);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const handleBumpVersion = async () => {
    if (!form.id) {
      alert('Save initial template before creating formal version release.');
      return;
    }
    try {
      const updated = await adminTemplateService.createVersion(form.id, {
        bumpType,
        changeNote: changeNote.trim() || `Bumped ${bumpType} version`,
        htmlContent: form.htmlContent,
        cssContent: form.cssContent,
      });
      setForm((prev) => ({
        ...prev,
        version: updated.version,
      }));
      setVersions(updated.versions || []);
      setIsBumpModalOpen(false);
      setChangeNote('');
      setStatusMessage(`Released new version v${updated.version}!`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(`Version bump failed: ${err.message}`);
    }
  };

  const handleRollback = async (targetVersion: string) => {
    if (!form.id) return;
    if (!window.confirm(`Rollback layout code to version v${targetVersion}?`)) return;

    try {
      const rolledBack = await adminTemplateService.rollbackVersion(form.id, targetVersion);
      setForm((prev) => ({
        ...prev,
        htmlContent: rolledBack.htmlContent || prev.htmlContent,
        cssContent: rolledBack.cssContent || prev.cssContent,
      }));
      setVersions(rolledBack.versions || []);
      setStatusMessage(`Rolled back code to version v${targetVersion}.`);
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(`Rollback failed: ${err.message}`);
    }
  };

  // Construct mock preview CV matching target country
  const previewCv = {
    ...DEFAULT_CV,
    countryId: form.countryId,
    templateId: form.id || 'custom-preview',
    isCustomTemplate: true,
    customTemplateHtml: form.htmlContent,
    customTemplateCss: form.cssContent,
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Code className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">
              {form.id ? `Editing Template: ${form.name}` : 'New Custom HTML/CSS Template Studio'}
            </h2>
            <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-slate-100 text-slate-700">
              v{form.version}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Craft country-wise templates using HTML, scoped CSS, and Mustache dynamic tokens.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {form.id && (
            <button
              type="button"
              onClick={() => setIsBumpModalOpen(true)}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
            >
              <History className="w-3.5 h-3.5" />
              <span>Release New Version</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleSave(false)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Publish to Gallery</span>
          </button>
        </div>
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

      {/* Form Metadata Grid */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Template Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Modern Tokyo Dev JIS Rirekisho"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Target Country *</label>
            <select
              value={form.countryId}
              onChange={(e) => setForm({ ...form, countryId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 bg-white"
            >
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.flag} {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 bg-white"
            >
              <option value="traditional">Traditional (JIS / Academic)</option>
              <option value="ats">ATS-Friendly</option>
              <option value="modern">Modern Professional</option>
              <option value="classic">Classic Serif</option>
              <option value="executive">Executive Leadership</option>
              <option value="minimal">Minimal Swiss</option>
              <option value="creative">Creative & Portfolio</option>
              <option value="technical">Engineering & Technical</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Document Format Type</label>
            <select
              value={form.documentType}
              onChange={(e) => setForm({ ...form, documentType: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 bg-white"
            >
              <option value="cv">Curriculum Vitae (CV)</option>
              <option value="resume">Resume</option>
              <option value="rirekisho">履歴書 (JIS Rirekisho)</option>
              <option value="shokumu">職務経歴書 (Shokumu Keirekisho)</option>
              <option value="biodata">Biodata (South Asia)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Recruiter Description</label>
          <input
            type="text"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Brief explanation of when and why a candidate should choose this format..."
            className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
          />
        </div>
      </div>

      {/* Main Split: Code Editor & Token Palette (Left) vs Live Sandbox (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Code Editor */}
        <div className="lg:col-span-7 space-y-4">
          {/* Quick Insert Tokens Bar */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <span className="text-[11px] font-bold text-slate-700 block uppercase tracking-wider">
              One-Click CV Field Injector:
            </span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
              {AVAILABLE_CV_TOKENS.map((t) => (
                <button
                  key={t.token}
                  type="button"
                  onClick={() => insertToken(t.token)}
                  className="px-2 py-0.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 rounded font-mono text-[10px] transition-colors cursor-pointer"
                  title={`${t.label}: ${t.description}`}
                >
                  + {t.token}
                </button>
              ))}
            </div>
          </div>

          {/* HTML vs CSS Tabs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-4 bg-slate-900 text-white py-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('html')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    activeCodeTab === 'html' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  HTML Template Source
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('css')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer ${
                    activeCodeTab === 'css' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Scoped Custom CSS
                </button>
                <button
                  type="button"
                  onClick={() => setActiveCodeTab('fields')}
                  className={`px-3 py-1 rounded text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeCodeTab === 'fields' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sliders className="w-3 h-3" />
                  <span>Dynamic Fields ({form.fieldConfig?.fields?.length || 0})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                {activeCodeTab === 'html' && <span>{form.htmlContent.length} chars</span>}
                {activeCodeTab === 'css' && <span>{form.cssContent.length} chars</span>}
                {activeCodeTab === 'fields' && <span>{(form.fieldConfig?.sections || []).length} sections active</span>}
              </div>
            </div>

            {/* Code / Config Editor Body */}
            {activeCodeTab === 'html' && (
              <textarea
                rows={18}
                value={form.htmlContent}
                onChange={(e) => setForm({ ...form, htmlContent: e.target.value })}
                className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs leading-relaxed focus:outline-hidden selection:bg-blue-900"
                spellCheck={false}
              />
            )}
            {activeCodeTab === 'css' && (
              <textarea
                rows={18}
                value={form.cssContent}
                onChange={(e) => setForm({ ...form, cssContent: e.target.value })}
                className="w-full p-4 bg-slate-950 text-cyan-300 font-mono text-xs leading-relaxed focus:outline-hidden selection:bg-blue-900"
                spellCheck={false}
              />
            )}
            {activeCodeTab === 'fields' && (
              <div className="p-4 bg-white">
                <TemplateFieldConfigEditor
                  config={form.fieldConfig}
                  onChange={(fieldConfig) => setForm({ ...form, fieldConfig })}
                />
              </div>
            )}

            {/* Validation Feedback Footer */}
            {validationReport && (
              <div
                className={`p-3 border-t text-[11px] flex items-center justify-between gap-2 ${
                  validationReport.isValid
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {validationReport.isValid ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>
                    {validationReport.isValid
                      ? 'Security & syntax validation passed! Clean template structure.'
                      : validationReport.errors[0]}
                  </span>
                </div>
                {validationReport.warnings.length > 0 && (
                  <span className="text-amber-700 font-medium">{validationReport.warnings.length} warnings</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Sandbox & Version History */}
        <div className="lg:col-span-5 space-y-4">
          {/* Live A4 Sandbox Card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Eye className="w-4 h-4 text-blue-600" />
                <span>Live A4 Sandbox Compilation</span>
              </div>
              <span className="text-[10px] text-slate-400">Sandbox Preview</span>
            </div>

            <div className="border border-slate-200 rounded-lg p-2 bg-slate-100 overflow-y-auto max-h-[500px]">
              <div className="bg-white rounded shadow-sm p-4 text-slate-900 text-xs">
                <CustomHtmlTemplateEngine cv={previewCv} />
              </div>
            </div>
          </div>

          {/* Version History List */}
          {versions.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <History className="w-4 h-4 text-purple-600" />
                  <span>Version History & Rollbacks</span>
                </div>
                <span className="text-[10px] text-slate-400">{versions.length} releases</span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto">
                {versions.map((ver, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-50 hover:bg-slate-100/80 rounded-lg border border-slate-200 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-slate-900">v{ver.version}</span>
                        {idx === 0 && (
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded text-[9px] font-bold">
                            Current
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{ver.changeNote || 'Standard release'}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-slate-400 font-mono">
                        {new Date(ver.createdAt).toLocaleDateString()}
                      </span>
                      {idx !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleRollback(ver.version)}
                          className="px-2 py-0.5 bg-white border border-slate-300 hover:border-blue-600 hover:text-blue-600 rounded text-[10px] font-semibold cursor-pointer"
                        >
                          Rollback
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Version Bump Modal */}
      {isBumpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <History className="w-5 h-5 text-purple-600" />
              <h3 className="font-bold text-sm text-slate-900">Release New Template Version</h3>
            </div>
            <p className="text-xs text-slate-600">
              Increment the semantic version for <b>{form.name}</b> (current: v{form.version}):
            </p>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'patch', label: 'Patch Fix', hint: '1.0.0 → 1.0.1' },
                { id: 'minor', label: 'Minor Feature', hint: '1.0.0 → 1.1.0' },
                { id: 'major', label: 'Major Redesign', hint: '1.0.0 → 2.0.0' },
              ].map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setBumpType(b.id as any)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                    bumpType === b.id ? 'border-purple-600 bg-purple-50/50 shadow-2xs font-bold' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="block text-xs text-slate-900">{b.label}</span>
                  <span className="block text-[10px] text-slate-400 font-mono mt-0.5">{b.hint}</span>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Changelog / Release Note</label>
              <input
                type="text"
                value={changeNote}
                onChange={(e) => setChangeNote(e.target.value)}
                placeholder="e.g. Added Furigana header alignment and 30x40mm photo frame"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-purple-600"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsBumpModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBumpVersion}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
              >
                Commit Version Release
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTemplateEditorTab;
