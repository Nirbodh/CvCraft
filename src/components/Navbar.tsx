import React from 'react';
import { useAuth } from '../services/authContext.tsx';
import { FileText, Download, Upload, LogIn, LogOut, Database, UserCheck, Sparkles, FolderKanban, Crown } from 'lucide-react';

interface NavbarProps {
  currentView: 'landing' | 'editor' | 'dashboard' | 'admin';
  onNavigate: (view: 'landing' | 'editor' | 'dashboard' | 'admin') => void;
  onOpenImport: () => void;
  onOpenWritingAssistant: () => void;
  onOpenGeminiChat?: () => void;
  onOpenDbStatus: () => void;
  onDownloadPdf?: () => void;
  savedCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onOpenImport,
  onOpenWritingAssistant,
  onOpenGeminiChat,
  onOpenDbStatus,
  onDownloadPdf,
  savedCount = 0,
}) => {
  const { user, isAuthenticated, logout, openAuthModal, isAdmin, isSuperAdmin } = useAuth();

  return (
    <nav className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center gap-2 font-black text-slate-900 tracking-tight text-base hover:opacity-90 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold text-sm shadow-xs">
              CV
            </div>
            <span>CVCraft</span>
            <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 uppercase tracking-wider">
              Free
            </span>
          </button>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onNavigate('editor')}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${
                currentView === 'editor' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              CV Editor
            </button>
            <button
              onClick={() => onNavigate('landing')}
              className={`hover:text-blue-600 transition-colors cursor-pointer ${
                currentView === 'landing' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Templates
            </button>
            {isAuthenticated ? (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`hover:text-blue-600 transition-colors cursor-pointer flex items-center gap-1.5 ${
                  currentView === 'dashboard' ? 'text-blue-600 font-bold' : ''
                }`}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>My Saved CVs</span>
                <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded font-mono">
                  {savedCount}
                </span>
              </button>
            ) : null}

            {/* Super Admin Dashboard Trigger */}
            <button
              onClick={() => onNavigate('admin')}
              className={`hover:text-amber-700 transition-colors cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold ${
                currentView === 'admin'
                  ? 'text-amber-800 bg-amber-100/80 font-bold border border-amber-300'
                  : 'text-amber-800 bg-amber-50 hover:bg-amber-100/60 border border-amber-200 shadow-2xs'
              }`}
              title="Super Admin Dashboard & Country Templates"
            >
              <Crown className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Dashboard</span>
              {(isSuperAdmin || isAdmin) && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Gemini AI Career Coach trigger */}
          {onOpenGeminiChat && (
            <button
              type="button"
              onClick={onOpenGeminiChat}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md border border-indigo-200 transition-colors cursor-pointer shadow-2xs"
              title="Open Gemini AI Career Coach"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
              <span>AI Career Coach</span>
            </button>
          )}

          {/* Writing Assistant trigger */}
          <button
            type="button"
            onClick={onOpenWritingAssistant}
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-md border border-slate-200 transition-colors cursor-pointer"
            title="Writing Assistant & Action Verbs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Writing Engine</span>
          </button>

          {/* Import document button */}
          <button
            type="button"
            onClick={onOpenImport}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 rounded-md border border-slate-200 transition-colors cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Import Document</span>
          </button>

          {/* Database status check */}
          <button
            type="button"
            onClick={onOpenDbStatus}
            className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
            title="View MongoDB & Storage Status"
          >
            <Database className="w-4 h-4" />
          </button>

          {/* PDF Download button when in editor */}
          {currentView === 'editor' && onDownloadPdf && (
            <button
              type="button"
              onClick={onDownloadPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download A4 PDF</span>
            </button>
          )}

          {/* Auth State */}
          <div className="pl-2 border-l border-slate-200 flex items-center gap-2">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-blue-600 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="truncate max-w-[120px]">{user.name}</span>
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => openAuthModal('register')}
                  className="hidden sm:inline-flex px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
