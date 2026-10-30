import React, { useState } from 'react';
import {
  Upload,
  FileText,
  FileCode,
  Image,
  Check,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Eye,
  Save,
  CheckCircle2,
  RefreshCw,
  Layers,
  Globe2,
} from 'lucide-react';
import { adminTemplateService } from '../../services/adminService.ts';
import { AdminTemplate, CountryItem } from '../../types/template.ts';
import { CustomHtmlTemplateEngine } from '../Templates/CustomHtmlTemplateEngine.tsx';
import { DEFAULT_CV } from '../../types/cv.ts';

interface AdminImportManagerTabProps {
  onImportComplete?: (savedTemplate: AdminTemplate) => void;
}

export const AdminImportManagerTab: React.FC<AdminImportManagerTabProps> = ({
  onImportComplete,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [step, setStep] = useState<'upload' | 'review'>('upload');

  // Conversion output state
  const [importResult, setImportResult] = useState<any>(null);
  const [templateName, setTemplateName] = useState('');
  const [countryId, setCountryId] = useState('usa');
  const [category, setCategory] = useState<'modern' | 'classic' | 'ats' | 'traditional' | 'executive' | 'creative' | 'technical'>('modern');
  const [documentType, setDocumentType] = useState('cv');
  const [defaultLanguage, setDefaultLanguage] = useState('en');
  const [editedHtml, setEditedHtml] = useState('');
  const [editedCss, setEditedCss] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 10 * 1024 * 1024) {
        setErrorMsg('File exceeds 10MB limit.');
        return;
      }
      setFile(selected);
      setErrorMsg(null);

      if (selected.type.startsWith('image/')) {
        const url = URL.createObjectURL(selected);
        setFilePreviewUrl(url);
      } else {
        setFilePreviewUrl(null);
      }
    }
  };

  const handleProcessImport = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const ext = file.name.split('.').pop()?.toLowerCase() || 'txt';
      let fileBase64 = '';
      let rawText = '';

      if (ext === 'html' || ext === 'htm' || ext === 'css' || ext === 'txt') {
        rawText = await file.text();
      } else {
        const arrayBuffer = await file.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        fileBase64 = btoa(binary);
      }

      const res = await adminTemplateService.importTemplateDocument({
        filename: file.name,
        fileType: ext,
        fileBase64,
        rawText,
        countryId,
      });

      setImportResult(res);
      setTemplateName(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') + ' Template');
      setEditedHtml(res.htmlContent);
      setEditedCss(res.cssContent);
      setStep('review');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to process document conversion.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToLibrary = async (publishImmediate = false) => {
    if (!templateName.trim()) {
      alert('Template name is required.');
      return;
    }

    setIsSaving(true);
    try {
      const newTemplate = await adminTemplateService.createTemplate({
        name: templateName.trim(),
        countryId,
        category,
        documentType,
        defaultLanguage,
        version: '1.0.0',
        description: `Imported from ${file?.name || 'document source'}.`,
        status: publishImmediate ? 'published' : 'draft',
        enabled: publishImmediate,
        isCustomHtml: true,
        htmlContent: editedHtml,
        cssContent: editedCss,
        importedFrom: {
          originalFilename: file?.name,
          fileType: file?.name.split('.').pop(),
          importedAt: new Date().toISOString(),
        },
      });

      setStatusMessage(`Template "${newTemplate.name}" saved to library as ${(newTemplate.status || 'draft').toUpperCase()}!`);
      if (onImportComplete) onImportComplete(newTemplate);
      setTimeout(() => {
        setStep('upload');
        setFile(null);
        setImportResult(null);
        setStatusMessage(null);
      }, 2500);
    } catch (err: any) {
      alert(`Save failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const previewCv = {
    ...DEFAULT_CV,
    countryId,
    templateId: 'import-preview',
    isCustomTemplate: true,
    customTemplateHtml: editedHtml,
    customTemplateCss: editedCss,
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Upload className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">CV Template Multi-Format Importer (Module D)</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Convert existing DOCX, PDF, HTML, CSS, or image files into reusable country-wise templates with dynamic CV tokens.
          </p>
        </div>

        {step === 'review' && (
          <button
            type="button"
            onClick={() => setStep('upload')}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
          >
            ← Choose Another File
          </button>
        )}
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">{statusMessage}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: UPLOAD */}
      {step === 'upload' ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-8 text-center space-y-6 max-w-2xl mx-auto">
          <div
            onClick={() => document.getElementById('admin-file-import-input')?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/20 rounded-2xl p-10 cursor-pointer transition-all flex flex-col items-center justify-center gap-3"
          >
            <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <Upload className="w-7 h-7" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900">
                Click to browse or drop an existing CV template file
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Supported formats: <b>DOCX</b> (Word), <b>PDF</b>, <b>HTML</b>, <b>CSS</b>, <b>PNG</b>, <b>JPG</b>, <b>JPEG</b> (Max 10MB)
              </p>
            </div>

            {file && (
              <div className="mt-2 px-3.5 py-2 bg-white border border-blue-200 rounded-lg text-xs font-bold text-blue-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>{file.name}</span>
                <span className="text-slate-400 font-normal">({(file.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}

            <input
              id="admin-file-import-input"
              type="file"
              accept=".docx,.pdf,.html,.htm,.css,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={!file || isProcessing}
              onClick={handleProcessImport}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Converting Layout &amp; Tokens...</span>
                </>
              ) : (
                <>
                  <span>Analyze &amp; Convert Template</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* STEP 2: REVIEW & REFINE */
        <div className="space-y-6">
          {/* Conversion Notice */}
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
              <span>{importResult?.conversionNote || 'Document successfully converted into editable HTML/CSS.'}</span>
            </div>
            <span className="text-[10px] font-mono bg-blue-100 px-2 py-0.5 rounded text-blue-800">
              Source: {file?.name}
            </span>
          </div>

          {/* Metadata Controls */}
          <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assigned Template Name *</label>
              <input
                type="text"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 font-bold focus:outline-hidden focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Assign Country</label>
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
              >
                <option value="usa">🇺🇸 United States</option>
                <option value="japan">🇯🇵 Japan</option>
                <option value="germany">🇩🇪 Germany</option>
                <option value="uk">🇬🇧 United Kingdom</option>
                <option value="canada">🇨🇦 Canada</option>
                <option value="eu">🇪🇺 European Union</option>
                <option value="uae">🇦🇪 UAE &amp; Gulf</option>
                <option value="bangladesh">🇧🇩 Bangladesh</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
              >
                <option value="modern">Modern Professional</option>
                <option value="classic">Classic</option>
                <option value="ats">ATS-Friendly</option>
                <option value="traditional">Traditional (JIS)</option>
                <option value="executive">Executive</option>
                <option value="technical">Technical</option>
                <option value="creative">Creative</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Document Format</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs text-slate-900 bg-white"
              >
                <option value="cv">CV</option>
                <option value="resume">Resume</option>
                <option value="rirekisho">履歴書</option>
                <option value="shokumu">職務経歴書</option>
                <option value="biodata">Biodata</option>
              </select>
            </div>
          </div>

          {/* Side-by-Side: Code Refinement (Left) vs Live Sandbox (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                <div className="px-4 py-2 bg-slate-900 text-white font-bold text-xs flex justify-between items-center">
                  <span>Generated HTML Template Source</span>
                  <span className="text-[10px] text-emerald-400 font-mono">Tokens Ready</span>
                </div>
                <textarea
                  rows={16}
                  value={editedHtml}
                  onChange={(e) => setEditedHtml(e.target.value)}
                  className="w-full p-4 bg-slate-950 text-emerald-400 font-mono text-xs focus:outline-hidden leading-relaxed"
                  spellCheck={false}
                />
              </div>

              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col">
                <div className="px-4 py-2 bg-slate-900 text-white font-bold text-xs flex justify-between items-center">
                  <span>Scoped Custom CSS</span>
                  <span className="text-[10px] text-cyan-300 font-mono">Scoped</span>
                </div>
                <textarea
                  rows={6}
                  value={editedCss}
                  onChange={(e) => setEditedCss(e.target.value)}
                  className="w-full p-3 bg-slate-950 text-cyan-300 font-mono text-xs focus:outline-hidden"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="bg-white rounded-xl border border-slate-200 shadow-2xs p-4 flex flex-col space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800">
                    <Eye className="w-4 h-4 text-blue-600" />
                    <span>Live A4 Compilation Preview</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Sandbox Preview</span>
                </div>

                <div className="border border-slate-200 rounded-lg p-2 bg-slate-100 overflow-y-auto max-h-[580px]">
                  <div className="bg-white rounded shadow-sm p-4 text-slate-900 text-xs">
                    <CustomHtmlTemplateEngine cv={previewCv} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveToLibrary(false)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Save as Draft in Library
            </button>
            <button
              type="button"
              disabled={isSaving}
              onClick={() => handleSaveToLibrary(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Publish to User Gallery Now</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminImportManagerTab;
