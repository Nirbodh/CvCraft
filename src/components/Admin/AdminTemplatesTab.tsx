import React, { useState, useEffect } from 'react';
import {
  Layers,
  Search,
  Plus,
  Eye,
  Edit3,
  Copy,
  Trash2,
  Check,
  CheckCircle2,
  Clock,
  History,
  Tag,
  RefreshCw,
  FileCode,
  Sparkles,
} from 'lucide-react';
import { adminTemplateService } from '../../services/adminService.ts';
import { AdminTemplate, CountryItem, TemplateStatus } from '../../types/template.ts';

interface AdminTemplatesTabProps {
  onEditTemplate: (template: AdminTemplate) => void;
  onPreviewTemplate: (template: AdminTemplate) => void;
  onNewTemplate: () => void;
}

export const AdminTemplatesTab: React.FC<AdminTemplatesTabProps> = ({
  onEditTemplate,
  onPreviewTemplate,
  onNewTemplate,
}) => {
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [tplData, ctryData] = await Promise.all([
        adminTemplateService.getTemplates({
          search: search.trim() || undefined,
          countryId: countryFilter !== 'all' ? countryFilter : undefined,
          status: statusFilter !== 'all' ? (statusFilter as TemplateStatus) : undefined,
        }),
        adminTemplateService.getCountries(),
      ]);
      setTemplates(tplData);
      setCountries(ctryData);
    } catch (err) {
      console.error('Failed to load templates:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [countryFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleTogglePublish = async (t: AdminTemplate) => {
    const isCurrentlyPublished = t.status === 'published' || (t.enabled && t.status !== 'archived');
    try {
      if (isCurrentlyPublished) {
        await adminTemplateService.unpublishTemplate(t.id);
        setStatusMessage(`Template "${t.name}" moved to draft (hidden from users).`);
      } else {
        await adminTemplateService.publishTemplate(t.id);
        setStatusMessage(`Template "${t.name}" published (live in User Gallery).`);
      }
      loadData();
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(`Publish toggle failed: ${err.message}`);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const cloned = await adminTemplateService.duplicateTemplate(id);
      setStatusMessage(`Cloned template draft "${cloned.name}".`);
      loadData();
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(`Duplication failed: ${err.message}`);
    }
  };

  const handleDelete = async (t: AdminTemplate) => {
    if (t.isSystem) {
      alert('System-defined core templates cannot be deleted.');
      return;
    }
    if (!window.confirm(`Permanently delete custom template "${t.name}"?`)) return;

    try {
      await adminTemplateService.deleteTemplate(t.id);
      setStatusMessage(`Template "${t.name}" deleted.`);
      loadData();
      setTimeout(() => setStatusMessage(null), 3500);
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Master Template Catalog & Versioning</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Administer reusable country-wise templates. Only published templates are accessible in the user-facing Gallery.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={onNewTemplate}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Template</span>
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

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:w-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by template name, category, or country..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer shrink-0"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="all">All Countries</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>
                {c.flag} {c.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published Only</option>
            <option value="draft">Draft Only</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((t) => {
          const countryObj = countries.find((c) => c.id.toLowerCase() === t.countryId?.toLowerCase());
          const isPublished = t.status === 'published' || (t.enabled && t.status !== 'archived');
          const versionCount = t.versions?.length || 1;

          return (
            <div
              key={t.id}
              className={`p-4 bg-white rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                isPublished ? 'border-slate-200 hover:shadow-md' : 'border-dashed border-amber-300 bg-amber-50/20'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{countryObj?.flag || '🌐'}</span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xs leading-snug">{t.name}</h3>
                      <span className="font-mono text-[10px] text-slate-400">ID: {t.id}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(t)}
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                      isPublished
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                    }`}
                    title="Click to toggle Publish/Unpublish status"
                  >
                    {isPublished ? '● Published' : '○ Draft'}
                  </button>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px] mb-3">
                  {t.description || 'Country-wise resume blueprint.'}
                </p>

                <div className="flex flex-wrap gap-1.5 text-[10px]">
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded font-mono font-bold">
                    v{t.version || '1.0.0'}
                  </span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded capitalize font-medium">
                    {t.category}
                  </span>
                  <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded uppercase font-mono">
                    Lang: {t.defaultLanguage || 'en'}
                  </span>
                  {t.isCustomHtml && (
                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">
                      HTML/CSS
                    </span>
                  )}
                  {t.isSystem && (
                    <span className="px-2 py-0.5 bg-slate-200 text-slate-700 rounded">System Core</span>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <History className="w-3 h-3" />
                  <span>{versionCount} {versionCount === 1 ? 'version' : 'versions'}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onPreviewTemplate(t)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Live A4 Preview"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEditTemplate(t)}
                    className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Edit HTML/CSS Source & Versions"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDuplicate(t.id)}
                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    title="Duplicate as New Draft"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  {!t.isSystem && (
                    <button
                      type="button"
                      onClick={() => handleDelete(t)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete Custom Template"
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
  );
};

export default AdminTemplatesTab;
