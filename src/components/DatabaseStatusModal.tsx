import React, { useState, useEffect } from 'react';
import { api } from '../services/api.ts';
import { Database, CheckCircle2, AlertCircle, RefreshCw, Copy, Check } from 'lucide-react';

interface DatabaseStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseStatusModal: React.FC<DatabaseStatusModalProps> = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [healthData, setHealthData] = useState<{
    status: string;
    database: {
      isMongo: boolean;
      mode: string;
      error: string | null;
      activeCollections: Record<string, string>;
      hint: string;
    };
  } | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    try {
      const data = await api.checkHealth();
      setHealthData(data);
    } catch (err: any) {
      console.error('Failed to query health:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchHealth();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mongoAtlasSampleEnv = 'MONGODB_URI="mongodb+srv://<db_user>:<db_password>@cluster0.abcde.mongodb.net/cvcraft?retryWrites=true&w=majority"';

  const copyConfig = () => {
    navigator.clipboard.writeText(mongoAtlasSampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col text-xs">
        {/* Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Database &amp; Storage Architecture</h3>
              <p className="text-[11px] text-slate-500">MongoDB Atlas Free + Local Persistence Engine</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Active Mode Banner */}
          <div
            className={`p-3.5 rounded-lg border flex items-start gap-2.5 ${
              healthData?.database.isMongo
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            {healthData?.database.isMongo ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <Database className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5">
              <span className="font-bold text-sm block">
                {healthData?.database.mode || 'Detecting Database...'}
              </span>
              <p className="text-[11px] opacity-90 leading-relaxed">
                {healthData?.database.isMongo
                  ? 'All user accounts and CV documents are actively stored in your remote MongoDB Atlas Free cluster via Mongoose.'
                  : 'CVCraft is currently running with its built-in persistent storage engine (.data/cvcraft_store.json). User accounts, logins, and saved CVs work immediately without requiring any external credentials!'}
              </p>
            </div>
          </div>

          {/* Diagnostics summary */}
          <div className="space-y-2">
            <span className="font-bold text-slate-900 block">Repository Diagnostics:</span>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">Users Collection</span>
                <span className="font-semibold text-slate-900">
                  {healthData?.database.activeCollections.users || 'Active'}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded">
                <span className="text-slate-500 block">CVs Collection</span>
                <span className="font-semibold text-slate-900">
                  {healthData?.database.activeCollections.cvs || 'Active'}
                </span>
              </div>
            </div>
          </div>

          {/* MongoDB Atlas Setup Instructions */}
          <div className="space-y-2 pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-900 block">Connecting your free MongoDB Atlas cluster:</span>
            <ol className="list-decimal ml-4 space-y-1 text-[11px] text-slate-600">
              <li>Create a free M0 cluster at <b>mongodb.com/cloud/atlas</b> (100% free forever, 512MB).</li>
              <li>Under Database Access, create a database user and password.</li>
              <li>Under Network Access, allow IP access (0.0.0.0/0 for cloud hosts like Render).</li>
              <li>Click &ldquo;Connect&rdquo; &rarr; &ldquo;Drivers (Node.js)&rdquo; and copy your connection string.</li>
              <li>Set <code className="bg-slate-100 px-1 py-0.5 rounded text-slate-800">MONGODB_URI</code> in your .env or Render dashboard.</li>
            </ol>

            <div className="p-2.5 bg-slate-900 text-slate-100 rounded-md font-mono text-[10px] flex items-center justify-between gap-2 mt-2">
              <span className="truncate">{mongoAtlasSampleEnv}</span>
              <button
                type="button"
                onClick={copyConfig}
                className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 shrink-0 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={fetchHealth}
            disabled={loading}
            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Diagnostics</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded font-medium hover:bg-slate-800 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
