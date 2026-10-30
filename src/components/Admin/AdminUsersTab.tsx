import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserX,
  UserCheck,
  Trash2,
  Lock,
  Mail,
  Calendar,
  Clock,
  AlertTriangle,
  RefreshCw,
  Check,
  FileText,
  KeyRound,
} from 'lucide-react';
import { adminTemplateService } from '../../services/adminService.ts';
import { UserAdminItem } from '../../types/admin.ts';

export const AdminUsersTab: React.FC = () => {
  const [users, setUsers] = useState<UserAdminItem[]>([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Selected user for role change modal
  const [editingRoleUser, setEditingRoleUser] = useState<UserAdminItem | null>(null);
  const [newRole, setNewRole] = useState<'user' | 'admin' | 'superadmin'>('user');

  // Selected user for delete confirmation modal
  const [deletingUser, setDeletingUser] = useState<UserAdminItem | null>(null);
  const [typedConfirm, setTypedConfirm] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await adminTemplateService.getUsers({
        search: search.trim() || undefined,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined,
      });
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [roleFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers();
  };

  const handleToggleStatus = async (user: UserAdminItem) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    const actionLabel = nextStatus === 'suspended' ? 'suspend' : 'reactivate';

    if (!window.confirm(`Are you sure you want to ${actionLabel} account for ${user.name} (${user.email})?`)) {
      return;
    }

    try {
      const userId = user._id || user.id || '';
      await adminTemplateService.updateUserStatus(userId, nextStatus);
      setStatusMessage(`Account for ${user.name} has been ${nextStatus === 'suspended' ? 'suspended' : 'reactivated'}.`);
      loadUsers();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Status update failed: ${err.message}`);
    }
  };

  const handleSaveRole = async () => {
    if (!editingRoleUser) return;
    try {
      const userId = editingRoleUser._id || editingRoleUser.id || '';
      await adminTemplateService.updateUserRole(userId, newRole);
      setStatusMessage(`Updated role of ${editingRoleUser.name} to ${newRole.toUpperCase()}.`);
      setEditingRoleUser(null);
      loadUsers();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Role change failed: ${err.message}`);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingUser || typedConfirm !== 'DELETE') return;
    try {
      const userId = deletingUser._id || deletingUser.id || '';
      await adminTemplateService.deleteUser(userId);
      setStatusMessage(`User ${deletingUser.name} has been permanently deleted.`);
      setDeletingUser(null);
      setTypedConfirm('');
      loadUsers();
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(`Deletion failed: ${err.message}`);
    }
  };

  return (
    <div className="space-y-6 text-xs text-slate-800">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            <h2 className="text-sm font-bold text-slate-900">User Management & Access Control</h2>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Audit user accounts, manage security tiers, and suspend malicious access. Password credentials are never transmitted.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadUsers}
            disabled={loading}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
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

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full md:w-auto flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by candidate name or email address..."
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
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="all">All Roles</option>
            <option value="superadmin">Super Admins</option>
            <option value="admin">Administrators</option>
            <option value="user">Standard Users</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-100 text-slate-600 text-[11px] uppercase tracking-wider font-bold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Registered Date</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No users matching criteria found.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isOwner = u.email === 'nirbodh3@gmail.com' || u.role === 'superadmin';
                  const isSuspended = u.status === 'suspended';

                  return (
                    <tr key={u._id || u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center uppercase shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isOwner && (
                                <span className="px-1.5 py-0.2 bg-purple-100 text-purple-800 rounded text-[9px] font-bold">
                                  Owner
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Mail className="w-3 h-3 text-slate-400" />
                              <span>{u.email}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.role === 'superadmin'
                              ? 'bg-purple-50 text-purple-700 border-purple-200'
                              : u.role === 'admin'
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {u.role === 'superadmin' && <Shield className="w-3 h-3" />}
                          <span className="capitalize">{u.role}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            isSuspended
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isSuspended ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                          <span className="capitalize">{u.status || 'active'}</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : 'Never'}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Change role button */}
                          <button
                            type="button"
                            onClick={() => {
                              setEditingRoleUser(u);
                              setNewRole(u.role);
                            }}
                            className="p-1.5 hover:bg-slate-100 text-slate-600 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                            title="Manage User Role"
                          >
                            <KeyRound className="w-3.5 h-3.5" />
                          </button>

                          {/* Suspend / Reactivate button */}
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(u)}
                            disabled={isOwner}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              isSuspended
                                ? 'hover:bg-emerald-50 text-emerald-600'
                                : 'hover:bg-amber-50 text-slate-400 hover:text-amber-600'
                            } disabled:opacity-30`}
                            title={isSuspended ? 'Reactivate Account' : 'Suspend Account'}
                          >
                            {isSuspended ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                          </button>

                          {/* Delete button */}
                          <button
                            type="button"
                            onClick={() => setDeletingUser(u)}
                            disabled={isOwner}
                            className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                            title="Permanently Delete User"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Management Modal */}
      {editingRoleUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 pb-2 border-b border-slate-100">
              <Shield className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-sm">Assign User Role</h3>
            </div>
            <p className="text-xs text-slate-600">
              Updating authorization level for <b>{editingRoleUser.name}</b> ({editingRoleUser.email}):
            </p>

            <div className="space-y-2">
              {[
                { id: 'user', label: 'Standard User', desc: 'Can create, edit, translate, and export personal CVs.' },
                { id: 'admin', label: 'Administrator', desc: 'Can manage template catalog, edit HTML/CSS, and view audit logs.' },
                { id: 'superadmin', label: 'Super Administrator', desc: 'Full system privileges: user management, settings, and database.' },
              ].map((r) => (
                <label
                  key={r.id}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    newRole === r.id ? 'border-blue-600 bg-blue-50/50 shadow-2xs' : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role-select"
                    value={r.id}
                    checked={newRole === r.id}
                    onChange={() => setNewRole(r.id as any)}
                    className="mt-1 text-blue-600"
                  />
                  <div>
                    <span className="font-bold text-slate-900 text-xs block">{r.label}</span>
                    <span className="text-[11px] text-slate-500">{r.desc}</span>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingRoleUser(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRole}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Typed Confirmation Modal */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-rose-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center gap-2 text-rose-600 pb-2 border-b border-rose-100">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-sm">Dangerous Action: Delete Account</h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              You are about to permanently delete account <b>{deletingUser.name}</b> ({deletingUser.email}).
              All associated CV documents and drafts will be purged from the database.
            </p>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                Type <span className="font-mono text-rose-600 font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={typedConfirm}
                onChange={(e) => setTypedConfirm(e.target.value)}
                placeholder="DELETE"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:border-rose-600"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeletingUser(null);
                  setTypedConfirm('');
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={typedConfirm !== 'DELETE'}
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
              >
                Permanently Delete User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsersTab;
