import React from 'react';
import { CertificationItem } from '../../types/cv.ts';
import { Plus, Trash2, Award, Copy } from 'lucide-react';

interface CertificationsSectionProps {
  items: CertificationItem[];
  onChange: (updated: CertificationItem[]) => void;
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: CertificationItem = {
      id: 'cert_' + Math.random().toString(36).substring(2, 9),
      name: '',
      issuer: '',
      issueDate: '',
      credentialId: '',
    };
    onChange([...items, newItem]);
  };

  const duplicateItem = (item: CertificationItem) => {
    const clone: CertificationItem = {
      ...item,
      id: 'cert_' + Math.random().toString(36).substring(2, 9),
      name: `${item.name} (Copy)`,
    };
    const index = items.findIndex((it) => it.id === item.id);
    const updated = [...items];
    updated.splice(index + 1, 0, clone);
    onChange(updated);
  };

  const updateItem = (id: string, updates: Partial<CertificationItem>) => {
    onChange(items.map((it) => (it.id === id ? { ...it, ...updates } : it)));
  };

  const removeItem = (id: string) => {
    onChange(items.filter((it) => it.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-xs font-semibold text-slate-700">Certifications &amp; Licenses</span>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Certificate</span>
        </button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-6 px-4 bg-slate-50 border border-dashed border-slate-200 rounded text-xs text-slate-500">
          No certifications added. Click &ldquo;Add Certificate&rdquo; for AWS, PMP, GCP, or industry licenses.
        </div>
      ) : (
        <div className="space-y-2.5">
          {items.map((item) => (
            <div key={item.id} className="p-3 border border-slate-200 rounded-md bg-white space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 flex-1 mr-2">
                  <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => updateItem(item.id, { name: e.target.value })}
                    placeholder="Certificate Title (e.g. AWS Solutions Architect Professional)"
                    className="w-full font-semibold text-slate-900 border-b border-transparent hover:border-slate-300 focus:border-blue-600 focus:outline-none px-1 py-0.5"
                  />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => duplicateItem(item)}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Duplicate certificate"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                    title="Delete certificate"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={item.issuer}
                  onChange={(e) => updateItem(item.id, { issuer: e.target.value })}
                  placeholder="Issuing Body (e.g. Amazon Web Services)"
                  className="px-2 py-1 border border-slate-200 rounded text-slate-900"
                />
                <input
                  type="text"
                  value={item.issueDate}
                  onChange={(e) => updateItem(item.id, { issueDate: e.target.value })}
                  placeholder="Issue Date (e.g. 2023)"
                  className="px-2 py-1 border border-slate-200 rounded text-slate-900"
                />
                <input
                  type="text"
                  value={item.credentialId || ''}
                  onChange={(e) => updateItem(item.id, { credentialId: e.target.value })}
                  placeholder="Credential ID (optional)"
                  className="px-2 py-1 border border-slate-200 rounded text-slate-900"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
