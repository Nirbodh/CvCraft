import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  RefreshCw,
  ShieldCheck,
  User,
  Layers,
  Globe2,
  Settings,
  Database,
  Filter,
} from 'lucide-react';
import { adminTemplateService } from '../../services/adminService.ts';
import { ActivityLogItem } from '../../types/admin.ts';

export const AdminActivityLogsTab: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await adminTemplateService.getActivityLogs(150);
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    if (entityFilter !== 'all' && log.entityType !== entityFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.adminEmail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getEntityIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-3.5 h-3.5 text-blue-600" />;
      case 'template':
        return <Layers className="w-3.5 h-3.5 text-purple-600" />;
      case 'country':
        return <Globe2 className="w-3.5 h-3.5 text-emerald-600" />;
      case 'settings':
        return <Settings className="w-3.5 h-3.5 text-amber-600" />;
      case 'database':
        return <Database className="w-3.5 h-3.5 text-cyan-600" />;
      default:
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" />
            <h2 className="text-sm font-bold text-slate-900">Security &amp; Administrative Activity Logs</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Immutable audit trail recording administrative logins, template changes, account suspensions, and system events.
          </p>
        </div>

        <button
          type="button"
          onClick={loadLogs}
          disabled={loading}
          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Filter toolbar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search actions, emails, or event details..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:border-blue-600"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-slate-500 font-semibold whitespace-nowrap">Filter Entity:</span>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="all">All Entities</option>
            <option value="user">User Operations</option>
            <option value="template">Template Changes</option>
            <option value="country">Country Changes</option>
            <option value="settings">Settings &amp; Branding</option>
            <option value="database">Database &amp; Backup</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Admin Actor</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No activity logs recorded matching criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log, idx) => (
                  <tr key={log._id || log.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded border border-slate-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 capitalize font-medium text-slate-700">
                        {getEntityIcon(log.entityType)}
                        <span>{log.entityType}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800 max-w-md">
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                      {log.adminEmail}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px] text-right whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminActivityLogsTab;
