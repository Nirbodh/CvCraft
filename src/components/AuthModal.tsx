import React, { useState } from 'react';
import { useAuth } from '../services/authContext.tsx';
import { Lock, Mail, User, AlertCircle, Loader2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalTab, closeAuthModal, login, register, openAuthModal } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    try {
      if (authModalTab === 'register') {
        if (!name.trim() || name.trim().length < 2) {
          throw new Error('Please enter your full name (at least 2 characters).');
        }
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      setName('');
      setEmail('');
      setPassword('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              CC
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {authModalTab === 'login' ? 'Sign In to CVCraft' : 'Create Free Account'}
              </h3>
              <p className="text-[11px] text-slate-500">Save, reopen, edit, and export your CVs anytime</p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-1 bg-slate-100 flex text-xs font-medium border-b border-slate-200">
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              openAuthModal('login');
            }}
            className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
              authModalTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              openAuthModal('register');
            }}
            className={`flex-1 py-1.5 rounded-md transition-colors cursor-pointer ${
              authModalTab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs">
          {errorMsg && (
            <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-md text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {authModalTab === 'register' && (
            <div>
              <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Vance"
                className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>Email Address</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@example.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Password (min. 6 characters)</span>
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-md font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>{authModalTab === 'login' ? 'Sign In' : 'Create Free Account'}</span>
              )}
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-500 pt-1">
            Free forever. No paid subscriptions, no credit card required.
          </p>
        </form>
      </div>
    </div>
  );
};
