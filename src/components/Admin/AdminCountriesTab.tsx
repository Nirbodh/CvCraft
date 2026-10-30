import React, { useState, useEffect } from 'react';
import {
  Globe2,
  Plus,
  Edit2,
  Trash2,
  Check,
  Camera,
  FileCheck2,
  AlertTriangle,
  Languages,
  RefreshCw,
} from 'lucide-react';
import { adminTemplateService } from '../../services/adminService.ts';
import { CountryItem } from '../../types/template.ts';

export const AdminCountriesTab: React.FC = () => {
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Edit / Create Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCountryId, setEditingCountryId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    flag: '',
    documentTerm: 'CV',
    defaultLanguage: 'en',
    recommendedLength: '1 to 2 pages',
    photoConvention: 'optional' as any,
    photoExplanation: '',
    atsGuidance: '',
  });

  const loadCountries = async () => {
    setLoading(true);
    try {
      const data = await adminTemplateService.getCountries();
      setCountries(data);
    } catch (err) {
      console.error('Failed to load countries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCountries();
  }, []);

  const handleOpenCreate = () => {
    setEditingCountryId(null);
    setFormData({
      id: '',
      name: '',
      flag: '',
      documentTerm: 'CV',
      defaultLanguage: 'en',
      recommendedLength: '1 to 2 pages',
      photoConvention: 'optional',
      photoExplanation: '',
      atsGuidance: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CountryItem) => {
    setEditingCountryId(c.id);
    setFormData({
      id: c.id,
      name: c.name,
      flag: c.flag,
      documentTerm: c.documentTerm || 'CV',
      defaultLanguage: c.defaultLanguage || 'en',
      recommendedLength: c.recommendedLength || '1 to 2 pages',
      photoConvention: c.photoConvention || 'optional',
      photoExplanation: c.photoExplanation || '',
      atsGuidance: c.atsGuidance || '',
    });
    setIsModalOpen(true);
  };

  const handleSaveCountry = async () => {
    if (!formData.name.trim() || !formData.flag.trim()) {
      alert('Country name and flag emoji are required.');
      return;
    }

    try {
      if (editingCountryId) {
        await adminTemplateService.updateCountry(editingCountryId, formData);
        setStatusMessage(`Updated country profile for "${formData.name}".`);
      } else {
        const id = formData.id.trim() || formData.name.toLowerCase().replace(/[^a-z0-9]/g, '-');
        await adminTemplateService.createCountry({ ...formData, id });
        setStatusMessage(`Added "${formData.name}" to the country library.`);
      }
      setIsModalOpen(false);
      loadCountries();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Error saving country: ${err.message}`);
    }
  };

  const handleDeleteCountry = async (c: CountryItem) => {
    if (!window.confirm(`Delete country profile for "${c.name}"?`)) return;
    try {
      await adminTemplateService.deleteCountry(c.id);
      setStatusMessage(`Removed "${c.name}" from library.`);
      loadCountries();
      setTimeout(() => setStatusMessage(null), 4000);
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
            <Globe2 className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Country Recruitment Conventions & Markets</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Configure country-specific hiring norms, photo guidelines (EEOC vs. Lebenslauf vs. JIS), default terminology, and ATS parameters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadCountries}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Country</span>
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

      {/* Countries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {countries.map((c) => (
          <div
            key={c.id}
            className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{c.flag}</span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs">{c.name}</h3>
                    <span className="font-mono text-[10px] text-slate-400">ID: {c.id}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    c.photoConvention === 'discouraged'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : c.photoConvention === 'standard'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }`}
                >
                  Photo: {c.photoConvention?.toUpperCase() || 'OPTIONAL'}
                </span>
              </div>

              <div className="mt-3 space-y-1.5 text-[11px] text-slate-600">
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Standard Term:</span>
                  <span className="font-bold text-slate-800">{c.documentTerm}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Language:</span>
                  <span className="font-mono uppercase text-slate-800">{c.defaultLanguage}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1">
                  <span className="text-slate-400">Length:</span>
                  <span className="text-slate-800">{c.recommendedLength || '1-2 pages'}</span>
                </div>
                {c.photoExplanation && (
                  <p className="text-[10px] text-slate-500 italic pt-1 leading-snug">
                    {c.photoExplanation}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-1 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => handleOpenEdit(c)}
                className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer font-semibold"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteCountry(c)}
                className="px-2.5 py-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Country Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-sm text-slate-900">
                  {editingCountryId ? 'Edit Country Profile' : 'Add New Country Market'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Country Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. South Korea"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Flag Emoji *</label>
                  <input
                    type="text"
                    value={formData.flag}
                    onChange={(e) => setFormData({ ...formData, flag: e.target.value })}
                    placeholder="e.g. 🇰🇷"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Standard Document Term</label>
                  <input
                    type="text"
                    value={formData.documentTerm}
                    onChange={(e) => setFormData({ ...formData, documentTerm: e.target.value })}
                    placeholder="e.g. 이력서 / Resume"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Default Language Code</label>
                  <input
                    type="text"
                    value={formData.defaultLanguage}
                    onChange={(e) => setFormData({ ...formData, defaultLanguage: e.target.value })}
                    placeholder="e.g. ko or en"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Recommended Page Length</label>
                <input
                  type="text"
                  value={formData.recommendedLength}
                  onChange={(e) => setFormData({ ...formData, recommendedLength: e.target.value })}
                  placeholder="e.g. 1 to 2 pages"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Photo Convention</label>
                <select
                  value={formData.photoConvention}
                  onChange={(e) => setFormData({ ...formData, photoConvention: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600 bg-white"
                >
                  <option value="discouraged">Discouraged (US/UK/Canada anti-bias)</option>
                  <option value="optional">Optional (European Union / Europass)</option>
                  <option value="common">Common (Germany / Lebenslauf Bewerbungsfoto)</option>
                  <option value="standard">Standard / Required (Japan JIS Rirekisho / UAE / Bangladesh)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Photo Recruiter Rationale</label>
                <textarea
                  rows={2}
                  value={formData.photoExplanation}
                  onChange={(e) => setFormData({ ...formData, photoExplanation: e.target.value })}
                  placeholder="Explain legal or cultural reasons (e.g. EEOC regulations, studio photo requirements)..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">ATS Guidance & Standards</label>
                <input
                  type="text"
                  value={formData.atsGuidance}
                  onChange={(e) => setFormData({ ...formData, atsGuidance: e.target.value })}
                  placeholder="e.g. High priority single-column flow, Taleo & Greenhouse parser standard"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:border-blue-600"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCountry}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
              >
                {editingCountryId ? 'Save Changes' : 'Create Country'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCountriesTab;
