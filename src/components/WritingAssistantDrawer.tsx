import React, { useState } from 'react';
import { ACTION_VERBS, analyzeAndEnhanceBullet, BulletAnalysis } from '../services/writingAssistant.ts';
import { Sparkles, Search, Check, Copy, ArrowRight, BookOpen } from 'lucide-react';

interface WritingAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertText?: (text: string) => void;
}

export const WritingAssistantDrawer: React.FC<WritingAssistantDrawerProps> = ({ isOpen, onClose, onInsertText }) => {
  const [activeTab, setActiveTab] = useState<'verbs' | 'optimizer' | 'rules'>('verbs');
  const [searchQuery, setSearchQuery] = useState('');
  const [testSentence, setTestSentence] = useState('');
  const [analysisResult, setAnalysisResult] = useState<BulletAnalysis | null>(null);
  const [copiedVerb, setCopiedVerb] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopyVerb = (verb: string) => {
    navigator.clipboard.writeText(verb);
    setCopiedVerb(verb);
    setTimeout(() => setCopiedVerb(null), 2000);
  };

  const handleAnalyze = () => {
    if (!testSentence.trim()) return;
    const res = analyzeAndEnhanceBullet(testSentence);
    setAnalysisResult(res);
  };

  const filteredCategories = ACTION_VERBS.map((cat) => ({
    ...cat,
    verbs: cat.verbs.filter((v) => v.toLowerCase().includes(searchQuery.toLowerCase())),
  })).filter((cat) => cat.verbs.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              CC
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">Deterministic Writing Engine</h2>
              <p className="text-[11px] text-slate-500">Free rule-based grammar, action verbs &amp; clarity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-200 text-sm cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Segmented Tabs (Compliant with Anti-Slop frontend design rules) */}
        <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-1">
          <button
            onClick={() => setActiveTab('verbs')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'verbs'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Action Verbs Bank
          </button>
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'optimizer'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sentence Optimizer
          </button>
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'rules'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Writing Heuristics
          </button>
        </div>

        {/* Body content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* TAB 1: Action Verbs */}
          {activeTab === 'verbs' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search powerful verbs (e.g. Lead, Architect, Scale)..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="space-y-4">
                {filteredCategories.map((cat, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-slate-900">{cat.category}</span>
                      <span className="text-[10px] text-slate-400">{cat.description}</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {cat.verbs.map((verb) => (
                        <button
                          key={verb}
                          type="button"
                          onClick={() => handleCopyVerb(verb)}
                          className="px-2 py-1 text-xs bg-slate-50 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 border border-slate-200 rounded transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>{verb}</span>
                          {copiedVerb === verb ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-2.5 h-2.5 text-slate-400 opacity-60" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Sentence Optimizer */}
          {activeTab === 'optimizer' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-800">
                  Paste or draft an accomplishment bullet:
                </label>
                <textarea
                  rows={4}
                  value={testSentence}
                  onChange={(e) => setTestSentence(e.target.value)}
                  placeholder="e.g. I worked on fixing bugs and helped the team make the system 30% faster."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600 text-slate-900"
                />
                <button
                  type="button"
                  onClick={handleAnalyze}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Analyze with Deterministic Heuristics</span>
                </button>
              </div>

              {analysisResult && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                    <span className="text-xs font-bold text-slate-900">Analysis Breakdown</span>
                    <span className="px-2 py-0.5 text-xs font-bold bg-blue-600 text-white rounded">
                      Clarity Score: {analysisResult.clarityScore}/100
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 bg-white border border-slate-200 rounded">
                      <span className="text-slate-500 block">Lead Action Verb</span>
                      <span className={analysisResult.hasActionVerb ? 'font-bold text-emerald-600' : 'text-rose-600 font-medium'}>
                        {analysisResult.hasActionVerb ? '✓ Present' : '✗ Missing / Weak'}
                      </span>
                    </div>
                    <div className="p-2 bg-white border border-slate-200 rounded">
                      <span className="text-slate-500 block">Measurable Metric</span>
                      <span className={analysisResult.hasMetric ? 'font-bold text-emerald-600' : 'text-amber-600 font-medium'}>
                        {analysisResult.hasMetric ? '✓ Quantified' : '✗ Unquantified'}
                      </span>
                    </div>
                  </div>

                  {analysisResult.feedbackTips.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold text-slate-800">Rule-Based Recommendations:</span>
                      <ul className="list-disc ml-4 space-y-0.5 text-[11px] text-slate-600">
                        {analysisResult.feedbackTips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {analysisResult.enhancedSuggestions.length > 0 && (
                    <div className="space-y-1.5 pt-1 border-t border-slate-200">
                      <span className="text-[11px] font-bold text-slate-900">Deterministic Enhancements:</span>
                      {analysisResult.enhancedSuggestions.map((sug, i) => (
                        <div key={i} className="p-2 bg-white border border-slate-200 rounded space-y-1.5">
                          <p className="text-xs text-slate-800 leading-normal">{sug}</p>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(sug);
                                setCopiedVerb(sug);
                                setTimeout(() => setCopiedVerb(null), 2000);
                              }}
                              className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                            >
                              {copiedVerb === sug ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedVerb === sug ? 'Copied' : 'Copy'}</span>
                            </button>
                            {onInsertText && (
                              <button
                                type="button"
                                onClick={() => onInsertText(sug)}
                                className="text-[11px] font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
                              >
                                <span>Insert to CV</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Writing Heuristics Guide */}
          {activeTab === 'rules' && (
            <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>The STAR Method Blueprint</span>
                </div>
                <p className="text-[11px] text-blue-800">
                  Strong resume bullets always combine:
                  <br />
                  1. <b>Action Verb</b>: What you directly did (Spearheaded, Architected).
                  <br />
                  2. <b>Context / Task</b>: The system, project, or mandate.
                  <br />
                  3. <b>Measurable Impact</b>: % saved, users served, latency reduced, revenue generated.
                </p>
              </div>

              <div className="space-y-2">
                <span className="font-bold text-slate-900">Deterministic Weak-Verb Substitutions:</span>
                <div className="space-y-1.5 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span className="text-rose-600 line-through">&ldquo;worked on&rdquo;</span>
                    <span className="font-semibold text-emerald-700">developed &amp; maintained</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span className="text-rose-600 line-through">&ldquo;responsible for&rdquo;</span>
                    <span className="font-semibold text-emerald-700">orchestrated &amp; directed</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span className="text-rose-600 line-through">&ldquo;helped with&rdquo;</span>
                    <span className="font-semibold text-emerald-700">collaborated to deliver</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 flex justify-between">
                    <span className="text-rose-600 line-through">&ldquo;fixed&rdquo;</span>
                    <span className="font-semibold text-emerald-700">troubleshot &amp; remediated</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
