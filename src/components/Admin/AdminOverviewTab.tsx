import React, { useState, useEffect } from 'react';
import {
  Users,
  FileText,
  Layers,
  FileCheck,
  Database,
  Activity,
  Globe2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { adminTemplateService } from '../../services/adminService.ts';
import { AdminDashboardOverviewData } from '../../types/admin.ts';

interface AdminOverviewTabProps {
  onNavigateTab: (tab: any) => void;
}

export const AdminOverviewTab: React.FC<AdminOverviewTabProps> = ({ onNavigateTab }) => {
  const [data, setData] = useState<AdminDashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await adminTemplateService.getDashboardStats();
      if (res && res.kpi) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center p-16 space-y-3">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading Super Admin telemetry...</p>
      </div>
    );
  }

  const { kpi, countryStats, database, systemHealth } = data;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Super Admin Command Center</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">CVCraft System Overview</h1>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Real-time monitoring of registered user accounts, country-wise templates, database connection status, and application health.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              type="button"
              onClick={loadData}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Stats</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('import')}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>+ Import New CV Template</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Main KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div
          onClick={() => onNavigateTab('users')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Registered Users
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">{kpi.totalUsers}</div>
            </div>
            <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-blue-600 font-semibold mt-3 pt-3 border-t border-slate-100">
            <span>Manage User Accounts</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Total CVs Created */}
        <div
          onClick={() => onNavigateTab('studio')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Total Resumes Created
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">{kpi.totalCvs}</div>
            </div>
            <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-emerald-600 font-semibold mt-3 pt-3 border-t border-slate-100">
            <span>Inspect User Design Layouts</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Published Templates */}
        <div
          onClick={() => onNavigateTab('templates')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Published Templates
              </span>
              <div className="text-2xl font-black text-slate-900 mt-1">{kpi.publishedTemplates}</div>
            </div>
            <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:scale-110 transition-transform">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-purple-600 font-semibold mt-3 pt-3 border-t border-slate-100">
            <span>Live in User Gallery</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>

        {/* Draft Templates */}
        <div
          onClick={() => onNavigateTab('templates')}
          className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Draft Templates
              </span>
              <div className="text-2xl font-black text-amber-600 mt-1">{kpi.draftTemplates}</div>
            </div>
            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center text-[11px] text-amber-600 font-semibold mt-3 pt-3 border-t border-slate-100">
            <span>Unpublished Workspaces</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </div>
        </div>
      </div>

      {/* Middle Section: Country-wise Template Matrix & Database Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Country Breakdown (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Country-Wise Template Distribution</h2>
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('countries')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              Manage Countries →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {countryStats.map((item) => (
              <div
                key={item.countryId}
                onClick={() => onNavigateTab('templates')}
                className="p-3 bg-slate-50 hover:bg-blue-50/50 rounded-xl border border-slate-200 transition-colors cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xl">{item.flag}</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 bg-blue-100 text-blue-800 rounded font-mono">
                    {item.totalTemplates} Total
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-900 truncate">{item.name}</div>
                <div className="flex items-center justify-between text-[10px] text-slate-500">
                  <span className="text-emerald-700 font-semibold">{item.publishedTemplates} Active</span>
                  <span className="text-amber-700">{item.draftTemplates} Draft</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Database & Runtime Health (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <h2 className="text-sm font-bold text-slate-900">Database & System</h2>
              </div>
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  database.isMongo ? 'bg-emerald-500 animate-pulse' : 'bg-blue-500'
                }`}
                title={database.mode}
              />
            </div>

            {/* Storage Mode */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Active Storage Mode
              </span>
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                {database.isMongo ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Server className="w-4 h-4 text-blue-600" />
                )}
                <span>{database.mode}</span>
              </div>
            </div>

            {/* Runtime Telemetry */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Node.js</span>
                <span className="font-mono text-slate-800 font-bold">{systemHealth.nodeVersion}</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Memory Usage</span>
                <span className="font-mono text-slate-800 font-bold">{systemHealth.memoryUsageMb} MB</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">System Uptime</span>
                <span className="font-mono text-slate-800 font-bold">
                  {Math.floor(systemHealth.uptimeSeconds / 60)} mins
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-400 block font-semibold">Platform OS</span>
                <span className="font-mono text-slate-800 font-bold capitalize">{systemHealth.platform}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('database')}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Open Database Diagnostics</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
