import React, { useState, useEffect } from 'react';
import { CV, DEFAULT_CV } from '../types/cv.ts';
import { api } from '../services/api.ts';
import { useAuth } from '../services/authContext.tsx';
import { Plus, Edit, Copy, Trash2, Download, Clock, FolderKanban, AlertCircle, Loader2 } from 'lucide-react';

interface DashboardPageProps {
  onOpenCv: (cv: CV) => void;
  onCreateNew: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onOpenCv, onCreateNew }) => {
  const { user } = useAuth();
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchCvs = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await api.getCvs();
      setCvs(res.cvs || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to retrieve your saved CVs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCvs();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await api.deleteCv(id);
      setCvs((prev) => prev.filter((c) => (c._id || c.id) !== id));
    } catch (err: any) {
      alert(`Failed to delete CV: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDuplicate = async (sourceCv: CV) => {
    try {
      const cloned: Partial<CV> = {
        title: `${sourceCv.title} (Copy)`,
        templateId: sourceCv.templateId,
        themeColor: sourceCv.themeColor,
        fontFamily: sourceCv.fontFamily,
        spacing: sourceCv.spacing,
        sectionOrder: sourceCv.sectionOrder,
        sectionVisibility: sourceCv.sectionVisibility,
        data: JSON.parse(JSON.stringify(sourceCv.data)),
      };
      const res = await api.createCv(cloned);
      setCvs([res.cv, ...cvs]);
    } catch (err: any) {
      alert(`Failed to duplicate CV: ${err.message}`);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Just now';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-3.5rem)] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <FolderKanban className="w-6 h-6 text-blue-600" />
              <span>My Saved Resumes</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Signed in as <b>{user?.name}</b> ({user?.email}) · All documents are securely isolated to your account
            </p>
          </div>

          <button
            type="button"
            onClick={onCreateNew}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create New CV</span>
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Loading your saved CVs...</p>
          </div>
        ) : cvs.length === 0 ? (
          /* Empty state */
          <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FolderKanban className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">No saved CVs yet</h3>
              <p className="text-xs text-slate-500 mt-1">
                You haven&apos;t saved any CV documents to your cloud account. Click below to start building your first resume!
              </p>
            </div>
            <button
              type="button"
              onClick={onCreateNew}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Start New CV</span>
            </button>
          </div>
        ) : (
          /* Grid of saved CV cards */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cvItem) => {
              const id = cvItem._id || cvItem.id || '';
              const isDeleting = deletingId === id;

              return (
                <div
                  key={id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0"
                          style={{ backgroundColor: cvItem.themeColor || '#2563eb' }}
                        />
                        <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                          {cvItem.title || 'Untitled CV'}
                        </h3>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {cvItem.templateId}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="font-semibold text-slate-900">
                        {cvItem.data?.personalInfo?.fullName || 'Candidate Name'}
                      </div>
                      <div className="text-slate-500">
                        {cvItem.data?.personalInfo?.jobTitle || 'Role Title'}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Updated {formatDate(cvItem.updatedAt || cvItem.createdAt)}</span>
                    </div>
                  </div>

                  {/* Actions bar */}
                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => onOpenCv(cvItem)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium text-xs flex items-center gap-1 transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleDuplicate(cvItem)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Duplicate CV"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          onOpenCv(cvItem);
                          setTimeout(() => window.print(), 300);
                        }}
                        className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Download A4 PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={() => handleDelete(id, cvItem.title)}
                        className="p-1.5 text-slate-500 hover:text-rose-600 rounded hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Delete CV"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
