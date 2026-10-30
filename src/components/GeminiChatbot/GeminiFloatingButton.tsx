/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Floating button to open the Gemini AI Chatbot from anywhere in the application
 */

import React from 'react';
import { Sparkles, MessageSquare } from 'lucide-react';

interface GeminiFloatingButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export const GeminiFloatingButton: React.FC<GeminiFloatingButtonProps> = ({ onClick, isOpen }) => {
  if (isOpen) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="no-print fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white p-3.5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 flex items-center gap-2 group cursor-pointer border-2 border-white/80 hover:scale-105"
      title="Open Gemini AI Career Coach"
    >
      <div className="relative">
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
      </div>
      <span className="text-xs font-bold tracking-tight pr-1 hidden sm:inline-block">
        AI Career Coach
      </span>
      <span className="flex h-2 w-2 relative">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
      </span>
    </button>
  );
};

export default GeminiFloatingButton;
