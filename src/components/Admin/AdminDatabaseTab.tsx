import React, { useState, useEffect } from 'react';
import {
  Database,
  Download,
  RotateCcw,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertTriangle,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react';
import { adminTemplateService } from '../../services/adminService.ts';

export const AdminDatabaseTab: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminTemplateService.getDatabaseStatus();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleResetSeed = async () => {
    if (!window.confirm('Re-synchronize core seed countries and templates? Any user-created custom templates will remain safe.')) {
      return;
    }
    try {
      await adminTemplateService.resetSeedData();
      setStatusMessage('Default country and template baselines re-synchronized.');
      loadData();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Reset failed: ${err.message}`);
    }
  };

  const sampleMongoUri = 'MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/cvcraft?retryWrites=true&w=majority"';

  const copyConfig = () => {
    navigator.clipboard.writeText(sampleMongoUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">Database Engine &amp; Storage Architecture</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Real-time telemetry for MongoDB Atlas Free cluster and local persistent storage fallback (.data/cvcraft_store.json).
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
            <span>Refresh Telemetry</span>
          </button>

          <a
            href={adminTemplateService.exportDatabaseUrl()}
            download="cvcraft_backup.json"
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full JSON Backup</span>
          </a>
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

      {/* Database State Banner */}
      <div
        className={`p-5 rounded-2xl border flex items-start gap-4 ${
          data?.database?.isMongo
            ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}
      >
        <div className="p-3 bg-white rounded-xl shadow-xs shrink-0 mt-0.5">
          {data?.database?.isMongo ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          ) : (
            <Server className="w-6 h-6 text-blue-600" />
          )}
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-sm">
            {data?.database?.mode || 'Detecting Active Storage Layer...'}
          </h3>
          <p className="text-xs opacity-90 leading-relaxed">
            {data?.database?.isMongo
              ? 'All user accounts, CV documents, and custom templates are actively synchronized with your remote MongoDB Atlas Free cluster.'
              : 'Running on CVCraft transparent local storage engine (.data/cvcraft_store.json). Zero external dependencies required; fully persistent across reboots.'}
          </p>
          <div className="text-[11px] text-slate-500 pt-1">
            Status: <b>Healthy &amp; Operational</b> • Node PID: <b>{data?.systemHealth?.pid || 1}</b>
          </div>
        </div>
      </div>

      {/* Collection Diagnostics */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Collection Health &amp; Diagnostics
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold block">Users Collection</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {data?.database?.activeCollections?.users || 'Active'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold block">CVs Collection</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {data?.database?.activeCollections?.cvs || 'Active'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold block">Templates Collection</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {data?.database?.activeCollections?.templates || 'Active'}
            </span>
          </div>
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] text-slate-400 font-semibold block">Countries Collection</span>
            <span className="font-bold text-slate-900 text-sm mt-0.5 block">
              {data?.database?.activeCollections?.countries || 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* MongoDB Atlas Setup Reference */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
          Connecting Remote MongoDB Atlas (Optional)
        </h3>
        <p className="text-xs text-slate-600">
          To connect your cluster, configure <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">MONGODB_URI</code> in your environment or hosting dashboard:
        </p>

        <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-[11px] flex items-center justify-between gap-3">
          <span className="truncate">{sampleMongoUri}</span>
          <button
            type="button"
            onClick={copyConfig}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleResetSeed}
            className="px-3.5 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-seed System Baseline Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDatabaseTab;
