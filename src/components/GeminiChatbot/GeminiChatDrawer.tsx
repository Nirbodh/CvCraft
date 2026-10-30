/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * CVCraft Gemini AI Chatbot Drawer
 * Multi-turn conversational interface powered by Google Gemini models
 * (gemini-3.8-flash, gemini-3.1-flash-lite, and gemini-4-argon).
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  X,
  Send,
  Trash2,
  Copy,
  Check,
  Zap,
  Cpu,
  Brain,
  UserCheck,
  Bot,
  RefreshCw,
  ArrowRight,
  ShieldCheck,
  FileText,
  Briefcase,
  AlertCircle,
  Globe2,
} from 'lucide-react';
import {
  aiChatService,
  ChatMessage,
  GeminiModelId,
  ChatRolePreset,
} from '../../services/aiChatService.ts';
import { CV } from '../../types/cv.ts';

interface GeminiChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeCv?: CV;
  onApplySummary?: (summaryText: string) => void;
  onInsertHighlight?: (bulletText: string) => void;
}

const STARTER_PROMPTS: Array<{ label: string; prompt: string; role: ChatRolePreset }> = [
  {
    label: '✨ Polish My Summary',
    prompt: 'Please rewrite and sharpen my professional summary to be concise, compelling, and hook a recruiter in 6 seconds.',
    role: 'career_coach',
  },
  {
    label: '📈 3 STAR Bullets with Metrics',
    prompt: 'Give me 3 high-impact accomplishment bullets for my job role using the STAR method with quantifiable metrics and active verbs.',
    role: 'executive_writer',
  },
  {
    label: '🎯 Check ATS Keywords',
    prompt: 'What are the top 10 high-priority ATS keywords, technical skills, and tools hiring managers search for in this role?',
    role: 'ats_specialist',
  },
  {
    label: '🇯🇵 Japanese Rirekisho Rules',
    prompt: 'What are the essential Japanese JIS Rirekisho and Shokumu Keirekisho etiquette rules I need to know before applying in Japan?',
    role: 'regional_expert',
  },
  {
    label: '🇩🇪 German Lebenslauf Tips',
    prompt: 'How should I structure my German Lebenslauf? What are the expectations for photos, tabular dates, and language levels?',
    role: 'regional_expert',
  },
];

export const GeminiChatDrawer: React.FC<GeminiChatDrawerProps> = ({
  isOpen,
  onClose,
  activeCv,
  onApplySummary,
  onInsertHighlight,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = aiChatService.getStoredHistory();
    if (saved.length > 0) return saved;
    return [
      {
        id: 'msg_initial',
        role: 'model',
        text: `👋 Hello! I'm your **CVCraft AI Career Coach & CV Strategist** powered by Gemini.

I can help you:
- Craft an executive **Professional Summary** that hooks recruiters in 6 seconds.
- Turn daily job tasks into **STAR-method accomplishment bullets** with measurable metrics.
- Audit your CV for **100% ATS parser readiness** (Workday, Greenhouse, Taleo).
- Tailor your resume to **country conventions** (US, UK, Germany, Japan, UAE, Bangladesh).

How can I help elevate your CV today?`,
        timestamp: new Date().toISOString(),
        model: 'gemini-3.8-flash',
        rolePreset: 'career_coach',
      },
    ];
  });

  const [inputText, setInputText] = useState('');
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>('gemini-3.8-flash');
  const [selectedRole, setSelectedRole] = useState<ChatRolePreset>('career_coach');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Persist history
  useEffect(() => {
    if (messages.length > 0) {
      aiChatService.saveHistory(messages);
    }
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || inputText).trim();
    if (!messageContent || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user_${Date.now()}`,
      role: 'user',
      text: messageContent,
      timestamp: new Date().toISOString(),
      model: selectedModel,
      rolePreset: selectedRole,
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setInputText('');
    setIsLoading(true);

    try {
      // Compile active CV context
      const cvContext = activeCv
        ? {
            jobTitle: activeCv.data.personalInfo.jobTitle,
            targetCountry: activeCv.countryId,
            summary: activeCv.data.summary,
            skills: activeCv.data.skills.flatMap((s) => s.items),
            experience: activeCv.data.experience.map((e) => ({
              role: e.role,
              company: e.company,
              highlights: e.highlights,
            })),
          }
        : undefined;

      const payload = {
        messages: newHistory.map((m) => ({ role: m.role, text: m.text })),
        model: selectedModel,
        rolePreset: selectedRole,
        cvContext,
      };

      const res = await aiChatService.sendMessage(payload);

      const aiMessage: ChatMessage = {
        id: `ai_${Date.now()}`,
        role: 'model',
        text: res.reply,
        timestamp: new Date().toISOString(),
        model: res.model || selectedModel,
        rolePreset: selectedRole,
      };

      setMessages([...newHistory, aiMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: `err_${Date.now()}`,
        role: 'model',
        text: `⚠️ **Connection Notice:** ${err.message || 'Unable to reach the Gemini service'}.\n\nPlease try again or verify your settings in the AI Studio Secrets panel.`,
        timestamp: new Date().toISOString(),
        model: selectedModel,
        rolePreset: selectedRole,
      };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear conversation history and start fresh?')) {
      aiChatService.clearHistory();
      setMessages([
        {
          id: `msg_${Date.now()}`,
          role: 'model',
          text: `Conversation restarted! How can I assist you with your CV today?`,
          timestamp: new Date().toISOString(),
          model: selectedModel,
          rolePreset: selectedRole,
        },
      ]);
    }
  };

  const extractCleanSnippet = (text: string): string => {
    // Look for quotes or bullets in the response
    const quoteMatch = text.match(/>\s*"?([^"\n\r]+)"?/);
    if (quoteMatch && quoteMatch[1]) {
      return quoteMatch[1].trim();
    }
    // Remove markdown symbols
    return text
      .replace(/^#+\s+/gm, '')
      .replace(/\*\*/g, '')
      .replace(/^-\s+/gm, '')
      .trim();
  };

  const handleApplyToSummary = (text: string) => {
    if (!onApplySummary) return;
    const clean = extractCleanSnippet(text);
    onApplySummary(clean);
    setActionFeedback('Applied to your CV Professional Summary!');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  const handleInsertBullet = (text: string) => {
    if (!onInsertHighlight) return;
    const clean = extractCleanSnippet(text);
    onInsertHighlight(clean);
    setActionFeedback('Inserted into your CV Work Experience!');
    setTimeout(() => setActionFeedback(null), 3500);
  };

  return (
    <div className="no-print fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200 border-l border-slate-200">
        {/* Top Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight">CVCraft AI Career Coach</h2>
                <span className="px-1.5 py-0.2 bg-white/20 text-white text-[9px] font-mono rounded">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-blue-100">
                Multi-turn resume optimization &amp; interview strategy
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handleClearHistory}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Clear chat history"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
              title="Close chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action feedback alert banner */}
        {actionFeedback && (
          <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Model & Role Controls Bar */}
        <div className="p-2.5 bg-slate-50 border-b border-slate-200 flex flex-col gap-2 shrink-0">
          {/* Model Selector Bar */}
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Gemini Engine:
            </span>
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setSelectedModel('gemini-3.1-flash-lite')}
                className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all text-[11px] ${
                  selectedModel === 'gemini-3.1-flash-lite'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Fast tasks: Quick grammar, action verbs & proofreading"
              >
                <Zap className="w-3 h-3 text-amber-500" />
                <span>Fast</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedModel('gemini-3.8-flash')}
                className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all text-[11px] ${
                  selectedModel === 'gemini-3.8-flash'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="General tasks: Balanced drafting, STAR bullets, ATS suggestions (Default)"
              >
                <Cpu className="w-3 h-3 text-blue-600" />
                <span>General</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedModel('gemini-4-argon')}
                className={`px-2 py-1 rounded-md flex items-center gap-1 transition-all text-[11px] ${
                  selectedModel === 'gemini-4-argon'
                    ? 'bg-white text-purple-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Complex tasks: Executive career trajectory, career change & restructuring"
              >
                <Brain className="w-3 h-3 text-purple-600" />
                <span>Complex</span>
              </button>
            </div>
          </div>

          {/* Persona / Role Selector */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {[
              { id: 'career_coach', label: '👔 Career Coach' },
              { id: 'ats_specialist', label: '🤖 ATS Specialist' },
              { id: 'executive_writer', label: '✍️ Bullet Writer' },
              { id: 'regional_expert', label: '🌐 Global Norms' },
            ].map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedRole(id as ChatRolePreset)}
                className={`px-2 py-1 text-[11px] rounded-md font-medium whitespace-nowrap transition-colors ${
                  selectedRole === id
                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Active CV Context Ribbon */}
          {activeCv && (
            <div className="flex items-center justify-between text-[10px] text-slate-500 bg-white px-2 py-1 rounded border border-slate-200">
              <span className="truncate">
                Role: <b>{activeCv.data.personalInfo.jobTitle || 'General'}</b> • Market: <b>{(activeCv.countryId || 'USA').toUpperCase()}</b>
              </span>
              <span className="text-emerald-600 font-semibold shrink-0">● Context Active</span>
            </div>
          )}
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs shadow-2xs leading-relaxed ${
                    isUser
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  {/* Assistant metadata header */}
                  {!isUser && (
                    <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-slate-100 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1 font-semibold text-blue-600">
                        <Bot className="w-3 h-3" />
                        <span>Gemini Assistant</span>
                      </div>
                      <span className="font-mono text-[9px] bg-slate-100 px-1 py-0.2 rounded text-slate-600">
                        {msg.model || selectedModel}
                      </span>
                    </div>
                  )}

                  {/* Message body with formatted styling */}
                  <div className="space-y-1.5 whitespace-pre-line break-words font-sans">
                    {msg.text}
                  </div>

                  {/* Assistant Interactive Actions */}
                  {!isUser && msg.id !== 'msg_initial' && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-1 text-[11px]">
                      <div className="flex items-center gap-1">
                        {onApplySummary && msg.text.toLowerCase().includes('summary') && (
                          <button
                            type="button"
                            onClick={() => handleApplyToSummary(msg.text)}
                            className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded font-medium flex items-center gap-1 transition-colors cursor-pointer"
                            title="Insert directly into Professional Summary in CV Editor"
                          >
                            <FileText className="w-3 h-3 text-blue-600" />
                            <span>Apply to Summary</span>
                          </button>
                        )}
                        {onInsertHighlight &&
                          (msg.text.includes('- ') || msg.text.includes('* ') || msg.text.toLowerCase().includes('bullet')) && (
                            <button
                              type="button"
                              onClick={() => handleInsertBullet(msg.text)}
                              className="px-2 py-0.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-medium flex items-center gap-1 transition-colors cursor-pointer"
                              title="Add bullet to first job position in CV Editor"
                            >
                              <Briefcase className="w-3 h-3 text-emerald-600" />
                              <span>Add Bullet to Work Experience</span>
                            </button>
                          )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyMessage(msg.id, msg.text)}
                        className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer flex items-center gap-1"
                        title="Copy text"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-600" />
                            <span className="text-[10px] text-emerald-600 font-semibold">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            );
          })}

          {/* Loading typing bubble */}
          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl w-fit text-xs text-slate-500 shadow-2xs">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
              <span>Gemini ({selectedModel}) is analyzing your CV...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Starter Prompts Ribbon */}
        <div className="px-3 py-2 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto shrink-0">
          {STARTER_PROMPTS.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isLoading}
              onClick={() => {
                setSelectedRole(starter.role);
                handleSendMessage(starter.prompt);
              }}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 border border-slate-300 hover:border-blue-400 rounded-full text-[11px] font-medium text-slate-700 whitespace-nowrap shadow-2xs transition-colors shrink-0 disabled:opacity-50 cursor-pointer"
            >
              {starter.label}
            </button>
          ))}
        </div>

        {/* Input Composer */}
        <div className="p-3 bg-white border-t border-slate-200 shrink-0">
          <div className="flex items-end gap-2 bg-slate-50 border border-slate-300 focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600 rounded-xl p-2 transition-all">
            <textarea
              ref={inputRef}
              rows={2}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask for summary advice, STAR accomplishment bullets, ATS keywords..."
              className="w-full text-xs bg-transparent outline-none resize-none text-slate-900 placeholder:text-slate-400 leading-relaxed"
            />
            <button
              type="button"
              disabled={!inputText.trim() || isLoading}
              onClick={() => handleSendMessage()}
              className="p-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors cursor-pointer shrink-0 shadow-xs"
              title="Send message (Enter)"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5 px-1">
            <span>Press Enter to send, Shift+Enter for newline</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Safe server-side API proxy</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeminiChatDrawer;
