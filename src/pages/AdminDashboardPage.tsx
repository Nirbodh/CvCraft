/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Super Admin Dashboard Page
 * Complete administrative control center for CVCraft
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Globe2,
  Layers,
  Code,
  Eye,
  Palette,
  Languages,
  Upload,
  Database,
  Settings,
  History,
  Shield,
  ShieldAlert,
  ArrowLeft,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Crown,
} from 'lucide-react';
import { useAuth } from '../services/authContext.tsx';
import { AdminNavTab } from '../types/admin.ts';
import { AdminTemplate } from '../types/template.ts';

// Tabs
import { AdminOverviewTab } from '../components/Admin/AdminOverviewTab.tsx';
import { AdminUsersTab } from '../components/Admin/AdminUsersTab.tsx';
import { AdminCountriesTab } from '../components/Admin/AdminCountriesTab.tsx';
import { AdminTemplatesTab } from '../components/Admin/AdminTemplatesTab.tsx';
import { AdminTemplateEditorTab } from '../components/Admin/AdminTemplateEditorTab.tsx';
import { AdminTemplatePreviewTab } from '../components/Admin/AdminTemplatePreviewTab.tsx';
import { AdminDesignStudioTab } from '../components/Admin/AdminDesignStudioTab.tsx';
import { AdminTranslationsTab } from '../components/Admin/AdminTranslationsTab.tsx';
import { AdminImportManagerTab } from '../components/Admin/AdminImportManagerTab.tsx';
import { AdminDatabaseTab } from '../components/Admin/AdminDatabaseTab.tsx';
import { AdminSettingsTab } from '../components/Admin/AdminSettingsTab.tsx';
import { AdminActivityLogsTab } from '../components/Admin/AdminActivityLogsTab.tsx';

interface AdminDashboardPageProps {
  onReturnToApp: () => void;
}

interface NavItem {
  id: AdminNavTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Core' | 'Templates & Design' | 'Localization & Import' | 'System & Security';
}

const NAV_ITEMS: NavItem[] = [
  // Core
  { id: 'overview', label: 'Dashboard', icon: LayoutDashboard, group: 'Core' },
  { id: 'users', label: 'User Management', icon: Users, group: 'Core' },
  { id: 'countries', label: 'Country Management', icon: Globe2, group: 'Core' },

  // Templates & Design
  { id: 'templates', label: 'Template Catalog', icon: Layers, group: 'Templates & Design' },
  { id: 'editor', label: 'HTML/CSS Studio', icon: Code, group: 'Templates & Design' },
  { id: 'preview', label: 'Visual A4 Preview', icon: Eye, group: 'Templates & Design' },
  { id: 'studio', label: 'User Studio Monitor', icon: Palette, group: 'Templates & Design' },

  // Localization & Import
  { id: 'translations', label: 'Translations & Dict', icon: Languages, group: 'Localization & Import' },
  { id: 'import', label: 'Template Importer', icon: Upload, group: 'Localization & Import' },

  // System & Security
  { id: 'database', label: 'Database & Backup', icon: Database, group: 'System & Security' },
  { id: 'settings', label: 'Website Settings', icon: Settings, group: 'System & Security' },
  { id: 'logs', label: 'Activity Audit Logs', icon: History, group: 'System & Security' },
];

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onReturnToApp }) => {
  const { user, isSuperAdmin, isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<AdminNavTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Template to pass into editor or preview
  const [activeTemplate, setActiveTemplate] = useState<AdminTemplate | null>(null);

  const handleEditTemplate = (tpl: AdminTemplate) => {
    setActiveTemplate(tpl);
    setCurrentTab('editor');
  };

  const handlePreviewTemplate = (tpl: AdminTemplate) => {
    setActiveTemplate(tpl);
    setCurrentTab('preview');
  };

  const handleNewTemplate = () => {
    setActiveTemplate(null);
    setCurrentTab('editor');
  };

  const handleImportComplete = (saved: AdminTemplate) => {
    setActiveTemplate(saved);
    setCurrentTab('editor');
  };

  const currentNavItem = NAV_ITEMS.find((n) => n.id === currentTab);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans antialiased text-slate-900">
      {/* Top Admin Header Bar */}
      <header className="no-print bg-slate-950 text-white h-14 px-4 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white shadow-xs">
              CV
            </div>
            <div className="flex items-center gap-1.5 font-bold text-sm">
              <span className="text-white">CVCraft</span>
              <span className="text-slate-400 font-normal">/</span>
              <span className="text-amber-400 flex items-center gap-1">
                <Crown className="w-3.5 h-3.5" />
                <span>Super Admin</span>
              </span>
            </div>
          </div>

          {/* Breadcrumb current section */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 pl-4 border-l border-slate-800">
            <span>Workspace</span>
            <span>/</span>
            <span className="text-slate-200 font-semibold">{currentNavItem?.label}</span>
          </div>
        </div>

        {/* Right header actions */}
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={onReturnToApp}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to User Site</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="hidden lg:block text-left">
              <div className="font-bold text-[11px] text-white leading-tight">
                {user?.name || 'Super Admin'}
              </div>
              <div className="text-[10px] text-amber-400 font-mono">
                {user?.role === 'superadmin' ? 'Super Admin' : 'Admin'}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside
          className={`no-print w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 transition-all z-30 fixed md:static inset-y-14 left-0 ${
            mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Quick return button on mobile */}
          <div className="p-3 border-b border-slate-800 sm:hidden">
            <button
              type="button"
              onClick={onReturnToApp}
              className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to User App</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-5">
            {['Core', 'Templates & Design', 'Localization & Import', 'System & Security'].map((groupName) => {
              const groupItems = NAV_ITEMS.filter((item) => item.group === groupName);
              return (
                <div key={groupName} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3">
                    {groupName}
                  </span>
                  <div className="space-y-0.5 pt-1">
                    {groupItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = currentTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setCurrentTab(item.id);
                            setMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                            isActive
                              ? 'bg-blue-600 text-white shadow-xs font-bold'
                              : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70'
                          }`}
                        >
                          <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 bg-slate-950/60 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Admin Guard Active</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">v1.2.0</span>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden fixed inset-0 z-20 bg-slate-950/50 backdrop-blur-xs top-14"
          />
        )}

        {/* Main Content Workspace Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-100">
          <div className="max-w-7xl mx-auto">
            {currentTab === 'overview' && (
              <AdminOverviewTab onNavigateTab={(tab) => setCurrentTab(tab)} />
            )}
            {currentTab === 'users' && <AdminUsersTab />}
            {currentTab === 'countries' && <AdminCountriesTab />}
            {currentTab === 'templates' && (
              <AdminTemplatesTab
                onEditTemplate={handleEditTemplate}
                onPreviewTemplate={handlePreviewTemplate}
                onNewTemplate={handleNewTemplate}
              />
            )}
            {currentTab === 'editor' && (
              <AdminTemplateEditorTab
                initialTemplate={activeTemplate}
                onSaved={(saved) => setActiveTemplate(saved)}
                onPreviewFull={handlePreviewTemplate}
              />
            )}
            {currentTab === 'preview' && (
              <AdminTemplatePreviewTab
                template={activeTemplate}
                onEditTemplate={handleEditTemplate}
              />
            )}
            {currentTab === 'studio' && <AdminDesignStudioTab />}
            {currentTab === 'translations' && <AdminTranslationsTab />}
            {currentTab === 'import' && (
              <AdminImportManagerTab onImportComplete={handleImportComplete} />
            )}
            {currentTab === 'database' && <AdminDatabaseTab />}
            {currentTab === 'settings' && <AdminSettingsTab />}
            {currentTab === 'logs' && <AdminActivityLogsTab />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
